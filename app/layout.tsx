import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const description =
  "O Hive conecta um time hierárquico de agentes de IA a uma memória integrada — o segundo cérebro da empresa. Os agentes agem com base no que já foi decidido. Você mantém o controle total.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hive.dev.br"),
  title: {
    default: "Hive — O time de IA da sua empresa, ordenado e sob controle",
    template: "%s · Hive",
  },
  description,
  keywords: [
    "agentes de IA",
    "orquestração de agentes",
    "memória de IA",
    "grafo de conhecimento",
    "governança de IA",
    "indie hacker",
    "solopreneur",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Hive",
    title: "Hive — O time de IA da sua empresa, ordenado e sob controle",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Hive — O time de IA da sua empresa",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
