/* ============================================================
   Land survey site — data, i18n and interactions (no build step)
   ============================================================ */

/* ---------- Contact constants ----------
   Supplied by assets/clinic-compat.js, which builds window.CONTACT from
   assets/clinic.config.js. It must be loaded before this file.

   Declaring the object here as well is what previously kept a clinic's phone
   number in two places at once; a booking button pointing at the wrong WhatsApp
   number looks perfectly fine on screen and sends every enquiry to a stranger. */
const CONTACT = window.CONTACT || {};

/* ---------- Price list (single source of truth) ----------
   min/max in BDT used by the cost calculator.
   per => quantity selector shown, scaled by CLINIC.units.        */
// Ordered to mirror the homepage service-menu serial.
const CATS = (window.CLINIC_CONTENT || {}).cats || {};

const PRICES = (window.CLINIC_CONTENT || {}).prices || [];

/* ---------- Services (homepage grid) ---------- */
/* Content lives in assets/content.js so the admin editor can publish it.
   Loaded before this file; the fallbacks keep app.js harmless if it is absent. */
const SERVICES = (window.CLINIC_CONTENT || {}).services || [];

/* ---------- i18n strings ---------- */
const I18N = {
  en: {
    f_plot_legend:"About the land (optional)",
    f_plot_hint:"Fill in whatever you have. None of this is required — if you are enquiring before you buy, leave it blank and we will find it.",
    f_district:"District / Upazila", f_district_ph:"e.g. Khulna / Dumuria",
    f_mouza:"Mouza", f_mouza_ph:"Mouza name",
    f_jl:"JL No.", f_jl_ph:"JL number",
    f_dag:"Dag No.", f_dag_ph:"Dag / plot number",
    f_khatian:"Khatian No.", f_khatian_ph:"Khatian / porcha number",
    f_area:"Approx. area", f_area_ph:"e.g. 5",
    nav_home:"Home", nav_about:"About", nav_services:"Services", nav_pricing:"Pricing",
    nav_calc:"Estimate", nav_ba:"Our Work", nav_contact:"Contact",
    book:"Request a Survey", call:"Call Now",
    topbar:"Licensed Land Survey & Records · Sat–Thu 9:00 AM–7:00 PM · Fri closed",
    hero_eyebrow:"Licensed Land Surveyor in Khulna",
    hero_title:"Know exactly what <span>land</span> you own",
    hero_text:"Accurate field survey, khatian and mouza map collection, and verification before you buy. Signed reports you can hand to a bank, a buyer or a court.",
    hero_b1:"Digital Survey", hero_b2:"Modern Technology", hero_b3:"Affordable Pricing", hero_b4:"Licensed Amin",
    g_reviews:"Google Reviews",
    tb_addr:"Khulna", tb_hours:"Sat–Thu: 10:00 AM – 9:00 PM",
    rev_us:"Review Us", hp_label:"Surveys Completed",
    fb1_t:"Modern Technology", fb1_s:"Total station and GNSS for exact measurement",
    fb2_t:"Licensed Surveyor", fb2_s:"Experienced, licensed, accountable",
    fb3_t:"Court-admissible", fb3_s:"Signed, sealed and ready to file",
    fb4_t:"Clear Reporting", fb4_s:"Plain-language report with the map attached",
    hero_badge_t:"Trusted for {n}+ surveys", hero_badge_s:"Careful, licensed work",
    hero_badge2_t:"Signed & sealed", hero_badge2_s:"Ready to file in court",
    stat1:"Surveys Completed", stat2:"Years Experience", stat3:"Services Available", stat4:"Satisfaction",
    services_eyebrow:"Our Services",
    services_title:"Every land service in one place",
    services_text:"Measurement, records, partition and verification — done properly and documented.",
    why_eyebrow:"Why Khulna Digital Surveyor Association",
    why_title:"Measurements you can rely on",
    why_text:"Proper instruments and signed paperwork, so the result stands up when someone disputes it.",
    why1:"Exact measurement, not an estimate", why2:"Every corner pegged and photographed", why3:"Transparent, affordable pricing",
    why4:"Licensed surveyor, signed reports", why5:"Modern equipment & techniques", why6:"Same-week service when a deal is closing",
    calc_eyebrow:"Cost Estimator",
    calc_title:"Estimate your survey fee",
    calc_text:"Pick a service and enter the land area for an instant estimate. The final fee is confirmed once we see the plot and the papers.",
    calc_service:"Select service", calc_qty:"Quantity", calc_result:"Estimated Cost",
    calc_category:"Service Type", calc_serviceopt:"Service Option",
    calc_head1:"Service", calc_head2:"Price Calculator",
    calc_note:"Fee estimate only — never a measurement. Taka is exact; USD is converted. Area is confirmed by the signed field report.",
    calc_book:"Request this survey",
    pricing_eyebrow:"Transparent Pricing",
    pricing_title:"Survey fee list",
    pricing_text:"Clear, upfront fees for every service. Prices in Bangladeshi Taka (৳).",
    pricing_th1:"Service", pricing_th2:"Price (BDT)", per_tooth:"per unit",
    ba_eyebrow:"Real Results",
    ba_title:"Before & after demarcation",
    ba_text:"Drag the slider to see a boundary go from disputed to marked.",
    ba_before:"Before", ba_after:"After",
    ba_note:"Illustrative and redacted. Every plot differs.",
    ba_f_all:"All", ba_f_boundary:"Boundary", ba_f_partition:"Partition", ba_f_records:"Records", ba_f_layout:"Layout",
    doc_eyebrow:"Meet the Surveyor",
    doc_name:"Md. Example Rahman",
    doc_role:"Licensed Surveyor, Khulna Digital Surveyor Association",
    doc_text:"Md. Example Rahman leads Khulna Digital Surveyor Association, working to exact measurement and reporting that holds up when it is challenged.",
    doc_c1:"Surveyor licence no. — replace with the real registration",
    doc_c2:"Diploma in Survey — replace with the real qualification",
    doc_c3:"Court commission (কমিশন) survey experience",
    doc_c4:"Trained on total station and GNSS instruments",
    doc_book:"Request a survey",
    test_eyebrow:"Client Stories",
    test_title:"Trusted by landowners",
    contact_eyebrow:"Visit Us",
    contact_title:"Find Khulna Digital Surveyor Association",
    contact_addr_l:"Address", contact_phone_l:"Phone", contact_wa_l:"WhatsApp", contact_email_l:"Email", contact_hours_l:"Hours",
    contact_phone_main_l:"Main", contact_phone_appt_l:"Enquiries",
    contact_addr:"Office address — Khulna",
    contact_hours:"Saturday – Thursday: 10:00 AM – 9:30 PM · Friday: 11:00 AM – 9:30 PM",
    contact_dir:"Get Directions",
    book_eyebrow:"Survey Requests",
    book_title:"Request a survey",
    book_text:"Tell us where the plot is and what you need — we'll confirm on WhatsApp.",
    book_side_eyebrow:"Prefer to talk?",
    book_side_title:"Message or call us directly",
    book_side_text:"Send a quick WhatsApp message, call us, or get directions — whichever is easiest.",
    f_name:"Full name", f_phone:"Phone number", f_service:"Service needed",
    f_date:"Preferred date", f_time:"Preferred time", f_date_ph:"Type or pick a date", f_time_ph:"Type or pick a time", f_today:"Today", f_tomorrow:"Tomorrow", f_address:"Address (optional)", f_address_ph:"House / road / area",
    f_emerg:"This is urgent / I need the survey this week",
    f_consent:'I agree that my details will be sent to Khulna Digital Surveyor Association via WhatsApp, as described in the <a href="privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.',
    cb_consent:'I agree to be contacted about my request, as described in the <a href="privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.',
    consent_alert:"Please tick the consent box so we can contact you.",
    book_wa_note:'🔒 Your details are sent to us via WhatsApp. See our <a href="privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.',
    f_select:"Select a service", f_submit:"Send via WhatsApp", f_wa:"Quick WhatsApp",
    f_success:"Your request is saved. Send it on WhatsApp so we can confirm quickly.",
    f_send_wa:"Send on WhatsApp",
    foot_about:"Licensed land survey, records and verification in Khulna. Know what you own before you build on it or buy it.",
    foot_links:"Quick Links", foot_services:"Services", foot_contact:"Contact",
    foot_rights:"All rights reserved.",
    nav_tech:"Technology", nav_faq:"FAQ",
    nav_contact_link:"Contact",
    cb_title:"Request a Free Callback", cb_ph:"Enter Your Number", cb_wa:"WhatsApp",
    cb_name_ph:"Your Name",
    cb_success:"Thanks! We have your number and will call you back.",
    nav_about_us:"About Us", nav_ourservices:"Our Services", nav_branch:"Branch",
    nav_doctors:"Surveyors", nav_pricelist:"Price List", nav_blog:"Blog", nav_gallery:"Gallery", nav_careers:"Career",
    srch_ph:"Search services, fees, FAQs…", srch_hint:"↑↓ navigate · Enter open · Esc close",
    srch_services:"Services", srch_pricing:"Pricing", srch_faq:"FAQ", srch_blog:"Blog", srch_tech:"Technology",
    srch_empty:"No results found. Try a different keyword.",
    svc_learn:"Learn more", book_now:"Request Now", view_all:"View All Services",
    dd_svc1:"Amin Land Measurement", dd_svc2:"Boundary Demarcation", dd_svc3:"Digital / GPS Survey",
    dd_svc4:"Khatian & Records", dd_svc5:"Mouza Map",
    dd_svc6:"Partition Survey", dd_svc7:"Pre-purchase Verification", dd_more:"More Services",
    steps_eyebrow:"How It Works", steps_title:"Your survey in 4 easy steps",
    steps_text:"From your first message to the signed report, we keep every step simple and clear.",
    step1_t:"Request", step1_d:"Tell us where the plot is and what you need — online, by phone or on WhatsApp.",
    step2_t:"Consult", step2_d:"We visit the plot, read the papers, and say plainly what the survey will and will not settle.",
    step3_t:"Survey", step3_d:"Field measurement with total station or GNSS, and the corners physically marked.",
    step4_t:"Report", step4_d:"You get a signed area statement and drawing, and we stay reachable for questions.",
    tech_eyebrow:"Technology & Accuracy",
    tech_title:"Modern instruments, defensible results",
    tech_text:"We invest in proper instruments and careful drafting, so a report still holds when somebody argues with it.",
    emerg_eyebrow:"Always Here For You",
    emerg_title:"Buying land this week?",
    emerg_text:"Same-week verification before the money moves, and online consultation for overseas (NRB) buyers.",
    emerg_b1:"Same-week urgent verification", emerg_b2:"Online video consultation", emerg_b3:"Friendly support on WhatsApp",
    emerg_call:"Call about an urgent job", emerg_video:"Book a video consult",
    faq_eyebrow:"Questions", faq_title:"Frequently asked questions",
    tips_eyebrow:"Land Guides", tips_title:"Land buying & records guides",
    tips_read:"Read more",
    wa_online:"● Online now", wa_greeting:"Hi! 👋 How can we help you today? We typically reply within minutes.",
    wa_chip_book:"📅 Request a survey", wa_chip_price:"💰 Survey fee?", wa_chip_q:"❓ Ask a Question",
    wa_start:"Start Chat on WhatsApp →",
    google_reviews_label:"Based on our Google reviews",
    qr_scan_label:"Scan to review us on Google",
    see_reviews:"See All Reviews →",
    share_experience:"Share Your Experience",
    hero_wa:"WhatsApp Us",
    lang_label:"বাংলা",
  },
  bn: {
    f_plot_legend:"জমি সম্পর্কে (ঐচ্ছিক)",
    f_plot_hint:"যা জানা আছে তাই লিখুন। কোনোটিই বাধ্যতামূলক নয় — কেনার আগে জানতে চাইলে খালি রাখুন, আমরা বের করে দেব।",
    f_district:"জেলা / উপজেলা", f_district_ph:"যেমন খুলনা / ডুমুরিয়া",
    f_mouza:"মৌজা", f_mouza_ph:"মৌজার নাম",
    f_jl:"জেএল নম্বর", f_jl_ph:"জেএল নম্বর",
    f_dag:"দাগ নম্বর", f_dag_ph:"দাগ / প্লট নম্বর",
    f_khatian:"খতিয়ান নম্বর", f_khatian_ph:"খতিয়ান / পর্চা নম্বর",
    f_area:"আনুমানিক পরিমাণ", f_area_ph:"যেমন ৫",
    nav_home:"হোম", nav_about:"পরিচিতি", nav_services:"সেবা", nav_pricing:"মূল্য",
    nav_calc:"খরচ হিসাব", nav_ba:"আমাদের কাজ", nav_contact:"যোগাযোগ",
    book:"জরিপের অনুরোধ", call:"কল করুন",
    topbar:"সনদপ্রাপ্ত জমি জরিপ ও রেকর্ড · শনি–বৃহঃ সকাল ৯টা–সন্ধ্যা ৭টা · শুক্র বন্ধ",
    hero_eyebrow:"খুলনার সনদপ্রাপ্ত ভূমি জরিপকারী",
    hero_title:"আপনার <span>জমি</span> ঠিক কতটুকু, জানুন নিশ্চিতভাবে",
    hero_text:"নির্ভুল মাঠ জরিপ, খতিয়ান ও মৌজা ম্যাপ সংগ্রহ, এবং কেনার আগে যাচাই। স্বাক্ষরিত রিপোর্ট — ব্যাংক, ক্রেতা বা আদালতে দাখিলযোগ্য।",
    hero_b1:"ডিজিটাল জরিপ", hero_b2:"আধুনিক যন্ত্রপাতি", hero_b3:"সাশ্রয়ী খরচ", hero_b4:"সনদপ্রাপ্ত আমিন",
    g_reviews:"গুগল রিভিউ",
    tb_addr:"খুলনা", tb_hours:"শনি–বৃহ: সকাল ১০টা – রাত ৯টা",
    rev_us:"রিভিউ দিন", hp_label:"সম্পন্ন জরিপ",
    fb1_t:"আধুনিক যন্ত্রপাতি", fb1_s:"নির্ভুল মাপের জন্য টোটাল স্টেশন ও জিএনএসএস",
    fb2_t:"সনদপ্রাপ্ত জরিপকারী", fb2_s:"অভিজ্ঞ, সনদপ্রাপ্ত ও দায়বদ্ধ",
    fb3_t:"আদালতে গ্রহণযোগ্য", fb3_s:"স্বাক্ষরিত, সিলমোহরযুক্ত ও দাখিলের উপযোগী",
    fb4_t:"পরিষ্কার রিপোর্ট", fb4_s:"সহজ ভাষায় রিপোর্ট, সঙ্গে নকশা",
    hero_badge_t:"{n}+ জরিপে আস্থা", hero_badge_s:"যত্নশীল, সনদপ্রাপ্ত কাজ",
    hero_badge2_t:"স্বাক্ষরিত ও সিলমোহর", hero_badge2_s:"আদালতে দাখিলের উপযোগী",
    stat1:"সম্পন্ন জরিপ", stat2:"বছরের অভিজ্ঞতা", stat3:"সেবা আছে", stat4:"সন্তুষ্টি",
    services_eyebrow:"আমাদের সেবা",
    services_title:"জমির সব সেবা এক জায়গায়",
    services_text:"মাপ, রেকর্ড, বণ্টন ও যাচাই — নিয়ম মেনে, কাগজে প্রমাণসহ।",
    why_eyebrow:"কেন খুলনা ডিজিটাল সার্ভেয়ার অ্যাসোসিয়েশন",
    why_title:"ভরসা করার মতো নির্ভুল পরিমাপ",
    why_text:"সঠিক যন্ত্র আর স্বাক্ষরিত কাগজ — কেউ প্রশ্ন তুললেও ফল টিকে থাকে।",
    why1:"আন্দাজ নয়, নির্ভুল পরিমাপ", why2:"প্রতিটি কোণ পিলারে চিহ্নিত ও ছবিসহ", why3:"পরিষ্কার ও সাশ্রয়ী দাম",
    why4:"সনদপ্রাপ্ত জরিপকারী, স্বাক্ষরিত রিপোর্ট", why5:"আধুনিক যন্ত্রপাতি ও পদ্ধতি", why6:"দলিল হওয়ার আগেই একই সপ্তাহে কাজ",
    calc_eyebrow:"খরচের হিসাব",
    calc_title:"জরিপের খরচ হিসাব করুন",
    calc_text:"সেবা বেছে নিন ও জমির পরিমাণ লিখুন, সঙ্গে সঙ্গে খরচের ধারণা পাবেন। জমি ও কাগজ দেখার পর চূড়ান্ত খরচ জানানো হয়।",
    calc_service:"সেবা নির্বাচন করুন", calc_qty:"পরিমাণ", calc_result:"আনুমানিক খরচ",
    calc_category:"সেবার ধরন", calc_serviceopt:"সেবা নির্বাচন",
    calc_head1:"সেবা", calc_head2:"খরচের হিসাব",
    calc_note:"শুধু খরচের ধারণা — এটি জমির পরিমাপ নয়। প্রকৃত পরিমাণ স্বাক্ষরিত মাঠ রিপোর্টে নির্ধারিত হয়।",
    calc_book:"এই জরিপের অনুরোধ করুন",
    pricing_eyebrow:"স্বচ্ছ মূল্য",
    pricing_title:"জরিপের মূল্য তালিকা",
    pricing_text:"প্রতিটি সেবার খরচ আগে থেকেই পরিষ্কার। দাম বাংলাদেশি টাকায় (৳)।",
    pricing_th1:"সেবা", pricing_th2:"মূল্য (টাকা)", per_tooth:"প্রতি ইউনিট",
    ba_eyebrow:"সত্যিকারের ফলাফল",
    ba_title:"সীমানা নির্ধারণের আগে ও পরে",
    ba_text:"স্লাইডার টেনে দেখুন — বিরোধপূর্ণ সীমানা থেকে চিহ্নিত সীমানা।",
    ba_before:"আগে", ba_after:"পরে",
    ba_note:"প্রতীকী ও তথ্য গোপন রাখা। প্রতিটি জমি আলাদা।",
    ba_f_all:"সব", ba_f_boundary:"সীমানা", ba_f_partition:"বণ্টন", ba_f_records:"রেকর্ড", ba_f_layout:"লেআউট",
    doc_eyebrow:"আমাদের জরিপকারী",
    doc_name:"মোঃ উদাহরণ রহমান",
    doc_role:"সনদপ্রাপ্ত জরিপকারী, খুলনা ডিজিটাল সার্ভেয়ার অ্যাসোসিয়েশন",
    doc_text:"মোঃ উদাহরণ রহমান খুলনা ডিজিটাল সার্ভেয়ার অ্যাসোসিয়েশন পরিচালনা করেন — নির্ভুল পরিমাপ ও প্রশ্নের মুখেও টিকে থাকা রিপোর্টের উপর জোর দিয়ে।",
    doc_c1:"জরিপকারীর লাইসেন্স নং — প্রকৃত রেজিস্ট্রেশন দিয়ে পরিবর্তন করুন",
    doc_c2:"ডিপ্লোমা ইন সার্ভে — প্রকৃত যোগ্যতা দিয়ে পরিবর্তন করুন",
    doc_c3:"আদালতের কমিশন জরিপের অভিজ্ঞতা",
    doc_c4:"টোটাল স্টেশন ও জিএনএসএস যন্ত্রে প্রশিক্ষিত",
    doc_book:"জরিপের অনুরোধ করুন",
    test_eyebrow:"ক্লায়েন্টদের কথা",
    test_title:"জমির মালিকদের আস্থায়",
    contact_eyebrow:"আমাদের কাছে আসুন",
    contact_title:"খুলনা ডিজিটাল সার্ভেয়ার অ্যাসোসিয়েশন খুঁজুন",
    contact_addr_l:"ঠিকানা", contact_phone_l:"ফোন", contact_wa_l:"হোয়াটসঅ্যাপ", contact_email_l:"ইমেইল", contact_hours_l:"সময়",
    contact_phone_main_l:"মূল", contact_phone_appt_l:"অনুসন্ধান",
    contact_addr:"অফিসের ঠিকানা — খুলনা",
    contact_hours:"শনিবার – বৃহস্পতিবার: সকাল ১০টা – রাত ৯:৩০ · শুক্রবার: দুপুর ১১টা – রাত ৯:৩০",
    contact_dir:"দিকনির্দেশ নিন",
    book_eyebrow:"জরিপের অনুরোধ",
    book_title:"জরিপের অনুরোধ করুন",
    book_text:"জমি কোথায় ও কী কাজ দরকার জানান — হোয়াটসঅ্যাপে সঙ্গে সঙ্গে নিশ্চিত করব।",
    book_side_eyebrow:"সরাসরি কথা বলবেন?",
    book_side_title:"মেসেজ বা কল করুন",
    book_side_text:"দ্রুত হোয়াটসঅ্যাপ মেসেজ দিন, কল করুন, অথবা দিকনির্দেশ নিন — যেটি সহজ।",
    f_name:"পুরো নাম", f_phone:"ফোন নম্বর", f_service:"প্রয়োজনীয় সেবা",
    f_date:"পছন্দের তারিখ", f_time:"পছন্দের সময়", f_date_ph:"তারিখ লিখুন বা বেছে নিন", f_time_ph:"সময় লিখুন বা বেছে নিন", f_today:"আজ", f_tomorrow:"আগামীকাল", f_address:"ঠিকানা (ঐচ্ছিক)", f_address_ph:"বাসা / রোড / এলাকা",
    f_emerg:"এটি জরুরি / এই সপ্তাহেই জরিপ দরকার",
    f_consent:'আমি সম্মত যে আমার তথ্য <a href="privacy-policy.html" target="_blank" rel="noopener">প্রাইভেসি পলিসি</a> অনুযায়ী হোয়াটসঅ্যাপে খুলনা ডিজিটাল সার্ভেয়ার অ্যাসোসিয়েশনে পাঠানো হবে।',
    cb_consent:'আমি <a href="privacy-policy.html" target="_blank" rel="noopener">প্রাইভেসি পলিসি</a> অনুযায়ী আমার অনুরোধ নিয়ে যোগাযোগে সম্মত।',
    consent_alert:"যোগাযোগ করতে অনুগ্রহ করে সম্মতির ঘরটি টিক দিন।",
    book_wa_note:'🔒 আপনার তথ্য হোয়াটসঅ্যাপে আমাদের কাছে পাঠানো হয়। দেখুন আমাদের <a href="privacy-policy.html" target="_blank" rel="noopener">প্রাইভেসি পলিসি</a>।',
    f_select:"একটি সেবা নির্বাচন করুন", f_submit:"হোয়াটসঅ্যাপে পাঠান", f_wa:"দ্রুত হোয়াটসঅ্যাপ",
    f_success:"আপনার অনুরোধ সংরক্ষিত হয়েছে। দ্রুত নিশ্চিত করতে হোয়াটসঅ্যাপে পাঠান।",
    f_send_wa:"হোয়াটসঅ্যাপে পাঠান",
    foot_about:"খুলনায় সনদপ্রাপ্ত জমি জরিপ, রেকর্ড ও যাচাই। নির্মাণ বা কেনার আগে জেনে নিন জমি কতটুকু।",
    foot_links:"দ্রুত লিংক", foot_services:"সেবা", foot_contact:"যোগাযোগ",
    foot_rights:"সর্বস্বত্ব সংরক্ষিত।",
    nav_tech:"প্রযুক্তি", nav_faq:"প্রশ্নোত্তর",
    nav_contact_link:"যোগাযোগ",
    cb_title:"ফ্রি কলব্যাক অনুরোধ করুন", cb_ph:"আপনার নম্বর লিখুন", cb_wa:"হোয়াটসঅ্যাপ",
    cb_name_ph:"আপনার নাম",
    cb_success:"ধন্যবাদ! আপনার নম্বর পেয়েছি, আমরা কল করব।",
    nav_about_us:"আমাদের সম্পর্কে", nav_ourservices:"আমাদের সেবা", nav_branch:"শাখা",
    nav_doctors:"জরিপকারী", nav_pricelist:"মূল্য তালিকা", nav_blog:"ব্লগ", nav_gallery:"গ্যালারি", nav_careers:"ক্যারিয়ার",
    srch_ph:"সেবা, মূল্য, প্রশ্নোত্তর খুঁজুন…", srch_hint:"↑↓ নেভিগেট · Enter খুলুন · Esc বন্ধ করুন",
    srch_services:"সেবা", srch_pricing:"মূল্য তালিকা", srch_faq:"প্রশ্নোত্তর", srch_blog:"ব্লগ", srch_tech:"প্রযুক্তি",
    srch_empty:"কোনো ফলাফল পাওয়া যায়নি। অন্য শব্দ চেষ্টা করুন।",
    svc_learn:"বিস্তারিত", book_now:"বুক করুন", view_all:"সব সেবা দেখুন",
    dd_svc1:"আমিন দিয়ে জমি মাপ", dd_svc2:"সীমানা নির্ধারণ", dd_svc3:"ডিজিটাল / জিপিএস জরিপ",
    dd_svc4:"খতিয়ান ও রেকর্ড", dd_svc5:"মৌজা ম্যাপ",
    dd_svc6:"বণ্টন জরিপ", dd_svc7:"কেনার আগে যাচাই", dd_more:"আরও সেবা",
    steps_eyebrow:"যেভাবে কাজ করে", steps_title:"৪টি সহজ ধাপে আপনার জরিপ",
    steps_text:"প্রথম মেসেজ থেকে স্বাক্ষরিত রিপোর্ট পর্যন্ত — পুরো কাজটি সহজ ও পরিষ্কার রাখি।",
    step1_t:"অনুরোধ করুন", step1_d:"জমি কোথায় ও কী কাজ দরকার জানান — অনলাইন, ফোন বা হোয়াটসঅ্যাপে।",
    step2_t:"পরামর্শ", step2_d:"জমি দেখে ও কাগজ পড়ে পরিষ্কার বলি, জরিপে কী মীমাংসা হবে আর কী হবে না।",
    step3_t:"জরিপ", step3_d:"টোটাল স্টেশন বা জিএনএসএসে মাঠ পরিমাপ, আর সীমানা বাস্তবে চিহ্নিত।",
    step4_t:"রিপোর্ট", step4_d:"স্বাক্ষরিত পরিমাণ বিবরণী ও নকশা পাবেন, আর পরেও প্রশ্নের উত্তর দিতে আমরা আছি।",
    tech_eyebrow:"প্রযুক্তি ও নির্ভুলতা",
    tech_title:"আধুনিক যন্ত্র, প্রশ্নের মুখেও টেকে",
    tech_text:"সঠিক যন্ত্র আর যত্নে আঁকা নকশায় বিনিয়োগ করি, যাতে কেউ প্রশ্ন তুললেও রিপোর্ট টিকে থাকে।",
    emerg_eyebrow:"সবসময় আপনার পাশে",
    emerg_title:"এই সপ্তাহে জমি কিনছেন?",
    emerg_text:"টাকা দেওয়ার আগে একই সপ্তাহে যাচাই, আর প্রবাসী (এনআরবি) ক্রেতাদের জন্য অনলাইন পরামর্শ।",
    emerg_b1:"একই সপ্তাহে জরুরি যাচাই", emerg_b2:"অনলাইন ভিডিও পরামর্শ", emerg_b3:"হোয়াটসঅ্যাপে সহায়তা",
    emerg_call:"জরুরি কাজে কল করুন", emerg_video:"ভিডিও পরামর্শ বুক করুন",
    faq_eyebrow:"প্রশ্ন", faq_title:"সবার সাধারণ প্রশ্ন",
    tips_eyebrow:"জমির গাইড", tips_title:"জমি কেনা ও রেকর্ডের গাইড",
    tips_read:"আরও পড়ুন",
    wa_online:"● এখন অনলাইন", wa_greeting:"হ্যালো! 👋 আপনাকে কীভাবে সাহায্য করতে পারি? আমরা কয়েক মিনিটের মধ্যে উত্তর দিই।",
    wa_chip_book:"📅 জরিপের অনুরোধ", wa_chip_price:"💰 জরিপের খরচ?", wa_chip_q:"❓ প্রশ্ন করুন",
    wa_start:"WhatsApp-এ চ্যাট শুরু করুন →",
    google_reviews_label:"আমাদের গুগল রিভিউয়ের ভিত্তিতে",
    qr_scan_label:"গুগলে রিভিউ দিতে স্ক্যান করুন",
    see_reviews:"সব রিভিউ দেখুন →",
    share_experience:"আপনার অভিজ্ঞতা শেয়ার করুন",
    hero_wa:"WhatsApp করুন",
    lang_label:"EN",
  }
};

