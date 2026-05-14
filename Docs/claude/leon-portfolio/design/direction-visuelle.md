# Direction visuelle — leon-portfolio

**Statut :** ✅ **Direction retenue : Hybride A+C (éditorial + tech minimaliste)** — validé par Léon le 2026-05-14
**Issue :** #10
**Couvre les US :** US-VI-01 (Hero), US-VI-03 (Nav/Footer), US-VI-04 (Dark mode), US-VI-05 (About), US-VI-06 (prefers-reduced-motion)

---

## 1. Concept retenu — Hybride éditorial × tech

Le portfolio adopte **deux identités visuelles cohabitant** selon le contexte de la page :

| Mode | Pages concernées | Caractère |
|---|---|---|
| **`editorial`** | `/`, `/cv`, `/about`, `/contact`, `/mentions-legales` | Serif élégant, fond crème, atmosphère "presse haut-de-gamme" |
| **`tech`** | `/projets`, `/projets/[slug]`, `/admin/*`, `/blog/*` (V2) | Mono dominant, fond noir profond, accents néon, ambiance "Linear/Vercel" |

Le **dark mode** se superpose à chaque mode (chacun a sa déclinaison sombre).

### Intention narrative
- L'arrivée sur la landing donne une impression **éditoriale, posée, élégante** — rassurante pour un recruteur corp ou un client freelance.
- En cliquant sur "Projets" ou en entrant dans l'admin, le visiteur bascule dans un **mode "atelier dev"** plus brut, signal direct envers la cible technique.
- Cette dichotomie est en elle-même une **démo de compétence** : maîtrise design + exécution propre du theming dynamique.

---

## 2. Mapping technique

### 2.1 Implémentation Tailwind v4 (à appliquer Issue #11)

Dans `app/globals.css`, on déclare 4 jeux de tokens via CSS variables :

```css
@theme {
  /* ====== Tokens communs (radius, spacing, animations) ====== */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --font-sans-editorial: 'Inter Variable', system-ui, sans-serif;
  --font-serif-editorial: 'Fraunces', Georgia, serif;
  --font-sans-tech: 'Geist Variable', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
}

/* ====== Mode éditorial — light (par défaut) ====== */
[data-mode='editorial']:root,
:root {
  --color-background: oklch(0.97 0.02 80);   /* #FAF7F2 */
  --color-foreground: oklch(0.14 0 0);        /* #1A1A1A */
  --color-primary:    oklch(0.30 0.10 30);    /* #3C2415 */
  --color-secondary:  oklch(0.52 0.05 60);    /* #8B7355 */
  --color-muted:      oklch(0.92 0.02 80);    /* #E8E2D5 */
  --color-accent:     oklch(0.55 0.15 30);    /* #C4514C */
  --font-display: var(--font-serif-editorial);
  --font-body:    var(--font-sans-editorial);
}

/* ====== Mode éditorial — dark ====== */
[data-mode='editorial'][data-theme='dark'] {
  --color-background: oklch(0.10 0.01 60);
  --color-foreground: oklch(0.95 0.02 80);
  --color-primary:    oklch(0.80 0.10 70);
  --color-accent:     oklch(0.65 0.15 30);
}

/* ====== Mode tech — dark (par défaut sur ces pages) ====== */
[data-mode='tech']:root,
[data-mode='tech'][data-theme='dark'] {
  --color-background: oklch(0.05 0 0);        /* #0A0A0A */
  --color-foreground: oklch(0.93 0 0);        /* #EDEDED */
  --color-primary:    oklch(0.78 0.15 220);   /* #00D9FF cyan néon */
  --color-secondary:  oklch(0.63 0 0);        /* #A1A1A1 */
  --color-muted:      oklch(0.10 0 0);        /* #1A1A1A */
  --color-border:     oklch(0.15 0 0);        /* #262626 */
  --color-accent:     oklch(0.70 0.14 290);   /* #A78BFA violet */
  --font-display: var(--font-sans-tech);
  --font-body:    var(--font-sans-tech);
}

/* ====== Mode tech — light (option) ====== */
[data-mode='tech'][data-theme='light'] {
  --color-background: oklch(0.98 0 0);
  --color-foreground: oklch(0.10 0 0);
  --color-primary:    oklch(0.55 0.13 220);
  --color-accent:     oklch(0.50 0.18 290);
}
```

### 2.2 Détection automatique du mode selon route

