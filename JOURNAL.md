# Journal de bord — leon-portfolio

> Journal narratif du projet, organisé par Sprint puis par Issue.
> Format imposé : H2 Sprint, H3 Issue, séparateur `---` entre issues. Pas de date (l'historique git fait foi).

## Sprint 0 — Foundations

### Issue #5 — [0.5] Init Next.js 15 + TypeScript strict dans web/

Scaffold initial du projet Next.js dans `web/` via `create-next-app@latest`. La version installée est en réalité Next.js 16.2.6 (dernière stable disponible), supérieure à la cible plan_dev (Next.js 15.x). On conserve cette version 16 plus récente sans réécrire les docs : App Router stable + Tailwind v4 + ESLint 9 + TypeScript 5.x sont rétro-compatibles avec ce qui était prévu.

- Scaffold avec flags `--typescript --tailwind --eslint --app --import-alias "@/*" --use-npm --disable-git --no-agents-md` pour éviter le `AGENTS.md` que Next 16 génère par défaut
- React 19.2.4, Next.js 16.2.6, Tailwind CSS v4 (via `@tailwindcss/postcss`), ESLint 9 flat config
- `tsconfig.json` durci : `strict: true` (déjà fourni) + `noUncheckedIndexedAccess` + `noImplicitOverride` + `forceConsistentCasingInFileNames`, target `ES2022`
- Scripts ajoutés au `package.json` : `typecheck` (`tsc --noEmit`) et `lint:fix` (`eslint --fix`)
- Aucun fichier IA (`CLAUDE.md`, `AGENTS.md`, `.cursor*`) commité

Tests validés :
- `npm run lint` → 0 warning
- `npm run typecheck` → 0 erreur (même avec `noUncheckedIndexedAccess`)
- `npm run build` → succès, 2 routes statiques (`/`, `/_not-found`), compilation ~2s

---