/* ---------- Testimonials ---------- */
/* The firm's own Google reviews page — Maps -> their listing -> Reviews ->
   copy the URL. Left empty, the "See all reviews" link is hidden. */
const GMAPS_REVIEW_URL = "";
const TESTIMONIALS = [
  /* PLACEHOLDER COPY. Replace with the firm's own reviews before launch.
     Use their real Google reviews, with the reviewer's display name as it
     already appears publicly on Google — do not invent testimonials, and do not
     carry another business's across: they are that business's clients, and a
     fabricated review is illegal advertising in most jurisdictions. */
  { en:"Replace this with a real review from the firm's Google listing.", name:"Reviewer name", role:"Google Review" },
  { en:"Four to eight short reviews reads best. The slider loops whatever is here.", name:"Reviewer name", role:"Google Review" },
  { en:"Keep each one to roughly two sentences so the card does not scroll.", name:"Reviewer name", role:"Google Review" },
  { en:"A named review carries more weight than an anonymous one.", name:"Reviewer name", role:"Google Review" },
];

/* ---------- Process steps ---------- */
const STEPS = [
  { ic:"chat", t:"step1_t", d:"step1_d" },
  { ic:"pin", t:"step2_t", d:"step2_d" },
  { ic:"scan", t:"step3_t", d:"step3_d" },
  { ic:"shield", t:"step4_t", d:"step4_d" },
];