Dans `app/layout.tsx` (Issue #12), on lit le pathname et on ajoute `data-mode="editorial"` ou `data-mode="tech"` sur le `<html>` ou le `<body>`. Approche via composant client `<ModeProvider>` + `usePathname()`.

```tsx
// web/components/ModeProvider.tsx (Issue #12)
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const TECH_PATHS = ['/projets', '/admin', '/blog'];

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mode = TECH_PATHS.some(p => pathname.startsWith(p)) ? 'tech' : 'editorial';

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  return <>{children}</>;
}
```

Combiné avec `next-themes` pour le dark/light (qui set `data-theme`).

---

## 3. Mode `editorial` — détail

> *« Un portfolio qu'un éditeur de presse haut-de-gamme aurait conçu. »*

### Palette (light, par défaut)
| Rôle | Hex | OKLCH |
|---|---|---|
| `background` | `#FAF7F2` | `oklch(0.97 0.02 80)` |
| `foreground` | `#1A1A1A` | `oklch(0.14 0 0)` |
| `primary` | `#3C2415` | `oklch(0.30 0.10 30)` |
| `secondary` | `#8B7355` | `oklch(0.52 0.05 60)` |
| `muted` | `#E8E2D5` | `oklch(0.92 0.02 80)` |
| `accent` | `#C4514C` | `oklch(0.55 0.15 30)` |

### Palette (dark)
| Rôle | Hex approx |
|---|---|
| `background` | `#0F0E0C` |
| `foreground` | `#F5F0E8` |
| `primary` | `#D4B896` |
| `accent` | `#E07A5F` |

### Typographie
- **Display / Hero** : **Fraunces** (serif variable, Google Fonts) — italique grasse pour les sections titres
- **Body** : **Inter** (sans-serif neutre, déjà fourni par `next/font/google`)

### Animations
- Hero : titre apparaît par lettre (GSAP `SplitText` ou stagger Framer Motion)
- Sous-titre fade-up délai 400ms, CTA reveal 600ms
- Scroll : sections fade-up à 200ms avec offset 20px
- Cards projets : tilt subtil 3-5° + shadow douce, hover scale 1.02
- Transition pages éditorial→éditorial : crossfade 300ms + scale 1.02→1

### Pages cibles
- `/` (Accueil) avec hero éditorial fort
- `/about` avec bio narrative en colonnes presse
- `/cv` avec timeline élégante
- `/contact` avec lien mailto stylé
- `/mentions-legales`

---

## 4. Mode `tech` — détail

> *« Un portfolio qui parle à l'oreille des devs et des CTO. »*

### Palette (dark, par défaut sur ces pages)
| Rôle | Hex | OKLCH |
|---|---|---|
| `background` | `#0A0A0A` | `oklch(0.05 0 0)` |
| `foreground` | `#EDEDED` | `oklch(0.93 0 0)` |
| `primary` | `#00D9FF` | `oklch(0.78 0.15 220)` cyan néon |
| `secondary` | `#A1A1A1` | `oklch(0.63 0 0)` |
| `muted` | `#1A1A1A` | `oklch(0.10 0 0)` |
| `border` | `#262626` | `oklch(0.15 0 0)` |
| `accent` | `#A78BFA` | `oklch(0.70 0.14 290)` violet pastel |

### Palette (light option)
| Rôle | Hex |
|---|---|
| `background` | `#FAFAFA` |
| `foreground` | `#0A0A0A` |
| `primary` | `#0099B8` |
| `accent` | `#6D28D9` |

### Typographie
- **Display + Body** : **Geist** (variable, `geist/font`)
- **Mono** : **Geist Mono** — utilisé largement, badges code, ASCII art décoratif

### Animations
- Hero `/projets` : grille SVG animée subtile en background (10% opacité)
- Cards projets : border highlight cyan + glow néon léger au hover
- Transitions : crossfade rapide 200ms (style Linear)
- Curseur custom (point + cercle, style Raycast) en option Sprint 1
- Transition page tech→tech : pas de delay, juste fade
- Transition éditorial→tech : transition forte "dissolution → terminal boot" (effet glitch léger 400ms)

### Pages cibles
- `/projets` (catalogue avec filtres et hub GitHub)
- `/projets/[slug]` (détail)
- `/admin/*` (back-office)
- `/blog/*` (V2 plus tard)

---

## 5. Cohérence inter-modes

### Éléments partagés (jamais réécrits selon mode)
- Layout root (Header sticky, Footer)
- Logo (texte simple "Léon HEU" en font display du mode actif)
- Toggle dark/light
- Comportement `prefers-reduced-motion` : désactive toutes les transitions complexes, garde fade simple

### Transitions inter-modes
- L'utilisateur ne doit pas être surpris de manière désagréable
- Animation d'environ 400ms entre les 2 contextes (cf. `Transition éditorial→tech`)
- Header reste sticky pendant la transition
- Logo morph entre la fonte serif et la fonte sans-serif

---

## 6. Alternatives évaluées (non retenues)

### 🅱️ Brutaliste moderne — non retenue

Trop risqué pour la cible "recruteurs FR corp" et le tampon a11y plus serré. Mémorabilité forte mais polarisant.

Caractéristiques rapides :
- Palette : `#FFFEF5` + `#FF5C00` (orange) + `#0066FF` (Klein) + `#000`
- Typo : Space Grotesk + Geist
- Animations : magnetic cursor, tilt 5-8°, ombres dures offset 8px

### 🅰️ Sobre éditorial pur (sans hybride)

Devient le mode `editorial` ci-dessus, mais appliqué partout. L'hybride permet d'avoir la flexibilité supplémentaire pour la partie technique.

### 🅲️ Tech minimaliste pur (sans hybride)

Devient le mode `tech` ci-dessus, mais appliqué partout. L'hybride conserve l'avantage éditorial sur la landing pour rassurer.

---

## 7. Issues bloquées par cette décision

- ✅ **#10** Direction visuelle → cette PR
- ▶ **#11** Tokens design Tailwind v4 → implémenter le snippet `@theme` du §2.1
- ▶ **#12** Layout root + Header / Footer → intégrer `<ModeProvider>` et préparer la transition inter-modes

## 8. Références à mood-boarder (Sprint 1)

### Mode éditorial
- https://stripe.com (sobriété + détails)
- https://linear.app/method (typographie serif éditoriale)
- https://baseline.is (portfolio éditorial)
- https://nytimes.com/design (presse)

### Mode tech
- https://linear.app (UI tech minimaliste)
- https://raycast.com (curseur custom, micro-interactions)
- https://vercel.com (dark + accents)
- https://supabase.com
