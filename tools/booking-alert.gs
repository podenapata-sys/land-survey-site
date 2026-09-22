/**
 * Khulna Divisional Digital Surveyors Association — free booking alerts by email.
 *
 * The website has no server, so this small Google Apps Script acts as one. It
 * receives a booking from book.html and emails it to the clinic, which the Gmail
 * app on a phone shows as a notification.
 *
 * It also appends every booking to a Google Sheet in the clinic's own Drive, so
 * there is a complete list to open in Excel without anyone re-typing anything.
 * The sheet is created automatically on the first booking; run bookingsSheetUrl()
 * from the editor to get its link.
 *
 * Free: MailApp allows about 100 emails a day on a normal Google account, far
 * more than a clinic will ever book in a day.
 *
 * ── SETUP (about five minutes, once) ────────────────────────────────────────
 * 1. Go to script.google.com and press "New project".
 * 2. Delete whatever is in the editor and paste this whole file in.
 * 3. Change TO_EMAIL below to the address that should receive the alerts, and
 *    change SHARED_TOKEN to any random word of your own.
 * 4. Press Deploy → New deployment → type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Press Deploy, then Authorise access and allow it (Google will warn that
 *    the app is not verified — that is normal for your own script; choose
 *    Advanced → Go to project).
 * 5. Copy the Web app URL it gives you.
 * 6. Put that URL and the same token into assets/firebase-config.js:
 *      window.CLINIC_ALERT_URL   = "https://script.google.com/macros/s/..../exec";
 *      window.CLINIC_ALERT_TOKEN = "your-random-word";
 *
 * ── A NOTE ON THE TOKEN ─────────────────────────────────────────────────────
 * The token sits in the website's page source, so anyone determined can read
 * it. It is a speed bump against random bots, not a secret. The worst that can
 * happen is junk arriving in the inbox below — the script can only ever email
 * that one fixed address, and it can never read or change anything else.
 */

/* Who receives the alerts. Separate several with commas — every one of them gets the
   same email. Note that Google's ~100-a-day mail allowance counts RECIPIENTS, not
   messages, so two addresses means two units per booking (about 50 bookings a day
   instead of 100 — still far more than a clinic takes). */
/* ── OAuth scopes this project needs ───────────────────────────────────────────────
   appsscript.json pins an explicit list, which is safer than letting Google infer it —
   but it means a service used for the first time is refused until its scope is added.
   The complete set for this file, Reminder.gs and Publish.gs:

     "https://www.googleapis.com/auth/script.send_mail"          MailApp
     "https://www.googleapis.com/auth/script.external_request"   UrlFetchApp
     "https://www.googleapis.com/auth/script.scriptapp"          triggers (the sweep)
     "https://www.googleapis.com/auth/spreadsheets"              the bookings sheet
     "https://www.googleapis.com/auth/drive.file"                creating that sheet
     "https://www.googleapis.com/auth/userinfo.email"            who the mail sends as

   Add a missing one in the editor: appsscript.json in the file list, then Save, then
   run the function again and press Allow. Do NOT replace the whole file — the webapp
   block in it holds the deployment settings.
   ──────────────────────────────────────────────────────────────────────────────── */

var TO_EMAIL     = 'you@example.com';
var SHARED_TOKEN = 'change-me-to-a-random-word';                // ← must match firebase-config.js
var CLINIC_NAME  = 'Khulna Divisional Digital Surveyors Association';

/** TO_EMAIL as MailApp wants it. Typing a list by hand invites a trailing comma, a
    stray semicolon or a line break, and MailApp rejects the whole send for one bad
    entry — so anything without an "@" is dropped rather than taking the alert down
    with it. */
function _recipients() {
  return String(TO_EMAIL || '')
    .split(/[,;\s]+/)
    .filter(function (a) { return a.indexOf('@') > 0; })
    .join(',');
}

/** The alert email, built in one place. Two things send it now — the beacon the website
    fires, and the sweep that runs on a timer — and a clinic reading both must not be able
    to tell which one it came from. Building it twice is how they drift apart. */