/* ---------- Technology & safety ---------- */
const TECH = [
  { ic:"scan", en:"Total Station", bn:"টোটাল স্টেশন",
    de:"Angle and distance measured to the second — the instrument court reports are expected to come from.",
    db:"সেকেন্ড নিখুঁত কোণ ও দূরত্ব — আদালতের রিপোর্ট এই যন্ত্রেই প্রত্যাশিত।" },
  { ic:"pin", en:"GNSS / GPS", bn:"জিএনএসএস / জিপিএস",
    de:"Satellite positioning to tie your plot to the national grid, not just to the neighbour's wall.",
    db:"স্যাটেলাইট অবস্থান — জমিকে জাতীয় গ্রিডের সঙ্গে মেলানো, শুধু পাশের দেয়ালের সঙ্গে নয়।" },
  { ic:"shield", en:"Signed & Sealed Reports", bn:"স্বাক্ষরিত ও সিলমোহর রিপোর্ট",
    de:"Every survey leaves with a signed area statement and a drawing, ready to file.",
    db:"প্রতিটি জরিপের সঙ্গে স্বাক্ষরিত পরিমাণ বিবরণী ও নকশা — দাখিলের জন্য প্রস্তুত।" },
  { ic:"cpu", en:"CAD Drafting", bn:"ক্যাড ড্রাফটিং",
    de:"Field data drawn to scale, so the map matches the ground and the mouza sheet.",
    db:"মাঠের তথ্য স্কেলে অঙ্কিত — নকশা, জমি ও মৌজা শিট মিলিয়ে।" },
];

/* ---------- FAQs ---------- */
const FAQS = [
  { qe:"How accurate is the measurement?",
    ae:"Total station work is accurate to a few centimetres on a normal plot. Chain-and-tape is coarser and we will say so before you book. The signed report states the method used.",
    qb:"পরিমাপ কতটা নির্ভুল?",
    ab:"সাধারণ জমিতে টোটাল স্টেশনের কাজ কয়েক সেন্টিমিটার পর্যন্ত নির্ভুল। চেইন-ফিতার কাজ তুলনায় কম নিখুঁত, বুকিংয়ের আগেই তা জানানো হয়। স্বাক্ষরিত রিপোর্টে পদ্ধতি উল্লেখ থাকে।" },
  { qe:"Can I use your report in court?",
    ae:"Yes. Our survey reports are signed and sealed and are prepared to be filed. A court-appointed commission survey is a separate service — tell us if that is what the court ordered.",
    qb:"আপনাদের রিপোর্ট কি আদালতে ব্যবহার করা যাবে?",
    ab:"হ্যাঁ। আমাদের জরিপ রিপোর্ট স্বাক্ষরিত ও সিলমোহরযুক্ত এবং দাখিলের উপযোগী করে তৈরি। আদালত নিযুক্ত কমিশন জরিপ আলাদা সেবা — আদালত তা নির্দেশ দিলে জানাবেন।" },
  { qe:"What documents do I need to give you?",
    ae:"Whatever you have — the deed, any khatian, and the dag number. If you have none of it we can search the record room first; that is a separate fee and it takes longer.",
    qb:"আমাকে কী কী কাগজ দিতে হবে?",
    ab:"যা আছে তাই — দলিল, খতিয়ান ও দাগ নম্বর। কিছুই না থাকলে আগে রেকর্ড রুমে খোঁজা যায়; সেটি আলাদা ফি ও বেশি সময়ের কাজ।" },
  { qe:"How much will it cost?",
    ae:"Use the estimator for an instant range. It is a fee estimate and never a measurement — the final figure is set once we see the plot and the papers.",
    qb:"খরচ কত হবে?",
    ab:"সঙ্গে সঙ্গে ধারণা পেতে হিসাবটি ব্যবহার করুন। এটি খরচের ধারণা, জমির পরিমাপ নয় — জমি ও কাগজ দেখার পর চূড়ান্ত হয়।" },
  { qe:"I am abroad. Can you survey without me?",
    ae:"Yes, and it is common. We coordinate with someone you trust locally, send photographs from the site, and deliver the report digitally before any money moves.",
    qb:"আমি বিদেশে আছি। আমাকে ছাড়া জরিপ সম্ভব?",
    ab:"হ্যাঁ, এটি খুবই সাধারণ। আপনার বিশ্বস্ত কারও সঙ্গে সমন্বয় করে মাঠ থেকে ছবি পাঠানো হয় এবং টাকা লেনদেনের আগেই ডিজিটালি রিপোর্ট পৌঁছে দেওয়া হয়।" },
  { qe:"Do you work outside your district?",
    ae:"Often, yes, with travel added to the fee. Ask before you book — record-room work in particular is tied to where the land actually sits.",
    qb:"আপনারা কি জেলার বাইরে কাজ করেন?",
    ab:"প্রায়ই করি, ফির সঙ্গে যাতায়াত যোগ হয়। বুকিংয়ের আগে জেনে নিন — বিশেষত রেকর্ড রুমের কাজ জমি যেখানে সেখানকার সঙ্গেই যুক্ত।" },
];

