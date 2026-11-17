// Copies the static export (out/) to ../sigari-bio/landing, where vercel.json serves "/" from.
import { cpSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const here = p => fileURLToPath(new URL(p, import.meta.url));
const out = here("../out"), dest = here("../../sigari-bio/landing");
if (!existsSync(out)) { console.error("out/ is missing: run next build first"); process.exit(1); }
rmSync(dest, { recursive: true, force: true });
cpSync(out, dest, { recursive: true });
console.log("landing ->", dest);
