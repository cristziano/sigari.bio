// Read-only access to the public Firestore documents (profiles, usernames), as any visitor would.
const PROJECT = "kbio-c6126";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

// Firestore REST values -> plain JS
function decode(v) {
  if (!v || typeof v !== "object") return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(decode);
  if ("mapValue" in v) { const o = {}; for (const [k, x] of Object.entries(v.mapValue.fields || {})) o[k] = decode(x); return o; }
  return null;
}
const decodeDoc = d => decode({ mapValue: { fields: d.fields || {} } });

async function getDoc(path) {
  const r = await fetch(`${BASE}/${path}`, { signal: AbortSignal.timeout(2200) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("firestore " + r.status);
  return decodeDoc(await r.json());
}

// First profile whose Discord presence id is this Discord user
async function profileByDiscord(id) {
  const r = await fetch(`${BASE}:runQuery`, {
    method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(2200),
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "profiles" }], where: { fieldFilter: { field: { fieldPath: "appearance.widgets.discordId" }, op: "EQUAL", value: { stringValue: id } } }, limit: 1 } })
  });
  if (!r.ok) return null;
  const rows = await r.json();
  const d = rows.find(x => x.document);
  return d ? { handle: d.document.name.split("/").pop(), ...decodeDoc(d.document) } : null;
}

// A name typed by the user: the main @ or an extra name that points to it
async function profileByName(name) {
  const h = String(name || "").toLowerCase().replace(/^@/, "").replace(/[^a-z0-9_]/g, "").slice(0, 20);
  if (!h) return null;
  let p = await getDoc("profiles/" + h);
  if (p) return { handle: h, ...p };
  const u = await getDoc("usernames/" + h);
  if (u && u.aliasOf) { p = await getDoc("profiles/" + u.aliasOf); if (p) return { handle: u.aliasOf, ...p }; }
  return null;
}

module.exports = { getDoc, profileByDiscord, profileByName };