function _bookingEmail(d) {
  var name  = _clean(d.name) || '(no name given)';
  var phone = _clean(d.phone);
  var when  = [_clean(d.date), _clean(d.time)].filter(String).join(' at ') || 'not specified';
  var rows  = [
    ['Client',    name],
    ['Phone',     phone ? '<a href="tel:' + phone + '">' + phone + '</a>' : '(not given)'],
    ['Service',   _clean(d.service) || 'not specified'],
    ['Wants',     when],
    ['Address',   _address(d) || '—']
  ];

  /* Parcel identity, appended only when the enquirer actually gave it. A row
     of five em-dashes is noise in a notification someone reads on a phone. */
  var plot = [
    ['District', _clean(d.district)],
    ['Mouza',    _clean(d.mouza) + (_clean(d.jl) ? ' (JL ' + _clean(d.jl) + ')' : '')],
    ['Dag No.',  _clean(d.dag)],
    ['Khatian',  _clean(d.khatian)],
    ['Area',     _clean(d.area) ? _clean(d.area) + ' ' + _clean(d.areaUnit) : '']
  ];
  for (var pi = 0; pi < plot.length; pi++) {
    if (plot[pi][1]) rows.push(plot[pi]);
  }
  var body = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1f2d3d">'
    + (d.emerg ? '<p style="background:#fde8e8;color:#c0392b;padding:10px;border-radius:8px">'
               + '<b>Marked as an emergency / same-day request.</b></p>' : '')
    + '<h2 style="color:#173a63;margin:0 0 12px">New booking from the website</h2>'
    + '<table cellpadding="7" style="border-collapse:collapse">';
  for (var i = 0; i < rows.length; i++) {
    body += '<tr>'
         +  '<td style="color:#6b7a8c">' + rows[i][0] + '</td>'
         +  '<td><b>' + rows[i][1] + '</b></td></tr>';
  }
  body += '</table>'
    + (phone ? '<p style="margin-top:16px">'
             + '<a href="https://wa.me/88' + phone.replace(/\D/g, '') + '"'
             + ' style="background:#25D366;color:#fff;padding:10px 16px;border-radius:8px;'
             + 'text-decoration:none;font-weight:bold">Reply on WhatsApp</a></p>' : '')
    + '<p style="color:#6b7a8c;font-size:12px;margin-top:20px">'
    + 'Sent automatically by the ' + CLINIC_NAME + ' website. It is also saved in your dashboard'
    + (_sheetUrl() ? ' and in your <a href="' + _sheetUrl() + '">bookings sheet</a>' : '')
    + '.</p></div>';
  return {
    subject: (d.emerg ? '[EMERGENCY] ' : '') + 'New booking — ' + name,
    body: body
  };
}

/* A project may only have one doPost, so this is the single front door: the booking
   form and the content editor both arrive here and are told apart by `action`. */
function doPost(e) {
  try {
    /* Pressing Run on doPost from the editor gets here with no request attached. The
       catch below would swallow the TypeError and report "Execution completed" having
       sent nothing — which reads exactly like a broken email. Say so instead. */
    if (!e || !e.postData) {
      console.log('doPost is the website\'s entry point — it cannot be run from the editor, '
                + 'because there is no booking attached to it.');
      console.log('To test the email: pick sendTestAlert in the function dropdown above, '
                + 'then press Run. To see the setup: pick checkAlertSetup.');
      return _ok('no request');
    }

    var d = JSON.parse(e.postData.contents);

    /* The content editor. Guarded by a Firebase sign-in inside publishContent(), not by
       SHARED_TOKEN — that token is in the website's page source and must never be
       enough to write to the repository. Defined in publish.gs. */
    if (d && d.action === 'publish') return _ok(JSON.stringify(publishContent(d)));

    if (String(d.token || '') !== SHARED_TOKEN) return _ok('ignored');

    /* Written down before anything else. If the mail quota is spent or Gmail is having
       a bad day the booking is still recorded. */
    try { _logBooking(d); } catch (logErr) { console.warn('Sheet log failed: ' + logErr); }

    var to = _recipients();
    if (!to) return _ok('no recipient');   // logged to the sheet regardless, above

    var mail = _bookingEmail(d);
    MailApp.sendEmail({ to: to, subject: mail.subject, htmlBody: mail.body,
                        name: CLINIC_NAME + ' website' });

    /* Tell the sweep this one is done. It reads the same booking out of Firestore a few
       minutes later and would otherwise send it a second time. */
    _markHandled(_fingerprint(d.phone, new Date()));
    return _ok('sent');
  } catch (err) {
    // never throw: a failed alert must not affect the client's booking
    return _ok('error');
  }
}

/* Visiting the URL in a browser should say something friendly rather than error. */
function doGet() {
  return _ok(CLINIC_NAME + ' booking alerts are running.');
}

