/* Khulna Digital Surveyor Association — keep each services/*.html price in step with the shared content.

   Why this exists: every service page used to carry its own hard-coded price
   (e.g. veneers.html had `data-en="৳ 3,500–7,500"`) with no link to the price
   table or the homepage card. Editing a price in the admin editor would have
   updated the homepage, price table, calculator and booking form while the
   service page silently kept contradicting them.

   Deliberately syncs the PRICE ONLY. The page's `.prod-desc` is longer,
   patient-facing copy written per page ("Have a chipped, stained or gappy front
   tooth?…"), whereas the card's `de`/`db` is a one-line blurb. Overwriting one
   with the other would lose the better copy, so page prose stays hand-written.

   Load AFTER assets/content.js. The page's own inline setLang() has already run
   by then, so this re-applies the language once the attributes are updated. */
(function () {
  var C = window.CLINIC_CONTENT;
  if (!C || !C.services) return;

  var slug = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
  if (!slug) return;

  var entry = null;
  for (var i = 0; i < C.services.length; i++) {
    if (C.services[i].slug === slug) { entry = C.services[i]; break; }
  }
  if (!entry || !entry.pr) return;

  var BN = "০১২৩৪৫৬৭৮৯";
  function toBn(s) {
    return String(s).replace(/[0-9]/g, function (d) { return BN.charAt(+d); });
  }

  /* "From ৳25,000" -> EN kept as authored; BN gets Bengali digits and reads
     naturally with the qualifier after the amount, as Bangla does.  */
  function bnPrice(p) {
    var m = /^From\s+(.*)$/.exec(p);
    if (m) return toBn(m[1]) + " থেকে";
    return toBn(p);
  }

  var el = document.querySelector(".prod-price");
  if (!el) return;

  var en = String(entry.pr).replace(/^৳/, "৳ ");   // page style has a space after ৳
  el.setAttribute("data-en", en);
  el.setAttribute("data-bn", bnPrice(entry.pr));

  /* re-apply whichever language is active so the change is visible immediately */
  var lang = document.documentElement.getAttribute("data-lang") || "bn";
  el.textContent = el.getAttribute(lang === "bn" ? "data-bn" : "data-en");
})();
