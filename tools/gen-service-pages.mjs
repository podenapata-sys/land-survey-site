#!/usr/bin/env node
/* ============================================================================
   gen-service-pages — build services/*.html and services/index.html
   ============================================================================

     node tools/gen-service-pages.mjs

   WHY THIS EXISTS, AND WHY IT IS NOT LIKE tools/gen-services.js
   The generator this template inherited held its own private copy of every
   service page's bilingual copy. The pages were then hand-edited, the two
   drifted, and the generator had to be quarantined behind --force because
   running it would silently revert real corrections.

   This one holds no copy of its own. Everything variable comes from
   assets/content.js, and the page chrome is lifted out of index.html at build
   time, so there is nothing here that can drift from the site. Re-running it is
   always safe — which is the whole point, because "safe to re-run" is what a
   generator has to be to stay useful.

   Consequence, stated plainly: hand-editing a generated page IS lost on the
   next run. Put durable copy in content.js, not in the output.
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (rel) => {
  const w = {};
  new Function("window", readFileSync(join(ROOT, rel), "utf8"))(w);
  return w;
};
const CLINIC = load("assets/clinic.config.js").CLINIC;
const C = load("assets/content.js").CLINIC_CONTENT;

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Bilingual text node. Inner pages use the data-en/data-bn convention (the
   inline switcher at the foot of each page reads it); only index.html and
   book.html use the data-i18n dictionary. */
const bi = (en, bn, tag = "span", cls = "") =>
  `<${tag}${cls ? ` class="${cls}"` : ""} data-en="${esc(en)}" data-bn="${esc(bn)}"></${tag}>`;

