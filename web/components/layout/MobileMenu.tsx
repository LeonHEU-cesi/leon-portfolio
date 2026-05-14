"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets" },
  { href: "/cv", label: "CV" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const prefersReduced = usePrefersReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Esc ferme le menu
  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Body scroll lock pendant ouverture
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Focus le premier lien à l'ouverture, retourne au trigger à la fermeture
  useEffect(() => {
    if (isOpen) {
      const firstLink = drawerRef.current?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Ferme automatiquement quand la route change (back/forward navigation OS).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    close();
  }, [pathname, close]);

  const drawerAnimation = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
      };

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-drawer"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--border)] bg-transparent text-[var(--fg)] transition-colors hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          {isOpen ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.15 }}
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              ref={drawerRef}
              id="mobile-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-2 border-l border-[var(--border)] bg-[var(--bg)] p-6 shadow-xl"
              {...drawerAnimation}
              transition={{ type: "tween", duration: prefersReduced ? 0 : 0.25, ease: "easeOut" }}
            >
              <nav aria-label="Navigation mobile" className="mt-12 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "rounded-md px-4 py-3 text-base font-medium transition-colors",
                        active
                          ? "bg-[var(--muted)] text-[var(--primary)]"
                          : "text-[var(--fg)] hover:bg-[var(--muted)]",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
