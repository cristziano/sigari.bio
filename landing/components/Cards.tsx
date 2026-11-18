"use client";
// "La tua carta": the real card of @1 on a 3D table. It rises from flat when you get here,
// then follows the mouse.
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { kit, profileOfOne, reducedMotion } from "@/lib/site";
import { useHandle } from "@/lib/handle";
import { useT } from "@/lib/i18n";

const SPRING = { stiffness: 60, damping: 18, mass: 1 };

export default function Cards() {
  const sec = useRef<HTMLElement>(null);
  const cardBox = useRef<HTMLDivElement>(null);
  const seen = useInView(sec, { once: true, amount: .15 });
  const [live, setLive] = useState(false);
  const { guestHref } = useHandle();
  const { t } = useT();

  // tilt: starts flat (80°) and lands on 24° / -10°, then the mouse adds a little
  const rx = useMotionValue(80), rz = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING), srz = useSpring(rz, SPRING), sry = useSpring(ry, SPRING);

  useEffect(() => {
    if (!seen) return;
    rx.set(24); rz.set(-10);
    const t = setTimeout(() => setLive(true), 1800);
    // mount the card of @1 (the standard card with @1 on it if the profile can't be read)
    (async () => {
      const [k, p] = await Promise.all([kit.card(), profileOfOne()]);
      if (cardBox.current && !cardBox.current.childElementCount) {
        const one = { card: p?.card || k.DEFAULT_CARD, who: { handle: "1", avatarUrl: p?.avatarUrl || "", displayName: p?.displayName || "1" } };
        k.mountCard(cardBox.current, one.card, one.who);
      }
    })().catch(() => {});
    return () => clearTimeout(t);
  }, [seen, rx, rz]);

  const move = (e: React.PointerEvent) => {
    if (!live || reducedMotion() || e.pointerType !== "mouse") return;
    const r = sec.current!.getBoundingClientRect();
    const x = (r.width / 2 - (e.clientX - r.left)) / 25, y = (r.height / 2 - (e.clientY - r.top)) / 25;
    rx.set(24 + y / 2); rz.set(-10 + x / 3); ry.set(-x / 2);
  };

  return (
    <section ref={sec} id="cards" aria-label={`${t("cardsT1")} ${t("cardsT2")}`} onPointerMove={move}
      className="relative isolate flex flex-col overflow-hidden bg-[#0a0a0a]/80 text-[#e0e0e0] md:block md:h-[calc(82svh*var(--vz,1))] md:min-h-[560px]">
      <div aria-hidden className="tc-grain pointer-events-none absolute inset-0 z-20" />
      <div aria-hidden className="pointer-events-none absolute -inset-[20%] opacity-35 [background-image:repeating-radial-gradient(circle_at_60%_55%,transparent_0,transparent_40px,rgba(255,255,255,.05)_41px,transparent_42px)]" />

      <div className="pointer-events-none relative z-10 max-md:contents md:absolute md:inset-0 md:grid md:grid-cols-2 md:grid-rows-[auto_1fr_auto] md:gap-0 md:p-[clamp(24px,5vw,64px)]">
        <h2 className="m-0 px-4 pt-[72px] max-md:order-1 md:p-0 font-wide text-[clamp(40px,8vw,120px)] font-bold leading-[.85] tracking-[-.04em] text-[#e0e0e0] mix-blend-difference md:col-span-2 md:mt-[clamp(28px,calc(7vh*var(--vz,1)),80px)]">
          {[t("cardsT1"), t("cardsT2")].map((l, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span className={`block ${i ? "chrome" : ""}`} initial={{ y: "100%" }} animate={seen ? { y: 0 } : undefined} transition={{ duration: .9, ease: [0.23, 1, 0.32, 1], delay: i * .12 }}>{l}</motion.span>
              {i === 0 && " "}
            </span>
          ))}
        </h2>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={seen ? { opacity: 1, y: 0 } : undefined} transition={{ duration: .7, delay: .35 }}
          className="pointer-events-auto max-w-[380px] self-start rounded-[18px] max-md:order-3 max-md:mx-4 max-md:mt-2 border border-line-2 bg-[rgba(10,10,10,.82)] px-5 py-[18px] font-sans md:col-start-1 md:mt-7">
          <b className="block text-base tracking-[-.01em] text-white">{t("cardsQ")}</b>
          <p className="mt-1.5 text-sm leading-[1.55] text-muted">{t("cardsA")}</p>
          <a href="/1" className="mt-1.5 inline-block py-2 text-[13.5px] text-white underline underline-offset-[3px]">{t("cardsSee")}</a>
        </motion.div>
        <div className="flex px-4 pb-12 pt-5 max-md:order-4 md:col-span-2 md:items-end md:justify-end md:p-0">
          <a href={guestHref("/dashboard#card")}
            className="pointer-events-auto whitespace-nowrap bg-[#e0e0e0] px-8 py-4 font-wide text-[13px] font-bold tracking-[.04em] text-[#0a0a0a] transition-[background,transform] duration-300 [clip-path:polygon(0_0,100%_0,100%_70%,85%_100%,0_100%)] hover:-translate-y-[5px] hover:bg-white">
            {t("cardsCta")}
          </a>
        </div>
      </div>

      <div className="relative flex h-[300px] items-center max-md:order-2 justify-center overflow-hidden [perspective:1600px] md:absolute md:inset-0 md:h-auto md:justify-end md:pr-[clamp(16px,4vw,72px)]">
        <motion.div style={{ rotateX: srx, rotateZ: srz, rotateY: sry, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: .85 }} animate={seen ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[86vw] md:w-[clamp(320px,48vw,760px)]">
          <div ref={cardBox} className="aspect-[1.586] w-full [container-type:inline-size] rounded-[4.5%] shadow-[0_50px_70px_-20px_rgba(0,0,0,.75)] [&>*]:size-full" />
        </motion.div>
      </div>
    </section>
  );
}