/* ---- chrome, lifted from index.html so it can never fall out of step ---- */
const home = readFileSync(join(ROOT, "index.html"), "utf8");
const grab = (tag) => {
  const m = home.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`));
  if (!m) throw new Error(`could not find <${tag}> in index.html`);
  /* one directory deeper: rewrite root-relative asset and page links */
  return m[0]
    .replace(/(src|href)="(?!https?:|#|\/\/|mailto:|tel:)/g, '$1="../')
    .replace(/\.\.\/services\//g, "")
    /* The nav and footer carry same-page anchors — #services, #pricing,
       #contact, #home — which only exist on the homepage. Lifted verbatim onto
       a service page they are dead links, and they have been on all eight of
       them: the rewrite above deliberately skips anything starting with "#".
       Point them back at the homepage instead. */
    .replace(/href="#([A-Za-z][-\w]*)"/g, 'href="../index.html#$1"');
};
const HEADER = grab("header");
const FOOTER = grab("footer");

/* ---- per-service extras ------------------------------------------------
   Kept here rather than in content.js because they are page furniture, not
   data the admin editor should be publishing. Keyed by slug; a service with
   no entry still generates a complete page without them. */
const EXTRA = {
  "field-survey": {
    includes: [
      ["Site visit and field measurement", "সরেজমিনে গিয়ে মাঠ পরিমাপ"],
      ["Signed area statement in decimal, katha and bigha", "শতক, কাঠা ও বিঘায় স্বাক্ষরিত পরিমাণ বিবরণী"],
      ["Sketch drawn to scale", "স্কেল অনুযায়ী নকশা"],
      ["Comparison against your khatian and dag", "খতিয়ান ও দাগের সঙ্গে মিলিয়ে দেখা"],
    ],
    bring: [
      ["Deed (দলিল) if you have one", "দলিল, যদি থাকে"],
      ["Khatian or porcha", "খতিয়ান বা পর্চা"],
      ["Dag number and mouza name", "দাগ নম্বর ও মৌজার নাম"],
    ],
  },
  "boundary-demarcation": {
    includes: [
      ["Corners located and physically pinned", "সীমানার কোণ নির্ণয় ও বাস্তবে চিহ্নিতকরণ"],
      ["Boundary pillars set (material charged separately)", "সীমানা পিলার স্থাপন (উপকরণ আলাদা হিসাব)"],
      ["Neighbour-facing sketch you can show", "প্রতিবেশীকে দেখানোর উপযোগী নকশা"],
    ],
    bring: [
      ["Khatian and dag number", "খতিয়ান ও দাগ নম্বর"],
      ["Any earlier survey report", "আগের কোনো জরিপ রিপোর্ট"],
    ],
  },
  "land-records": {
    includes: [
      ["Khatian collected from the record room", "রেকর্ড রুম থেকে খতিয়ান সংগ্রহ"],
      ["CS, SA, RS and BS checked against each other", "সিএস, এসএ, আরএস ও বিএস মিলিয়ে যাচাই"],
      ["Dag number verified against the mouza sheet", "মৌজা শিটের সঙ্গে দাগ নম্বর যাচাই"],
    ],
    bring: [
      ["Mouza name and JL number", "মৌজার নাম ও জেএল নম্বর"],
      ["Dag or khatian number, if known", "দাগ বা খতিয়ান নম্বর, জানা থাকলে"],
      ["Owner's name as written on the papers", "কাগজে লেখা মালিকের নাম"],
    ],
  },
  "mouza-map": {
    includes: [
      ["Certified mouza map obtained", "সার্টিফায়েড মৌজা ম্যাপ সংগ্রহ"],
      ["Your dag traced and highlighted", "আপনার দাগ ট্রেস করে চিহ্নিত"],
      ["Digital copy supplied alongside the print", "প্রিন্টের সঙ্গে ডিজিটাল কপি"],
    ],
    bring: [
      ["Mouza name, JL number and district", "মৌজার নাম, জেএল নম্বর ও জেলা"],
      ["Dag number", "দাগ নম্বর"],
    ],
  },
  "partition-survey": {
    includes: [
      ["Total holding measured before division", "বণ্টনের আগে পুরো জমির পরিমাপ"],
      ["Shares calculated and drawn to scale", "অংশ হিসাব করে স্কেলে অঙ্কন"],
      ["Signed and sealed report for filing", "দাখিলের জন্য স্বাক্ষরিত ও সিলমোহর রিপোর্ট"],
    ],
    bring: [
      ["Khatian and the deed", "খতিয়ান ও দলিল"],
      ["Succession certificate or warish nama", "ওয়ারিশ সনদ বা ওয়ারিশনামা"],
      ["Court order, if the survey is commissioned", "আদালতের আদেশ, কমিশন জরিপ হলে"],
    ],
  },
  "pre-purchase-verification": {
    includes: [
      ["Ownership chain traced through the records", "রেকর্ড ধরে মালিকানার ধারা যাচাই"],
      ["Papers reconciled against the ground", "কাগজ ও বাস্তব জমি মিলিয়ে দেখা"],
      ["Khas and vested-property check", "খাস ও অর্পিত সম্পত্তি যাচাই"],
      ["Written go / no-go summary before you pay", "টাকা দেওয়ার আগে লিখিত মতামত"],
    ],
    bring: [
      ["Whatever the seller has given you", "বিক্রেতা যা যা দিয়েছেন"],
      ["Mouza, dag and khatian numbers", "মৌজা, দাগ ও খতিয়ান নম্বর"],
      ["The seller's name and NID, if shared", "বিক্রেতার নাম ও এনআইডি, দেওয়া থাকলে"],
    ],
  },
  "land-office-services": {
    includes: [
      ["Deed read and checked against the record", "দলিল পড়ে রেকর্ডের সঙ্গে মিলিয়ে যাচাই"],
      ["Online mutation (namjari) application filed for you", "আপনার হয়ে অনলাইনে নামজারির আবেদন"],
      ["Land development tax paid online and the dakhila handed over", "অনলাইনে ভূমি উন্নয়ন কর পরিশোধ ও দাখিলা হস্তান্তর"],
      ["Application status followed up until it closes", "আবেদন শেষ না হওয়া পর্যন্ত ফলো-আপ"],
      ["Government fees are charged at cost, shown on the receipt", "সরকারি ফি যত, তত — রসিদে দেখানো থাকে"],
    ],
    bring: [
      ["The deed (dolil) and khatian", "দলিল ও খতিয়ান"],
      ["NID of the owner or applicant", "মালিক বা আবেদনকারীর এনআইডি"],
      ["Mouza name, JL number and dag number", "মৌজার নাম, জেএল নম্বর ও দাগ নম্বর"],
      ["Last dakhila, if you have one", "সর্বশেষ দাখিলা, থাকলে"],
      ["A mobile number that can receive the OTP", "ওটিপি আসবে এমন একটি মোবাইল নম্বর"],
    ],
  },
};

const listOf = (rows, cls) => rows && rows.length
  ? `<ul class="${cls}">` + rows.map(([e, b]) => bi(e, b, "li")).join("") + `</ul>`
  : "";

/* The inline language switcher each inner page carries. index.html and
   book.html use the i18n dictionary instead; this is the data-en/data-bn side
   of that split, documented in assets/legal.js. */
const LANG_SCRIPT = `<script>
(function(){
  function setLang(l){
    document.documentElement.setAttribute('data-lang',l);
    document.body.classList.toggle('bn', l==='bn');
    try{ localStorage.setItem('clinic_lang', l); }catch(e){}
    document.querySelectorAll('[data-en]').forEach(function(el){
      el.textContent = (l==='bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en'));
    });
    var t=document.getElementById('langText'); if(t) t.textContent = (l==='bn'?'EN':'বাংলা');
  }
  var L='bn'; try{ L=localStorage.getItem('clinic_lang')||'bn'; }catch(e){}
  setLang(L);
  document.addEventListener('click',function(e){
    var b=e.target.closest('#langToggle'); if(!b) return;
    setLang(document.documentElement.getAttribute('data-lang')==='bn'?'en':'bn');
  });
})();
</script>`;

function page({ title, desc, body }) {
  return `<!DOCTYPE html>