/* ---------- Guides / blog ---------- */
/* The blog ships disabled (features.blog). Leave this empty rather than
   pointing cards at pages that do not exist — an empty list renders nothing
   and hides the section. */
const POSTS = [
];

/* ---------- Before/After cases ----------
   A case only belongs here once BOTH its photos exist in assets/ba/. Listing one
   without them cost six 404s on every page load and showed the visitor a flat
   colour block where a result photo should be — initBA()'s placeholder keeps the
   page from looking broken, but it is a fallback, not a feature.

   To add a case back: drop <type>-before.jpg and <type>-after.jpg into assets/ba/,
   uncomment its line, and the filter buttons below reappear on their own. */
const BA_CASES = [
  { type:"boundary",  before:"#cbbfae", after:"#eef3ec", bImg:"assets/ba/boundary-before.svg?v=1",  aImg:"assets/ba/boundary-after.svg?v=1" },
  { type:"partition", before:"#c9bda9", after:"#eef1f6", bImg:"assets/ba/partition-before.svg?v=1", aImg:"assets/ba/partition-after.svg?v=1" },
  { type:"records",   before:"#cdc4b2", after:"#f0f1ee", bImg:"assets/ba/records-before.svg?v=1",   aImg:"assets/ba/records-after.svg?v=1" },
  { type:"layout",    before:"#c7bda6", after:"#f2f0e9", bImg:"assets/ba/layout-before.svg?v=1",    aImg:"assets/ba/layout-after.svg?v=1" },
];

/* ---------- WhatsApp chat pre-filled messages ---------- */
const WA_MSGS = {
  book:"Hi, I'd like to request a land survey.",
  price:"Hi, I'd like to know your survey fees.",
  question:"Hi, I have a question about a land survey."
};
const WA_MSGS_BN = {
  book:"হ্যালো, আমি জমি জরিপের জন্য অনুরোধ করতে চাই।",
  price:"হ্যালো, আমি জরিপের খরচ জানতে চাই।",
  question:"হ্যালো, জমি জরিপ নিয়ে আমার একটি প্রশ্ন আছে।"
};

/* ============================================================
   Rendering + interactions
   ============================================================ */
let LANG = localStorage.getItem("clinic_lang") || "bn";  // Bangladeshi audience → Bangla first

function t(key){ return (I18N[LANG] && I18N[LANG][key]) ?? (I18N.en[key] ?? key); }
/* Currency, locale and FX all come from CLINIC.currency. They used to be three
   separate literals here and in renderPricing, while clinic.config.js carried a
   currency block that nothing read — so `showUsd` did nothing and the rate could
   drift from the configured one without any symptom. */
const CUR = (window.CLINIC && window.CLINIC.currency) || {};
function fmt(n){ return n.toLocaleString(CUR.locale || "en-IN"); }

function applyI18n(){
  document.documentElement.lang = LANG;
  document.documentElement.setAttribute("data-lang", LANG);
  document.body.classList.toggle("bn", LANG === "bn");
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    const v = withCounts(t(k));
    if (el.hasAttribute("data-i18n-html")) el.innerHTML = v;
    else el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
  // dynamic blocks
  renderServices(); renderPricing(); renderCalcOptions(); renderTestimonials(); renderBookOptions(); renderBookSlots();
  renderSteps(); renderTech(); renderFaqs(); renderCalcBA(); renderMarquee(); renderAreaUnits();
  const tgl = document.getElementById("langText");
  if (tgl) tgl.textContent = t("lang_label");
  applyGoogleReviews(); // re-overlay live Google data (if loaded) in the current language
  applyStatCount();
}

/* The patient figure appears in THREE places on the homepage — the hero pill, the
   "Trusted by …" badge, and the headline counter. They must never disagree, so all
   three read the same number: whatever the clinic last saved, falling back to the
   data-target written into index.html. */
let STAT_SURVEYS = null;
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
function statCount(){
  if (STAT_SURVEYS !== null) return STAT_SURVEYS;
  const el = document.querySelector('.stat-num[data-stat="surveys"]');
  return el ? (+el.dataset.target || 0) : 0;
}
function statCountText(){
  const s = fmt(statCount());
  // the Bangla badge has always shown Bengali numerals; keep it that way
  return LANG === "bn" ? s.replace(/[0-9]/g, d => BN_DIGITS.charAt(+d)) : s;
}
function withCounts(str){
  return (typeof str === "string" && str.indexOf("{n}") > -1)
    ? str.split("{n}").join(statCountText()) : str;
}
/* re-render only the bits that carry the number, so a new figure does not force a
   full applyI18n() (which re-renders every list on the page). */
function applyStatCount(){
  const pill = document.querySelector(".hp-count");
  if (pill) pill.textContent = fmt(statCount()) + "+";   // pill is Latin in both languages
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const raw = t(el.getAttribute("data-i18n"));
    if (typeof raw === "string" && raw.indexOf("{n}") > -1){
      const v = withCounts(raw);
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = v; else el.textContent = v;
    }
  });
}

function setLang(l){ LANG = l; localStorage.setItem("clinic_lang", l); applyI18n(); }

/* ----- Inline SVG icons (Lucide-style, currentColor) ----- */
const ICONS = {
  calendar:'<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
  stethoscope:'<path d="M4 3v6a5 5 0 0 0 10 0V3"/><path d="M9 18a4 4 0 0 0 8 0v-3"/><circle cx="20" cy="12" r="2"/>',
  smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  heart:'<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.8a5 5 0 0 0 0-7.1z"/>',
  shield:'<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  zap:'<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
  package:'<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  pin:'<path d="M12 22s8-5.5 8-12a8 8 0 1 0-16 0c0 6.5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>',
  chat:'<path d="M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6A8.4 8.4 0 1 1 21 11.5z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
};
function svgIcon(name){return `<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.check}</svg>`;}

/* The clinic's own Google review link, built from the Place ID in config.
   A Place ID is an opaque string, so a hardcoded one survives every name- and
   number-based search — the previous business's ID shipped in this template
   unnoticed, which would have pointed a new client's review QR at a stranger's
   listing. Empty ID => no link, and the callers hide their UI. */
function reviewUrl(){
  const id = (window.CLINIC && window.CLINIC.google && window.CLINIC.google.placeId) || "";
  return id ? `https://search.google.com/local/writereview?placeid=${id}` : "";
}

/* ----- Service image paths -----
   One place decides the extension and the size-variant folder, because the four
   call sites below used to spell ".jpg?v=2" out by hand and a template that
   ships SVG placeholders had to be edited in all four.

   SIZE VARIANTS: cards/ is a 640px copy and thumbs/ a 132px copy of the same
   photo — worth a lot for real clinical JPEGs, worth nothing for an SVG, which
   is resolution-independent. So with SVG both resolve to the single base file
   and the clinic ships 84 files instead of 252. When real photos arrive, set
   media.ext to "jpg" and run tools/gen-image-sizes.py to build the two folders.

   The <img onerror> chains in the callers still fall back to the base image, so
   a missing size variant degrades instead of leaving a broken frame. */
const IMG_EXT = (window.CLINIC && window.CLINIC.media && window.CLINIC.media.ext) || "svg";
const IMG_V   = (window.CLINIC && window.CLINIC.site && window.CLINIC.site.assetVersion) || "1";

/* styles.css cannot read the config, so the hero background extension used to be
   spelled ".jpg" by hand — a guaranteed 404 on an SVG-shipping site, and one
   apply-config.mjs never caught because it only walks .html. The stylesheet now
   carries the default ext; this only overrides it when the client ships photos.
   Set on the ELEMENT, because a relative url() inside a custom property resolves
   against the stylesheet, not the document, which silently yields assets/assets/. */
function applyHeroBg(){
  if (IMG_EXT === "svg") return;             // the CSS fallback is already right
  const el = document.querySelector(".hero-bg");
  if (el) el.style.backgroundImage = `url(assets/hero-portrait.${IMG_EXT}?v=${IMG_V})`;
}

function svcImg(name, size) {
  const dir = (size && IMG_EXT !== "svg") ? size + "/" : "";
  return `assets/services/${dir}${name}.${IMG_EXT}?v=${IMG_V}`;
}

/* ----- Services grid ----- */
function renderServices(){
  const wrap = document.getElementById("servicesGrid");
  if(!wrap) return;
  wrap.innerHTML = SERVICES.map((s)=>{
    const href = s.slug ? `services/${s.slug}.html` : "book.html";
    const name = LANG==="bn"?s.bn:s.en;
    const common = LANG==="bn"?s.cn:s.cne;
    const sub = (s.sub||[]).map(o=>`<a class="svc-sub-chip" href="services/${o.slug}.html">${LANG==="bn"?o.bn:o.en}</a>`).join("");
    const dur = s.dur ? `<span class="svc-dur"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${LANG==="bn"?s.durbn:s.dur}</span>` : "";
    /* Cards show a 640px copy (art box is ~330px) and the thumb strip a 132px copy
       (it renders at 44x34) — a fraction of the full-size files, which are still
       used for the lightbox and when a thumb is clicked. Each falls back to the
       full-size image, then to the SVG, so nothing breaks if a copy is missing. */
    const card   = (n) => svcImg(n, "cards");
    const fbFull = (n) => `this.onerror=null;this.src='${svcImg(n)}'`;
    const media = s.vid
      ? `<img class="svc-static" src="${card(s.img)}" onerror="${fbFull(s.img)}" alt="${name}" loading="lazy" decoding="async"><video class="svc-anim" autoplay muted loop playsinline preload="none"><source src="assets/services/${s.vid}.mp4?v=${IMG_V}" type="video/mp4"></video>`
      : s.img2
        ? `<img class="svc-static" src="${card(s.img)}" onerror="${fbFull(s.img)}" alt="${name}" loading="lazy" decoding="async"><img class="svc-anim svc-anim-img" src="${card(s.img2)}" onerror="${fbFull(s.img2)}" alt="${name}" loading="lazy" decoding="async">`
        : `<img src="${card(s.img)}" onerror="${fbFull(s.img)}" alt="${name}" loading="lazy" decoding="async">`;
    /* the strip is absolutely positioned inside the 210px .svc-img, so it only has room
       for 5 thumbs (5*34 + 4*4 + 8 = 194px). Anything past that would be clipped by the
       card's overflow:hidden and become invisible — the full set lives on the service
       page and in the gallery. */
    const galSrcs=[s.img,...(s.img2?[s.img2]:[]),...(s.gal||[])].slice(0,5);
    const galHtml=galSrcs.length>1?`<div class="svc-gal">${galSrcs.map((t,i)=>`<button class="sgal-thumb${i===0?' active':''}" type="button" data-src="${svcImg(t)}"><img src="${svcImg(t, "thumbs")}" alt="" loading="lazy" decoding="async" onerror="if(this.dataset.fb){this.parentNode.style.display='none'}else{this.dataset.fb=1;this.src='${svcImg(t)}'}"></button>`).join('')}</div>`:'';
    return `
    <article class="svc-card${s.vid||s.img2?' svc-has-vid':''}">
      <a class="svc-img" href="${href}" aria-label="${name}">${media}</a>${galHtml}
      <div class="svc-body">
        <div class="svc-top"><span class="svc-price">${s.pr}${s.per?` <span class="svc-per">${unitLabel()}</span>`:""}</span>${dur}</div>
        <h3><a href="${href}">${name}</a></h3>
        ${common?`<span class="svc-common">${common}</span>`:""}
        <p>${LANG==="bn"?s.db:s.de}</p>
        ${sub?`<div class="svc-sub">${sub}</div>`:""}
        <a class="btn btn-primary svc-book" href="book.html?service=${encodeURIComponent(s.en)}">${t("book_now")}</a>
      </div>
    </article>`;}).join("");
  wrap.querySelectorAll(".svc-has-vid").forEach(function(card){
    var img=card.querySelector(".svc-static");
    var vid=card.querySelector(".svc-anim");
    if(!img||!vid) return;
    if(vid.tagName==="VIDEO"){
      // continuous animation — plays non-stop, never pauses
      var play=function(){var p=vid.play();if(p&&p.catch)p.catch(function(){});};
      vid.addEventListener("playing",function(){img.style.opacity="0";vid.style.opacity="1";});
      new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)play();});},{threshold:0.01}).observe(card);
      play();
      return;
    }
    // image-swap cards — continuously cross-fade between the two photos while
    // in view (hover/touch forces the second photo). Respects reduced-motion.
    var second=false, hovering=false, timer=null;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function paint(){ var s=hovering||second; img.style.opacity=s?"0":"1"; vid.style.opacity=s?"1":"0"; }
    function start(){ if(reduceMotion||timer) return; timer=setInterval(function(){ second=!second; paint(); }, 2800); }
    function stop(){ if(timer){ clearInterval(timer); timer=null; } second=false; paint(); }
    card.addEventListener("mouseenter",function(){hovering=true;paint();});
    card.addEventListener("mouseleave",function(){hovering=false;paint();});
    card.addEventListener("touchstart",function(){card.classList.add("touch-active");hovering=true;paint();},{passive:true});
    card.addEventListener("touchend",function(){card.classList.remove("touch-active");hovering=false;paint();},{passive:true});
    var svcIO=new IntersectionObserver(function(entries){entries.forEach(function(e){ e.isIntersecting?start():stop(); });},{threshold:0.3});
    svcIO.observe(card);
    paint();
  });
  wrap.querySelectorAll(".svc-gal").forEach(function(gal){
    var card=gal.closest(".svc-card");
    var staticImg=card.querySelector(".svc-static")||card.querySelector(".svc-img img");
    gal.querySelectorAll(".sgal-thumb").forEach(function(btn){
      btn.addEventListener("click",function(e){
        e.preventDefault();e.stopPropagation();
        gal.querySelectorAll(".sgal-thumb").forEach(function(b){b.classList.remove("active");});
        btn.classList.add("active");
        if(staticImg){
          var animEl=card.querySelector(".svc-anim");
          if(animEl){animEl.style.opacity="0";if(animEl.tagName==="VIDEO")animEl.pause();}
          staticImg.style.opacity="1";
          staticImg.src=btn.dataset.src;
        }
      });
    });
  });
}

