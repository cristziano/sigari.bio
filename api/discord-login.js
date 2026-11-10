const { limited } = require("./_limit");
// "Continua con Discord": Firebase has no Discord sign-in, so this does the Discord part and then
// gives Firebase a signed "custom token" for the uid discord:<id>.
//   1. GET /api/discord-login            -> sends the user to Discord to say yes
//   2. GET /api/discord-login?code=...   -> Discord comes back here; we read who it is and go back
//      to login.html#dt=<token>&dn=<name>&de=<email> (after "#", so it never reaches any server log)
// Needs two Vercel variables (never in the code): DISCORD_CLIENT_SECRET (Discord app > OAuth2)
// and FIREBASE_SERVICE_ACCOUNT (Firebase > Impostazioni progetto > Account di servizio > chiave JSON).
const crypto = require("crypto");

const CLIENT_ID = "1567229195208097922";
const b64u = b => Buffer.from(b).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const cookie = (req, name) => { const m = new RegExp("(?:^|;\\s*)" + name + "=([^;]+)").exec(req.headers.cookie || ""); return m ? decodeURIComponent(m[1]) : ""; };

// Firebase custom token, signed with the service account key (no extra package needed)
function customToken(uid, claims) {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64u(JSON.stringify({
    iss: sa.client_email, sub: sa.client_email,
    aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
    iat: now, exp: now + 3600, uid, claims
  }));
  const sig = crypto.sign("RSA-SHA256", Buffer.from(head + "." + body), sa.private_key);
  return head + "." + body + "." + b64u(sig);
}

// Discord only accepts the return address saved in its app: always come back through this one,
// then send the person to the site address they started from (only our own addresses).
const HOME = "18kbio.vercel.app";
const SITES = ["18kbio.xyz", "www.18kbio.xyz", "18kbio.vercel.app"];
const back = (res, hash, site) => { res.statusCode = 302; res.setHeader("Location", (site && SITES.includes(site) ? `https://${site}` : "") + "/login.html#" + hash); res.end(); };

module.exports = async (req, res) => {
  if (limited(req, res, "login", 30)) return; // traffic guard (see _limit.js)
  res.setHeader("Cache-Control", "no-store");
  const url = new URL(req.url, "https://" + req.headers.host);
  const redirect = `https://${HOME}/api/discord-login`;
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  // started on 18kbio.xyz: hop to the address Discord knows, remembering where to go back
  if (host !== HOME && !url.searchParams.get("code") && !url.searchParams.get("error")) {
    res.statusCode = 302;
    res.setHeader("Location", `https://${HOME}/api/discord-login?site=${encodeURIComponent(SITES.includes(host) ? host : "18kbio.xyz")}`);
    return res.end();
  }
  const site = SITES.includes(url.searchParams.get("site")) ? url.searchParams.get("site") : (cookie(req, "dlsite") || HOME);
  if (!process.env.DISCORD_CLIENT_SECRET || !process.env.FIREBASE_SERVICE_ACCOUNT) return back(res, "derr=" + encodeURIComponent("L'accesso con Discord non è ancora attivo."));

  const code = url.searchParams.get("code");
  if (!code) {
    if (url.searchParams.get("error")) return back(res, "derr=" + encodeURIComponent("Accesso con Discord annullato."), site);
    // Step 1: off to Discord, with a random "state" kept in a short cookie against forged returns
    const state = crypto.randomBytes(16).toString("hex");
    res.setHeader("Set-Cookie", [`dlstate=${state}; Path=/api/discord-login; Max-Age=600; HttpOnly; Secure; SameSite=Lax`, `dlsite=${encodeURIComponent(site)}; Path=/api/discord-login; Max-Age=600; HttpOnly; Secure; SameSite=Lax`]);
    res.statusCode = 302;
    res.setHeader("Location", "https://discord.com/oauth2/authorize?" + new URLSearchParams({ client_id: CLIENT_ID, response_type: "code", scope: "identify email", redirect_uri: redirect, state, prompt: "none" }));
    return res.end();
  }

  try {
    if (!url.searchParams.get("state") || url.searchParams.get("state") !== cookie(req, "dlstate")) throw new Error("Accesso scaduto, riprova.");
    res.setHeader("Set-Cookie", ["dlstate=; Path=/api/discord-login; Max-Age=0; HttpOnly; Secure; SameSite=Lax", "dlsite=; Path=/api/discord-login; Max-Age=0; HttpOnly; Secure; SameSite=Lax"]);
    const t = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: process.env.DISCORD_CLIENT_SECRET, grant_type: "authorization_code", code, redirect_uri: redirect })
    }).then(r => r.json());
    if (!t.access_token) throw new Error("Discord non ha confermato l'accesso, riprova.");
    const me = await fetch("https://discord.com/api/v10/users/@me", { headers: { Authorization: "Bearer " + t.access_token } }).then(r => r.json());
    if (!me.id) throw new Error("Discord non ha dato il tuo profilo, riprova.");
    const token = customToken("discord:" + me.id, { discord: me.id });
    const name = me.global_name || me.username || "";
    const email = me.verified && me.email ? me.email : "";
    return back(res, new URLSearchParams({ dt: token, dn: name, de: email, di: me.id }).toString(), site);
  } catch (e) {
    return back(res, "derr=" + encodeURIComponent(e.message || "Accesso con Discord non riuscito."), site);
  }
};
