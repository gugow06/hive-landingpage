/**
 * Prova social e logos de clientes.
 *
 * Só entra aqui o que a pessoa realmente disse, com a autorização dela. As seções
 * correspondentes só aparecem na página quando houver conteúdo. Depoimento inventado
 * numa landing é propaganda enganosa, então nada de texto de exemplo que
 * alguém possa confundir com cliente de verdade.
 *
 * Para publicar, preencha as listas abaixo — a seção aparece sozinha.
 */

export interface Testimonial {
  /** Quem falou. */
  name: string;
  /** Cargo, como a pessoa se apresenta. Opcional: sem ele aparece só a empresa. */
  role?: string;
  company: string;
  /** De 0 a 5, aceita decimais (4.9). */
  rating: number;
  quote: string;
  /** Arquivo em `public/social/`, opcional. */
  avatar?: string;
  /** Link do relato original (post, vídeo), opcional: o cartão inteiro vira link. */
  href?: string;
}

export interface Customer {
  name: string;
  /** Arquivo em `public/social/`; sem ele o nome aparece como texto. */
  logo?: string;
  darkLogo?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Eric Shodi Sakamoto",
    company: "ATMOS",
    rating: 5,
    quote:
      "Com o Hive, conseguimos trabalhar de forma mais inteligente com vários agentes de IA. Organizar as responsabilidades e coordenar o trabalho entre eles trouxe um ganho de produtividade para a operação como um todo, desde as atividades do dia a dia até a execução de projetos.",
  },
  {
    name: "Michele Piva",
    company: "Ennov",
    rating: 4.9,
    quote:
      "Na Ennov, usamos o Hive como apoio no desenvolvimento de processos internos e automações. Ter um lugar para organizar as demandas e coordenar os agentes tem sido muito útil para transformar ideias em soluções para a nossa rotina.",
  },
  {
    name: "Gabriel Pires Sakamoto",
    company: "Arca Technology",
    rating: 5,
    quote:
      "Utilizamos o Hive no desenvolvimento de sites e aplicações web. O que mais valorizamos é conseguir dividir o trabalho entre agentes e acompanhar as etapas do projeto. Ele trouxe mais organização para a forma como usamos IA no desenvolvimento.",
  },
  {
    name: "Murillo Mendanha",
    company: "MN Suplementos",
    rating: 4.9,
    quote:
      "O Hive está nos auxiliando em várias frentes da MN Suplementos, da operação e controle às automações e ao marketing. Estamos conseguindo estruturar o uso dos agentes em torno das necessidades reais do negócio. É uma ferramenta que vem ganhando espaço no nosso dia a dia.",
  },
  {
    name: "Eduardo Pessoa",
    company: "Phoenyx Tecnologia",
    rating: 5,
    quote:
      "O Hive tem nos ajudado no desenvolvimento de aplicações Protheus e na automação de atividades. Trabalhar de forma agêntica trouxe um ganho de produtividade para a nossa rotina como um todo, com agentes apoiando diferentes demandas e processos da empresa.",
  },
  {
    name: "Gabriel Reis",
    company: "GWEB",
    rating: 5,
    quote:
      "Na GWEB, aplicamos o Hive ao desenvolvimento de sites e aplicações web. Poder coordenar os agentes e manter as demandas organizadas ajuda bastante na condução dos projetos. É uma forma prática de trazer IA para o trabalho de desenvolvimento.",
  },
];

export const CUSTOMERS: Customer[] = [
  // { name: "Empresa", logo: "empresa.svg", darkLogo: "empresa-dark.svg" },
];
