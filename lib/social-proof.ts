/**
 * Prova social e logos de clientes.
 *
 * As duas listas estão VAZIAS de propósito: as seções correspondentes só
 * aparecem na página quando houver conteúdo real aqui. Depoimento inventado
 * numa landing é propaganda enganosa, então nada de texto de exemplo que
 * alguém possa confundir com cliente de verdade.
 *
 * Para publicar, preencha as listas abaixo — a seção aparece sozinha.
 */

export interface Testimonial {
  /** Quem falou. */
  name: string;
  /** Cargo, como a pessoa se apresenta. */
  role: string;
  company: string;
  /** De 1 a 5. */
  rating: number;
  quote: string;
  /** Arquivo em `public/social/`, opcional. */
  avatar?: string;
}

export interface Customer {
  name: string;
  /** Arquivo em `public/social/`; sem ele o nome aparece como texto. */
  logo?: string;
  darkLogo?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // {
  //   name: "Nome da pessoa",
  //   role: "Founder",
  //   company: "Empresa",
  //   rating: 5,
  //   quote: "O que ela realmente disse.",
  //   avatar: "pessoa.jpg",
  // },
];

export const CUSTOMERS: Customer[] = [
  // { name: "Empresa", logo: "empresa.svg", darkLogo: "empresa-dark.svg" },
];