/* ---------- the bookings sheet ---------- */

var SHEET_NAME    = 'Website Bookings';
var SHEET_HEADERS = ['Received', 'Client', 'Phone', 'Address', 'Service',
                     'District', 'Mouza', 'JL', 'Dag', 'Khatian', 'Area',
                     'Requested date', 'Requested time', 'Emergency', 'Status'];
var ADDRESS_COL   = 4;   // where Address sits in SHEET_HEADERS

/** The booking form used to ask "where are you coming from?" and send it as `msg`.
    It asks for the address outright now. Read both so a visitor still on a cached
    copy of the old page lands in the Address column rather than nowhere. */
function _address(d) {
  return _clean(d && d.address) || _clean(d && d.msg);
}

/** Adds one booking to the top of the sheet. Newest first, so the clinic opens it
    and sees today without scrolling.

    Each value is placed under its OWN heading rather than at a fixed position. The sheet
    is the clinic's own file: they can reorder the columns, and the Address column arrives
    by migration on a sheet that predates it. Writing by position meant one unexpected
    column put every phone number under Service. */
function _logBooking(d) {
  var sh = _bookingsSheet();
  if (!sh) return;
  var width = Math.max(sh.getLastColumn(), SHEET_HEADERS.length);
  var head  = sh.getRange(1, 1, 1, width).getValues()[0];
  var byName = {
    'received':       Utilities.formatDate(new Date(), 'Asia/Dhaka', 'dd-MM-yyyy HH:mm'),
    'client':         _clean(d.name),
    'patient':        _clean(d.name),   // sheets created before the rename
    'phone':          _clean(d.phone),
    'address':        _address(d),
    'note':           _address(d),   // an un-migrated sheet still says Note
    'service':        _clean(d.service),
    'district':       _clean(d.district),
    'mouza':          _clean(d.mouza),
    'jl':             _clean(d.jl),
    'dag':            _clean(d.dag),
    'khatian':        _clean(d.khatian),
    'area':           _clean(d.area) ? _clean(d.area) + ' ' + _clean(d.areaUnit) : '',
    'treatment':      _clean(d.service),  // ditto
    'requested date': _clean(d.date),
    'requested time': _clean(d.time),
    'emergency':      d.emerg ? 'YES' : '',
    'status':         'New'
  };
  var row = head.map(function (h) {
    var k = String(h).trim().toLowerCase();
    return byName.hasOwnProperty(k) ? byName[k] : '';
  });
  sh.insertRowBefore(2);
  sh.getRange(2, 1, 1, row.length).setValues([row]);
}

/** The sheet, made on first use and remembered afterwards. */
function _bookingsSheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('BOOKINGS_SHEET_ID');
  if (id) {
    try {
      var existing = SpreadsheetApp.openById(id).getSheets()[0];
      _addAddressColumn(existing);
      return existing;
    }
    catch (e) { /* deleted or in someone's bin — fall through and make a new one */ }
  }
  var ss = SpreadsheetApp.create(SHEET_NAME);
  var sh = ss.getSheets()[0];
  sh.getRange(1, 1, 1, SHEET_HEADERS.length)
    .setValues([SHEET_HEADERS]).setFontWeight('bold').setBackground('#eef4f7');
  sh.setFrozenRows(1);
  /* Phone as TEXT. A spreadsheet reads 01711223344 as a number and drops the leading
     zero, which makes every Bangladeshi mobile in the file wrong. */
  sh.getRange('C:C').setNumberFormat('@');
  sh.setColumnWidth(1, 130);
  sh.setColumnWidth(ADDRESS_COL, 220);
  props.setProperty('BOOKINGS_SHEET_ID', ss.getId());
  return sh;
}

/** Sheets made before the booking form asked for an address have no Address heading,
    and _logBooking would write straight past them into the wrong columns.

    Their **Note** column already holds the answer to "where are you coming from?" — the
    same question, asked less directly — so it is renamed and slid into place rather than
    left behind: no history is lost and nothing ends up in a column it does not belong in.
    A sheet with no Note column at all just gains an empty one.

    Runs once. Every booking after that finds the heading and returns immediately. */