<html lang="en" data-lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="${esc(CLINIC.brand.primary)}">
<link rel="canonical" href="${esc(CLINIC.site.baseUrl)}/">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(CLINIC.site.baseUrl)}/">
<meta property="og:image" content="${esc(CLINIC.site.baseUrl)}/${esc(CLINIC.brand.ogImage)}">
<link rel="icon" type="image/svg+xml" href="../${esc(CLINIC.brand.mark)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<link rel="stylesheet" href="../assets/styles.css?v=${esc(CLINIC.site.assetVersion)}">
</head>
<body>
${HEADER}
${body}
${FOOTER}
<script src="../assets/clinic.config.js?v=1"></script>
<script src="../assets/clinic-compat.js?v=1"></script>
<script src="../assets/content.js?v=1"></script>
<script src="../assets/service-content.js?v=1" defer></script>
<script src="../assets/brand-highlight.js?v=1" defer></script>
<script src="../assets/admin-gate.js?v=1" defer></script>
<script src="../assets/legal.js?v=1" defer></script>
${LANG_SCRIPT}
</body>
</html>
`;
}

/* ---- one service ------------------------------------------------------- */
function servicePage(svc) {
  const rows = C.prices.filter((p) => p.slug === svc.slug);
  const ex = EXTRA[svc.slug] || {};
  const img = `../assets/services/${svc.img}.${CLINIC.media.ext}?v=${CLINIC.site.assetVersion}`;
  const unit = CLINIC.units.label;

  const priceRows = rows.map((p) => {
    /* A row with no min/max is quoted on request — land-office work is a
       government fee plus a service charge and the government fee is not ours
       to publish. Without this branch p.min.toLocaleString throws outright. */
    const money = (p.min == null || p.max == null)
      ? bi("Quote on request", "দর জানতে যোগাযোগ")
      : p.min === p.max
        ? `${CLINIC.currency.symbol} ${p.min.toLocaleString(CLINIC.currency.locale)}`
        : `${CLINIC.currency.symbol} ${p.min.toLocaleString(CLINIC.currency.locale)} – ${p.max.toLocaleString(CLINIC.currency.locale)}`;
    const per = (p.per && p.min != null) ? ` <span class="pprice-per" data-en="${esc(unit.en)}" data-bn="${esc(unit.bn)}"></span>` : "";
    return `<tr><td>${bi(p.n, p.nb)}</td><td class="num">${money}${per}</td></tr>`;
  }).join("");

  const gallery = (svc.gal || []).map((g, i) =>
    `<button class="pthumb${i === 0 ? " active" : ""}" type="button" data-src="../assets/services/${g}.${CLINIC.media.ext}?v=${CLINIC.site.assetVersion}">` +
    `<img src="../assets/services/${g}.${CLINIC.media.ext}?v=${CLINIC.site.assetVersion}" loading="lazy" decoding="async" alt=""></button>`
  ).join("");

  const body = `
