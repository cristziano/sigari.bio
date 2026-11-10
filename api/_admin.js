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

// The staff accounts: whoever owns @1 now + the /staff documents. Those who log in with Discord
// have an account id "discord:<id>": the bot can write to them in private.
async function staffDiscordIds() {
  const token = await adminToken();
  const H = { Authorization: "Bearer " + token };
  const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
  const uids = new Set();
  const one = await fetch(`${base}/usernames/1`, { headers: H }).then(r => r.ok ? r.json() : null).catch(() => null);
  if (one && one.fields && one.fields.uid) uids.add(one.fields.uid.stringValue);
  const list = await fetch(`${base}/staff?pageSize=50`, { headers: H }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
  (list.documents || []).forEach(d => uids.add(d.name.split("/").pop()));
  return [...uids].filter(u => /^discord:\d{15,22}$/.test(u)).map(u => u.slice(8));
}
const lastDm = {};
// A private message from the bot to every staff member on Discord (at most one per kind every 10 minutes)
async function alertStaff(kind, text) {
  try {
    if (!process.env.DISCORD_BOT_TOKEN) return;
    if (lastDm[kind] && Date.now() - lastDm[kind] < 600e3) return;
    lastDm[kind] = Date.now();
    const H = { Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN, "Content-Type": "application/json" };
    for (const id of await staffDiscordIds()) {
      const ch = await fetch("https://discord.com/api/v10/users/@me/channels", { method: "POST", headers: H, body: JSON.stringify({ recipient_id: id }) }).then(r => r.json()).catch(() => null);
      if (ch && ch.id) await fetch(`https://discord.com/api/v10/channels/${ch.id}/messages`, { method: "POST", headers: H, body: JSON.stringify({ content: String(text).slice(0, 1800), allowed_mentions: { parse: [] } }) }).catch(() => {});
    }
  } catch (_) { /* never break the request */ }
}

// The bot writes to the staff ONLY when many reports arrive together: at least ALERT_MIN
// (bugs + system errors) in the last hour, and then at most one message every 3 hours.
const ALERT_MIN = 5, ALERT_GAP = 3 * 3600e3;
async function alertIfMany() {
  try {
    if (!process.env.DISCORD_BOT_TOKEN) return;
    const token = await adminToken();
    const H = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
    const base = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
    const since = new Date(Date.now() - 3600e3).toISOString();
    const count = async coll => {
      const r = await fetch(`${base}:runAggregationQuery`, { method: "POST", headers: H, body: JSON.stringify({ structuredAggregationQuery: { structuredQuery: { from: [{ collectionId: coll }], where: { fieldFilter: { field: { fieldPath: "createdAt" }, op: "GREATER_THAN_OR_EQUAL", value: { timestampValue: since } } } }, aggregations: [{ alias: "n", count: {} }] } }), signal: AbortSignal.timeout(6000) }).then(r => r.json()).catch(() => null);
      const v = r && r[0] && r[0].result && r[0].result.aggregateFields && r[0].result.aggregateFields.n;
      return v ? +v.integerValue || 0 : 0;
    };
    const [bugs, sys] = await Promise.all([count("bugs"), count("sysreports")]);
    if (bugs + sys < ALERT_MIN) return;
    // remember when we last wrote, so different servers don't all send it
    const meta = await fetch(`${base}/staffmeta/alert`, { headers: H }).then(r => r.ok ? r.json() : null).catch(() => null);
    const last = meta && meta.fields && meta.fields.lastAt ? Date.parse(meta.fields.lastAt.timestampValue) : 0;
    if (Date.now() - last < ALERT_GAP) return;
    await fetch(`${base}/staffmeta/alert?updateMask.fieldPaths=lastAt`, { method: "PATCH", headers: H, body: JSON.stringify({ fields: { lastAt: { timestampValue: new Date().toISOString() } } }) }).catch(() => {});
    lastDm.many = 0;
    await alertStaff("many", `🚨 **Tante segnalazioni nell'ultima ora**: ${bugs} bug segnalati dagli utenti, ${sys} errori di sistema.\nGuarda: 18kbio.xyz/dashboard.html → Staff`);
  } catch (_) { /* never break the request */ }
}

// Never throws: a failed report must not break what the user is doing
async function reportSystem(kind, message, extra = {}) {
  try {
    const token = await adminToken();
    const fields = { kind: { stringValue: String(kind).slice(0, 40) }, message: { stringValue: String(message).slice(0, 500) }, createdAt: { timestampValue: new Date().toISOString() } };
    for (const [k, v] of Object.entries(extra)) fields[k] = { stringValue: String(v).slice(0, 200) };
    await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/sysreports`, { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ fields }), signal: AbortSignal.timeout(6000) });
  } catch (_) { /* nothing else to do */ }
  await alertIfMany();
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

module.exports = { adminToken, reportSystem, deployRules, alertStaff, alertIfMany, PROJECT };
