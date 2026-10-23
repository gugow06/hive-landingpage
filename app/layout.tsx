import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/seo";
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

const TITLE = "Hive: equipe de agentes de IA com memória e auditoria";
const description =
  "Organize agentes de IA numa equipe, com hierarquia, memória compartilhada e auditoria. Gratuito, de código aberto, para Windows, macOS e Linux.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Hive",
  },
  description,
  applicationName: "Hive",
  keywords: [
    "agentes de IA",
    "equipe de agentes de IA",
    "orquestração de agentes de IA",
    "memória compartilhada para IA",
    "grafo de conhecimento",
    "auditoria de agentes",
    "Claude Code",
    "Codex",
    "Gemini CLI",
    "código aberto",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Hive",
    url: "/",
    title: TITLE,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <ThemeProvider>
          {children}
          <CookieNotice />
        </ThemeProvider>
      </body>
    </html>
  );
}
