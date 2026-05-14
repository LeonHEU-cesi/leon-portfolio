"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TECH_PATH_PREFIXES = ["/projets", "/admin", "/blog"];

function detectMode(pathname: string): "editorial" | "tech" {
  return TECH_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ? "tech" : "editorial";
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mode = detectMode(pathname);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
  }, [mode]);

  return <>{children}</>;
}
