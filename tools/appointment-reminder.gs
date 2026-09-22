/**
 * Khulna Divisional Digital Surveyors Association — "appointments tomorrow" reminder.
 *
 * Every evening this reads tomorrow's appointments and emails the clinic one summary,
 * with a WhatsApp button beside each client. Tap the button, WhatsApp opens with the
 * reminder already written, press send. The client gets it on the app they actually
 * read, and it costs nothing.
 *
 * WHY THE CLINIC TAPS INSTEAD OF IT BEING AUTOMATIC
 * A booking stores a name and a phone number, nothing else. Texting a phone number
 * without a person involved needs either a paid SMS gateway or Meta's paid WhatsApp
 * Business API. There is no free, hands-off route to a client's phone. This gets the
 * reminder to them in about a minute of the clinic's evening for nothing.
 *
 * ── SETUP (about five minutes, once) ────────────────────────────────────────
 * Add this file to the SAME Apps Script project as the booking alerts: it reuses
 * TO_EMAIL and CLINIC_NAME from there, so the address lives in one place.
 *
 * 1. In the editor: Files → + → Script → name it "Reminder" → paste this in.
 * 2. Project Settings (the gear) → Script Properties → Add three properties.
 *    They are kept out of the code so they are never in a file anyone can read:
 *      FB_API_KEY   your Firebase Web API key   (Firebase Console → Project settings
 *                                                → General → Web API Key)
 *      FB_EMAIL     the clinic's dashboard login email
 *      FB_PASSWORD  that account's password
 *    This signs in as the clinic, exactly like the dashboard does, so it can read no
 *    more than the dashboard can. (A Google service-account key would be the other way
 *    to do this, but that bypasses the security rules entirely and can write anything —
 *    a bigger key than this job needs.)
 * 3. Project Settings → Time zone → **(GMT+06:00) Khulna**. "Tomorrow" is worked out in
 *    this zone, so the wrong setting reminds the wrong day.
 * 4. RE-AUTHORISE. The project was authorised when it only sent email; this file also
 *    calls out to Firebase, and Apps Script does not always ask again by itself. If Run
 *    fails with "You do not have permission to call UrlFetchApp.fetch":
 *      Project Settings → tick "Show appsscript.json manifest file in editor",
 *      then open appsscript.json and make sure it contains
 *        "oauthScopes": [
 *          "https://www.googleapis.com/auth/script.send_mail",
 *          "https://www.googleapis.com/auth/script.external_request"
 *        ]
 *      Save, Run again, and allow the new permission when Google asks.
 * 5. Press Run on `sendRemindersNow`. Check the inbox — this is the same email the
 *    trigger will send, so it proves the whole path works.
 * 6. Clock icon (Triggers) → Add trigger:
 *      Function: sendReminders
 *      Event source: Time-driven → Day timer → 7pm to 8pm
 *
 * ── WHAT IT READS ───────────────────────────────────────────────────────────
 * The Next Appointment date on records in the dashboard. Those only reach the cloud
 * when the clinic has pressed **Connect** — without that, records stay on one device
 * and this script sees nothing to remind anyone about.
 */

var PROJECT_ID = '';        // Firebase project id
var SEND_ON_EMPTY_DAYS = false;         // true = email even when tomorrow is free

/** The daily trigger points here. */
function sendReminders() { _runReminders(false); }

/** Run this by hand to test — it emails immediately, even if today's already went. */
function sendRemindersNow() { _runReminders(true); }

function _runReminders(force) {
  var day = _tomorrow();
  var props = PropertiesService.getScriptProperties();

  // A retry after an error, or a stray manual run, must not send the same list twice.
  if (!force && props.getProperty('reminded:' + day)) return;

  var token = _signIn(props);   // _signIn says exactly what went wrong
  if (!token) return;

  var list = _appointmentsOn(day, token);
  if (!list.length && !SEND_ON_EMPTY_DAYS) { props.setProperty('reminded:' + day, '1'); return; }

  /* _recipients() lives in booking-alert.gs, in this same project. Going through it
     means TO_EMAIL can hold several addresses and the reminder reaches all of them,
     exactly like a booking alert. */
  var to = (typeof _recipients === 'function') ? _recipients() : TO_EMAIL;
  if (!to) { _warn('TO_EMAIL has no valid address — nobody to remind.'); return; }
  MailApp.sendEmail({
    to: to,
    subject: _subject(list.length, day),
    htmlBody: _body(list, day),
    name: CLINIC_NAME + ' reminders'
  });
  props.setProperty('reminded:' + day, '1');
}

