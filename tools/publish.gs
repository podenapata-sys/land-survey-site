/**
 * Khulna Digital Surveyor Association — publish content edits to the website.
 *
 * The content editor (admin-content.html) runs in a browser and cannot write files.
 * It sends its changes here; this commits them to the repository, and GitHub Pages
 * rebuilds the site by itself a minute or so later.
 *
 * WHY THE TOKEN LIVES HERE AND NOT IN THE BROWSER
 * Writing to the repository needs a GitHub token. Kept in the page it would sit in
 * localStorage on whatever device the clinic uses, readable by anything that gets a
 * moment alone with that browser. Here it never leaves Google's servers, and the only
 * thing the browser can ask for is "commit these files" — nothing else in the account.
 *
 * WHO IS ALLOWED
 * The caller must send a Firebase ID token from a signed-in session, and it must belong
 * to FB_EMAIL — the clinic's own dashboard login. The web app is open to anyone (the
 * booking form needs that), so this check is what stops a stranger publishing.
 *
 * ── SETUP (once) ────────────────────────────────────────────────────────────
 * 1. Make a GitHub token: github.com → Settings → Developer settings →
 *    Personal access tokens → Fine-grained tokens → Generate new token.
 *      Repository access: Only select repositories → this repository
 *      Permissions: Repository permissions → Contents → Read and write
 *    Nothing else. Copy the token (it is shown once).
 * 2. Apps Script → Project Settings → Script Properties → add
 *      GITHUB_TOKEN = the token you just copied
 *    FB_API_KEY and FB_EMAIL are already there for the reminder; this reuses them.
 * 3. Deploy → Manage deployments → New version. The editor talks to the same /exec
 *    URL the booking form uses.
 */

var GITHUB_REPO   = 'your-github-username/your-repo-name';
/* The branch GitHub Pages builds from. Must match .github/workflows/pages.yml — commit
   to anything else and the publish succeeds while the website never changes. */
var GITHUB_BRANCH = 'main';
var GITHUB_API    = 'https://api.github.com';

/** Called from doPost in Code.gs when the payload carries action:"publish". */
function publishContent(d) {
  /* Pressing Run on this in the editor calls it with nothing, which used to throw a
     TypeError that looked like a real fault. It is driven by the website editor. */
  if (!d || typeof d !== 'object')
    return { ok: false, error: 'publishContent is called by the website editor, not run from ' +
             'this toolbar. Open the dashboard, press Connect, then Publish to website.' };

  var who = _verifyClinic(d.idToken);
  if (!who.ok) return { ok: false, error: who.error };

  var files = d.files;
  if (!files || !files.length) return { ok: false, error: 'Nothing to publish.' };
  if (files.length > 60) return { ok: false, error: 'Too many files in one publish.' };

  for (var i = 0; i < files.length; i++) {
    var bad = _pathAllowed(files[i].path);
    if (bad) return { ok: false, error: bad };
  }

  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) return { ok: false, error: 'GITHUB_TOKEN is not set in Script Properties.' };

  try {
    return _commit(token, files, d.message || 'Update website content', who.email);
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/* ---------- who is asking ---------- */

/** True only for a signed-in session belonging to the clinic's own account. */
function _verifyClinic(idToken) {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('FB_API_KEY'), want = props.getProperty('FB_EMAIL');
  if (!key || !want) return { ok: false, error: 'FB_API_KEY / FB_EMAIL are not set in Script Properties.' };
  if (!idToken) return { ok: false, error: 'Not signed in.' };

  try {
    var res = UrlFetchApp.fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + encodeURIComponent(key),
      { method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        payload: JSON.stringify({ idToken: idToken }) });
    if (res.getResponseCode() !== 200) return { ok: false, error: 'Your sign-in has expired. Sign in again.' };
    var users = (JSON.parse(res.getContentText()) || {}).users || [];
    var email = users.length ? String(users[0].email || '') : '';
    if (!email) return { ok: false, error: 'Your sign-in has expired. Sign in again.' };
    if (email.toLowerCase() !== String(want).toLowerCase())
      return { ok: false, error: 'That account may not publish.' };
    return { ok: true, email: email };
  } catch (e) {
    return { ok: false, error: 'Could not check the sign-in: ' + e };
  }
}

/** Only the content file and the photo folders. Nothing may escape them. */
function _pathAllowed(p) {
  p = String(p || '');
  if (!p) return 'A file had no path.';
  if (p.indexOf('..') > -1 || p.charAt(0) === '/') return 'Bad path: ' + p;
  if (p === 'assets/content.js') return '';
  if (/^assets\/services\/(cards\/|thumbs\/)?[a-z0-9-]{1,40}\.jpg$/.test(p)) return '';
  return 'This publish tried to write somewhere it should not: ' + p;
}

/* ---------- one atomic commit ---------- */

function _gh(token, method, path, payload) {
  var opts = {
    method: method, muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json',
               'User-Agent': 'land-survey-content-editor' }
  };
  if (payload) { opts.contentType = 'application/json'; opts.payload = JSON.stringify(payload); }
  var res = UrlFetchApp.fetch(GITHUB_API + path, opts);
  var code = res.getResponseCode(), text = res.getContentText();
  if (code < 200 || code >= 300) throw new Error('GitHub ' + code + ' on ' + path + ': ' + text.slice(0, 200));
  return JSON.parse(text || '{}');
}

/* Blobs → tree → commit → move the branch. One commit for every file, so the site is
   never rebuilt from a half-written state. */
function _commit(token, files, message, email) {
  var repo = '/repos/' + GITHUB_REPO;
  var ref  = _gh(token, 'get', repo + '/git/ref/heads/' + GITHUB_BRANCH);
  var headSha = ref.object.sha;
  var head = _gh(token, 'get', repo + '/git/commits/' + headSha);

  var tree = [];
  for (var i = 0; i < files.length; i++) {
    var blob = _gh(token, 'post', repo + '/git/blobs',
      { content: files[i].content, encoding: 'base64' });
    tree.push({ path: files[i].path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  var newTree = _gh(token, 'post', repo + '/git/trees', { base_tree: head.tree.sha, tree: tree });
  var commit  = _gh(token, 'post', repo + '/git/commits', {
    message: message + '\n\nPublished from the content editor by ' + email + '.',
    tree: newTree.sha, parents: [headSha]
  });
  _gh(token, 'patch', repo + '/git/refs/heads/' + GITHUB_BRANCH, { sha: commit.sha });

  return { ok: true, commit: commit.sha.slice(0, 7), files: files.length };
}