/* ----- Pricing table (grouped by category) ----- */
function renderPricing(){
  const wrap = document.getElementById("pricingBody");
  if(!wrap) return;
  let html = "";
  Object.keys(CATS).forEach(cat=>{
    const items = PRICES.filter(p=>p.c===cat);
    if(!items.length) return;
    html += `<tr class="price-cat"><td colspan="2">${LANG==="bn"?CATS[cat].bn:CATS[cat].en}</td></tr>`;
    items.forEach(p=>{
      const price = p.min===p.max ? fmtBdt(p.min) : `${fmtBdt(p.min)} – ${fmtBdt(p.max)}`;
      const pname = LANG==="bn" && p.nb ? p.nb : p.n;
      const noteTxt = LANG==="bn" && p.noteb ? p.noteb : p.note;
      const noteTag = noteTxt ? ` <span class="tag tag-soft">${noteTxt}</span>` : "";
      const perLabel = p.per ? `<span class="pprice-per">${unitLabel()}</span>` : "";
      const nameCell = p.slug
        ? `<a class="pname-link" href="services/${p.slug}.html"><span class="pname">${pname}</span>${noteTag}<span class="plink-arr">→</span></a>`
        : `<span class="pname">${pname}</span>${noteTag}`;
      html += `<tr${p.slug?' class="price-row-link"':''}>
        <td>${nameCell}</td>
        <td class="pprice">${price}${perLabel}</td></tr>`;
    });
  });
  wrap.innerHTML = html;
}

/* ----- Cost calculator ----- */
function renderCalcOptions(){            // categories + services + qty
  const cat = document.getElementById("calcCategory");
  const qty = document.getElementById("calcQty");
  if(cat){
    const cur = cat.value;
    cat.innerHTML = Object.keys(CATS).map(c=>`<option value="${c}">${LANG==="bn"?CATS[c].bn:CATS[c].en}</option>`).join("");
    if(cur) cat.value = cur;
  }
  if(qty && !qty.options.length){
    /* A <select> of 1..20 whole numbers cannot express 2.5 katha, and land area
       routinely exceeds 20 units. The field is a number input so any positive
       amount is accepted; UNITS.step decides the granularity. */
    buildQtyField(qty);
  }
  /* The label above the quantity field names the unit, so it follows config
     rather than the i18n dictionary when a business defines its own. */
  const qtyLab = qtyWrapLabel();
  if (qtyLab) qtyLab.textContent = unitQtyLabel();
  renderCalcServices();
}
/* ----- The quantity multiplier -----
   Generic "price x units". UNITS names what a unit IS for this business — teeth,
   decimals of land, rooms, hours — so the arithmetic below never has to know. */
const UNITS = (window.CLINIC && window.CLINIC.units) || {};
function unitLabel(){
  const l = UNITS.label;
  if (!l) return t("per_tooth");
  return (LANG === "bn" && l.bn) ? l.bn : (l.en || "");
}
function unitQtyLabel(){
  const l = UNITS.qtyLabel;
  if (!l) return t("calc_qty");
  return (LANG === "bn" && l.bn) ? l.bn : (l.en || "");
}
/* Replaces the old 1..20 <select> in place, keeping the element id so every
   existing listener and style still applies. */
function qtyWrapLabel(){
  const w = document.getElementById("calcQtyWrap");
  return w ? w.querySelector("label") : null;
}
function buildQtyField(el){
  if (!el || el.tagName === "INPUT") return;
  const input = document.createElement("input");
  input.type = "number";
  input.id = el.id;
  input.className = el.className;
  input.min = String(UNITS.min ?? 0.01);
  input.step = String(UNITS.step ?? 0.01);
  input.value = String(UNITS.default ?? 1);
  input.inputMode = "decimal";
  el.replaceWith(input);
}

function renderCalcServices(){
  const catSel = document.getElementById("calcCategory");
  const sel = document.getElementById("calcService");
  if(!sel) return;
  const cat = catSel ? catSel.value : null;
  const cur = sel.value;
  const opts = PRICES.map((p,i)=>({p,i})).filter(o=>!cat || o.p.c===cat);
  sel.innerHTML = opts.map(o=>`<option value="${o.i}">${o.p.n}</option>`).join("");
  if(cur && opts.some(o=>String(o.i)===cur)) sel.value = cur;
  updateCalc();
}
let _calcAnim;
const USD_RATE = Number(CUR.usdRate) || 123;
function fmtBdt(bdt){ return (CUR.symbol || "\u09f3") + " " + fmt(bdt); }
function fmtUsd(bdt){ return "$" + Math.round(bdt/USD_RATE).toLocaleString("en-US"); }
function fitCalcLine(el, avail){          // shrink font so the number fits one line without growing the box
  if(!el || !avail) return;
  el.style.fontSize = "";                 // reset to the CSS size, then measure
  const base = parseFloat(getComputedStyle(el).fontSize) || 16;
  const w = el.scrollWidth;
  if(w > avail) el.style.fontSize = (base * avail / w) + "px";
}
function updateCalc(){
  const sel = document.getElementById("calcService");
  const qtyWrap = document.getElementById("calcQtyWrap");
  const qtyEl = document.getElementById("calcQty");
  const out = document.getElementById("calcResult");
  if(!sel||!out) return;
  const p = PRICES[+sel.value] || PRICES[0];
  const per = !!p.per;
  if(qtyWrap) qtyWrap.style.visibility = per ? "visible" : "hidden";  // keep space so card height stays fixed
  /* parseFloat, not parseInt: land is sold in fractions and parseInt("2.5")
     is 2 — a 20% undercount, on a price, with nothing on screen to show it.
     A blank or nonsense field falls back to one unit rather than NaN. */
  const raw = parseFloat((qtyEl && qtyEl.value) || "1");
  const qty = per ? (isFinite(raw) && raw > 0 ? raw : 1) : 1;
  /* Round once, at the end: rounding the unit price first then multiplying
     compounds the error across both bounds of the range. */
  const min = Math.round(p.min*qty), max = Math.round(p.max*qty);
  // build the result structure once; update text in-place each frame so we can size the font to fit
  out.innerHTML = `<span class="calc-amt"></span><span class="calc-usd"></span>${p.note?`<span class="calc-sub">${p.note}</span>`:""}`;
  const amtEl = out.querySelector(".calc-amt");
  const usdEl = out.querySelector(".calc-usd");
  const bdtOf = (a,b)=> a===b ? fmtBdt(b) : `${fmtBdt(a)} – ${fmtBdt(b)}`;
  const usdOf = (a,b)=> "≈ " + (a===b ? fmtUsd(b) : `${fmtUsd(a)} – ${fmtUsd(b)}`);
  // size the font to the FINAL (widest) values so nothing wraps or expands during the count-up
  const avail = out.clientWidth;
  amtEl.textContent = bdtOf(min,max);
  usdEl.textContent = usdOf(min,max);
  fitCalcLine(amtEl, avail);
  fitCalcLine(usdEl, avail);
  cancelAnimationFrame(_calcAnim);
  const dur = 650, t0 = performance.now();
  const step = (now)=>{
    const k = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-k,3);
    const cMin = Math.round(min*e), cMax = Math.round(max*e);
    amtEl.textContent = bdtOf(cMin,cMax);
    usdEl.textContent = usdOf(cMin,cMax);
    if(k<1) _calcAnim = requestAnimationFrame(step);
  };
  out.classList.remove("pop"); void out.offsetWidth; out.classList.add("pop");
  _calcAnim = requestAnimationFrame(step);
  const btn = document.getElementById("calcBook");
  if(btn) btn.dataset.service = p.n;
}
function renderCalcBA(){
  const el = document.getElementById("calcBa");
  if(!el) return;
  const c = BA_CASES[0];
  el.innerHTML = `<div class="ba">
      <img class="ba-after" loading="lazy" decoding="async" src="${c.aImg}" data-fbcolor="${c.after}" data-fblabel="ba_after" alt="after">
      <img class="ba-before" loading="lazy" decoding="async" src="${c.bImg}" data-fbcolor="${c.before}" data-fblabel="ba_before" alt="before">
      <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="before after slider">
      <span class="ba-tag ba-tag-l">${t('ba_before')}</span>
      <span class="ba-tag ba-tag-r">${t('ba_after')}</span>
      <span class="ba-handle"></span>
    </div>`;
  el.querySelectorAll(".ba").forEach(initBA);
}

/* ----- Testimonials ----- */
function renderTestimonials(){
  const wrap = document.getElementById("testGrid");
  if(!wrap) return;
  wrap.innerHTML = TESTIMONIALS.map(x=>`
    <a class="test-card" href="${GMAPS_REVIEW_URL}" target="_blank" rel="noopener noreferrer" aria-label="Read review on Google Maps">
      <div class="stars">★★★★★</div>
      <p>"${LANG==="bn"&&x.bn?x.bn:x.en}"</p>
      <div class="test-meta"><span class="avatar">${x.name.charAt(0)}</span>
        <div><strong>${x.name}</strong><small>${x.role}</small></div></div>
    </a>`).join("");
}

