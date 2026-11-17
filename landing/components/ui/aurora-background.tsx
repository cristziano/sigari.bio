"use client";
// Aurora background (the 21st.dev / Aceternity "Aurora Background" idea, rebuilt for 18kbio):
// a soft, glowing gradient that drifts slowly behind the whole page. Cold silver and lilac, so the
// black and white of the site stays the main thing. Fixed to the screen, cheap: only background-position moves.
export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className="aurora absolute -inset-[10px] opacity-60 [mask-image:radial-gradient(ellipse_at_70%_0%,#000_15%,transparent_75%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_100%,rgba(165,180,252,.10),transparent_70%)]" />
    </div>
  );
}
