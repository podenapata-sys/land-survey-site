#!/usr/bin/env node
/* ============================================================================
   apply-config — write assets/clinic.config.js into every page.
   ============================================================================

   Run after editing the config:   npm run apply
   Validate without writing:       npm run check
   See the diff first:             npm run apply -- --dry-run

   WHAT IT TOUCHES, and nothing else:
     <title>, <meta name="description|keywords|theme-color">
     <link rel="canonical">, every og:* / twitter:* tag
     the LocalBusiness JSON-LD block (regenerated whole, not patched field by
     field — patching lets the address drift out of step with the geo)
     sitemap.xml and robots.txt (rebuilt from the page list)
     the ?v= cache-buster on local css/js

   It is IDEMPOTENT. Running it twice produces the same bytes as running it
   once, so it is safe in a pre-deploy hook and safe to run after every content
   edit. Body copy is never touched — that is the clinic's, not the config's.
   ========================================================================== */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT   = join(dirname(fileURLToPath(import.meta.url)), "..");
/* The practitioner block. `doctor` is the name this key had while the template
   was clinic-only; a delivered client site still carries it, so both are read
   and neither has to be migrated in a hurry. */
const PRAC = (c) => (c && (c.practitioner || c.doctor)) || null;

const ARGV   = process.argv.slice(2);
const DRY    = ARGV.includes("--dry-run");
const CHECK  = ARGV.includes("--check");

/* Directories that never contain pages we own. */
const SKIP_DIRS = new Set(["node_modules", ".git", "assets", ".github", "scripts"]);

/* ---- load the config the same way a browser would -------------------- */
function loadConfig() {
  const path = join(ROOT, "assets", "clinic.config.js");
  if (!existsSync(path)) fail(`assets/clinic.config.js is missing.`);
  const sandbox = {};
  /* The file is `window.CLINIC = (function(){...})()`. Evaluating it with a
     fake `window` is enough and avoids a JSON duplicate of the same data that
     would immediately drift. */
  new Function("window", readFileSync(path, "utf8"))(sandbox);
  if (!sandbox.CLINIC) fail("clinic.config.js did not set window.CLINIC.");
  return sandbox.CLINIC;
}

function fail(msg) { console.error(`\n  ERROR  ${msg}\n`); process.exit(1); }

/* ---- validate before writing anything -------------------------------------
   A template's failure mode is a clinic going live with example.com in its
   canonical tags and the placeholder WhatsApp number on the booking button.
   Every one of these has a visible, revenue-losing symptom, so they are hard
   errors rather than warnings.                                             */