/* ---------- Live Google reviews (Featurable free JSON API) ----------
   Paste your Featurable widget ID below to go live. Featurable reads the
   clinic's Google Business Profile and refreshes ~daily. While the ID is
   empty (or if the fetch fails) the static reviews above stay as a fallback,
   so the section never looks broken. */
const FEATURABLE_WIDGET_ID = "";
let GOOGLE_REVIEWS = null; // { rating, count, reviews:[{name,text,rating,url}] }

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

async function loadGoogleReviews(){
  if(!FEATURABLE_WIDGET_ID) return; // no ID yet → keep static fallback
  try{
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 8000);
    const res = await fetch("https://featurable.com/api/v1/widgets/"+FEATURABLE_WIDGET_ID, {signal:ctrl.signal});
    clearTimeout(timer);
    if(!res.ok) return;
    const data = await res.json();
    // Featurable's JSON shape can vary; accept the common field names defensively.
    const arr = data.reviews || data.data || [];
    const WORD2NUM = {ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5};
    const toStars = v => {
      if(typeof v==="string" && WORD2NUM[v.toUpperCase()]) return WORD2NUM[v.toUpperCase()];
      const n = Number(v); return (n>=1 && n<=5) ? n : 5;
    };
    const reviews = arr.map(r=>({
      name:   r.reviewerName || r.author || r.name || (r.reviewer && (r.reviewer.displayName || r.reviewer.name)) || "Google user",
      text:   r.reviewText || r.text || r.comment || r.content || "",
      rating: toStars(r.starRating || r.rating || r.stars || 5),
      url:    r.reviewUrl || r.url || (r.reviewer && r.reviewer.profileUrl) || GMAPS_REVIEW_URL
    })).filter(r => r.text.trim());
    let rating = Number(data.averageRating || data.rating || (data.summary && data.summary.averageRating));
    let count  = Number(data.totalReviewCount || data.totalReviews || data.reviewCount || (data.summary && data.summary.totalReviewCount));
    if(!(rating>0) && reviews.length) rating = reviews.reduce((s,r)=>s+r.rating,0) / reviews.length;
    if(!(count>0)  && reviews.length) count = reviews.length;
    if(!reviews.length && !(rating>0)) return;
    GOOGLE_REVIEWS = {
      rating: rating>0 ? rating : null,
      count:  count>0  ? count  : null,
      reviews: reviews
    };
    applyGoogleReviews();
  }catch(e){ /* offline / blocked / bad JSON → silent, static fallback stays */ }
}

/* Overlay live data onto the existing badges + testimonial grid. Called at the
   end of applyI18n() too, so a language toggle re-applies it in the right language. */
function applyGoogleReviews(){
  if(!GOOGLE_REVIEWS) return;
  const g = GOOGLE_REVIEWS;

  if(g.rating != null){
    const rt = g.rating.toFixed(1);
    document.querySelectorAll(".g-score").forEach(el => el.textContent = rt);
    document.querySelectorAll(".rs-score").forEach(el => {
      const stars = el.querySelector(".rs-stars");
      el.textContent = rt + " ";
      if(stars) el.appendChild(stars);
    });
  }

  if(g.count != null){
    document.querySelectorAll(".rs-label").forEach(el =>
      el.textContent = LANG==="bn"
        ? (g.count + "+ গুগল রিভিউয়ের ভিত্তিতে")
        : ("Based on " + g.count + "+ Google reviews"));
    document.querySelectorAll(".g-label").forEach(el =>
      el.textContent = LANG==="bn"
        ? (g.count + "+ গুগল রিভিউ")
        : (g.count + "+ Google Reviews"));
  }

  const wrap = document.getElementById("testGrid");
  if(wrap && g.reviews.length){
    const roleTxt = LANG==="bn" ? "গুগল রিভিউ" : "Google Review";
    const list = g.reviews.slice()
      .sort((a,b)=> (b.rating - a.rating) || (b.text.length - a.text.length))
      .slice(0, 9);
    wrap.innerHTML = list.map(x=>{
      const stars = "★".repeat(Math.max(1, Math.min(5, Math.round(x.rating))));
      return `
    <a class="test-card" href="${escapeHtml(x.url)}" target="_blank" rel="noopener noreferrer" aria-label="Read review on Google Maps">
      <div class="stars">${stars}</div>
      <p>"${escapeHtml(x.text)}"</p>
      <div class="test-meta"><span class="avatar">${escapeHtml(x.name.charAt(0))}</span>
        <div><strong>${escapeHtml(x.name)}</strong><small>${roleTxt}</small></div></div>
    </a>`;
    }).join("");
  }
}

/* ----- Process steps ----- */
function renderSteps(){
  const wrap = document.getElementById("stepsGrid");
  if(!wrap) return;
  wrap.innerHTML = STEPS.map((s,i)=>`
    <article class="step-card">
      <span class="step-num">${i+1}</span>
      <div class="step-ic">${svgIcon(s.ic)}</div>
      <h3>${t(s.t)}</h3>
      <p>${t(s.d)}</p>
    </article>`).join("");
}

/* ----- Technology & safety ----- */
function renderTech(){
  const wrap = document.getElementById("techGrid");
  if(!wrap) return;
  wrap.innerHTML = TECH.map(x=>`
    <article class="tech-card">
      <div class="tech-ic">${svgIcon(x.ic)}</div>
      <div><h3>${LANG==="bn"?x.bn:x.en}</h3><p>${LANG==="bn"?x.db:x.de}</p></div>
    </article>`).join("");
}

/* ----- FAQ accordion ----- */
function renderFaqs(){
  const wrap = document.getElementById("faqList");
  if(!wrap) return;
  wrap.innerHTML = FAQS.map((f,i)=>`
    <div class="faq-item">
      <button class="faq-q" aria-expanded="false"><span class="faq-qt">${LANG==="bn"?f.qb:f.qe}</span><span class="faq-ic">+</span></button>
      <div class="faq-a"><p>${LANG==="bn"?f.ab:f.ae}</p></div>
    </div>`).join("");
  wrap.querySelectorAll(".faq-q").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const open = btn.getAttribute("aria-expanded")==="true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.parentElement.classList.toggle("open", !open);
    });
  });
}

/* ----- Guides ----- */
function renderTips(){
  const wrap = document.getElementById("tipsGrid");
  if(!wrap) return;
  wrap.innerHTML = POSTS.map(p=>`
    <article class="tip-card">
      <a class="tip-img" href="blog/${p.slug}.html">${p.ic}</a>
      <div class="tip-body">
        <h3>${LANG==="bn"?p.tb:p.te}</h3>
        <p>${LANG==="bn"?p.eb:p.ee}</p>
        <a class="svc-link" href="blog/${p.slug}.html">${t("tips_read")} →</a>
      </div>
    </article>`).join("");
}

/* ----- Before/After ----- */
function baSvg(color, label){
  /* The fallback image behind the before/after slider. It used to draw a row of
     teeth; for a survey site it draws a plot outline with its corners pinned,
     which is what the slider is actually comparing. */
  return `data:image/svg+xml;utf8,`+encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='420'>
      <rect width='600' height='420' fill='${color}'/>
      <g stroke='#fff' stroke-width='9' fill='#ffffff' fill-opacity='0.22' stroke-linejoin='round'>
        <path d='M120 300 L250 110 L430 150 L400 320 Z'/>
      </g>
      <g fill='#fff'>
        <circle cx='120' cy='300' r='14'/><circle cx='250' cy='110' r='14'/>
        <circle cx='430' cy='150' r='14'/><circle cx='400' cy='320' r='14'/>
      </g>
      <text x='300' y='380' font-family='sans-serif' font-size='26' fill='#fff' text-anchor='middle' opacity='0.9'>${label}</text>
    </svg>`);
}

/* A filter button with no case behind it renders an empty grid, which reads as a
   broken page. Drive the buttons off BA_CASES instead of the markup, so they follow
   whatever is actually listed above — and drop the whole row when there is only one
   case, since filtering one item is not a choice. */
function syncBAFilters(){
  const row = document.querySelector(".ba-filters");
  if(!row) return;
  const types = new Set(BA_CASES.map(c=>c.type));
  row.querySelectorAll(".ba-filter").forEach(b=>{
    const f = b.dataset.filter;
    b.hidden = !(f === "all" || types.has(f));
  });
  row.hidden = types.size < 2;
}

function renderBA(filter="all"){
  const wrap = document.getElementById("baGrid");
  if(!wrap) return;
  syncBAFilters();
  const list = BA_CASES.filter(c=>filter==="all"||c.type===filter);
  wrap.innerHTML = list.map((c,i)=>`
    <div class="ba" data-i="${i}">
      <img class="ba-after" loading="lazy" decoding="async" src="${c.aImg}" data-fbcolor="${c.after}" data-fblabel="ba_after" alt="after">
      <img class="ba-before" loading="lazy" decoding="async" src="${c.bImg}" data-fbcolor="${c.before}" data-fblabel="ba_before" alt="before">
      <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="before after slider">
      <span class="ba-tag ba-tag-l">${t('ba_before')}</span>
      <span class="ba-tag ba-tag-r">${t('ba_after')}</span>
      <span class="ba-handle"></span>
    </div>`).join("");
  wrap.querySelectorAll(".ba").forEach(initBA);
}
function initBA(el){
  // fall back to colour placeholder if a before/after photo is missing
  el.querySelectorAll("img[data-fbcolor]").forEach(img=>{
    img.onerror = function(){ this.onerror=null; this.src = baSvg(this.dataset.fbcolor, t(this.dataset.fblabel)); };
  });
  const range = el.querySelector(".ba-range");
  const before = el.querySelector(".ba-before");
  const handle = el.querySelector(".ba-handle");
  const set = v=>{ before.style.clipPath="inset(0 "+(100-v)+"% 0 0)"; handle.style.left=v+"%"; };
  range.addEventListener("input", e=>set(e.target.value));
  set(50);
  // one-time auto-sweep when first scrolled into view (signals it's draggable)
  if(!window.matchMedia || !matchMedia("(prefers-reduced-motion: reduce)").matches){
    const demo = ()=>{
      el.classList.add("ba-anim");
      const steps = [82,22,50]; let i=0;
      const next = ()=>{ if(i>=steps.length){ el.classList.remove("ba-anim"); return; }
        const v=steps[i++]; range.value=v; set(v); setTimeout(next, 760); };
      setTimeout(next, 400);
    };
    if("IntersectionObserver" in window){
      const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ io.disconnect(); demo(); } }); }, {threshold:.4});
      io.observe(el);
    } else demo();
  }
}

/* ----- Booking ----- */
function renderBookOptions(){
  const sel = document.getElementById("f_service");
  if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = `<option value="">${t("f_select")}</option>` +
    PRICES.map(p=>`<option value="${p.n}">${p.n}</option>`).join("");
  if(cur) sel.value = cur;
}
function renderBookSlots(){
  // upcoming dates — "type or select" datalist
  const dl = document.getElementById("dateList");
  if(dl){
    const loc = LANG==="bn" ? "bn-BD" : "en-GB";
    let opts = "";
    for(let i=0;i<14;i++){
      const d = new Date(); d.setDate(d.getDate()+i);
      const label = `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
      const prefix = i===0 ? t("f_today")+" — " : i===1 ? t("f_tomorrow")+" — " : "";
      opts += `<option value="${prefix}${label}"></option>`;
    }
    dl.innerHTML = opts;
  }
  // clinic time slots (10:00 AM – 9:30 PM, 30-min)
  const tl = document.getElementById("timeList");
  if(tl){
    let opts = "";
    for(let m=600;m<=1290;m+=30){              // minutes from midnight
      let h=Math.floor(m/60), mi=m%60, ap=h<12?"AM":"PM", h12=h%12||12;
      opts += `<option value="${h12}:${String(mi).padStart(2,"0")} ${ap}"></option>`;
    }
    tl.innerHTML = opts;
  }
}
/* Human-readable name for a unit key, for the WhatsApp message. */
function unitLabelFor(key){
  const u = (UNITS.convert || []).filter(x => x.key === key)[0];
  return u ? (LANG === "bn" ? u.bn : u.en) : (key || "");
}

