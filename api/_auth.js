// Checks a Firebase ID token (the "Bearer" sent by the dashboard) without any secret:
// the signature is verified with Google's public certificates for Firebase Auth.
const crypto = require("crypto");
const PROJECT = "kbio-c6126";
const CERTS = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let certs = null, certsUntil = 0;

async function getCerts() {
  if (certs && Date.now() < certsUntil) return certs;
  const r = await fetch(CERTS, { signal: AbortSignal.timeout(4000) });
  const age = /max-age=(\d+)/.exec(r.headers.get("cache-control") || "");
  certs = await r.json(); certsUntil = Date.now() + (age ? +age[1] * 1000 : 3600e3);
  return certs;
}
const b64 = s => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

// Returns the user id, or throws with status 401
async function verifyUser(req) {
  const fail = () => Object.assign(new Error("Accedi per farlo."), { status: 401 });
  const m = /^Bearer ([\w-]+)\.([\w-]+)\.([\w-]+)$/.exec(String(req.headers.authorization || ""));
  if (!m) throw fail();
  let head, body;
  try { head = JSON.parse(b64(m[1])); body = JSON.parse(b64(m[2])); } catch (_) { throw fail(); }
  const cert = head.alg === "RS256" && (await getCerts())[head.kid];
  if (!cert || !crypto.verify("RSA-SHA256", Buffer.from(m[1] + "." + m[2]), cert, b64(m[3]))) throw fail();
  const now = Date.now() / 1000;
  if (body.aud !== PROJECT || body.iss !== "https://securetoken.google.com/" + PROJECT || !body.sub || body.exp < now || body.iat > now + 300) throw fail();
  return body.sub;
}

module.exports = { verifyUser };
