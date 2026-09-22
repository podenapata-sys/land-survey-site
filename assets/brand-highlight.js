/* Highlight the brand name "Khulna Divisional Digital Surveyors Association" / "খুলনা বিভাগীয় ডিজিটাল সার্ভেয়ার এসোসিয়েশন" in running text.
   Runs on load and re-applies after language toggle (setLang rewrites textContent). */
(function () {
  // For Bangla, also consume any trailing vowel-signs / case-ending letters that
  // attach to "ল্যান্ড" (e.g. ল্যান্ডে, ল্যান্ডের) so the word is never split —
  // splitting would orphan a combining mark and render a broken glyph.
  var RXG = /(Khulna Divisional Digital Surveyors Association|খুলনা বিভাগীয় ডিজিটাল সার্ভেয়ার এসোসিয়েশন[ঀ-৿]*)/g;
  var RXT = /(Khulna Divisional Digital Surveyors Association|খুলনা বিভাগীয় ডিজিটাল সার্ভেয়ার এসোসিয়েশন)/;
  var SKIP_TAG = { SCRIPT: 1, STYLE: 1, INPUT: 1, TEXTAREA: 1, NOSCRIPT: 1, IFRAME: 1, OPTION: 1 };
  var busy = false;

  function skip(el) {
    if (!el) return true;
    if (SKIP_TAG[el.tagName]) return true;
    // leave the logo lockup and already-highlighted text alone
    return !!(el.closest && el.closest(".brand, .foot-logo, .logo-anim, .brand-hl"));
  }

  function run() {
    if (busy || !document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !RXT.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        if (skip(n.parentNode)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    if (!nodes.length) return;
    busy = true;
    nodes.forEach(function (node) {
      var text = node.nodeValue, frag = document.createDocumentFragment(), last = 0, m;
      RXG.lastIndex = 0;
      while ((m = RXG.exec(text))) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var span = document.createElement("span");
        span.className = "brand-hl";
        span.textContent = m[0];
        frag.appendChild(span);
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
    busy = false;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();

  // re-apply after language toggle / dynamic renders.
  // Leading-edge throttle: re-highlight immediately, then at most every 120ms during
  // continuous mutations (e.g. the calculator count-up) so there's no visible flash.
  var last = 0, t = null;
  function schedule() {
    if (busy) return;
    var now = Date.now(), since = now - last;
    clearTimeout(t);
    if (since >= 120) { last = now; run(); }
    else t = setTimeout(function () { last = Date.now(); run(); }, 120 - since);
  }
  var mo = new MutationObserver(schedule);
  if (document.body) mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  else document.addEventListener("DOMContentLoaded", function () {
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
