"use client";
// Background of the whole page: big soft lights that drift slowly behind every section, plus a faint dot grid.
// Only gradients moved with transform (no blur filter, no backdrop-blur): smooth while scrolling.
export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <i className="glow g1" />
      <i className="glow g2" />
      <i className="glow g3" />
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(90%_80%_at_50%_50%,#000,transparent)]" />
    </div>
  );
}
