# Deploying a new clinic

Target: **one working day** from fork to live site, for a clinic that has its
content ready. Steps 1–5 are about 40 minutes. Step 6 onward is content, and
content is what actually takes the day.

Work top to bottom. Every step that can fail silently says so and tells you how
to prove it worked — a clinic site fails quietly by design (a broken booking
button looks identical to a working one until nobody calls).

---

## 1. Fork and name it

```bash
git clone https://github.com/podenapata-sys/clinic-site-template.git smilecare
cd smilecare
rm -rf .git && git init
```

Name the repo after the clinic, lowercase, hyphens between words, **and never
with a trailing hyphen** — `smilecare-dental`, not `SmileCare-Dental-`. On a
GitHub Pages project site the repo name becomes part of the public URL, and
changing it later means re-issuing every link the clinic has handed out.

---

## 2. Fill in the config

`assets/clinic.config.js` is the only file you must edit. Work through it top to
bottom; every field has a comment saying where it surfaces.

The four that break the site if wrong:

| Field | Why it matters |
|---|---|
| `site.baseUrl` | Every canonical URL, share image and sitemap entry. No trailing slash. |
| `contact.whatsapp` | Digits only, no `+`. Every booking button on the site. |
| `geo.lat` / `geo.lng` | All three map links are derived from this one pair. |
| `brand.primary` | The whole colour scheme, plus the Android browser chrome tint. |

Then check it before you touch anything else:

```bash
npm run check
```

It refuses to pass while any placeholder remains. That is deliberate — the
failure it prevents is a clinic going live with `example.com` in its canonical
tags, which quietly tells Google the real site is a copy of something else.

---

## 3. Clear out the previous clinic

If you forked from a **built client site** rather than the clean template, its
name is still in the body copy, the nav and the alt text:

```bash
npm run rename -- --from "Khulna Divisional Digital Surveyors Association" --dry-run   # read the report first
npm run rename -- --from "Khulna Divisional Digital Surveyors Association"
```

It will not touch email addresses — rewriting `hello@example.com` into an
address nobody owns would send every booking into a mailbox that does not exist.
It lists the ones it found so you can point them at the clinic by hand.

---

## 4. Write the config into the pages

```bash
npm run apply
```

This rewrites titles, descriptions, canonical tags, every `og:`/`twitter:` tag,
the `mailto:` links, the JSON-LD business block, `sitemap.xml` and `robots.txt`.

It is idempotent — run it as often as you like. Run it again after **any**
config change, and always immediately before deploying.

Prove it worked:

```bash
grep -c "$(node scripts/apply-config.mjs --print-base-url)" sitemap.xml
grep -riE 'example\.(com|github)|PASTE_THE' . --include=*.html --include=*.js --include=*.rules
```

The second command must print **nothing**.

---

## 5. Swap the assets

Replace in `assets/`:

- `logo.png` — the clinic's logo, transparent background
- `mark-square.png` — square version, becomes the favicon and social avatar
- `hero-portrait.jpg` — the main homepage image
- `doctor.jpg` — the practitioner

**Delete every image in `assets/ba/` and `assets/services/` that came from
another clinic.** Those are real patients. Consent to appear on their own
dentist's website is not consent to appear on someone else's, and in most places
that is a legal problem for your client, not just an ethical one for you. Set
`features.beforeAfter: false` until the new clinic supplies its own consented
photos.

---

## 6. Firebase (bookings + dashboard)

Skip this entirely if the clinic only wants WhatsApp bookings — the site works
without it. The dashboard and the website-bookings panel need it.

1. Create a project at console.firebase.google.com. Spark (free) is enough.
2. Add a **Web app**, copy the config block into `assets/firebase-config.js`.
3. **Authentication → Sign-in method →** enable Email/Password.
4. **Authentication → Users →** add the clinic's account. Copy its **User UID**.
5. **Authentication → Settings → User actions →** untick **Enable create**.
6. Paste the UID into `ownerUid()` in `firestore.rules`.
7. **Firestore Database →** create it, then **Rules →** paste `firestore.rules`
   in and Publish.

> Steps 4–6 are not optional. Firebase enables public self-registration by
> default, so a rule of `request.auth != null` lets anyone who signs up read
> every patient name, phone number and treatment record in the project. Read the
> header comment in `firestore.rules` before you change anything in it.

Prove it worked: open the site in a **private window**, submit a test booking,
and confirm it appears in the dashboard. Then, still in that private window,
open the browser console and try to read the bookings collection — it must be
denied.

---

## 7. Booking alert emails

Optional, free, and the thing clinics notice most — it turns a booking into a
phone notification.

Follow the setup block at the top of `tools/booking-alert.gs`. Two things there
are **not** web content and are not touched by `npm run apply`:

- `TO_EMAIL` — who gets the alerts
- `SHARED_TOKEN` — must match `EXAMPLE_ALERT_TOKEN` in `assets/firebase-config.js`

Then run `checkAlertSetup()` from the Apps Script editor. It prints who it will
email, the token the site must send, and how much of the daily quota is left.

---

## 8. Deploy

**GitHub Pages** — push to `main`; `.github/workflows/pages.yml` does the rest.
Settings → Pages → Source: GitHub Actions.

**Custom domain** — add a `CNAME` file containing just the domain, point DNS at
GitHub, then set `site.baseUrl` to `https://thatdomain.com` and run
`npm run apply` again. Do it in that order: the canonical tags must not point at
a domain that is not live yet.

**Netlify / Vercel** — drag the folder in, or connect the repo. No build
command, publish directory `.`.

### After any domain change, do these two or bookings stop

1. **reCAPTCHA** — google.com/recaptcha/admin → add the new domain to the key's
   domain list. App Check rejects every token from an unlisted domain, and
   `exampleSaveBooking` swallows the error, so bookings just stop with nothing on
   screen.
2. **Firebase** — Authentication → Settings → Authorised domains → add it, or
   the dashboard login fails.

---

## 9. Final check before you hand it over

Open the live site on a **phone**, not a desktop window scaled down, and:

- [ ] Tap **Book Appointment** → WhatsApp opens to the clinic's real number
- [ ] Tap the phone number → the dialer opens with the right number
- [ ] Tap the map → directions to the right building
- [ ] Submit a real booking → it reaches the dashboard **and** the alert inbox
- [ ] Switch the language toggle → the whole page changes, nothing is left in English
- [ ] Paste the URL into WhatsApp → the preview shows the clinic's name and logo
- [ ] Run `npm run check` one last time → passes with no warnings you have not read

The WhatsApp preview is the one people skip. It is also the one the clinic will
see first, because the first thing they do with the link is send it to someone.