/* A form control that may not exist on every page that posts a booking. */
function fld(f, name){
  const el = f[name];
  return el && el.value ? String(el.value).trim() : "";
}

/* The area unit list is the SAME table the estimator and the converter read, so
   a booking can never arrive in a unit the site does not know. */
function renderAreaUnits(){
  const sel = document.getElementById("f_areaUnit");
  if (!sel) return;
  const list = (UNITS.convert || []);
  if (!list.length) return;
  const cur = sel.value;
  sel.innerHTML = list.map(u =>
    `<option value="${u.key}">${LANG === "bn" ? u.bn : u.en}</option>`).join("");
  sel.value = cur || UNITS.base || list[0].key;
}

function submitBooking(e){
  e.preventDefault();
  const f = e.target;
  if (f.f_consent && !f.f_consent.checked){ alert(t("consent_alert")); return; }
  const data = {
    name: f.f_name.value.trim(),
    phone: f.f_phone.value.trim(),
    service: f.f_service.value,
    date: f.f_date.value ? fmtPickedDate(f.f_date.value) : "",
    /* the raw YYYY-MM-DD as well: the dashboard needs a sortable date to file the
       booking as an upcoming appointment, and cannot parse the display form. */
    dateISO: f.f_date.value || "",
    time: f.f_time.value ? fmtPickedTime(f.f_time.value) : "",
    /* The old field asked "where are you coming from?" and its answer was parked in a
       note. It is the address now, and it travels as one all the way to the clinic's
       bookings sheet and the Address column of their records. */
    address: f.f_address ? f.f_address.value.trim() : "",
    /* Parcel identity. Always sent, empty when unknown: the Firestore rule
       whitelists exact keys, so omitting one is a rejected write, and a
       rejected write is swallowed by clinicSaveBooking's catch. */
    mouza:    fld(f, "f_mouza"),
    jl:       fld(f, "f_jl"),
    dag:      fld(f, "f_dag"),
    khatian:  fld(f, "f_khatian"),
    area:     fld(f, "f_area"),
    areaUnit: fld(f, "f_areaUnit"),
    district: fld(f, "f_district"),
    emerg: f.f_emerg.checked,
  };
  let lines = [
    "*Survey Request*",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.service ? `Service: ${data.service}` : "",
    data.date ? `Preferred date: ${data.date}` : "",
    data.time ? `Preferred time: ${data.time}` : "",
    data.emerg ? "⚠️ EMERGENCY / same-day requested" : "",
    data.address ? `Address: ${data.address}` : "",
    /* The parcel lines are what make the message actionable — a surveyor can
       price and schedule from a mouza and a dag without another round trip. */
    data.district ? `District: ${data.district}` : "",
    data.mouza ? `Mouza: ${data.mouza}${data.jl ? ` (JL ${data.jl})` : ""}` : "",
    data.dag ? `Dag: ${data.dag}` : "",
    data.khatian ? `Khatian: ${data.khatian}` : "",
    data.area ? `Area: ${data.area} ${unitLabelFor(data.areaUnit)}` : "",
  ].filter(Boolean);
  const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  const note = document.getElementById("bookSuccess");
  if(note){
    /* Always offer a tappable WhatsApp link as well as opening it automatically:
       phone browsers frequently block the popup, and until now that left the
       patient with nothing to press and the clinic with no message. */
    note.innerHTML = `<div>${escapeHtml(t("f_success"))}</div>`
      + `<a class="btn btn-wa" href="${url}" target="_blank" rel="noopener"`
      + ` style="display:inline-flex;align-items:center;gap:8px;margin-top:10px;width:auto;text-decoration:none">`
      + `${escapeHtml(t("f_send_wa"))}</a>`;
    note.style.display="block";
  }
  try{ if(window.clinicSaveBooking) window.clinicSaveBooking(data); }catch(e){}
  sendBookingAlert(data);
  window.open(url, "_blank");
}

/* Email the clinic about a new booking, via the owner's own Google Apps Script
   (see tools/booking-alert.gs). Off entirely when CLINIC_ALERT_URL is empty.

   Uses sendBeacon rather than fetch: window.open() runs immediately after this,
   so the page may go to the background or navigate, which cancels a normal
   request. A beacon is queued by the browser and delivered regardless. Apps
   Script sends no CORS headers, so this is a fire-and-forget text/plain post -
   there is no reply to read, and a failure must never disturb the booking. */
function sendBookingAlert(data){
  try{
    const url = (window.CLINIC_ALERT_URL || "").trim();
    if(!url) return;
    const payload = JSON.stringify({
      token: window.CLINIC_ALERT_TOKEN || "",
      name: data.name, phone: data.phone, service: data.service,
      date: data.date, time: data.time, address: data.address, emerg: !!data.emerg,
      /* The parcel is the whole point of the enquiry for a surveyor — without
         it the alert email says someone wants "a survey" somewhere. */
      district: data.district, mouza: data.mouza, jl: data.jl,
      dag: data.dag, khatian: data.khatian,
      area: data.area, areaUnit: data.areaUnit
    });
    if(navigator.sendBeacon){
      navigator.sendBeacon(url, new Blob([payload], {type:"text/plain;charset=UTF-8"}));
    }else{
      fetch(url, {method:"POST", mode:"no-cors", keepalive:true,
                  headers:{"Content-Type":"text/plain;charset=UTF-8"}, body:payload});
    }
  }catch(e){ /* an alert failing must not break the booking */ }
}

/* ----- Marquee ----- */
function renderMarquee(){
  const el = document.getElementById("marqueeTrack");
  if(!el) return;
  const items = SERVICES.map(s=>`<span>${LANG==="bn"?s.bn:s.en}</span>`).join("");
  el.innerHTML = items + items; // duplicate for seamless loop
}

/* ----- Counters ----- */
function animateCounters(){
  document.querySelectorAll(".stat-num").forEach(el=>{
    el.dataset.done = "1"; el.dataset.running = "1";
    const suffix = el.dataset.suffix||"";
    let n = 0;
    /* target is re-read every frame rather than captured once. The clinic's figures
       arrive from Firestore a second or so after load — usually while this count-up is
       still running — and a captured target would keep counting to the old number,
       overwriting them and settling on the stale value. */
    const tick = ()=>{
      const target = +el.dataset.target || 0;
      const step = Math.max(1, Math.ceil(target/60));
      n = Math.min(target, n+step);
      el.textContent = fmt(n)+suffix;
      if(n<target) requestAnimationFrame(tick);
      else delete el.dataset.running;
    };
    tick();
  });
}

/* The clinic edits these four figures in the dashboard; assets/booking-cloud.js calls
   this whenever the stored values change. The count-up is fired once by an
   IntersectionObserver, so values can arrive either side of it:
     - not animated yet -> move the target, and the count-up lands on the new number;
     - already animated -> set the text, since nothing will run again.
   Anything missing or not a number is ignored, so one bad field cannot blank a box. */
function clinicSetStats(vals){
  if(!vals) return;
  document.querySelectorAll(".stat-num[data-stat]").forEach(el=>{
    const v = vals[el.dataset.stat];
    if(v === undefined || v === null || v === "") return;
    const n = Number(v);
    if(!isFinite(n) || n < 0) return;
    el.dataset.target = String(n);
    if(el.dataset.stat === "surveys") STAT_SURVEYS = n;
    /* mid-animation the tick above will pick the new target up on its next frame;
       touching the text here would just fight with it. */
    if(el.dataset.done && !el.dataset.running) el.textContent = fmt(n) + (el.dataset.suffix||"");
  });
  applyStatCount();
}
window.clinicSetStats = clinicSetStats;

/* ----- Calendar + clock pickers on the booking date/time fields ----- */
function fmtPickedDate(v){            // v = "2026-06-28" -> "28-06-2026"
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v||"").trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : v;
}
function fmtPickedTime(v){            // v = "14:30" → "2:30 PM"
  const p=v.split(":"); let h=+p[0]; const m=p[1]||"00";
  const ap=h<12?"AM":"PM"; h=h%12; if(h===0)h=12;
  return `${h}:${m} ${ap}`;
}
function initBookPickers(){
  // native date/time inputs — block past dates on the calendar
  const d=document.getElementById("f_date");
  if(d && d.type==="date"){
    try{ const t=new Date();
      d.min = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
    }catch(e){}
    dressDateField(d);
  }
}

/* The browser draws <input type="date"> itself and takes the order from ITS OWN
   locale — a phone set to US English shows mm/dd/yyyy, and no CSS or lang attribute
   can reorder it. A patient reading mm/dd/yyyy and entering 05/09/2026 for 5
   September books 9 May, and nobody finds out until they fail to arrive.

   So: show our own DD-MM-YYYY text and lay the real input over it at zero opacity.
   Taps land on the native field, so the OS calendar still opens with no showPicker()
   to depend on, and f_date.value stays ISO for submitBooking(), dateISO and min.

   Built here rather than in book.html's markup on purpose. This is a patient-facing
   form: if this script never runs, the visitor is left with the plain native input
   that works today, instead of an empty span where the date field should be. */
function dressDateField(input){
  try{
    if(!input || input.parentElement?.classList.contains("datebox")) return;
    const box = document.createElement("span");
    box.className = "datebox";
    const txt = document.createElement("span");
    txt.className = "datebox-txt dt-ph";
    txt.textContent = "DD-MM-YYYY";
    input.parentNode.insertBefore(box, input);
    box.appendChild(txt);
    box.appendChild(input);

    const paint = ()=>{
      const v = input.value || "";
      txt.textContent = v ? fmtPickedDate(v) : "DD-MM-YYYY";
      txt.className = v ? "datebox-txt" : "datebox-txt dt-ph";
    };
    input.addEventListener("change", paint);
    input.addEventListener("input", paint);
    paint();                       // setting .value in code fires no event
  }catch(e){ /* leave the native field alone rather than break the form */ }
}

