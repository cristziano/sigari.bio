"use client";
// The @name the visitor is typing: shared by the two claim boxes, the globe label, the dock and the "try it" links.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { HANDLE_RE, RESERVED, firebase } from "./site";

export type Status = { kind: "" | "wait" | "ok" | "no"; text: string };
const HINT: Status = { kind: "", text: "da 1 a 20 tra lettere, numeri o _" };

type Ctx = {
  handle: string;
  setHandle: (h: string) => void;
  status: Status;
  setStatus: (s: Status) => void;
  avail: boolean | null;
  /** /dashboard?handle=… links: the dashboard opens with this name already in */
  guestHref: (base: string) => string;
};
const HandleCtx = createContext<Ctx | null>(null);

export function HandleProvider({ children }: { children: ReactNode }) {
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<Status>(HINT);
  const [avail, setAvail] = useState<boolean | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    const h = handle, mine = ++seq.current;
    setAvail(null);
    if (!h) { setStatus(HINT); return; }
    if (RESERVED.includes(h)) { setAvail(false); setStatus({ kind: "no", text: `@${h} è riservata` }); return; }
    setStatus({ kind: "wait", text: "controllo…" });
    const t = setTimeout(async () => {
      try {
        const { db, fs } = await firebase();
        const snap = await fs.getDoc(fs.doc(db, "usernames", h));
        if (mine !== seq.current) return;
        const free = !snap.exists();
        setAvail(free);
        setStatus(free ? { kind: "ok", text: `@${h} è libera` } : { kind: "no", text: `@${h} è già presa` });
      } catch {
        if (mine === seq.current) setStatus({ kind: "", text: "non riesco a controllare ora, lo vediamo all'iscrizione" });
      }
    }, 320);
    return () => clearTimeout(t);
  }, [handle]);

  const guestHref = (base: string) => {
    const [path, hash] = base.split("#");
    return path + (HANDLE_RE.test(handle) ? "?handle=" + handle : "") + (hash ? "#" + hash : "");
  };

  return <HandleCtx.Provider value={{ handle, setHandle, status, setStatus, avail, guestHref }}>{children}</HandleCtx.Provider>;
}

export function useHandle() {
  const c = useContext(HandleCtx);
  if (!c) throw new Error("useHandle outside HandleProvider");
  return c;
}

/** Scroll to the top and put the cursor in the hero's claim box */
export function focusClaim() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  setTimeout(() => document.getElementById("h1in")?.focus({ preventScroll: true }), reduce ? 0 : 450);
}
