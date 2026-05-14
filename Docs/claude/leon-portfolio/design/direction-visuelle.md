# Direction visuelle — leon-portfolio

**Statut :** ⏳ **3 propositions** — choix utilisateur en attente
**Issue :** #10
**Couvre les US :** US-VI-01 (Hero), US-VI-03 (Nav/Footer), US-VI-05 (About), US-VI-06 (prefers-reduced-motion)

---

## Cadre commun aux 3 directions

Quelle que soit la direction retenue, les contraintes suivantes s'appliquent :

| Contrainte | Détail |
|---|---|
| Cible | Recruteurs tech francophones (RH, CTO, lead dev) |
| Accessibilité | WCAG AA strict + `prefers-reduced-motion` honoré |
| Performance | Lighthouse ≥ 90 sur toutes les pages publiques |
| Responsive | Mobile First, 375px → 1280px+ |
| Stack | Tailwind CSS v4 (tokens dans `@theme` de `globals.css`) |
| Dark mode | Obligatoire, persistant via cookie |
| Animations | GSAP (scroll-driven) + Framer Motion (transitions), désactivables |

---

## 🅰️ Direction A — Sobre éditorial

> *« Un portfolio qu'un éditeur de presse haut-de-gamme aurait conçu. »*

### Concept
Mise en page typographique forte avec serif élégant, espaces blancs généreux, hiérarchie claire. Inspiration : _The New York Times_ digital, _Stripe Press_, _Eames Office_. Les animations sont **discrètes** : fade-in au scroll, parallax léger, transitions de page en blur+fade.

### Palette (light)
| Rôle | Hex | Usage |
|---|---|---|
| `background` | `#FAF7F2` | Fond principal (crème chaud) |
| `foreground` | `#1A1A1A` | Texte principal (noir cassé) |
| `primary` | `#3C2415` | Accent (brun chocolat) |
| `secondary` | `#8B7355` | Sous-titres, métadonnées |
| `muted` | `#E8E2D5` | Cards, séparateurs |
| `accent` | `#C4514C` | CTA, highlights (rouge brique) |
| `destructive` | `#9B2C2C` | Erreurs |

### Palette (dark)
| Rôle | Hex |
|---|---|
| `background` | `#0F0E0C` |
| `foreground` | `#F5F0E8` |
| `primary` | `#D4B896` |
| `accent` | `#E07A5F` |

### Typographie
- **Display / Headings** : *Fraunces* (serif variable, Google Fonts)
- **Body** : *Inter* (sans-serif neutre, Google Fonts)
- **Code/Mono** : *JetBrains Mono*

### Animations caractéristiques
- Hero : titre apparaît par lettre (stagger) + sous-titre fade-up + CTA reveal
- Scroll : sections fade-up à 200ms avec offset léger
- Cards projets : tilt subtil au hover (3-5°), shadow douce
- Transition pages : crossfade 300ms + scale 1.02 → 1

### Forces
- ✅ Signal "maturité" et "qualité éditoriale" — rassure les recruteurs corp
- ✅ A11y facile à tenir (contrastes élevés, anim limitées)
- ✅ Lighthouse 95+ accessible sans effort
- ✅ Lisibilité maximale pour le CV et l'About

### Faiblesses
- ❌ Moins "wahou" en démo tech — paraît "calme" face à un brutaliste
- ❌ Moins de surface pour démontrer GSAP / WebGL si on en reste là
- ❌ Risque "ennuyeux" si on néglige le hero

### Références à mood-boarder
- https://stripe.com (sobriété + détails)
- https://linear.app (clean + typographie)
- https://baseline.is (portfolio éditorial)

---

## 🅱️ Direction B — Brutaliste moderne

> *« Un portfolio qui assume sa personnalité de dev/designer. »*

### Concept
Neo-brutalism + détails ludiques. Gros titres display, blocs colorés saturés, ombres dures (offset noir), transitions audacieuses (slide, scale, rotate). Inspiration : _Vercel ship_, _Gumroad rebrand_, _OFFF_ design conferences. Les animations sont **affirmées** : parallax marqué, magnetic cursor, hover scale 1.05+.

### Palette (light)
| Rôle | Hex | Usage |
|---|---|---|
| `background` | `#FFFEF5` | Crème jaune très clair |
| `foreground` | `#000000` | Noir pur |
| `primary` | `#FF5C00` | Accent dominant (orange électrique) |
| `secondary` | `#0066FF` | Accent 2 (bleu Klein) |
| `muted` | `#F0EBDD` | Cards |
| `accent` | `#00D26A` | Vert highlight |
| `destructive` | `#E01E37` | Erreurs (rouge tomate) |

### Palette (dark)
| Rôle | Hex |
|---|---|
| `background` | `#0A0A0A` |
| `foreground` | `#FFFEF5` |
| `primary` | `#FF7733` |
| `accent` | `#00FF99` |

### Typographie
- **Display** : *Space Grotesk* (geometric sans, Google Fonts) — ou *Bricolage Grotesque*
- **Body** : *Geist* (Vercel sans, fonts/Geist) ou *Inter*
- **Code** : *Geist Mono*

### Animations caractéristiques
- Hero : titre énorme + slide latéral des mots + curseur magnétique custom
- Scroll : sections "snap" légers + parallax 0.6x
- Cards projets : tilt 5-8° + shadow noir 8px offset au hover
- Transitions pages : slide horizontal (depuis la droite) + masque coloré
- Bonus : noise grain SVG overlay subtil

