/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `next dev` e `next build` escreviam os dois em `.next`: rodar um build com
  // o dev no ar apagava os chunks que o dev servia, e o site passava a
  // responder 500 (MODULE_NOT_FOUND). Cada um ganha a sua pasta; `next start`
  // continua lendo a do build.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

// A página já se chamou /instalacao: quem tem o link antigo continua chegando.
nextConfig.redirects = async () => [{ source: "/instalacao", destination: "/install", permanent: true }];

export default nextConfig;
