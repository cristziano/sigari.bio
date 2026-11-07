// GET /api/lookup?p=<platform>&u=<username>: looks the account up on the platform itself,
// so the dashboard can show "found: <photo> <name>" before saving the social.
// Only platforms with a public lookup and no key: roblox, github, bluesky, telegram.
const UA = "18k.bio (+https://18k.bio)";
const clean = s => String(s || "").trim().replace(/^@/, "").slice(0, 60);
const getJSON = async (url, init = {}) => { const r = await fetch(url, { ...init, headers: { "User-Agent": UA, Accept: "application/json", ...(init.headers || {}) }, signal: AbortSignal.timeout(5000) }); return { ok: r.ok, status: r.status, j: r.ok ? await r.json() : null }; };
const ogOf = (html, k) => { const m = new RegExp(`<meta property="og:${k}" content="([^"]*)"`).exec(html); return m ? m[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"') : ""; };

const LOOKUP = {
  async roblox(u) {
    const r = await getJSON("https://users.roblox.com/v1/usernames/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usernames: [u], excludeBannedUsers: true }) });
    const p = r.j && r.j.data && r.j.data[0];
    if (!p) return { found: false };
    const t = await getJSON(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${p.id}&size=150x150&format=Png&isCircular=false`).catch(() => ({}));
    const img = t.j && t.j.data && t.j.data[0] && t.j.data[0].imageUrl;
    return { found: true, name: p.displayName || p.name, handle: p.name, avatar: img || "", url: `https://www.roblox.com/users/${p.id}/profile` };
  },
  async github(u) {
    const r = await getJSON("https://api.github.com/users/" + encodeURIComponent(u));
    if (!r.j) return { found: false };
    return { found: true, name: r.j.name || r.j.login, handle: r.j.login, avatar: r.j.avatar_url || "", url: r.j.html_url };
  },
  async bluesky(u) {
    const actor = u.includes(".") ? u : u + ".bsky.social";
    const r = await getJSON("https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" + encodeURIComponent(actor));
    if (!r.j) return { found: false };
    return { found: true, name: r.j.displayName || r.j.handle, handle: r.j.handle, avatar: r.j.avatar || "", url: "https://bsky.app/profile/" + r.j.handle };
  },
  async telegram(u) {
    const r = await fetch("https://t.me/" + encodeURIComponent(u), { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(5000) });
    const html = await r.text();
    if (!/tgme_page_title/.test(html)) return { found: false };
    return { found: true, name: ogOf(html, "title"), handle: u, avatar: ogOf(html, "image"), url: "https://t.me/" + u };
  }
};

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const q = new URL(req.url, "https://x").searchParams;
  const p = q.get("p"), u = clean(q.get("u"));
  if (!LOOKUP[p] || !/^[\w.\-]{1,60}$/.test(u)) { res.statusCode = 400; return res.end(JSON.stringify({ error: "Piattaforma o nome non validi." })); }
  try {
    const out = await LOOKUP[p](u);
    res.setHeader("Cache-Control", "public, s-maxage=600, max-age=60");
    res.end(JSON.stringify(out));
  } catch (_) {
    res.statusCode = 502; res.end(JSON.stringify({ error: "La piattaforma non risponde adesso." }));
  }
};