### Forces
- ✅ Mémorable — un recruteur s'en souvient
- ✅ Démontre directement la maîtrise GSAP / Framer
- ✅ Identité forte, pas de doute sur la personnalité
- ✅ Dans la tendance 2024-2026 (rejet du flat design générique)

### Faiblesses
- ❌ Plus exigeant en a11y (contrastes orange/jaune à valider)
- ❌ Peut rebuter des recruteurs corp conservateurs (banque, assurance)
- ❌ Risque de surcharge si trop d'effets cumulés
- ❌ Lighthouse plus difficile à tenir (animations lourdes)

### Références à mood-boarder
- https://gumroad.com (brutalist new design)
- https://vercel.com/ship (event sites)
- https://offf.barcelona (festival design)
- https://www.bench.co

---

## 🅲️ Direction C — Tech minimaliste sombre

> *« Un portfolio qui parle à l'oreille des devs et des CTO. »*

### Concept
Dark mode dominant par défaut (light en option), palette monochrome avec accents néons mesurés, monospace omniprésent, micro-animations précises (60fps obligatoire). Inspiration : _Linear_, _Raycast_, _Vercel docs_, _Cloudflare_. Les animations sont **fonctionnelles** : indicateurs hover, transitions fluides, pas d'effet gratuit.

### Palette (dark par défaut)
| Rôle | Hex | Usage |
|---|---|---|
| `background` | `#0A0A0A` | Fond principal (noir profond) |
| `foreground` | `#EDEDED` | Texte principal |
| `primary` | `#00D9FF` | Accent (cyan néon mesuré) |
| `secondary` | `#A1A1A1` | Sous-titres, métadonnées |
| `muted` | `#1A1A1A` | Cards, surfaces secondaires |
| `border` | `#262626` | Bordures discrètes |
| `accent` | `#A78BFA` | Highlights (violet pastel) |
| `destructive` | `#F87171` | Erreurs |

### Palette (light option)
| Rôle | Hex |
|---|---|
| `background` | `#FAFAFA` |
| `foreground` | `#0A0A0A` |
| `primary` | `#0099B8` |
| `accent` | `#6D28D9` |

### Typographie
- **Display** : *Geist* (variable, fonts/Geist)
- **Body** : *Geist*
- **Code/Mono** : *Geist Mono* (utilisé largement, pas juste pour le code)

### Animations caractéristiques
- Hero : grille animée subtile en background (SVG ou Canvas léger) + titre fade-up
- Scroll : opacité progressive sur sections + indicateur de progression
- Cards projets : border highlight au hover + glow néon très léger
- Transitions pages : crossfade rapide 200ms (style Linear)
- Curseur custom (point + cercle, style Raycast)
- Détails : ASCII art, badges code, terminal-like sur le contact

### Forces
- ✅ Cible parfaite : devs, CTO, lead techs
- ✅ Démontre la rigueur technique sans surcharge
- ✅ A11y facile (contrastes élevés sur fond sombre)
- ✅ Lighthouse 95+ tenable
- ✅ Cohérent avec un portfolio orienté "open source / hub GitHub"

### Faiblesses
- ❌ Moins chaleureux pour des recruteurs non-techs
- ❌ Risque "déjà vu" (beaucoup de portfolios devs ressemblent à ça en 2026)
- ❌ Demande de la finesse pour ne pas tomber dans le cliché "matrix"

### Références à mood-boarder
- https://linear.app
- https://raycast.com
- https://vercel.com
- https://supabase.com
- https://www.lcdr.fr (portfolio fr)

---

## Tableau de décision rapide

| Critère | A — Éditorial | B — Brutaliste | C — Tech minimaliste |
|---|---|---|---|
| Cible recruteur corp (banque, assurance) | ★★★★★ | ★★ | ★★★ |
| Cible recruteur startup/scale-up | ★★★ | ★★★★★ | ★★★★ |
| Cible CTO / lead dev | ★★★ | ★★★★ | ★★★★★ |
| Démo compétences animations | ★★ | ★★★★★ | ★★★ |
| Démo compétences perf | ★★★★ | ★★ | ★★★★★ |
| Mémorabilité (recruteur revoit le site) | ★★★ | ★★★★★ | ★★★ |
| A11y AA facile à tenir | ★★★★★ | ★★ | ★★★★ |
| Effort design (custom assets) | ★★ (faible) | ★★★★ (élevé) | ★★★ (moyen) |
| Risque "déjà vu" | ★★ | ★★ | ★★★★ |
| Cohérence avec ton blog technique V2 | ★★★★ | ★★ | ★★★★★ |

---

## Hybridation possible (optionnel)

Si tu hésites, on peut **hybrider** :
- **A + C** : sobre + dark mode tech (typo serif sur landing, mono dans le blog/projets). Élégant et flexible.
- **B + C** : brutaliste light + tech sombre selon le contexte de la page (hero/CV brutaliste, projets/blog tech). Plus complexe à orchestrer.

---

## Choix demandé

Une fois la direction retenue (A / B / C / hybride) :
1. Cette page est mise à jour avec **uniquement la direction retenue** détaillée (les autres restent en annexe "alternatives évaluées")
2. L'issue #11 démarre (tokens design Tailwind v4)
3. L'issue #12 démarre (layout root + Header / Footer)

**À fournir à Claude** :
- Lettre A / B / C ou hybride (préciser)
- Ajustements éventuels (couleur dominante, font alternative, etc.)