<section class="section">
  <div class="container">
    <div class="prod-card">
      <div class="prod-grid">
        <div class="prod-gallery">
          <div class="prod-main" id="pmainWrap">
            <img id="pmain" src="${img}" alt="${esc(svc.en)}" style="width:100%;height:100%;object-fit:contain">
          </div>
          ${gallery ? `<div class="prod-thumbs">${gallery}</div>` : ""}
        </div>
        <div class="prod-info">
          <span class="eyebrow">${bi("Our Services", "আমাদের সেবা")}</span>
          <h1 data-en="${esc(svc.en)}" data-bn="${esc(svc.bn)}"></h1>
          ${bi(svc.cne, svc.cn, "p", "prod-common")}
          <div class="prod-price">${esc(svc.pr)}</div>
          ${bi(svc.de, svc.db, "p", "prod-desc")}
          <div class="prod-facts">
            <div class="fact"><span class="fact-k">${bi("Turnaround", "সময়", "span")}</span><span class="fact-v" data-en="${esc(svc.dur)}" data-bn="${esc(svc.durbn)}"></span></div>
            <div class="fact"><span class="fact-k">${bi("Pricing", "মূল্য", "span")}</span><span class="fact-v">${bi(svc.per ? "By land area" : "Flat fee", svc.per ? "জমির পরিমাণ অনুযায়ী" : "নির্দিষ্ট ফি", "span")}</span></div>
            <div class="fact"><span class="fact-k">${bi("Deliverable", "যা পাবেন", "span")}</span><span class="fact-v">${bi("Signed report", "স্বাক্ষরিত রিপোর্ট", "span")}</span></div>
            <div class="fact"><span class="fact-k">${bi("Surveyor", "জরিপকারী", "span")}</span><span class="fact-v">${bi("Licensed", "সনদপ্রাপ্ত", "span")}</span></div>
          </div>
          <div class="prod-cta">
            <a class="btn btn-primary" href="../book.html?service=${encodeURIComponent(rows[0] ? rows[0].n : svc.en)}">${bi("Request this survey", "এই জরিপের অনুরোধ করুন")}</a>
            <a class="btn btn-ghost" href="../fee-estimator.html">${bi("Estimate the fee", "খরচ হিসাব করুন")}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container prod-detail">
    <div class="pd-col">
      <h2>${bi("What's included", "যা যা থাকছে")}</h2>
      ${listOf(ex.includes, "pd-list")}
    </div>
    <div class="pd-col">
      <h2>${bi("What to bring", "যা সঙ্গে আনবেন")}</h2>
      ${listOf(ex.bring, "pd-list")}
      ${bi("Missing a document? Say so when you enquire — in most cases we can search the record room for it.",
           "কোনো কাগজ নেই? অনুরোধের সময় জানিয়ে দিন — বেশিরভাগ ক্ষেত্রে আমরা রেকর্ড রুমে খুঁজে দিতে পারি।", "p", "pd-note")}
    </div>
  </div>
</section>

${priceRows ? `
<section class="section">
  <div class="container">
    <h2>${bi("Fees for this service", "এই সেবার খরচ")}</h2>
    <table class="price-table"><tbody>${priceRows}</tbody></table>
    ${bi("Fee estimate only, never a measurement. See the accuracy notice.",
         "শুধু খরচের ধারণা, জমির পরিমাপ নয়। নির্ভুলতা বিজ্ঞপ্তি দেখুন।", "p", "pd-note")}
    <p><a class="pd-link" href="../accuracy-disclaimer.html">${bi("Read the accuracy notice", "নির্ভুলতা বিজ্ঞপ্তি পড়ুন")}</a></p>
  </div>
</section>` : ""}
`;
  return page({
    title: `${svc.en} in ${CLINIC.address.locality} | ${CLINIC.name}`,
    desc: svc.de,
    body,
  });
}

/* ---- the index --------------------------------------------------------- */
function indexPage() {
  const cards = C.services.map((s) => `
      <a class="svc-card-link" href="${s.slug}.html">
        <article class="svc-card">
          <div class="svc-img"><img src="../assets/services/${s.img}.${CLINIC.media.ext}?v=${CLINIC.site.assetVersion}" alt="${esc(s.en)}" loading="lazy" decoding="async"></div>
          <div class="svc-body">
            <h3 data-en="${esc(s.en)}" data-bn="${esc(s.bn)}"></h3>
            ${bi(s.cne, s.cn, "p", "svc-sub")}
            <div class="svc-price">${esc(s.pr)}</div>
            ${bi(s.de, s.db, "p", "svc-desc")}
          </div>
        </article>
      </a>`).join("");

  const body = `
<section class="section">
  <div class="container">
    <span class="eyebrow">${bi("Our Services", "আমাদের সেবা")}</span>
    <h1>${bi("Every land service in one place", "জমির সব সেবা এক জায়গায়")}</h1>
    ${bi("Measurement, records, partition and verification — done properly and documented.",
         "মাপ, রেকর্ড, বণ্টন ও যাচাই — নিয়ম মেনে, কাগজে প্রমাণসহ।", "p", "lead")}
    <div class="svc-grid">${cards}</div>
  </div>
</section>`;
  return page({
    title: `Services | ${CLINIC.name}`,
    desc: "Land survey, records, partition and pre-purchase verification services.",
    body,
  });
}

/* ---- write ------------------------------------------------------------- */
if (!existsSync(join(ROOT, "services"))) mkdirSync(join(ROOT, "services"));
const slugs = [...new Set(C.services.map((s) => s.slug))];
let n = 0;
for (const slug of slugs) {
  const svc = C.services.find((s) => s.slug === slug);
  writeFileSync(join(ROOT, "services", `${slug}.html`), servicePage(svc));
  n++;
}
writeFileSync(join(ROOT, "services", "index.html"), indexPage());
console.log(`\n  generated ${n} service page(s) + index`);
slugs.forEach((s) => console.log(`    services/${s}.html`));
console.log(`\n  Chrome lifted from index.html — re-run after changing the nav or footer.`);
console.log(`  Hand edits to generated pages are LOST on the next run; edit content.js.\n`);
