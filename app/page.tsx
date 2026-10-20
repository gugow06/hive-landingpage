import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Agents } from "@/components/agents";
import { Benefits } from "@/components/benefits";
import { Connectors } from "@/components/connectors";
import { Customers, SocialProof } from "@/components/social-proof";
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
        {/* Logo abaixo do herói: confirma a promessa antes de a pessoa rolar. */}
        <Customers />
        <Agents />
        <Benefits />
        <Problem />
        <HowItWorks />
        <Memory />
        <Connectors />
        <Differential />
        {/* Depois dos diferenciais e antes do público: quem já provou, então
            para quem é. */}
        <SocialProof />
        <Audience />
        <Faq />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
