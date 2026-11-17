"use client";
import { useState } from "react";
import { HandleProvider } from "@/lib/handle";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Cards from "@/components/Cards";
import EditDemo from "@/components/EditDemo";
import Stats from "@/components/Stats";
import Weekly from "@/components/Weekly";
import Plans from "@/components/Plans";
import { Dock, Final, Footer, PageEffects } from "@/components/Final";

export default function Landing() {
  const [atFinal, setAtFinal] = useState(false);
  return (
    <HandleProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black">Vai al contenuto</a>
      <Nav />
      <main id="main">
        <Hero />
        <Cards />
        <EditDemo />
        <Stats />
        <Weekly />
        <Plans />
        <Final onSeen={setAtFinal} />
      </main>
      <Footer />
      <Dock hidden={atFinal} />
      <PageEffects />
    </HandleProvider>
  );
}
