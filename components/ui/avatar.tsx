"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

/**
 * Avatar do shadcn/Radix, sem o utilitário `cn` (o site não o usa). A foto carrega com
 * segurança: se a imagem faltar ou falhar, o Radix mostra o `AvatarFallback` (as iniciais).
 */
export function Avatar({ className = "", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={`relative flex size-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    />
  );
}

export function AvatarImage({ className = "", ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={`aspect-square size-full object-cover ${className}`} {...props} />;
}

export function AvatarFallback({ className = "", ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={`flex size-full items-center justify-center rounded-full bg-surface-raised text-sm font-semibold text-ink-soft shadow-[var(--ring-soft)] ${className}`}
      {...props}
    />
  );
}