function validate(c) {
  const errs = [], warns = [];

  const base = c.site?.baseUrl || "";
  if (!base)                       errs.push("site.baseUrl is empty.");
  if (base.endsWith("/"))          errs.push("site.baseUrl must not end with a trailing slash.");
  if (!/^https:\/\//.test(base))   errs.push("site.baseUrl must start with https:// — Firebase Auth and the camera/geolocation APIs refuse plain http.");
  if (/example\.(com|github\.io)/.test(base))
    errs.push("site.baseUrl is still the placeholder. Set it to the real deploy URL before launch.");

  const wa = c.contact?.whatsapp || "";
  if (!wa)                         errs.push("contact.whatsapp is empty — every booking button on the site is dead without it.");
  else if (!/^\d{8,15}$/.test(wa)) errs.push(`contact.whatsapp must be digits only, no "+" and no spaces (got "${wa}"). wa.me rejects anything else.`);
  else if (/X/i.test(wa))          errs.push("contact.whatsapp is still the placeholder.");

  if (/X/i.test(c.contact?.phone || ""))     errs.push("contact.phone is still the placeholder.");
  if (/example\.com/.test(c.contact?.email || "")) errs.push("contact.email is still the placeholder.");
  if (/^Example /.test(c.name || ""))        errs.push("clinic name is still the placeholder.");
  /* These reach the JSON-LD, where a placeholder is not merely untidy: Google
     reads it as the business's real registered name and street. */
  if (/^Example /.test(c.legalName || ""))   errs.push("legalName is still the placeholder.");
  if (/^Street address/.test(c.address?.street || ""))
                                             errs.push("address.street is still the placeholder.");
  /* These guards were written against the dental template's placeholders, so
     /^Dr\. Example/ never fired for "Md. Example Rahman" and the whole
     practitioner block shipped ungated. They are hard errors now rather than
     warnings because this copy is visible on the homepage, not just JSON-LD. */
  if (/\bExample\b/.test(PRAC(c)?.name || ""))
                                             errs.push("practitioner.name is still the placeholder.");
  if (/^(Licensed Surveyor \(Amin\)|Dentist|Example)/.test(PRAC(c)?.title || ""))
                                             errs.push("practitioner.title is still the placeholder.");
  if (/Licence No\. 0+\b|Reg\. No\. 0+\b|replace with the real/i.test(PRAC(c)?.credentials || ""))
                                             errs.push("practitioner.credentials still carries the placeholder licence number.");

  const { lat, lng } = c.geo || {};
  if (typeof lat !== "number" || typeof lng !== "number")
    errs.push("geo.lat / geo.lng must be numbers.");
  else if (Math.abs(lat) > 90 || Math.abs(lng) > 180)
    errs.push("geo.lat / geo.lng are out of range — you may have them swapped.");

  for (const d of c.description ? Object.keys(c.description) : []) {
    if (/Example (Dental|Land Survey|Clinic)/i.test(c.description[d] || ""))
      errs.push(`description.${d} still names the placeholder clinic — it ships straight into <meta description> and og:description.`);
    if (/^(A short paragraph|Years practising)/.test(PRAC(c)?.bio?.[d] || ""))
      warns.push(`doctor.bio.${d} is still the placeholder text.`);
    const len = (c.description[d] || "").length;
    if (len > 160) warns.push(`description.${d} is ${len} chars — Google truncates past ~155.`);
  }
  if (c.features?.beforeAfter)
    warns.push("features.beforeAfter is ON. Ship it only with the client's written consent for each plot shown, and redact plot identifiers.");
  if (!c.brand?.ogImage) warns.push("brand.ogImage is unset — links will share with no preview image.");

  return { errs, warns };
}

/* ---- helpers --------------------------------------------------------- */
const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".") || SKIP_DIRS.has(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (entry.endsWith(".html")) out.push(p);
  }
  return out;
}

/* A page's public URL. index.html serves as the directory itself, so
   blog/index.html is .../blog/ — emitting both that and .../blog/index.html
   in the sitemap is a duplicate-content signal. */
function pageUrl(base, file) {
  const rel = relative(ROOT, file).split(sep).join("/");
  return rel === "index.html" ? `${base}/`
       : rel.endsWith("/index.html") ? `${base}/${rel.slice(0, -"index.html".length)}`
       : `${base}/${rel}`;
}

/* Replace a tag's attribute in place, or report that it was absent. Returns
   the new html; never inserts, because where a missing tag belongs depends on
   the page and a wrong guess is worse than leaving it out. */
function setAttr(html, pattern, value, seen, label) {
  let hit = false;
  const next = html.replace(pattern, (m, pre, _old, post) => {
    hit = true; return `${pre}${esc(value)}${post}`;
  });
  if (hit) seen.add(label);
  return next;
}

/* schema.org types that actually accept the medical vocabulary. Anything else
   — ProfessionalService, LocalBusiness, HomeAndConstructionBusiness — must not
   carry medicalSpecialty or a Physician employee. */
const MEDICAL_TYPES = new Set([
  "Dentist", "Physician", "MedicalClinic", "MedicalBusiness", "Hospital",
  "Pharmacy", "Optician", "VeterinaryCare", "MedicalOrganization",
]);

