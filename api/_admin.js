// Server-side access to Firebase with the service account (FIREBASE_SERVICE_ACCOUNT on Vercel, never in the code).
//   adminToken()            -> an OAuth token for Google APIs (Firestore, Security Rules)
//   reportSystem(kind, msg) -> a "system report" the staff sees in the Staff page (users only get a simple message)
//   deployRules(source)     -> publishes the Firestore rules of the repository
const crypto = require("crypto");
const PROJECT = "kbio-c6126";
const b64u = b => Buffer.from(b).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

let cached = null;
async function adminToken() {
  if (cached && cached.exp > Date.now() + 60e3) return cached.token;
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  if (!sa.client_email || !sa.private_key) throw new Error("FIREBASE_SERVICE_ACCOUNT manca su Vercel");
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64u(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/datastore", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const jwt = head + "." + body + "." + b64u(crypto.sign("RSA-SHA256", Buffer.from(head + "." + body), sa.private_key));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }), signal: AbortSignal.timeout(8000) });
  const j = await r.json();
  if (!j.access_token) throw new Error("Google non ha dato il token del servizio");
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return cached.token;
}

// Never throws: a failed report must not break what the user is doing
async function reportSystem(kind, message, extra = {}) {
  try {
    const token = await adminToken();
    const fields = { kind: { stringValue: String(kind).slice(0, 40) }, message: { stringValue: String(message).slice(0, 500) }, createdAt: { timestampValue: new Date().toISOString() } };
    for (const [k, v] of Object.entries(extra)) fields[k] = { stringValue: String(v).slice(0, 200) };
    await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/sysreports`, { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ fields }), signal: AbortSignal.timeout(6000) });
  } catch (_) { /* nothing else to do */ }
}

async function deployRules(source) {
  const token = await adminToken();
  const H = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const base = `https://firebaserules.googleapis.com/v1/projects/${PROJECT}`;
  const rs = await fetch(`${base}/rulesets`, { method: "POST", headers: H, body: JSON.stringify({ source: { files: [{ name: "firestore.rules", content: source }] } }) }).then(r => r.json());
  if (!rs.name) throw new Error("Regole non accettate: " + JSON.stringify(rs.error || rs).slice(0, 300));
  const name = `projects/${PROJECT}/releases/cloud.firestore`;
  let rel = await fetch(`https://firebaserules.googleapis.com/v1/${name}`, { method: "PATCH", headers: H, body: JSON.stringify({ release: { name, rulesetName: rs.name } }) });
  if (rel.status === 404) rel = await fetch(`${base}/releases`, { method: "POST", headers: H, body: JSON.stringify({ name, rulesetName: rs.name }) });
  const j = await rel.json();
  if (!rel.ok) throw new Error("Pubblicazione non riuscita: " + JSON.stringify(j.error || j).slice(0, 300));
  return rs.name;
}

module.exports = { adminToken, reportSystem, deployRules, PROJECT };
