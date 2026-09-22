/* Khulna Divisional Digital Surveyors Association — send website enquiries to Firestore so they appear live in the
   admin dashboard's "Website Bookings" panel.

   This used to be an inline module in book.html, which meant only the booking
   page could reach Firestore. The homepage's "Request a Free Callback" form had
   nowhere to put the number it collected, so every callback request was lost the
   moment the visitor closed WhatsApp. Sharing one file gives both pages the same
   path with no duplicated bootstrap to drift apart.

   Callbacks are written to the SAME `bookings` collection as appointments, on
   purpose: the published Firestore rules already allow a public create there and
   nowhere else, and the dashboard already renders that collection. A separate
   collection would need new rules published by the owner and new dashboard code.
   `kind` tells the two apart for anyone querying later.

   Fails silently throughout. If Firebase is unreachable, blocked, or not yet
   configured, the WhatsApp hand-off still happens exactly as before. */
(async () => {
  try {
    const cfg = window.CLINIC_FB;
    if (!cfg || !cfg.apiKey) return;

    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");
    const { getFirestore, collection, addDoc, serverTimestamp, doc, onSnapshot } =
      await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js");

    const fbApp = initializeApp(cfg);

    // App Check (only if a reCAPTCHA v3 site key is configured) — must come before Firestore
    const acKey = (window.CLINIC_APPCHECK_KEY || "").trim();
    if (acKey) {
      try {
        const acMod = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app-check.js");
        acMod.initializeAppCheck(fbApp, {
          provider: new acMod.ReCaptchaV3Provider(acKey),
          isTokenAutoRefreshEnabled: true
        });
      } catch (e) { /* App Check unavailable — enforcement must be off */ }
    }

    const db = getFirestore(fbApp);

    window.clinicSaveBooking = async (data) => {
      try {
        await addDoc(collection(db, "bookings"), {
          name: data.name || "", phone: data.phone || "", service: data.service || "",
          date: data.date || "", dateISO: data.dateISO || "",
          time: data.time || "",
          /* `note` is kept for the callback form and for anything written before the
             booking form started asking for an address. */
          address: data.address || "", note: data.msg || "",
          /* Parcel identity, ALWAYS written even when empty.
             firestore.rules lists these in hasOnly and then type-checks each
             one, and a type check requires the field to be present — so the
             homepage callback form, which asks for none of them, would be
             rejected if they were merged in conditionally. A rejected write is
             swallowed by the catch below, so it would fail in total silence. */
          mouza:    data.mouza    || "",
          jl:       data.jl       || "",
          dag:      data.dag      || "",
          khatian:  data.khatian  || "",
          area:     data.area     || "",
          areaUnit: data.areaUnit || "",
          district: data.district || "",
          emergency: !!data.emerg, status: "new", source: "website",
          kind: data.kind || "appointment",
          createdAt: serverTimestamp()
        });
      } catch (e) { /* offline / rules — the enquiry already went via WhatsApp */ }
    };

    /* The homepage's four figures (Happy Patients, Years, Services, Satisfaction) are
       edited by the clinic in the dashboard and stored in site/stats. onSnapshot means a
       save there reaches every open homepage in about a second, with no rebuild.

       If this never resolves — Firebase blocked, offline, rules not published yet — the
       page keeps the data-target values written into index.html, so the numbers are
       always right-ish rather than zero. */
    try {
      /* checked inside the callback, not around it: this file is ordered before
         assets/app.js, so clinicSetStats may not exist yet when we subscribe. */
      onSnapshot(doc(db, "site", "stats"), (snap) => {
        if (snap.exists() && window.clinicSetStats) window.clinicSetStats(snap.data());
      }, () => { /* rules not published yet — keep the built-in numbers */ });
    } catch (e) { /* ignore */ }
  } catch (e) { /* SDK blocked — everything still works via WhatsApp */ }
})();
