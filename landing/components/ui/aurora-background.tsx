"use client";
// Background of the whole landing, with no gradients:
// - a thin line grid with small crosses where the lines meet, over the whole screen;
// - giant rows of what 18kbio gives you (no user names) sliding slowly, in alternate directions,
//   drawn only as an outline so the content in front stays easy to read.
// Fixed layer, transform-only animation; with prefers-reduced-motion the rows stand still.
import { useT } from "@/lib/i18n";

// row: font size (px), seconds for one loop, outline (true) or faint filled text
const ROWS: [number, number, boolean][] = [[150, 140, true], [56, 90, false], [150, 170, true], [56, 110, false], [150, 150, true], [56, 100, false], [150, 180, true]];

function Grid() {
  return (
    <svg className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <pattern id="bg-grid" width="96" height="96" patternUnits="userSpaceOnUse">
          <path d="M96 0H0V96" fill="none" stroke="rgba(255,255,255,.045)" strokeWidth="1" />
          <path d="M-5 0H5M0 -5V5" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-grid)" />
    </svg>
  );
}

export default function AuroraBackground() {
  const { list } = useT();
  const words = list("bgWords");
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <Grid />
      {(
        <div className="absolute inset-0 flex flex-col justify-between py-[2vh]">
          {ROWS.map(([size, dur, outline], r) => {
            // each row starts from a different word; the text is doubled so the loop has no seam
            const line = words.map((_, i) => words[(i + r * 2) % words.length]).join("   ·   ");
            return (
              <div key={r} className={`bg-row whitespace-nowrap font-bold leading-none tracking-[-.04em] ${r % 2 ? "rev" : ""} ${outline ? "bg-row-line" : "text-white/[.035]"}`}
                style={{ fontSize: `clamp(${Math.round(size * .45)}px, ${(size / 13).toFixed(1)}vw, ${size}px)`, animationDuration: dur + "s" }}>
                <span>{line}   ·   </span><span>{line}   ·   </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