/* ---- the JSON-LD block ------------------------------------------------ */
function buildJsonLd(c) {
  const base = c.site.baseUrl;
  const abs  = p => p ? (/^https?:/.test(p) ? p : `${base}/${String(p).replace(/^\//, "")}`) : undefined;

  const node = {
    "@context": "https://schema.org",
    "@type": c.type || "Dentist",
    name: c.name,
    legalName: c.legalName || undefined,
    image: abs(c.brand?.ogImage || c.brand?.logo),
    logo:  abs(c.brand?.logo),
    url:   `${base}/`,
    email: c.contact?.email || undefined,
    telephone: c.contact?.phoneIntl || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress:   c.address?.street || undefined,
      addressLocality: c.address?.locality || undefined,
      addressRegion:   c.address?.region || undefined,
      postalCode:      c.address?.postcode || undefined,
      addressCountry:  c.address?.country || undefined,
    },
    geo: { "@type": "GeoCoordinates", latitude: c.geo?.lat, longitude: c.geo?.lng },
    hasMap: c.maps?.view || undefined,
    openingHoursSpecification: (c.hours || []).map(h => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.length === 1 ? h.days[0] : h.days,
      opens: h.opens, closes: h.closes,
    })),
    sameAs: [c.contact?.facebook, c.contact?.instagram].filter(Boolean),
    /* medicalSpecialty and Physician are medical-vocabulary terms. On a
       non-medical @type they are invalid and Search Console reports them, so
       a land surveyor or a law practice gets knowsAbout and a plain Person
       instead. Everything else about the node is identical. */
    ...(MEDICAL_TYPES.has(c.type)
      ? { medicalSpecialty: c.specialty || undefined }
      : { knowsAbout: c.specialty || undefined }),
    employee: PRAC(c)?.name ? {
      "@type": MEDICAL_TYPES.has(c.type) ? "Physician" : "Person",
      name: PRAC(c).name,
      jobTitle: PRAC(c).title || undefined,
      ...(MEDICAL_TYPES.has(c.type)
        ? { medicalSpecialty: PRAC(c).specialty || c.specialty || undefined }
        : { knowsAbout: PRAC(c).specialty || c.specialty || undefined }),
    } : undefined,
  };
  if (!node.sameAs.length) delete node.sameAs;

  /* Drop empty branches — an address of all-undefined still renders as an
     empty PostalAddress and Google flags it as an incomplete entity. */
  const prune = o => {
    if (Array.isArray(o)) return o.map(prune);
    if (o && typeof o === "object") {
      const out = {};
      for (const [k, v] of Object.entries(o)) {
        const pv = prune(v);
        const empty = pv === undefined || pv === "" ||
          (pv && typeof pv === "object" && !Array.isArray(pv) &&
           Object.keys(pv).filter(x => x !== "@type").length === 0);
        if (!empty) out[k] = pv;
      }
      return out;
    }
    return o;
  };
  return JSON.stringify(prune(node), null, 2);
}

