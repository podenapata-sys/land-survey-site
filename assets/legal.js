/* Shared legal layer: footer legal links, the accuracy-notice line, the
   cookie-consent banner, and third-party gating. Works with BOTH i18n systems
   (index/book use data-i18n; other pages use data-en/data-bn) by setting text directly
   and re-translating on the language toggle. */
(function () {
  "use strict";

  // Path prefix so links work from root pages and nested (services/blog/gallery) pages.
  var p = location.pathname;
  var PRE = /\/(services|blog|gallery)\//.test(p) ? "../" : "";

  var STR = {
    privacy:  { en: "Privacy Policy",     bn: "প্রাইভেসি পলিসি" },
    terms:    { en: "Terms of Use",       bn: "ব্যবহারের শর্তাবলি" },
    disc:     { en: "Accuracy Notice", bn: "নির্ভুলতা বিজ্ঞপ্তি" },
    /* On every page, because the fee estimator and the area converter both
       produce numbers a visitor could mistake for a measurement. */
    discline: {
      en: "Figures on this site are fee estimates and unit conversions, never a measurement. Official area comes from the signed field survey report.",
      bn: "এই সাইটের সংখ্যাগুলো খরচের ধারণা ও একক রূপান্তর — জমির পরিমাপ নয়। প্রকৃত পরিমাণ স্বাক্ষরিত মাঠ জরিপ রিপোর্টে নির্ধারিত হয়।"
    },
    cookie: {
      en: "We use cookies and third-party services (Google Maps, WhatsApp, comments) to run this site and improve your experience.",
      bn: "এই সাইট চালাতে ও আপনার অভিজ্ঞতা উন্নত করতে আমরা কুকি ও তৃতীয় পক্ষের সেবা (গুগল ম্যাপ, হোয়াটসঅ্যাপ, কমেন্ট) ব্যবহার করি।"
    },
    accept:  { en: "Accept",  bn: "সম্মত" },
    decline: { en: "Decline", bn: "না" },
    learn:   { en: "Learn more", bn: "আরও জানুন" }
  };

  /* The markup ships <html data-lang="en"> and app.js only flips it inside
     applyI18n(). Both scripts are deferred, so which runs first is a race this
     file kept losing: translate() read "en" and rendered "Privacy Policy /
     Terms of Use / Accuracy Notice" in English on a Bangla page, then only
     re-ran on a toggle click — so it stayed English unless the visitor pressed
     EN twice. Read the stored preference the way app.js does (same key, same
     Bangla default) and the order stops mattering. */
  function lang() {
    if (document.documentElement.getAttribute("data-lang") === "bn") return "bn";
    var stored = null;
    try { stored = localStorage.getItem("clinic_lang"); } catch (e) {}
    return stored === "en" ? "en" : "bn";
  }

  /* ---------- Footer legal bar + disclaimer line ---------- */
  function buildFooter() {
    document.querySelectorAll(".footer").forEach(function (f) {
      if (f.querySelector(".foot-legal")) return;
      var bar = document.createElement("div");
      bar.className = "foot-legal";
      bar.innerHTML =
        '<div class="foot-legal-links">' +
          '<a href="' + PRE + 'privacy-policy.html" data-lg="privacy"></a><span>·</span>' +
          '<a href="' + PRE + 'terms.html" data-lg="terms"></a><span>·</span>' +
          '<a href="' + PRE + 'accuracy-disclaimer.html" data-lg="disc"></a>' +
        '</div>' +
        '<p class="foot-disc" data-lg="discline"></p>';
      var bottom = f.querySelector(".foot-bottom");
      if (bottom) bottom.parentNode.insertBefore(bar, bottom);
      else f.appendChild(bar);
    });
  }

  /* ---------- Cookie consent ---------- */
  function consent() { try { return localStorage.getItem("clinic_consent"); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem("clinic_consent", v); } catch (e) {} }

  function buildBanner() {
    if (consent()) { if (consent() === "granted") loadGated(); return; }
    var b = document.createElement("div");
    b.className = "cookie-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Cookie notice");
    b.innerHTML =
      '<p class="cookie-txt"><span data-lg="cookie"></span> ' +
        '<a href="' + PRE + 'privacy-policy.html" data-lg="learn"></a></p>' +
      '<div class="cookie-btns">' +
        '<button type="button" class="cookie-decline" data-lg="decline"></button>' +
        '<button type="button" class="cookie-accept" data-lg="accept"></button>' +
      '</div>';
    document.body.appendChild(b);
    b.querySelector(".cookie-accept").addEventListener("click", function () {
      setConsent("granted"); b.remove(); loadGated();
    });
    b.querySelector(".cookie-decline").addEventListener("click", function () {
      setConsent("denied"); b.remove();
    });
    translate();
  }

  // Load consent-gated third parties (currently Disqus on the gallery).
  function loadGated() { if (typeof window.__loadDisqus === "function") window.__loadDisqus(); }

  /* ---------- Translation (both i18n systems) ---------- */
  function translate() {
    var l = lang();
    document.querySelectorAll("[data-lg]").forEach(function (el) {
      var s = STR[el.getAttribute("data-lg")];
      if (s) el.textContent = s[l];
    });
  }

  function init() {
    buildFooter();
    loadGated();       // no cookie banner — load consent-gated third parties (Disqus) directly
    translate();
    var tg = document.getElementById("langToggle");
    if (tg) tg.addEventListener("click", function () { setTimeout(translate, 0); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
