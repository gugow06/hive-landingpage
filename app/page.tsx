import { JsonLd } from "@/components/json-ld";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Workflow } from "@/components/workflow";
import { Team } from "@/components/team";
import { Memory } from "@/components/memory";
import { Audit } from "@/components/audit";
import { Connectors } from "@/components/connectors";
import { Community } from "@/components/community";
import { Faq } from "@/components/sections";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { faqLd, graph, organizationLd, softwareLd, websiteLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={graph(organizationLd(), websiteLd(), softwareLd(), faqLd())} />
      <SmoothScroll />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {/* Equipe e execução vêm antes do fluxo: primeiro a pessoa vê quem faz o
            trabalho, depois por onde ele passa. É também a ordem do menu. */}
        <Team />
        <Workflow />
        <Memory />
        <Audit />
        <Connectors />
        {/* Prova social e comunidade vêm antes das dúvidas: o visitante vê que outras equipes
            usam, e o FAQ fecha as últimas objeções logo antes do rodapé. */}
        <Community />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