/* ---- rewrite one page ------------------------------------------------- */
function applyToPage(c, file, report) {
  const original = readFileSync(file, "utf8");
  let html = original;
  const base  = c.site.baseUrl;
  const url   = pageUrl(base, file);
  const isHome = relative(ROOT, file) === "index.html";
  /* The <head> is static; the language toggle only rewrites the body. So the
     crawlable title/description must be in the language you want INDEXED, which
     is not always the one a visitor sees first. metaLang controls the head,
     defaultLang controls the first paint. */
  const lang  = c.site.metaLang || c.site.defaultLang || "en";
  const seen  = new Set();

  const ogImg = c.brand?.ogImage
    ? `${base}/${String(c.brand.ogImage).replace(/^\//, "")}`
    : "";

  /* Only the homepage gets the config's title verbatim; inner pages keep their
     own <title> (they describe a service, not the clinic) and only have the
     clinic name after the dash corrected. */
  if (isHome) {
    const title = `${c.name} — ${c.tagline?.[lang] || c.tagline?.en || ""}`.replace(/ — $/, "");
    html = setAttr(html, /(<title>)([\s\S]*?)(<\/title>)/i, title, seen, "title");
    html = setAttr(html,
      /(<meta\s+name="description"\s+content=")([^"]*)(")/i,
      c.description?.[lang] || c.description?.en || "", seen, "description");
  } else {
    html = html.replace(/(<title>[\s\S]*?—\s*)([^<—]+)(<\/title>)/i, (m, pre, old, post) => {
      seen.add("title-suffix"); return `${pre}${esc(c.name)}${post}`;
    });
  }

  /* og:* mirror the page's own title/description. Missing these was silently
     shipping the previous clinic's name to every Facebook and WhatsApp share —
     the exact surface a clinic actually gets traffic from. */
  const ogTitle = isHome
    ? `${c.name} — ${c.tagline?.[lang] || c.tagline?.en || ""}`.replace(/ — $/, "")
    : (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || c.name).trim();
  const ogDesc = isHome
    ? (c.description?.[lang] || c.description?.en || "")
    : (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || "");

  html = setAttr(html, /(<meta\s+property="og:title"\s+content=")([^"]*)(")/i,   ogTitle, seen, "og:title");
  html = setAttr(html, /(<meta\s+name="twitter:title"\s+content=")([^"]*)(")/i,  ogTitle, seen, "twitter:title");
  if (ogDesc) {
    html = setAttr(html, /(<meta\s+property="og:description"\s+content=")([^"]*)(")/i,  ogDesc, seen, "og:description");
    html = setAttr(html, /(<meta\s+name="twitter:description"\s+content=")([^"]*)(")/i, ogDesc, seen, "twitter:description");
  }

  html = setAttr(html, /(<meta\s+name="keywords"\s+content=")([^"]*)(")/i,     c.keywords || "", seen, "keywords");
  html = setAttr(html, /(<meta\s+name="theme-color"\s+content=")([^"]*)(")/i,  c.brand?.primary || "", seen, "theme-color");
  html = setAttr(html, /(<link\s+rel="canonical"\s+href=")([^"]*)(")/i,        url, seen, "canonical");
  html = setAttr(html, /(<meta\s+property="og:url"\s+content=")([^"]*)(")/i,   url, seen, "og:url");
  html = setAttr(html, /(<meta\s+property="og:site_name"\s+content=")([^"]*)(")/i, c.name, seen, "og:site_name");
  if (ogImg) {
    html = setAttr(html, /(<meta\s+property="og:image"\s+content=")([^"]*)(")/i,  ogImg, seen, "og:image");
    html = setAttr(html, /(<meta\s+name="twitter:image"\s+content=")([^"]*)(")/i, ogImg, seen, "twitter:image");
  }

  /* Any surviving absolute reference to a PREVIOUS baseUrl. This is the whole
     reason the template exists: the site it came from had its old host written
     into 100+ places, and one missed occurrence silently points a canonical
     tag at a domain the clinic no longer controls. */
  const stale = html.match(/https?:\/\/[a-z0-9.-]+(?:\.github\.io|\.netlify\.app|\.vercel\.app)[^\s"'<>)]*/gi) || [];
  for (const u of new Set(stale)) {
    if (u.startsWith(base)) continue;
    const tail = u.replace(/^https?:\/\/[a-z0-9.-]+/i, "").replace(/^\/[^/]+/, "");
    html = html.split(u).join(base + tail);
    report.rewrittenHosts.add(u);
  }

  /* The Google review link, in both the QR anchor and the button. Driven from
     config for the same reason the Place ID lives there — see clinic.config.js. */
  {
    const pid = c.google?.placeId || "";
    html = html.replace(/(writereview\?placeid=)([A-Za-z0-9_-]*)/g, (m, a, old) => {
      if (old !== pid) { seen.add("placeid"); report.rewrittenPlaceIds.add(old); }
      return `${a}${pid}`;
    });
  }

  /* WhatsApp and phone links. These are hrefs, not prose, and they are the
     single most load-bearing thing on a clinic site — a wa.me link carrying the
     previous clinic's digits sends every enquiry to a stranger, and looks
     completely normal on screen. Rewritten from config on every apply, so they
     cannot be left behind by a fork. */
  if (c.contact?.whatsapp) {
    /* One character class, not an alternation: `\d+` would match only the "880"
       of a "880XXXXXXXXXX" placeholder and leave the X's dangling after the
       replacement, producing a longer broken number each run. */
    html = html.replace(/(wa\.me\/)([0-9Xx]+)/g, (m, a, old) => {
      if (old !== c.contact.whatsapp) seen.add("wa.me");
      return `${a}${c.contact.whatsapp}`;
    });
    html = html.replace(/(api\.whatsapp\.com\/send\?phone=)([0-9X]+)/gi,
      (m, a) => { seen.add("wa.me"); return `${a}${c.contact.whatsapp}`; });
  }
  if (c.contact?.phoneIntl) {
    html = html.replace(/(href="tel:)([^"]*)(")/gi, (m, a, old, z) => {
      if (old !== c.contact.phoneIntl) seen.add("tel");
      return `${a}${c.contact.phoneIntl}${z}`;
    });
  }

  /* The four animated counters. Written as data-target so the count-up script
     reads them; a clinic that leaves these at 0 gets a visible zero rather than
     the previous clinic's figures, which is the safe failure. */
  for (const [k, v] of Object.entries(c.stats || {})) {
    const re = new RegExp(`(data-stat="${k}"[^>]*?data-target=")([^"]*)(")`, "gi");
    if (re.test(html)) { seen.add(`stat:${k}`); html = html.replace(re, `$1${v}$3`); }
  }

  /* Google rating badge. Both places it appears on the homepage. */
  if (c.rating && typeof c.rating.score === "number") {
    const sc = c.rating.score ? c.rating.score.toFixed(1) : "";
    html = html.replace(/(<span class="g-score">)([^<]*)(<\/span>)/gi, (m, a, _b, z) => {
      seen.add("rating"); return `${a}${sc}${z}`; });
    html = html.replace(/(<div class="rs-score">)([^ <]*)( )/gi, (m, a, _b, z) => {
      seen.add("rating"); return `${a}${sc}${z}`; });
  }

  /* Every mailto: on a clinic site belongs to the clinic, so these are rewritten
     from config without needing to know the previous address. The visible link
     text is swapped too — a button reading the old clinic's address while
     linking to the new one is worse than either alone. */
  const email = c.contact?.email || "";
  if (email) {
    const oldAddrs = new Set();
    html = html.replace(/mailto:([^"'?\s>]+)/gi, (m, addr) => {
      if (addr !== email) { oldAddrs.add(addr); seen.add("mailto"); }
      return `mailto:${email}`;
    });
    for (const addr of oldAddrs) {
      /* Global, not text-nodes-only. The href occurrences were rewritten just
         above, so what remains is prose and data-en/data-bn attribute values —
         the legal pages carry the address in both. There is no context in which
         the PREVIOUS clinic's email should survive on this site. */
      html = html.split(addr).join(email);
      report.rewrittenEmails.add(addr);
    }
  }

  /* Cache-buster on our own css/js only — never on a CDN URL. */
  html = html.replace(/((?:href|src)="(?!https?:)[^"]+\.(?:css|js))\?v=[^"]*(")/gi,
    (m, pre, post) => `${pre}?v=${c.site.assetVersion}${post}`);

  /* The clinic's own JSON-LD block, regenerated. Blog Article/FAQ blocks are
     left alone — only the node whose @type matches the configured type. */
  const ldRe = /(<script\s+type="application\/ld\+json">)([\s\S]*?)(<\/script>)/gi;
  html = html.replace(ldRe, (m, open, body, close) => {
    let parsed; try { parsed = JSON.parse(body); } catch { return m; }
    const t = parsed?.["@type"];
    const businessTypes = [c.type || "Dentist", "Dentist", "MedicalClinic", "LocalBusiness", "MedicalBusiness"];
    if (!businessTypes.includes(t)) return m;
    seen.add("json-ld");
    return `${open}\n${buildJsonLd(c)}\n${close}`;
  });

  if (html !== original) {
    report.changed.push(relative(ROOT, file));
    if (!DRY) writeFileSync(file, html);
  }
  report.tags.set(relative(ROOT, file), seen);
  return html;
}

/* ---- sitemap + robots ------------------------------------------------- */
function writeSitemap(c, pages, report) {
  const base = c.site.baseUrl;
  const freq = p => /\/(blog|gallery)\//.test(p) ? "weekly"
              : /(privacy|terms|medical-disclaimer)/.test(p) ? "yearly" : "monthly";
  /* Pages nobody should be sent to from a search result. */
  const noIndex = /(dashboard|admin-content)\.html$/;

  const urls = pages
    .filter(p => !noIndex.test(p))
    .map(p => pageUrl(base, p))
    .sort((a, b) => a.length - b.length || a.localeCompare(b));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${esc(u)}</loc><changefreq>${freq(u)}</changefreq></url>`).join("\n")}
</urlset>
`;
  const robots = `User-agent: *
Allow: /
Disallow: /dashboard.html
Disallow: /admin-content.html

Sitemap: ${base}/sitemap.xml
`;
  for (const [name, body] of [["sitemap.xml", xml], ["robots.txt", robots]]) {
    const path = join(ROOT, name);
    const prev = existsSync(path) ? readFileSync(path, "utf8") : "";
    if (prev !== body) {
      report.changed.push(name);
      if (!DRY) writeFileSync(path, body);
    }
  }
  return urls.length;
}

/* ---- main ------------------------------------------------------------- */
const c = loadConfig();

/* Machine-readable single values, so shell and CI never re-implement the
   loader. package.json sets "type":"module", which makes a plain
   `require("./assets/clinic.config.js")` fail outright — it is parsed as ESM,
   where `window` does not exist. */
if (ARGV.includes("--print-name"))     { process.stdout.write(c.name || "");            process.exit(0); }
if (ARGV.includes("--print-base-url")) { process.stdout.write(c.site?.baseUrl || "");   process.exit(0); }

const { errs, warns } = validate(c);

/* Building the shared template itself, where the placeholders ARE the intended
   content. Everything still gets written — the pages must not keep a previous
   clinic's absolute URLs — but the placeholder errors become warnings. Never
   use this on a client site: it is precisely the check that stops one going
   live with example.com in its canonical tags. */
const TEMPLATE = ARGV.includes("--template");
if (TEMPLATE && errs.length) {
  console.warn(`\n  --template: treating ${errs.length} placeholder error(s) as warnings.`);
  errs.length = 0;
}

if (errs.length) {
  console.error(`\n  ${c.name || "config"} — ${errs.length} problem(s) to fix before deploy:\n`);
  errs.forEach(e => console.error(`    x  ${e}`));
  console.error("");
  process.exit(1);
}
warns.forEach(w => console.warn(`    !  ${w}`));

if (CHECK) {
  console.log(`\n  Config OK — ${c.name} → ${c.site.baseUrl}${warns.length ? `  (${warns.length} warning(s))` : ""}\n`);
  process.exit(0);
}

const pages  = walk(ROOT);
const report = { changed: [], tags: new Map(), rewrittenHosts: new Set(), rewrittenEmails: new Set(), rewrittenPlaceIds: new Set() };
pages.forEach(p => applyToPage(c, p, report));
const n = writeSitemap(c, pages, report);

console.log(`\n  ${DRY ? "DRY RUN — nothing written" : "Applied"}: ${c.name} → ${c.site.baseUrl}`);
console.log(`  ${pages.length} page(s) scanned, ${report.changed.length} updated, ${n} in sitemap.`);
if (report.rewrittenHosts.size) {
  console.log(`\n  Rewrote ${report.rewrittenHosts.size} stale absolute URL host(s):`);
  [...report.rewrittenHosts].slice(0, 5).forEach(u => console.log(`    - ${u}`));
}
if (report.rewrittenEmails.size) {
  console.log(`\n  Repointed ${report.rewrittenEmails.size} email address(es) to ${c.contact.email}:`);
  [...report.rewrittenEmails].forEach(a => console.log(`    - ${a}`));
  console.log(`    (tools/booking-alert.gs -> TO_EMAIL is not web content — set it by hand.)`);
}
if (report.rewrittenPlaceIds.size) {
  console.log(`\n  Repointed Google review link(s) to config.google.placeId${c.google?.placeId ? "" : " (empty — link hidden)"}:`);
  [...report.rewrittenPlaceIds].filter(Boolean).forEach(a => console.log(`    - was ${a}`));
}
if (report.changed.length) {
  console.log("");
  report.changed.slice(0, 20).forEach(f => console.log(`    ~ ${f}`));
  if (report.changed.length > 20) console.log(`    ... and ${report.changed.length - 20} more`);
}
/* A page with no canonical is invisible to the dedupe logic and will not be
   corrected by a later run either, so name them now. */
/* Phone numbers written into prose (the legal pages carry them in both
   languages). These are config data, but the formats vary too much to rewrite
   safely — a wrong guess inside a Terms page is worse than a flagged one. So
   they are reported, never touched. */
/* Bengali-Indic digits map to ASCII before comparison. A bilingual clinic site
   prints its phone number in both scripts, and an audit that only understands
   ASCII silently passes the previous clinic's number on the whole Bangla half
   of the site — which is the half most of its patients read. */
const BN_DIGITS = "\u09E6\u09E7\u09E8\u09E9\u09EA\u09EB\u09EC\u09ED\u09EE\u09EF";
const toAscii  = v => String(v || "").replace(/[\u09E6-\u09EF]/g, d => BN_DIGITS.indexOf(d));
const digits   = v => toAscii(v).replace(/\D/g, "");
const known    = new Set([digits(c.contact?.phone), digits(c.contact?.phoneIntl),
                          digits(c.contact?.whatsapp)].filter(Boolean));
const strayPhones = new Map();
const strayEmails = new Map();
for (const f of pages) {
  const raw = readFileSync(f, "utf8");
  /* Inline SVG path data is a dense run of digits, spaces, dots and hyphens —
     indistinguishable from a phone number to any regex, and there are hundreds
     of them per page. Left in, they bury the two findings that matter. */
  const text = raw
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/\sd="[^"]*"/gi, " ")
    .replace(/\sviewBox="[^"]*"/gi, " ");

  const scan = text.match(/[\d\u09E6-\u09EF][\d\u09E6-\u09EF\s()-]{7,17}[\d\u09E6-\u09EF]/g) || [];
  for (const m of scan) {
    const d = digits(m);
    if (d.length < 9 || d.length > 15) continue;
    /* A local number is a suffix of its own international form. */
    if ([...known].some(k => k.endsWith(d) || d.endsWith(k))) continue;
    if (!strayPhones.has(m.trim())) strayPhones.set(m.trim(), new Set());
    strayPhones.get(m.trim()).add(relative(ROOT, f));
  }

  for (const m of text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []) {
    if (m === c.contact?.email) continue;
    if (!strayEmails.has(m)) strayEmails.set(m, new Set());
    strayEmails.get(m).add(relative(ROOT, f));
  }
}
if (strayEmails.size) {
  console.log(`\n  ${strayEmails.size} email address(es) in page text are not config.contact.email.`);
  console.log(`  Only mailto: links are rewritten automatically — an address in prose`);
  console.log(`  is rewritten once, explicitly:  npm run rename -- --from-email <old>`);
  [...strayEmails].slice(0, 6).forEach(([a, where]) =>
    console.log(`    ${a}   ${[...where].slice(0, 2).join(", ")}${where.size > 2 ? ` +${where.size - 2} more` : ""}`));
}
if (strayPhones.size) {
  console.log(`\n  ${strayPhones.size} phone number(s) in page text do not match config.contact.`);
  console.log(`  Not rewritten — check each one, they may be a previous clinic's:`);
  [...strayPhones].slice(0, 8).forEach(([n, where]) =>
    console.log(`    ${n}   ${[...where].slice(0, 2).join(", ")}${where.size > 2 ? ` +${where.size - 2} more` : ""}`));
}

/* OPAQUE IDENTIFIERS. Names, phone numbers, emails and hostnames are all
   greppable because you know what you are looking for. A Google Place ID, a
   GA/GTM property, an Apps Script deployment — these are meaningless strings
   that match no such pattern, so they survive a clean-looking sweep and ship
   to the next client still pointing at the last one. Shape, not content, is
   the only thing that finds them. */
const OPAQUE = [
  [/\bChIJ[A-Za-z0-9_-]{10,}/g,        "Google Place ID"],
  [/\bGTM-[A-Z0-9]{4,}\b/g,            "Google Tag Manager container"],
  [/\bUA-\d{4,}-\d+\b/g,              "Universal Analytics property"],
  [/\bG-[A-Z0-9]{8,}\b/g,              "GA4 measurement ID"],
  [/\bAKfycb[A-Za-z0-9_-]{10,}/g,      "Apps Script deployment"],
  [/\bAIza[A-Za-z0-9_-]{30,}/g,        "Google API key"],
  [/\b\d{10,}-[a-z0-9]{20,}\b/g,       "OAuth client ID"],
];
{
  const found = new Map();
  /* .js and .gs too, not just pages — the Place ID that prompted this lived in
     app.js, which the page walk never opens. */
  const extra = [];
  const collect = (dir) => {
    for (const e of readdirSync(dir)) {
      if (e.startsWith(".") || e === "node_modules") continue;
      const fp = join(dir, e);
      if (statSync(fp).isDirectory()) collect(fp);
      else if (/\.(js|mjs|gs|json|xml|txt)$/.test(e) && !/vendor|clinic\.config/.test(fp)) extra.push(fp);
    }
  };
  collect(ROOT);
  for (const f of [...pages, ...extra]) {
    const text = readFileSync(f, "utf8");
    for (const [re, label] of OPAQUE) {
      for (const m of text.match(re) || []) {
        if (c.google?.placeId && m.includes(c.google.placeId)) continue;
        const k = `${label}|${m}`;
        if (!found.has(k)) found.set(k, new Set());
        found.get(k).add(relative(ROOT, f));
      }
    }
  }
  if (found.size) {
    console.log(`\n  ${found.size} opaque identifier(s) not accounted for by config:`);
    for (const [k, where] of [...found].slice(0, 8)) {
      const [label, val] = k.split("|");
      console.log(`    ${label}: ${val.slice(0, 44)}${val.length > 44 ? "…" : ""}`);
      console.log(`        ${[...where].slice(0, 3).join(", ")}`);
    }
    console.log(`    These match no name or number, so a normal sweep cannot see them.`);
  }
}

const missing = [...report.tags].filter(([, s]) => !s.has("canonical")).map(([f]) => f);
if (missing.length) {
  console.log(`\n  ${missing.length} page(s) have no <link rel="canonical"> to update:`);
  missing.slice(0, 10).forEach(f => console.log(`    ? ${f}`));
}
console.log("");