function _addAddressColumn(sh) {
  try {
    var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var noteAt = -1;
    for (var i = 0; i < head.length; i++) {
      var h = String(head[i]).trim().toLowerCase();
      if (h === 'address') return;            // already migrated
      if (h === 'note') noteAt = i + 1;       // getRange is 1-based
    }
    if (noteAt > 0) {
      sh.getRange(1, noteAt).setValue('Address');
      if (noteAt !== ADDRESS_COL) {
        sh.moveColumns(sh.getRange(1, noteAt, sh.getMaxRows(), 1), ADDRESS_COL);
      }
    } else {
      sh.insertColumnAfter(ADDRESS_COL - 1);
      sh.getRange(1, ADDRESS_COL)
        .setValue('Address').setFontWeight('bold').setBackground('#eef4f7');
    }
    sh.setColumnWidth(ADDRESS_COL, 220);
  } catch (e) { console.warn('Address column: ' + e); }
}

function _sheetUrl() {
  var id = PropertiesService.getScriptProperties().getProperty('BOOKINGS_SHEET_ID');
  return id ? 'https://docs.google.com/spreadsheets/d/' + id : '';
}

/* ---------- the safety net ----------

   The beacon the website fires is sent from the CLIENT'S browser, and it is
   fire-and-forget: the page cannot see the reply, so when it is blocked by an ad-blocker,
   dropped as the phone hands off to WhatsApp, or refused because the web app's access
   setting slipped off "Anyone", nothing anywhere says so. The clinic simply stops getting
   emails and has no way to find out why.

   The booking itself is never lost — the browser writes it to Firestore by a separate
   path, which is what the dashboard's Website Bookings panel reads. So this reads the
   bookings from THERE, on a timer, on Google's servers, and emails anything the beacon
   did not already cover. The alert no longer depends on the patient's browser.

   Set it up once: run installBookingSweep() from the editor. */

var SWEEP_MINUTES = 5;    // how often to look; the worst an alert can be late

/** Emails every booking written to Firestore since the last sweep. */
function sweepBookings() {
  var props = PropertiesService.getScriptProperties();
  var since = props.getProperty('sweepFrom');

  /* Nothing recorded yet: start the clock now and send nothing. Otherwise switching this
     on would email every booking the clinic has ever taken, all at once. */
  if (!since) {
    props.setProperty('sweepFrom', new Date().toISOString());
    console.log('First run — from now on, bookings arriving after this moment are swept.');
    return;
  }

  var token = _signIn(props);            // lives in Reminder.gs, same project
  if (!token) return;                    // _signIn already said exactly what is wrong

  var list = _newBookings(token, since);
  if (!list.length) { console.log('Nothing new since ' + since + '.'); return; }

  var to = _recipients();
  if (!to) { console.warn('TO_EMAIL has no valid address — nobody to alert.'); return; }

  /* The list is oldest first, and `newest` only moves past a booking once that booking is
     genuinely dealt with — sent, or already sent by the beacon. Moving it up front looks
     equivalent and is not: a send that then fails would have been stepped over and never
     tried again. A quota that runs out mid-sweep must delay alerts, never lose them. */
  var newest = since, sent = 0, skipped = 0;
  for (var i = 0; i < list.length; i++) {
    var b = list[i];
    var fp = _fingerprint(b.phone, new Date(b.createdAt));

    if (_alreadyHandled(fp)) {                          // the beacon got there first
      skipped++;
      if (b.createdAt > newest) newest = b.createdAt;
      continue;
    }

    try {
      var mail = _bookingEmail(b);
      MailApp.sendEmail({ to: to, subject: mail.subject, htmlBody: mail.body,
                          name: CLINIC_NAME + ' website' });
      try { _logBooking(b); } catch (logErr) { console.warn('Sheet log failed: ' + logErr); }
      _markHandled(fp);
      sent++;
      if (b.createdAt > newest) newest = b.createdAt;
    } catch (mailErr) {
      console.warn('Could not send, will try again next sweep: ' + mailErr);
      break;
    }
  }
  props.setProperty('sweepFrom', newest);
  console.log('Swept: ' + sent + ' emailed, ' + skipped + ' already sent by the website.');
}

/** Bookings created after `sinceIso`, oldest first. Shaped like the object the website
    beacon sends, so _bookingEmail() and _logBooking() take it unchanged. */
