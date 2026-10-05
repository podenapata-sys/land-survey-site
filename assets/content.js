/* Land survey website content.
   THIS FILE IS EDITED BY THE ADMIN CONTENT EDITOR (admin-content.html) and
   published straight to the repo, so keep it plain data: no logic, no comments
   that must survive, and the same shape every time.

   It is a .js file loaded with a normal <script> BEFORE assets/app.js — not JSON
   fetched at runtime — because app.js consumes this data synchronously when it
   renders. A fetch would force an async rewrite of the whole render path.

   Consumed by: the homepage service grid, the price table, the fee estimator,
   the quote form's service dropdown, and each services/*.html detail page
   (via assets/service-content.js).

   PRICES ARE PLACEHOLDERS. Every figure below is a plausible market rate, not
   this surveyor's rate. Replace the whole table before launch — a published
   price the client will not honour is worse than no price at all.

   `per:true` means the fee scales with land area and the estimator shows the
   area field. `unit` names which unit that row is quoted in, so a row priced
   per কাঠা is never silently multiplied by শতক. */
window.CLINIC_CONTENT = (function () {

  /* Every illustration available in assets/services/. Listed here because a
     browser cannot read a directory; the publish step keeps it in step. */
  const PHOTOS = [
    "amin-measurement", "boundary-demarcation", "boundary-pillar",
    "court-commission", "deed-verification", "digital-survey",
    "field-survey", "gps-survey", "khatian-search", "land-records",
    "mouza-map", "mutation-namjari", "partition-survey", "plot-layout",
    "pre-purchase-check", "survey-report", "topographic-survey", "total-station",
  ];

  /* The five service lines. Key order sets the order of the pricing table and
     the estimator's category dropdown. `papers` sits next to `records` because
     it is the same errand to the client — paperwork, not fieldwork — and it is
     the cheap repeat work that brings people in, so it does not belong last. */
  const CATS = {
    field:     { en: "Field Survey & Demarcation", bn: "মাঠ জরিপ ও সীমানা নির্ধারণ" },
    records:   { en: "Land Records & Documents",   bn: "ভূমি রেকর্ড ও দলিল" },
    papers:    { en: "Documents & Online Land Services", bn: "কাগজ ও অনলাইন ভূমি সেবা" },
    partition: { en: "Partition & Disputes",       bn: "বণ্টন ও বিরোধ" },
    verify:    { en: "Pre-purchase Verification",  bn: "জমি কেনার আগে যাচাই" },
  };

  const PRICES = [
    { c:"field", slug:"field-survey", n:"Amin Land Measurement", nb:"আমিন দিয়ে জমি মাপ",
      note:"Chain & tape", noteb:"চেইন ও ফিতা", per:true, unit:"decimal", min:300, max:500 },
    { c:"field", slug:"boundary-demarcation", n:"Boundary Demarcation", nb:"সীমানা নির্ধারণ",
      note:"Pillars extra", noteb:"পিলার আলাদা", per:true, unit:"decimal", min:400, max:700 },
    { c:"field", slug:"field-survey", n:"Digital / GPS Survey", nb:"ডিজিটাল / জিপিএস জরিপ",
      note:"GNSS", noteb:"জিএনএসএস", per:true, unit:"decimal", min:600, max:1000 },
    { c:"field", slug:"field-survey", n:"Total Station Survey", nb:"টোটাল স্টেশন জরিপ",
      note:"Highest accuracy", noteb:"সর্বোচ্চ নির্ভুলতা", per:true, unit:"decimal", min:800, max:1200 },
    { c:"field", slug:"boundary-demarcation", n:"Construction Plot Layout", nb:"নির্মাণের প্লট লেআউট",
      note:"Before piling", noteb:"পাইলিংয়ের আগে", per:true, unit:"decimal", min:500, max:900 },
    { c:"field", slug:"field-survey", n:"Topographic Survey", nb:"টপোগ্রাফিক জরিপ",
      note:"With contours", noteb:"কনট্যুরসহ", per:true, unit:"decimal", min:1000, max:1500 },

    { c:"records", slug:"land-records", n:"Khatian Search — RS / BS", nb:"খতিয়ান উত্তোলন — আরএস / বিএস",
      note:"Per khatian", noteb:"প্রতি খতিয়ান", min:1500, max:2500 },
    { c:"records", slug:"land-records", n:"Khatian Search — CS / SA", nb:"খতিয়ান উত্তোলন — সিএস / এসএ",
      note:"Older records", noteb:"পুরোনো রেকর্ড", min:2500, max:4000 },
    { c:"records", slug:"mouza-map", n:"Mouza Map Collection", nb:"মৌজা ম্যাপ সংগ্রহ",
      note:"Certified copy", noteb:"সার্টিফায়েড কপি", min:2000, max:3500 },
    { c:"records", slug:"mouza-map", n:"Mouza Map Tracing", nb:"মৌজা ম্যাপ ট্রেসিং",
      note:"Drawn to scale", noteb:"স্কেল অনুযায়ী", min:1500, max:3000 },
    { c:"records", slug:"land-records", n:"Dag Number Verification", nb:"দাগ নম্বর যাচাই",
      note:"Per dag", noteb:"প্রতি দাগ", min:1000, max:2000 },
    { c:"records", slug:"land-records", n:"Mutation (Namjari) Assistance", nb:"নামজারি সহায়তা",
      note:"Govt fees extra", noteb:"সরকারি ফি আলাদা", min:5000, max:12000 },

    /* Land-office and online services. These are a government fee plus a
       service charge, and the government fee is not ours to quote, so these
       rows carry NO min/max — the table and the estimator render them as
       "quote on request". An invented number here would be worse than silence:
       it is the one thing on this site a client gets held to. */
    { c:"papers", slug:"land-office-services", n:"Deed (Dolil) Verification", nb:"দলিল যাচাই",
      note:"Against the record", noteb:"রেকর্ডের সঙ্গে মিলিয়ে" },
    { c:"papers", slug:"land-office-services", n:"Online Mutation (Namjari) Application", nb:"অনলাইন নামজারি আবেদন",
      note:"Filing only — govt fees extra", noteb:"শুধু আবেদন — সরকারি ফি আলাদা" },
    { c:"papers", slug:"land-office-services", n:"Land Development Tax — Dakhila", nb:"ভূমি উন্নয়ন কর — দাখিলা",
      note:"Paid online, receipt handed over", noteb:"অনলাইনে পরিশোধ, দাখিলা হস্তান্তর" },
    { c:"papers", slug:"land-office-services", n:"Online Application & Information Check", nb:"অনলাইন আবেদন ও তথ্য যাচাই",
      note:"Any land-office portal", noteb:"যেকোনো ভূমি অফিস পোর্টাল" },

    { c:"partition", slug:"partition-survey", n:"Inheritance Partition Survey", nb:"ওয়ারিশ বণ্টন জরিপ",
      note:"Per share", noteb:"প্রতি অংশ", per:true, unit:"decimal", min:500, max:900 },
    { c:"partition", slug:"partition-survey", n:"Partition Layout (Batoara)", nb:"বাটোয়ারা নকশা",
      note:"Drawn & signed", noteb:"অঙ্কিত ও স্বাক্ষরিত", min:8000, max:15000 },
    { c:"partition", slug:"partition-survey", n:"Court-admissible Survey Report", nb:"আদালতে দাখিলযোগ্য জরিপ রিপোর্ট",
      note:"Signed & sealed", noteb:"স্বাক্ষর ও সিলসহ", min:10000, max:20000 },
    { c:"partition", slug:"partition-survey", n:"Court Commission Survey", nb:"কমিশন জরিপ",
      note:"Court appointed", noteb:"আদালত নিযুক্ত", min:15000, max:30000 },

    { c:"verify", slug:"pre-purchase-verification", n:"Full Pre-purchase Check", nb:"কেনার আগে পূর্ণ যাচাই",
      note:"Records + field", noteb:"রেকর্ড ও মাঠ", min:8000, max:15000 },
    { c:"verify", slug:"pre-purchase-verification", n:"Deed vs Dag Reconciliation", nb:"দলিল ও দাগ মিলকরণ",
      note:"Paper vs ground", noteb:"কাগজ বনাম মাঠ", min:3000, max:6000 },
    { c:"verify", slug:"pre-purchase-verification", n:"Ownership Verification", nb:"মালিকানা যাচাই",
      note:"Chain of title", noteb:"মালিকানার ধারা", min:2500, max:5000 },
    { c:"verify", slug:"pre-purchase-verification", n:"Khas / Vested Property Check", nb:"খাস / অর্পিত সম্পত্তি যাচাই",
      note:"Govt claim check", noteb:"সরকারি দাবি যাচাই", min:2000, max:4000 },
  ];

  /* Homepage cards. `pr` is a display string — keep it in step with PRICES by
     hand; nothing derives it (a known gap carried over from the template). */
  const SERVICES = [
    { icon:"📐", img:"field-survey", slug:"field-survey", pr:"৳300–1,200", per:true,
      dur:"1–2 days", durbn:"১–২ দিন",
      en:"Field Survey", bn:"মাঠ জরিপ",
      cne:"Measure the land", cn:"জমি মেপে দেওয়া",
      de:"Chain, GPS or total station measurement of your plot, with a signed area statement.",
      db:"চেইন, জিপিএস বা টোটাল স্টেশনে আপনার জমির পরিমাপ, স্বাক্ষরিত বিবরণীসহ।",
      gal:["amin-measurement","gps-survey","total-station","digital-survey"],
      sub:[{en:"Amin measurement", bn:"আমিন মাপ", slug:"field-survey"},
           {en:"GPS / GNSS", bn:"জিপিএস", slug:"field-survey"},
           {en:"Total station", bn:"টোটাল স্টেশন", slug:"field-survey"}] },

    { icon:"🧱", img:"boundary-demarcation", slug:"boundary-demarcation", pr:"৳400–900", per:true,
      dur:"1 day", durbn:"১ দিন",
      en:"Boundary Demarcation", bn:"সীমানা নির্ধারণ",
      cne:"Mark the corners", cn:"সীমানা চিহ্নিত করা",
      de:"Corner pillars placed on the ground so the boundary is visible and defensible.",
      db:"জমির কোণে পিলার বসিয়ে সীমানা দৃশ্যমান ও প্রমাণযোগ্য করা।",
      gal:["boundary-demarcation","boundary-pillar","plot-layout"] },

    { icon:"📜", img:"land-records", slug:"land-records", pr:"৳1,000–4,000",
      dur:"3–7 days", durbn:"৩–৭ দিন",
      en:"Khatian & Records", bn:"খতিয়ান ও রেকর্ড",
      cne:"Get the papers", cn:"কাগজপত্র সংগ্রহ",
      de:"CS, SA, RS and BS khatian collected from the record room, with the dag verified.",
      db:"রেকর্ড রুম থেকে সিএস, এসএ, আরএস ও বিএস খতিয়ান সংগ্রহ এবং দাগ যাচাই।",
      gal:["khatian-search","land-records","mutation-namjari"] },

    { icon:"🗺️", img:"mouza-map", slug:"mouza-map", pr:"৳1,500–3,500",
      dur:"3–5 days", durbn:"৩–৫ দিন",
      en:"Mouza Map", bn:"মৌজা ম্যাপ",
      cne:"The official map", cn:"সরকারি নকশা",
      de:"Certified mouza map obtained and traced to scale against your dag number.",
      db:"সার্টিফায়েড মৌজা ম্যাপ সংগ্রহ ও আপনার দাগ অনুযায়ী স্কেলে ট্রেসিং।",
      gal:["mouza-map","land-records"] },

    /* `prb` is the Bangla price string. Only needed where the price is words
       rather than digits — service-content.js transliterates digits on its own,
       but it cannot translate "Quote on request". */
    { icon:"🗂️", img:"mutation-namjari", slug:"land-office-services",
      pr:"Quote on request", prb:"দর জানতে যোগাযোগ",
      dur:"2–10 days", durbn:"২–১০ দিন",
      en:"Documents & Online Land Services", bn:"কাগজ ও অনলাইন ভূমি সেবা",
      cne:"Deeds, namjari, dakhila", cn:"দলিল, নামজারি, দাখিলা",
      de:"Deed verification, online mutation applications, land development tax and the receipt — the land-office errands, done for you.",
      db:"দলিল যাচাই, অনলাইন নামজারি আবেদন, ভূমি উন্নয়ন কর ও দাখিলা — ভূমি অফিসের দৌড়ঝাঁপ আমরা করে দিই।",
      gal:["mutation-namjari","deed-verification","land-records","khatian-search"],
      sub:[{en:"Deed verification", bn:"দলিল যাচাই", slug:"land-office-services"},
           {en:"Mutation (namjari)", bn:"নামজারি", slug:"land-office-services"},
           {en:"Dakhila", bn:"দাখিলা", slug:"land-office-services"},
           {en:"Online applications", bn:"অনলাইন আবেদন", slug:"land-office-services"}] },

    { icon:"⚖️", img:"partition-survey", slug:"partition-survey", pr:"৳500–30,000", per:true,
      dur:"5–15 days", durbn:"৫–১৫ দিন",
      en:"Partition & Court Survey", bn:"বণ্টন ও আদালতের জরিপ",
      cne:"Divide or defend", cn:"বণ্টন বা প্রমাণ",
      de:"Inheritance partition, batoara layout, and survey reports drawn to be filed in court.",
      db:"ওয়ারিশ বণ্টন, বাটোয়ারা নকশা এবং আদালতে দাখিলযোগ্য জরিপ রিপোর্ট।",
      gal:["partition-survey","court-commission","survey-report"] },

    { icon:"🔍", img:"pre-purchase-check", slug:"pre-purchase-verification", pr:"৳2,000–15,000",
      dur:"5–10 days", durbn:"৫–১০ দিন",
      en:"Before You Buy", bn:"কেনার আগে যাচাই",
      cne:"Check before you pay", cn:"টাকা দেওয়ার আগে যাচাই",
      de:"Papers, ownership chain and the ground itself checked against each other before money moves.",
      db:"টাকা দেওয়ার আগে কাগজ, মালিকানা ও বাস্তব জমি মিলিয়ে যাচাই।",
      gal:["pre-purchase-check","deed-verification","khatian-search"] },
  ];

  /* Sample deliverables. Every one must be REDACTED — a survey drawing carries
     the owner's name, the dag number and the plot's exact position, so
     publishing a real client's is a disclosure, not a portfolio piece. */
  const GALLERY_CATS = {
    all:     { en: "All",             bn: "সব" },
    maps:    { en: "Maps & Tracings", bn: "ম্যাপ ও ট্রেসিং" },
    field:   { en: "Field Work",      bn: "মাঠের কাজ" },
    reports: { en: "Reports",         bn: "রিপোর্ট" },
  };

  const GALLERY = [
    { photo:"mouza-map",         cat:"maps",    en:"Mouza map tracing",    bn:"মৌজা ম্যাপ ট্রেসিং" },
    { photo:"land-records",      cat:"maps",    en:"Record sheet",         bn:"রেকর্ড শিট" },
    { photo:"plot-layout",       cat:"maps",    en:"Plot layout",          bn:"প্লট লেআউট" },
    { photo:"amin-measurement",  cat:"field",   en:"Chain measurement",    bn:"চেইন মাপ" },
    { photo:"total-station",     cat:"field",   en:"Total station setup",  bn:"টোটাল স্টেশন" },
    { photo:"gps-survey",        cat:"field",   en:"GNSS survey",          bn:"জিএনএসএস জরিপ" },
    { photo:"boundary-pillar",   cat:"field",   en:"Boundary pillar",      bn:"সীমানা পিলার" },
    { photo:"survey-report",     cat:"reports", en:"Signed survey report", bn:"স্বাক্ষরিত রিপোর্ট" },
    { photo:"court-commission",  cat:"reports", en:"Commission report",    bn:"কমিশন রিপোর্ট" },
    { photo:"deed-verification", cat:"reports", en:"Deed reconciliation",  bn:"দলিল মিলকরণ" },
  ];

  return { cats: CATS, prices: PRICES, services: SERVICES, photos: PHOTOS,
           gallery: GALLERY, galleryCats: GALLERY_CATS };
})();
