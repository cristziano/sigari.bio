"use client";
// Background of the whole page: a very soft, still glow (the idea of the 21st.dev "Aurora Background",
// made minimal). No blur filter and no animation: it costs nothing while scrolling.
export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-black
      bg-[radial-gradient(55%_40%_at_75%_0%,rgba(199,210,254,.075),transparent_70%),radial-gradient(45%_35%_at_10%_100%,rgba(233,213,255,.05),transparent_70%)]" />
  );
}