/* ----- Wire up ----- */
document.addEventListener("DOMContentLoaded", ()=>{
  applyI18n();
  applyHeroBg();
  loadGoogleReviews(); // fetch real Google reviews (Featurable) → overlays when it resolves
  initBookPickers();
  // prefill booking-page treatment from ?service=
  try{ const q=new URLSearchParams(location.search).get("service"); const sel=document.getElementById("f_service");
    if(q&&sel&&[...sel.options].some(o=>o.value===q)) sel.value=q; }catch(e){}
  renderBA("all");

  document.getElementById("langToggle")?.addEventListener("click", ()=> setLang(LANG==="en"?"bn":"en"));
  // service catalog "Book Now" → prefill booking
  document.getElementById("servicesGrid")?.addEventListener("click", (e)=>{
    const a = e.target.closest(".svc-book");
    if(!a) return;
    const sel = document.getElementById("f_service");
    if(sel && a.dataset.service) sel.value = a.dataset.service;
  });

  document.getElementById("calcCategory")?.addEventListener("change", renderCalcServices);
  document.getElementById("calcService")?.addEventListener("change", updateCalc);
  document.getElementById("calcQty")?.addEventListener("change", updateCalc);
  document.getElementById("calcQty")?.addEventListener("input", updateCalc);
  document.getElementById("calcBook")?.addEventListener("click", function(){
    const svc = this.dataset.service ? "?service="+encodeURIComponent(this.dataset.service) : "";
    window.location.href = "book.html"+svc;
  });
  document.getElementById("bookForm")?.addEventListener("submit", submitBooking);
  document.getElementById("callbackForm")?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const num  = document.getElementById("cbNumber").value.trim();
    const name = (document.getElementById("cbName")||{}).value?.trim() || "";
    /* Same shape as a booking so it lands in the dashboard's Website Bookings
       panel with no dashboard changes. `service` is what that panel shows as the
       second line, so it doubles as the label that marks this as a callback. */
    const data = {
      name, phone: num, service: "📞 Call back request",
      date: "", dateISO: "", time: "", msg: "", emerg: false, kind: "callback"
    };
    const msg = [
      "📞 *Callback request*",
      name ? `Name: ${name}` : "",
      `Please call me back at: ${num}`
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;

    const note = document.getElementById("cbSuccess");
    if(note){
      // the popup below is blocked often enough on phones that a tappable link matters
      note.innerHTML = `<div>${escapeHtml(t("cb_success"))}</div>`
        + `<a class="btn btn-wa" href="${url}" target="_blank" rel="noopener"`
        + ` style="display:inline-flex;align-items:center;gap:8px;margin-top:10px;width:auto;text-decoration:none">`
        + `${escapeHtml(t("f_send_wa"))}</a>`;
      note.style.display = "block";
    }
    try{ if(window.clinicSaveBooking) window.clinicSaveBooking(data); }catch(err){}
    sendBookingAlert(data);
    window.open(url, "_blank");
  });

  document.querySelectorAll(".ba-filter").forEach(b=>{
    b.addEventListener("click", ()=>{
      document.querySelectorAll(".ba-filter").forEach(x=>x.classList.remove("active"));
      b.classList.add("active"); renderBA(b.dataset.filter);
    });
  });

  // mobile nav
  const burger = document.getElementById("burger");
  const navlist = document.getElementById("navlist");
  burger?.addEventListener("click", ()=> navlist.classList.toggle("open"));
  navlist?.querySelectorAll("a:not(.dd-toggle)").forEach(a=>a.addEventListener("click", ()=>navlist.classList.remove("open")));
  navlist?.querySelectorAll(".dd-menu a").forEach(a=>a.addEventListener("click", ()=>navlist.classList.remove("open")));
  // services dropdown toggle (click on mobile, hover on desktop)
  const hasDD = document.querySelector(".has-dd");
  const ddToggle = document.querySelector(".dd-toggle");
  ddToggle?.addEventListener("click", e => {
    if(window.innerWidth <= 760){ e.preventDefault(); hasDD.classList.toggle("open"); }
  });
  document.addEventListener("click", e => { if(hasDD && !hasDD.contains(e.target)) hasDD.classList.remove("open"); });

  // counters when visible
  const stats = document.getElementById("stats");
  if(stats){
    const ob = new IntersectionObserver((ent)=>{ if(ent[0].isIntersecting){ animateCounters(); ob.disconnect(); }},{threshold:.4});
    ob.observe(stats);
  }

  // scroll progress bar + back-to-top
  const bar = document.getElementById("scrollbar");
  const toTop = document.getElementById("toTop");
  const onScroll = ()=>{
    const h = document.documentElement;
    const sc = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    if(bar) bar.style.width = (max>0 ? (sc/max*100) : 0) + "%";
    if(toTop) toTop.classList.toggle("show", sc > 600);
  };
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  toTop?.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));

  // scroll reveal — above-fold elements animate immediately; below-fold on scroll
  const revealEls = document.querySelectorAll(".sec-head, .svc-card, .step-card, .tech-card, .test-card, .tip-card, .ci-row, .why-art, .doc-photo, .hero-photo, .calc-card, .calc-ba");
  revealEls.forEach(el=>el.classList.add("reveal"));
  const rob = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); rob.unobserve(e.target); }});
  },{threshold:.12});
  let stagger = 0;
  revealEls.forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight){
      setTimeout(()=>el.classList.add("in"), stagger);
      stagger += 80;
    } else {
      rob.observe(el);
    }
  });

  // WhatsApp Live Chat Widget
  (function initWaChat(){
    const bubble = document.getElementById("waBubble");
    const popup  = document.getElementById("waPopup");
    const closeBtn = document.getElementById("waClose");
    const start  = document.getElementById("waStart");
    if(!bubble||!popup) return;
    function openPopup(){ popup.classList.add("open"); popup.setAttribute("aria-hidden","false"); bubble.classList.add("active"); }
    function closePopup(){ popup.classList.remove("open"); popup.setAttribute("aria-hidden","true"); bubble.classList.remove("active"); }
    bubble.addEventListener("click", ()=> popup.classList.contains("open") ? closePopup() : openPopup());
    closeBtn?.addEventListener("click", closePopup);
    popup.querySelectorAll(".wcp-chip").forEach(chip=>{
      chip.addEventListener("click", ()=>{
        const key = chip.dataset.msg;
        const msgs = LANG==="bn" ? WA_MSGS_BN : WA_MSGS;
        /* Reads config like every other WhatsApp link on the site. This one was
           a literal placeholder, and apply-config only rewrites .html — so on a
           forked site the floating chat widget silently led nowhere, which is
           the most-pressed control on a phone. */
        if(start) start.href = `https://wa.me/${CONTACT.whatsapp}?text=` + encodeURIComponent(msgs[key]||"");
        start?.click();
      });
    });
  })();

  // ── Site-wide search ─────────────────────────────────────────────────────
  (function initSearch(){
    var srchOverlay = document.getElementById("srch-overlay");
    var srchInput   = document.getElementById("srch-input");
    var srchResults = document.getElementById("srch-results");
    var srchBtn     = document.getElementById("srch-btn");
    var srchClose   = document.getElementById("srch-close");
    if(!srchOverlay) return;

    var ROOT = (document.querySelector('meta[name="page-root"]')||{}).content || "";
    var searchIdx = null;
    var debTimer  = null;
    var activeIdx = -1;

    function buildIndex(){
      var idx = [];
      SERVICES.forEach(function(s){
        idx.push({type:"service",icon:s.icon,label:LANG==="bn"?s.bn:s.en,sub:LANG==="bn"?(s.cn||s.cne||""):(s.cne||s.cn||""),price:s.pr,url:ROOT+"services/"+s.slug+".html",kw:[s.en,s.bn,s.cne||"",s.cn||"",s.de,s.db].join(" ")});
      });
      PRICES.forEach(function(p){
        var pr = "৳"+p.min+(p.max&&p.max!==p.min?"–"+p.max:"");
        idx.push({type:"price",label:LANG==="bn"?p.nb:p.n,price:pr,url:ROOT+"index.html#pricing",kw:[p.n,p.nb,p.note||"",p.noteb||""].join(" ")});
      });
      FAQS.forEach(function(f){
        idx.push({type:"faq",label:LANG==="bn"?f.qb:f.qe,sub:(LANG==="bn"?f.ab:f.ae).substring(0,90)+"…",url:ROOT+"index.html#faq",kw:[f.qe,f.ae,f.qb,f.ab].join(" ")});
      });
      POSTS.forEach(function(p){
        idx.push({type:"blog",label:LANG==="bn"?p.tb:p.te,sub:LANG==="bn"?p.eb:p.ee,url:ROOT+"blog/"+p.slug+".html",kw:[p.te,p.ee,p.tb,p.eb].join(" ")});
      });
      TECH.forEach(function(tc){
        idx.push({type:"tech",label:LANG==="bn"?tc.bn:tc.en,sub:LANG==="bn"?tc.db:tc.de,url:ROOT+"index.html#tech",kw:[tc.en,tc.bn,tc.de,tc.db].join(" ")});
      });
      return idx;
    }

    function runSearch(q){
      if(!q.trim()) return [];
      var ql = q.toLowerCase();
      return searchIdx.filter(function(r){
        return r.label.toLowerCase().includes(ql) || r.kw.toLowerCase().includes(ql);
      }).sort(function(a,b){
        return (a.label.toLowerCase().includes(ql)?0:1)-(b.label.toLowerCase().includes(ql)?0:1);
      }).slice(0,18);
    }

    var TYPE_ICONS = {service:"📄",price:"💰",faq:"❓",blog:"📄",tech:"⚙️"};
    var TYPE_KEY   = {service:"srch_services",price:"srch_pricing",faq:"srch_faq",blog:"srch_blog",tech:"srch_tech"};

    function renderResults(results){
      activeIdx = -1;
      if(!results.length){
        srchResults.innerHTML = '<div class="srch-empty">'+t("srch_empty")+'</div>';
        return;
      }
      var grouped = {};
      results.forEach(function(r){ (grouped[r.type]=grouped[r.type]||[]).push(r); });
      var html = "";
      Object.keys(grouped).forEach(function(type){
        html += '<div class="srch-group-label">'+t(TYPE_KEY[type]||type)+'</div>';
        grouped[type].forEach(function(r,i){
          var dataIdx = results.indexOf(r);
          html += '<a class="srch-item" href="'+r.url+'" data-idx="'+dataIdx+'">'
               +'<span class="srch-item-icon">'+(r.icon||TYPE_ICONS[r.type]||"•")+'</span>'
               +'<span class="srch-item-body">'
               +'<span class="srch-item-label">'+r.label+'</span>'
               +(r.sub?'<span class="srch-item-sub">'+r.sub+'</span>':'')
               +'</span>'
               +(r.price?'<span class="srch-item-price">'+r.price+'</span>':'')
               +'</a>';
        });
      });
      srchResults.innerHTML = html;
    }

    function openSearch(){
      if(!searchIdx) searchIdx = buildIndex();
      srchOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
      srchInput.value = "";
      srchResults.innerHTML = "";
      srchInput.focus();
      srchInput.placeholder = t("srch_ph");
      document.getElementById("srch-hint-txt") && (document.getElementById("srch-hint-txt").textContent = t("srch_hint"));
    }
    function closeSearch(){
      srchOverlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    srchBtn && srchBtn.addEventListener("click", openSearch);
    srchClose && srchClose.addEventListener("click", closeSearch);
    srchOverlay.addEventListener("click", function(e){ if(e.target===srchOverlay) closeSearch(); });

    srchInput && srchInput.addEventListener("input", function(){
      clearTimeout(debTimer);
      debTimer = setTimeout(function(){
        if(!searchIdx) searchIdx = buildIndex();
        renderResults(runSearch(srchInput.value));
      }, 180);
    });

    // keyboard navigation
    document.addEventListener("keydown", function(e){
      if((e.ctrlKey||e.metaKey) && e.key==="k"){ e.preventDefault(); openSearch(); return; }
      if(!srchOverlay.classList.contains("open")) return;
      var items = srchResults.querySelectorAll(".srch-item");
      if(e.key==="Escape"){ closeSearch(); return; }
      if(e.key==="ArrowDown"){ e.preventDefault(); activeIdx=Math.min(activeIdx+1,items.length-1); }
      else if(e.key==="ArrowUp"){ e.preventDefault(); activeIdx=Math.max(activeIdx-1,-1); }
      else if(e.key==="Enter" && activeIdx>=0){ e.preventDefault(); items[activeIdx]?.click(); return; }
      else return;
      items.forEach(function(it,i){ it.classList.toggle("srch-active",i===activeIdx); });
      items[activeIdx]?.scrollIntoView({block:"nearest"});
    });
  })();

  // Google Review QR Code
  setTimeout(()=>{
    const qrEl = document.getElementById("reviewQRCode");
    if(qrEl && window.QRCode && reviewUrl()){
      new QRCode(qrEl, {
        text: reviewUrl(),
        width:128, height:128,
        colorDark:"#13294e", colorLight:"#ffffff"
      });
    }
  }, 600);
});

/* Private admin gateway moved to assets/admin-gate.js so it works on every
   page (26 of 28 public pages do not load this file). */