/* ---------- dates ---------- */

/** Tomorrow as YYYY-MM-DD in Khulna — the same format the dashboard stores. */
function _tomorrow() {
  var d = new Date();
  d.setDate(d.getDate() + 1);
  return Utilities.formatDate(d, 'Asia/Dhaka', 'yyyy-MM-dd');
}

/** "03-09-2026" — day first, matching the dashboard and the website. */
function _dmy(iso) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  return m ? m[3] + '-' + m[2] + '-' + m[1] : String(iso || '');
}

function _weekday(iso) {
  var p = String(iso || '').split('-');
  if (p.length !== 3) return '';
  var d = new Date(+p[0], +p[1] - 1, +p[2]);
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
}

/* ---------- Firebase ---------- */

/** Signs in as the clinic account and returns an ID token, or '' on failure.
    Google tells us precisely why a sign-in failed, so pass that on rather than
    listing three properties and leaving someone to guess which is wrong. */
function _signIn(props) {
  var key = props.getProperty('FB_API_KEY'),
      em  = props.getProperty('FB_EMAIL'),
      pw  = props.getProperty('FB_PASSWORD');

  var missing = [];
  if (!key) missing.push('FB_API_KEY');
  if (!em)  missing.push('FB_EMAIL');
  if (!pw)  missing.push('FB_PASSWORD');
  if (missing.length) {
    _warn('Script propert' + (missing.length > 1 ? 'ies are' : 'y is') + ' missing: ' +
          missing.join(', ') + '. Project Settings → Script Properties.');
    return '';
  }

  try {
    var res = UrlFetchApp.fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + encodeURIComponent(key),
      { method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        payload: JSON.stringify({ email: em, password: pw, returnSecureToken: true }) });
    var txt = res.getContentText();
    if (res.getResponseCode() !== 200) {
      var code = '';
      try { code = ((JSON.parse(txt) || {}).error || {}).message || ''; } catch (e) {}
      _warn(_signInReason(code, em));
      return '';
    }
    return JSON.parse(txt).idToken || '';
  } catch (e) {
    _warn('Could not reach Google to sign in: ' + e);
    return '';
  }
}

/** Turns Firebase's error code into something worth reading at 7am. */
function _signInReason(code, em) {
  code = String(code || '');
  if (code.indexOf('EMAIL_NOT_FOUND') === 0)
    return 'Firebase has no account "' + em + '". Open Firebase Console → Authentication → ' +
           'Users and copy the address listed there into FB_EMAIL. (The address alerts are ' +
           'SENT to is a different thing.)';
  if (code.indexOf('INVALID_PASSWORD') === 0 || code.indexOf('INVALID_LOGIN_CREDENTIALS') === 0)
    return 'Firebase rejected the email/password for "' + em + '". Either FB_PASSWORD is wrong, ' +
           'or that address is not the dashboard login. Check Authentication → Users.';
  if (code.indexOf('API_KEY') > -1 || code.indexOf('API key') > -1)
    return 'FB_API_KEY is not this project\'s Web API key. Firebase Console → Project settings ' +
           '→ General → Web API Key.';
  if (code.indexOf('USER_DISABLED') === 0)
    return 'The account "' + em + '" is disabled in Firebase → Authentication → Users.';
  if (code.indexOf('TOO_MANY_ATTEMPTS') > -1)
    return 'Firebase has temporarily blocked sign-in after repeated failures. Wait a few minutes, ' +
           'then fix the password before trying again.';
  if (code.indexOf('PASSWORD_LOGIN_DISABLED') > -1 || code.indexOf('OPERATION_NOT_ALLOWED') === 0)
    return 'Email/Password sign-in is turned off. Firebase Console → Authentication → Sign-in ' +
           'method → enable Email/Password.';
  return 'Firebase refused the sign-in: ' + (code || 'no reason given') + '.';
}

