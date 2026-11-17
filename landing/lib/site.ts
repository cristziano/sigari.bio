// Shared bits of the landing: Firebase (loaded at runtime from gstatic, like the other pages),
// the rules for a @name and the modules of the old site that the landing reuses as they are.

export const HANDLE_RE = /^[a-z0-9_]{1,20}$/;

// Names used by the site's own pages: nobody can take them
export const RESERVED = ["api", "404", "www", "admin", "dashboard", "login", "explore", "esplora", "clan", "clans", "paste", "profile", "index", "settings", "help", "sigari", "studios", "404studios", "18k", "privacy", "termini", "accedi"];

export const sanitize = (v: string) => v.toLowerCase().replace(/^@+/, "").replace(/[^a-z0-9_]/g, "").slice(0, 20);

/** Shorter names are rarer: [name, how many of the 4 pips are on] */
export const rarity = (h: string): [string, number] =>
  h.length <= 3 ? ["leggendaria", 4] : h.length === 4 ? ["epica", 3] : h.length === 5 ? ["rara", 2] : ["classica", 1];

const firebaseConfig = {
  apiKey: "AIzaSyCoT9dNoX36cQfvOHDn2d-d-N2_m_MdMzM",
  authDomain: "kbio-c6126.firebaseapp.com",
  projectId: "kbio-c6126",
  storageBucket: "kbio-c6126.firebasestorage.app",
  messagingSenderId: "723958775593",
  appId: "1:723958775593:web:096992d3c8460351d3c138",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fb = { db: any; fs: any; auth: any; au: any };
let fbPromise: Promise<Fb> | null = null;

/** Import a module by URL at runtime, without the bundler touching it */
export const runtimeImport = <T = any>(url: string): Promise<T> => import(/* webpackIgnore: true */ url);

export function firebase(): Promise<Fb> {
  fbPromise ??= (async () => {
    const base = "https://www.gstatic.com/firebasejs/10.12.5/";
    const [{ initializeApp }, fs, au] = await Promise.all([
      runtimeImport(base + "firebase-app.js"),
      runtimeImport(base + "firebase-firestore.js"),
      runtimeImport(base + "firebase-auth.js"),
    ]);
    const app = initializeApp(firebaseConfig);
    return { db: fs.getFirestore(app), fs, auth: au.getAuth(app), au };
  })();
  fbPromise.catch(() => { fbPromise = null; });
  return fbPromise;
}

/** The public profile of @1, used as the example on the landing (null if it can't be read) */
let oneP: Promise<any | null> | null = null;
export function profileOfOne(): Promise<any | null> {
  oneP ??= firebase()
    .then(async ({ db, fs }) => { const s = await fs.getDoc(fs.doc(db, "profiles", "1")); return s.exists() ? s.data() : null; })
    .catch(() => null);
  return oneP;
}

// Modules of the existing site, served from /sigari-bio/
export const kit = {
  profile: () => runtimeImport("/sigari-bio/profile-kit.js"),
  card: () => runtimeImport("/sigari-bio/card-kit.js"),
  globe: () => runtimeImport("/sigari-bio/globe.js"),
};

export const reducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
