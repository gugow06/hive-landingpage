"use client";

import { ThemeProvider as NextThemes } from "next-themes";

/**
 * O site tem um único tema: o escuro, que é o da marca. Não há mais seletor, então o tema é
 * forçado: sem isso, quem tinha "claro" ou "escuro" salvo no navegador (do seletor antigo), ou
 * um sistema operacional em modo claro, via o site diferente de um visitante novo.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