/** Records whose Next Appointment is `day`, minus anything sitting in the Bin. */
function _appointmentsOn(day, token) {
  var url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
            '/databases/(default)/documents:runQuery';
  var query = {
    structuredQuery: {
      from: [{ collectionId: 'records' }],
      where: { fieldFilter: { field: { fieldPath: 'next' }, op: 'EQUAL',
                              value: { stringValue: day } } }
    }
  };
  var out = [];
  try {
    var res = UrlFetchApp.fetch(url, {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify(query)
    });
    if (res.getResponseCode() !== 200) { _warn('Firestore said ' + res.getResponseCode() + '.'); return []; }
    var rows = JSON.parse(res.getContentText()) || [];
    for (var i = 0; i < rows.length; i++) {
      var doc = rows[i] && rows[i].document;
      if (!doc || !doc.fields) continue;
      var f = doc.fields;
      // a record in the Bin is not an appointment any more
      if (f.deletedAt && f.deletedAt.stringValue) continue;
      out.push({
        name:    (f.name    && f.name.stringValue)    || '',
        mobile:  (f.mobile  && f.mobile.stringValue)  || '',
        service: (f.service && f.service.stringValue) || '',
        id:      (f.id      && f.id.stringValue)      || ''
      });
    }
  } catch (e) { _warn('Could not reach Firestore: ' + e); return []; }
  return out;
}

/* ---------- the email ---------- */

function _subject(n, day) {
  if (!n) return 'No appointments tomorrow — ' + _dmy(day);
  return n + (n === 1 ? ' appointment' : ' appointments') + ' tomorrow — ' +
         _weekday(day) + ' ' + _dmy(day);
}

/** The Bangla reminder the clinic sends. Patients here read Bangla first. */
function _waText(a, day) {
  var who = a.name ? ' ' + a.name : '';
  return 'আসসালামু আলাইকুম' + who + ',\n\n'
       + CLINIC_NAME + ' থেকে মনে করিয়ে দিচ্ছি — আগামীকাল ' + _dmy(day)
       + ' আপনার অ্যাপয়েন্টমেন্ট রয়েছে'
       + (a.service ? ' (' + a.service + ')' : '') + '।\n\n'
       + 'আসতে না পারলে বা সময় বদলাতে চাইলে এই মেসেজের উত্তর দিন। ধন্যবাদ।';
}

function _waLink(a, day) {
  var digits = String(a.mobile || '').replace(/\D/g, '');
  if (digits.length < 10) return '';
  return 'https://wa.me/88' + digits + '?text=' + encodeURIComponent(_waText(a, day));
}

function _body(list, day) {
  var h = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1f2d3d">'
        + '<h2 style="color:#173a63;margin:0 0 4px">Appointments tomorrow</h2>'
        + '<p style="color:#6b7a8c;margin:0 0 16px">' + _weekday(day) + ' ' + _dmy(day) + '</p>';

  if (!list.length) {
    return h + '<p>Nothing booked for tomorrow.</p></div>';
  }

  h += '<p style="margin:0 0 14px">Tap <b>Send reminder</b> beside a client and WhatsApp '
     + 'opens with the message already written — just press send.</p>';

  for (var i = 0; i < list.length; i++) {
    var a = list[i], wa = _waLink(a, day), phone = _txt(a.mobile);
    h += '<div style="border:1px solid #e7eef1;border-radius:10px;padding:12px 14px;margin-bottom:10px">'
       + '<div><b style="color:#173a63">' + _txt(a.name || '(no name)') + '</b>'
       + (a.id ? ' <span style="color:#6b7a8c;font-size:13px">' + _txt(a.id) + '</span>' : '')
       + '</div>'
       + '<div style="color:#6b7a8c;font-size:14px;margin:4px 0 10px">'
       + (a.service ? _txt(a.service) : 'Service not noted')
       + (phone ? ' · <a href="tel:' + phone + '">' + phone + '</a>' : '')
       + '</div>'
       + (wa
          ? '<a href="' + wa + '" style="background:#25D366;color:#fff;padding:9px 14px;'
            + 'border-radius:8px;text-decoration:none;font-weight:bold">Send reminder</a>'
          : '<span style="color:#c0392b;font-size:13px">No usable phone number — call them.</span>')
       + '</div>';
  }

  h += '<p style="color:#6b7a8c;font-size:12px;margin-top:18px">'
     + 'Sent automatically by the ' + CLINIC_NAME + ' dashboard. Appointments come from the '
     + 'Next Appointment dates in your records.</p></div>';
  return h;
}

/* ---------- helpers ---------- */

/* Its own copy rather than borrowing _clean() from the booking-alert file: the only
   things this file takes from there are TO_EMAIL and CLINIC_NAME, which the setup notes
   call out. A missing helper would fail at send time, when nobody is watching. */
function _txt(v) {
  return String(v == null ? '' : v).replace(/[<>]/g, '').slice(0, 120).trim();
}

function _warn(msg) {
  // surfaced in Apps Script → Executions, so a silent failure is still findable
  console.warn(msg);
}