function _newBookings(token, sinceIso) {
  var url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
            '/databases/(default)/documents:runQuery';
  var query = {
    structuredQuery: {
      from: [{ collectionId: 'bookings' }],
      where: { fieldFilter: { field: { fieldPath: 'createdAt' }, op: 'GREATER_THAN',
                              value: { timestampValue: sinceIso } } },
      orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'ASCENDING' }],
      limit: 50
    }
  };
  var out = [];
  try {
    var res = UrlFetchApp.fetch(url, {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify(query)
    });
    if (res.getResponseCode() !== 200) {
      console.warn('Firestore said ' + res.getResponseCode() + ': ' + res.getContentText());
      return [];
    }
    var rows = JSON.parse(res.getContentText()) || [];
    for (var i = 0; i < rows.length; i++) {
      var doc = rows[i] && rows[i].document;
      if (!doc || !doc.fields) continue;
      var f = doc.fields;
      out.push({
        name:      _str(f.name),
        phone:     _str(f.phone),
        service:   _str(f.service),
        date:      _str(f.date),
        time:      _str(f.time),
        /* `note` is what the field was called before the form asked for an address */
        address:   _str(f.address) || _str(f.note),
        district:  _str(f.district), mouza: _str(f.mouza), jl: _str(f.jl),
        dag:       _str(f.dag), khatian: _str(f.khatian),
        area:      _str(f.area), areaUnit: _str(f.areaUnit),
        emerg:     !!(f.emergency && f.emergency.booleanValue),
        createdAt: (f.createdAt && f.createdAt.timestampValue) || ''
      });
    }
  } catch (e) { console.warn('Could not reach Firestore: ' + e); return []; }
  return out;
}

function _str(field) { return (field && field.stringValue) || ''; }

/* ---------- not sending the same booking twice ----------

   doPost never learns the Firestore document id — the browser writes the document and
   beacons the script as two separate things — so a booking is identified by the phone
   number and the minute it arrived. Two bookings from one number inside the same minute
   is the only way to collide, and that does not happen. */

function _fingerprint(phone, when) {
  return String(phone || '').replace(/\D/g, '') + '@' +
         Utilities.formatDate(when, 'Asia/Dhaka', 'yyyyMMddHHmm');
}

/** The last 100 fingerprints, capped so the property store cannot grow without limit.
    A hundred covers hours of bookings — far longer than the few minutes a beacon and a
    sweep can be apart. */
function _handledList() {
  try { return JSON.parse(
    PropertiesService.getScriptProperties().getProperty('handled') || '[]') || []; }
  catch (e) { return []; }
}
function _alreadyHandled(fp) { return _handledList().indexOf(fp) > -1; }
function _markHandled(fp) {
  try {
    var list = _handledList();
    if (list.indexOf(fp) > -1) return;
    list.push(fp);
    while (list.length > 100) list.shift();
    PropertiesService.getScriptProperties().setProperty('handled', JSON.stringify(list));
  } catch (e) { console.warn('Could not record the fingerprint: ' + e); }
}

/** Run once from the editor to start the sweep. Safe to run again — it clears its own
    old trigger first, so it never ends up installed twice and emailing twice.

    Needs the script.scriptapp OAuth scope. This project pins an explicit oauthScopes list
    in appsscript.json, so any Google service the code starts using is refused until its
    scope is added there — see SCOPES below. */
function installBookingSweep() {
  var all, removed = 0;
  try {
    all = ScriptApp.getProjectTriggers();
  } catch (e) {
    console.log('CANNOT CREATE THE TRIGGER — a permission is missing.');
    console.log('Fix: open appsscript.json in the file list on the left, and add this line');
    console.log('     inside "oauthScopes":');
    console.log('       "https://www.googleapis.com/auth/script.scriptapp"');
    console.log('Then Save, run this again, and press Allow when Google asks.');
    console.log('(Or skip it: left sidebar clock icon > Add Trigger > sweepBookings,');
    console.log(' Time-driven, Minutes timer, Every ' + SWEEP_MINUTES + ' minutes.)');
    console.log('Google said: ' + e);
    return;
  }
  for (var i = 0; i < all.length; i++) {
    if (all[i].getHandlerFunction() === 'sweepBookings') {
      ScriptApp.deleteTrigger(all[i]); removed++;
    }
  }
  ScriptApp.newTrigger('sweepBookings').timeBased().everyMinutes(SWEEP_MINUTES).create();
  console.log((removed ? 'Replaced the old sweep. ' : '') +
              'Bookings are now checked every ' + SWEEP_MINUTES + ' minutes.');
  console.log('An alert can be at most ' + SWEEP_MINUTES +
              ' minutes late, even if the website never reaches this script.');
}

