// Traffic guard: each address (IP) can call a server function only so many times per minute.
// Too many -> "429 troppe richieste" for a little while. Protects the site (and the free plan)
// from bots and from someone hammering the same address. Counts live in the memory of each
// server; Vercel's own firewall stops the big attacks before they get here.
const hits = new Map();
let sweep = 0;
function ipOf(req) {
  return String(req.headers["x-real-ip"] || String(req.headers["x-forwarded-for"] || "").split(",")[0] || (req.socket && req.socket.remoteAddress) || "?").trim();
}
// limited(req, res, "name", max, seconds) -> true when blocked (the answer is already sent)
function limited(req, res, name, max, seconds = 60) {
  const now = Date.now();
  if (now - sweep > 60e3) { sweep = now; for (const [k, v] of hits) if (v.until < now) hits.delete(k); }
  const key = name + "|" + ipOf(req);
  let v = hits.get(key);
  if (!v || v.until < now) { v = { n: 0, until: now + seconds * 1000 }; hits.set(key, v); }
  v.n++;
  if (v.n <= max) return false;
  const wait = Math.max(1, Math.ceil((v.until - now) / 1000));
  res.statusCode = 429;
  res.setHeader("Retry-After", String(wait));
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: `Troppe richieste: riprova tra ${wait} secondi.` }));
  return true;
}
module.exports = { limited, ipOf };
