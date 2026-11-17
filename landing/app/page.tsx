"use client";
import { HandleProvider } from "@/lib/handle";
import { LangProvider, useT } from "@/lib/i18n";
import Proof from "@/components/Proof";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Cards from "@/components/Cards";
import EditDemo from "@/components/EditDemo";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Plans from "@/components/Plans";
import { Footer, PageEffects } from "@/components/Footer";

export default function Landing() {
  return <LangProvider><HandleProvider><Page /></HandleProvider></LangProvider>;
}

function Page() {
  const { t } = useT();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black">{t("skip")}</a>
      <Nav />
      <main id="main">
        <Hero />
        <Cards />
        <HowItWorks />
        <EditDemo />
        <Stats />
        <Proof />
        <Plans />
      </main>
      <Footer />
      <PageEffects />
    </>
  );
}
