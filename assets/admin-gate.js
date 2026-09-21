/* Khulna Digital Surveyor Association — private admin gateway.
   Tapping the FOOTER logo 3 times quickly opens the admin dashboard.

   Why the footer mark and not the header brand:
   - the header .brand is a link to #home, so repeated taps also navigated the page;
   - the footer mark is a plain element, so the taps have no side effect;
   - it sits at the very bottom, where a visitor will not reach it by accident.

   This lives in its own file (rather than assets/app.js) because 26 of the site's
   28 public pages do not load app.js — the gateway only worked on the homepage and
   the booking page before. Loaded alongside brand-highlight.js, it works everywhere.

   Must NOT be loaded together with a second copy of this logic: two listeners would
   both count the same click and the dashboard would open in fewer taps than intended. */
(function () {
  var TAPS_NEEDED = 3;
  var WINDOW_MS = 1600;   // taps further apart than this start a fresh count
  var taps = 0, last = 0;

  document.addEventListener("click", function (e) {
    var logo = e.target.closest && e.target.closest(".foot-logo");
    if (!logo) return;

    var now = Date.now();
    if (now - last > WINDOW_MS) taps = 0;
    last = now;
    taps++;

    if (taps >= TAPS_NEEDED) {
      taps = 0;
      e.preventDefault();
      // pages in services/, blog/ and gallery/ declare how far up the site root is
      var root = (document.querySelector('meta[name="page-root"]') || {}).content || "";
      window.location.href = root + "dashboard.html";
    }
  }, true);
})();
