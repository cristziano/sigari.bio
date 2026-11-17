"use client";
// Glass spheres with social logos scattered along the whole page (behind the sections, mostly on the sides).
// They float slowly and keep changing: every few seconds one sphere takes a logo that is not on screen yet.
// Logos are different from the hero's (none of them repeats up there). Only transform/opacity animate, so scrolling stays smooth.
import { useEffect, useState } from "react";
import { reducedMotion } from "@/lib/site";

const ICONS = "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/";
const POOL = ["steam", "riotgames", "epicgames", "soundcloud", "applemusic", "tidal", "lastdotfm", "nintendoswitch", "bandcamp", "genius", "github", "reddit", "snapchat", "pinterest", "threads", "kofi", "paypal", "anilist", "myanimelist", "crunchyroll", "behance", "dribbble", "mastodon", "signal", "cashapp", "bereal", "xbox", "vk", "twitter", "messenger", "line", "wechat", "flickr", "unsplash", "artstation", "deviantart"];

// [left %, top % of the page below the hero, size px, float seconds, opacity, phone too?]
// [left %, top % of the page below the hero, size px, float seconds, opacity, phone too?] — only in the side margins
const SPOTS: [number, number, number, number, number, boolean][] = [
  [3.4, 1.4, 60, 10, 0.6, true], [94.9, 4.7, 68, 11, 0.66, false], [3.8, 7.8, 44, 11, 0.68, false], [96.3, 11.3, 52, 10, 0.61, false], [6.2, 16.0, 52, 12, 0.6, true], [94.0, 18.3, 68, 10, 0.74, false], [4.5, 22.8, 76, 13, 0.62, false], [93.8, 27.3, 76, 9, 0.62, false], [5.3, 30.5, 68, 10, 0.6, true], [95.7, 35.0, 52, 12, 0.68, false], [5.4, 38.9, 52, 13, 0.61, false], [96.7, 42.3, 76, 12, 0.57, false], [3.2, 44.5, 44, 10, 0.71, true], [95.2, 48.3, 68, 13, 0.75, false], [5.9, 52.8, 52, 9, 0.67, false], [96.6, 55.6, 68, 10, 0.62, false], [4.5, 60.6, 52, 11, 0.63, true], [96.7, 63.3, 52, 12, 0.8, false], [5.2, 66.3, 76, 12, 0.59, false], [93.3, 71.7, 68, 9, 0.68, false], [5.3, 74.7, 44, 9, 0.74, true], [96.4, 78.4, 68, 12, 0.7, false], [4.9, 82.0, 52, 10, 0.59, false], [96.4, 87.0, 60, 12, 0.56, false], [6.6, 90.6, 76, 10, 0.79, true], [95.1, 94.3, 60, 9, 0.59, false],
];

export default function SocialDrift() {
  const [icons, setIcons] = useState(() => SPOTS.map((_, i) => POOL[(i * 7) % POOL.length]));
  useEffect(() => {
    if (reducedMotion()) return;
    const id = setInterval(() => {
      setIcons(cur => {
        const free = POOL.filter(p => !cur.includes(p));
        const next = [...cur];
        for (let k = 0; k < 3; k++) next[Math.floor(Math.random() * next.length)] = free.splice(Math.floor(Math.random() * free.length), 1)[0];
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-[100svh] -z-[1] overflow-hidden max-md:opacity-50">
      {SPOTS.map(([x, y, s, d, o, phone], i) => (
        <span key={i} className={`sd-orb absolute ${phone ? "" : "max-md:hidden"}`}
          style={{ left: x + "%", top: y + "%", width: s, height: s, opacity: o, animationDuration: d + "s", animationDelay: -i * 1.3 + "s" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={icons[i]} src={`${ICONS}${icons[i]}.svg`} alt="" loading="lazy" className="sd-logo" onError={e => { e.currentTarget.style.visibility = "hidden"; }} />
        </span>
      ))}
    </div>
  );
}
