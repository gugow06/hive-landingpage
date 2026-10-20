import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Agents } from "@/components/agents";
import { Benefits } from "@/components/benefits";
import { Audience, Differential, Faq, Footer, HowItWorks, Memory, Problem } from "@/components/sections";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Waitlist } from "@/components/waitlist";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Agents />
        <Benefits />
        <Problem />
        <HowItWorks />
        <Memory />
        <Differential />
        <Audience />
        <Faq />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