/* ---------- checking it, when an alert does not arrive ----------

   An alert crosses three separate things, and a failure in any one of them looks
   identical from the outside — nothing in the inbox. So test them one at a time
   rather than guessing:

     1. does the mail itself work?     -> run sendTestAlert() below
     2. is the web app reachable?      -> open the /exec URL in a browser
     3. did the website's post arrive?  -> Executions in the left sidebar

   Both functions below run straight from the editor with the ▷ Run button. They do
   NOT need a deployment: a deployment only affects what the /exec URL serves, so a
   test can be run the moment the file is saved. */

/** Sends one alert to TO_EMAIL, exactly as a real booking would, and logs the mail
    quota that is left. If this arrives but real bookings do not, the email is fine
    and the problem is the website reaching the script — check Executions. */
function sendTestAlert() {
  var to = _recipients();
  if (!to) { console.log('NO VALID ADDRESS in TO_EMAIL — nothing to send to.'); return; }
  var n = to.split(',').length;
  var left = MailApp.getRemainingDailyQuota();
  console.log('Recipients (' + n + '): ' + to);
  console.log('Sends left today: ' + left + '  (each booking uses ' + n + ')');
  if (left < n) {
    console.log('QUOTA SPENT. Google allows about 100 a day; it resets after 24 hours. '
              + 'No alert can be sent until then.');
    return;
  }
  MailApp.sendEmail({
    to: to,
    subject: '[TEST] ' + CLINIC_NAME + ' booking alert',
    htmlBody: '<div style="font-family:Arial,sans-serif;font-size:15px;color:#1f2d3d">'
            + '<h2 style="color:#173a63;margin:0 0 12px">This is a test</h2>'
            + '<p>If you can read this, alert emails are working and reaching '
            + to + '. Nobody booked anything — you can delete this.</p>'
            + '<p style="color:#6b7a8c;font-size:12px">Sent from the Apps Script editor at '
            + Utilities.formatDate(new Date(), 'Asia/Dhaka', 'dd-MM-yyyy HH:mm') + '.</p></div>',
    name: CLINIC_NAME + ' website'
  });
  console.log('Sent. Check the inbox, and the Spam and Promotions tabs.');
}

/** Prints everything the alert needs, in one run: who it emails, the token the
    website must match, how much mail quota is left, and where the sheet is. */
function checkAlertSetup() {
  var to = _recipients();
  console.log('Alerts are emailed to : ' + (to || 'NOBODY — TO_EMAIL has no valid address'));
  console.log('Number of recipients  : ' + (to ? to.split(',').length : 0)
            + '   (each booking uses that many of the daily sends)');
  console.log('Token the site must send: ' + SHARED_TOKEN
            + '   (must equal CLINIC_ALERT_TOKEN in assets/firebase-config.js)');
  console.log('Emails left to send today: ' + MailApp.getRemainingDailyQuota());
  console.log('Bookings sheet: ' + (_sheetUrl() || 'not created yet'));

  /* The safety net matters more than anything above it: without it, an alert depends on
     the patient's browser reaching this script, which nobody can see fail. */
  var props = PropertiesService.getScriptProperties();
  try {
    var on = false, all = ScriptApp.getProjectTriggers();
    for (var i = 0; i < all.length; i++) {
      if (all[i].getHandlerFunction() === 'sweepBookings') on = true;
    }
    console.log('Safety-net sweep : ' + (on
      ? 'ON — every ' + SWEEP_MINUTES + ' minutes'
      : 'OFF. Run installBookingSweep() once, or an alert is lost whenever the '
        + 'website cannot reach this script.'));
  } catch (e) {
    console.log('Safety-net sweep : CANNOT CHECK — add the script.scriptapp scope to '
              + 'appsscript.json (see installBookingSweep).');
  }
  console.log('Last swept up to : ' + (props.getProperty('sweepFrom') || 'never run yet'));
  /* one more scope that the pinned list may not carry; never let it break the report */
  try {
    console.log('Script owner (mail is sent from here): '
              + Session.getEffectiveUser().getEmail());
  } catch (e) { console.log('Script owner : not readable (userinfo.email scope not granted)'); }
}

/** Run this from the editor to find the sheet. */
function bookingsSheetUrl() {
  var url = _sheetUrl();
  console.log(url || 'No sheet yet — it is created when the first booking arrives.');
  return url;
}

function _clean(v) {
  return String(v == null ? '' : v).replace(/[<>]/g, '').slice(0, 300).trim();
}
function _ok(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
