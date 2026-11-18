// Takes the pictures of the profiles for the ring in the home page (sigari-bio/ring/).
// The home only downloads these pictures: nothing is built while someone visits, so the ring shows at once.
// It runs by itself every time Vercel publishes the site (vercel.json, buildCommand), so the pictures
// follow the profiles without anyone doing anything. Here: node scripts/ring-shots.mjs (from landing/).
// If it fails (no network, no browser) the build goes on: the home just keeps the pictures it already has.
//
// Which profiles: the same ones Esplora shows (public and listed: the owner's choice), the most visited first.
// How: each profile is opened with the same code as its page (profile-kit.js), in a lighter version
// (no music or sounds, no entrance screen, no moving effects, no widgets that load other sites, the first
// 3 real links), and photographed at 400x500 (the card's 4:5).
import { chromium as pw } from "playwright-core";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../../", import.meta.url).pathname; // the repository
const OUT = join(ROOT, "sigari-bio", "ring");
const MAX = 8;
const W = 400, H = 500, SCALE = 1.5;
// the public web key of the site (it is in every page already; it only identifies the project)
const KEY = "AIzaSyCoT9dNoX36cQfvOHDn2d-d-N2_m_MdMzM";
const FS = "https://firestore.googleapis.com/v1/projects/kbio-c6126/databases/(default)/documents";

// Firestore's REST answer -> plain values
function plain(v) {
  if (!v || typeof v !== "object") return v;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return { seconds: Math.floor(Date.parse(v.timestampValue) / 1000) };
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(plain);
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, plain(x)]));
  return null;
}

async function topProfiles() {
  const r = await fetch(`${FS}:runQuery?key=${KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "profiles" }], orderBy: [{ field: { fieldPath: "views" }, direction: "DESCENDING" }], limit: 40 } }),
  });
  if (!r.ok) throw new Error("Firestore " + r.status + " " + (await r.text()).slice(0, 200));
  const rows = (await r.json()).filter(x => x.document).map(x => ({ handle: x.document.name.split("/").pop(), ...plain({ mapValue: { fields: x.document.fields } }) }));
  return rows.filter(p => {
    const pr = (p.appearance && p.appearance.privacy) || {};
    return p.appearance && p.avatarUrl && !p.private && !p.unlisted && !pr.private && !pr.unlisted && !pr.disabled;
  }).slice(0, MAX);
}

// a tiny server for the site's own files, so profile-kit.js runs as on the real site
const TYPES = { ".js": "text/javascript", ".html": "text/html", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };
const PAGE = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}#host{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style>
<div id="host"></div><script type="module">import * as k from "/sigari-bio/profile-kit.js"; window.k = k; window.ready = true;</script>`;
function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path === "/__ring") { res.writeHead(200, { "Content-Type": "text/html" }); return res.end(PAGE); }
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    try { const body = await readFile(file); res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" }); res.end(body); }
    catch { res.writeHead(404); res.end(); }
  });
  return new Promise(r => server.listen(0, "127.0.0.1", () => r(server)));
}

async function main() {
  const rows = await topProfiles();
  console.log("profiles:", rows.map(p => p.handle).join(", "));
  await mkdir(OUT, { recursive: true });
  const server = await serve();
  const port = server.address().port;
  // on Vercel: a Chromium made for servers (it brings its own system files); elsewhere the one of Playwright
  let browser;
  if (process.env.VERCEL) {
    // it unpacks its own system libraries only when it believes it runs on Amazon's Node 20/22 servers,
    // which is what Vercel's build machines are: so it is told (before it loads)
    process.env.AWS_LAMBDA_JS_RUNTIME ||= "nodejs22.x";
    const { default: chromium } = await import("@sparticuz/chromium");
    browser = await pw.launch({ executablePath: await chromium.executablePath(), args: chromium.args, headless: true });
  } else {
    browser = await pw.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  }
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  await page.goto(`http://127.0.0.1:${port}/__ring`);
  await page.waitForFunction(() => window.ready);
  const list = [];
  for (const p of rows) {
    try {
      await page.evaluate(async raw => {
        const host = document.getElementById("host");
        if (window.view) { try { window.view.destroy(); } catch {} }
        host.replaceChildren();
        const prof = window.k.normalizeProfile ? window.k.normalizeProfile(raw) : raw;
        const a = prof.appearance;
        a.music.type = "none"; a.music.autoplay = false;
        a.sfx = { ...a.sfx, hover: "none", click: "none", volume: 0 };
        a.enter.on = false;
        a.effect = "none";
        Object.assign(a.widgets, { twitch: "", youtube: "", spotify: "", roblox: "", discordServer: "", discordId: "", discordPresence: false, github: "", weather: "", gallery: false, guestbook: false, contact: false, newsletter: false });
        prof.gallery = [];
        prof.links = (prof.links || []).filter(l => !l.url || l.url !== "#").slice(0, 3);
        window.view = window.k.mountProfile(host, prof, { preview: true, entrance: false });
        const imgs = [...host.querySelectorAll("img")].map(im => im.decode().catch(() => {}));
        const vids = [...host.querySelectorAll("video")].map(v => new Promise(r => { if (v.readyState >= 2) r(); else { v.addEventListener("loadeddata", r, { once: true }); v.addEventListener("error", r, { once: true }); } }));
        await Promise.race([Promise.all([...imgs, ...vids]), new Promise(r => setTimeout(r, 8000))]);
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 400));
      }, p);
      const buf = await page.locator("#host").screenshot({ type: "jpeg", quality: 80 });
      const v = createHash("sha1").update(buf).digest("hex").slice(0, 10);
      await writeFile(join(OUT, p.handle + ".jpg"), buf);
      list.push({ h: p.handle, title: p.displayName || p.handle, v });
      console.log("ok", p.handle, Math.round(buf.length / 1024) + " KB");
    } catch (e) { console.log("skip", p.handle, e.message); }
  }
  await browser.close();
  server.close();
  // pictures of profiles that left the ring are removed
  for (const f of await readdir(OUT)) if (f.endsWith(".jpg") && !list.some(x => x.h + ".jpg" === f)) await unlink(join(OUT, f));
  await writeFile(join(OUT, "ring.json"), JSON.stringify({ list }, null, 1) + "\n");
  console.log("saved", list.length, "pictures");
}

// how the last run went, readable on the site (sigari-bio/ring/status.json): Vercel's build log is private
const status = async (ok, msg) => {
  try { await mkdir(OUT, { recursive: true }); await writeFile(join(OUT, "status.json"), JSON.stringify({ ok, msg: String(msg).slice(0, 1500), at: new Date().toISOString(), node: process.version }) + "\n"); } catch {}
};
main().then(() => status(true, "ok")).catch(async e => { console.error(e); await status(false, e && (e.stack || e.message) || e); process.exit(1); });
