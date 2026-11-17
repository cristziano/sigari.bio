"use client";
// Background of the whole landing: one flat matte black. No gradients, no patterns.
export default function AuroraBackground() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#0b0b0b]" />;
}
