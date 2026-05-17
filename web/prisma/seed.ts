import { PrismaClient, ProjectStatus, ArticleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

import { isPlaceholderSecret } from "../lib/admin-guard";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change_me_avant_prod";
  const adminName = process.env.ADMIN_NAME ?? "Léon HEU";

  // Garde sécurité : avertir (sans bloquer le seed dev) si le mot de passe
  // admin ou AUTH_SECRET sont laissés à une valeur de placeholder/faible.
  if (isPlaceholderSecret(adminPassword)) {
    console.warn(
      "[seed] ⚠ ADMIN_PASSWORD est faible ou par défaut — à changer impérativement avant toute mise en ligne.",
    );
  }
  if (isPlaceholderSecret(process.env.AUTH_SECRET)) {
    console.warn(
      "[seed] ⚠ AUTH_SECRET absent ou faible — générer via `npx auth secret` avant le Sprint 4 (Auth.js).",
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      name: adminName,
      role: "admin",
    },
  });

  const tagsData = [
    { slug: "react", name: "React", color: "#61DAFB" },
    { slug: "nextjs", name: "Next.js", color: "#000000" },
    { slug: "typescript", name: "TypeScript", color: "#3178C6" },
    { slug: "tailwind", name: "Tailwind", color: "#38BDF8" },
    { slug: "nodejs", name: "Node.js", color: "#3C873A" },
    { slug: "postgres", name: "Postgres", color: "#336791" },
    { slug: "docker", name: "Docker", color: "#2496ED" },
    { slug: "expo", name: "Expo", color: "#000020" },
  ];

  const tags = await Promise.all(
    tagsData.map((data) =>
      prisma.tag.upsert({
        where: { slug: data.slug },
        update: {},
        create: data,
      }),
    ),
  );

  const tagBySlug = Object.fromEntries(tags.map((t) => [t.slug, t.id]));

  const projectsData = [
    {
      slug: "leon-portfolio",
      title: "leon-portfolio",
      summary: "Portfolio personnel dynamique et animé — Next.js 15 + Expo + Postgres.",
      content:
        "## Contexte\nProjet vitrine présentant mes réalisations et compétences techniques.\n\n## Stack\nNext.js 15 (App Router), TypeScript strict, Tailwind v4, Prisma, PostgreSQL 16, Expo SDK 54.\n\n## Démos\n- Hero scroll-driven GSAP\n- Hub GitHub avec cache ISR 24h\n- Dark mode persistant\n\n## Résultats\nLighthouse > 90, WCAG AA, OG dynamiques.",
      repoUrl: "https://github.com/LeonHEU-cesi/leon-portfolio",
      demoUrl: "https://leonheu.fr",
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      tagSlugs: ["nextjs", "typescript", "tailwind", "postgres", "expo"],
    },
    {
      slug: "cesizen",
      title: "CESIZen",
      summary: "Application santé mentale (CESI Bloc 2) — Laravel + Next.js + Expo + Postgres.",
      content:
        "## Contexte\nProjet académique CESI CDA Bloc 2 réalisé en sprint compressé.\n\n## Stack\nLaravel 12 (API REST), Next.js 14, Expo SDK 54, PostgreSQL 16, Sanctum, GitHub Actions.\n\n## Démos\n- 3 modules : Comptes utilisateurs, Informations, Activités de détente\n- Architecture multi-clients (web public, admin, mobile)\n- Tests TU + TF + TNR couvrant API + Web + Mobile",
      repoUrl: "https://github.com/LeonHEU-cesi/cesizen",
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      tagSlugs: ["nextjs", "typescript", "postgres", "expo"],
    },
    {
      slug: "tasknest",
      title: "TaskNest",
      summary: "Gestionnaire de tâches collaboratif temps réel — Next.js + WebSocket + Postgres.",
      content:
        "## Contexte\nApplication de gestion de tâches en équipe avec synchronisation temps réel.\n\n## Stack\nNext.js (App Router), TypeScript, Server Actions, WebSocket, PostgreSQL, Tailwind.\n\n## Démos\n- Tableau Kanban drag & drop\n- Présence collaborative live\n- Notifications optimistes",
      repoUrl: "https://github.com/LeonHEU-cesi/tasknest",
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      tagSlugs: ["nextjs", "typescript", "postgres", "nodejs"],
    },
    {
      slug: "devbox-cli",
      title: "devbox-cli",
      summary: "CLI de scaffolding de projets full-stack avec presets opinionnés.",
      content:
        "## Contexte\nOutil en ligne de commande pour générer des squelettes de projets normalisés (lint, CI, conventions).\n\n## Stack\nNode.js, TypeScript, commander, prompts, Docker.\n\n## Démos\n- Presets Next.js / API / lib\n- Génération CI GitHub Actions\n- Publié sur npm",
      repoUrl: "https://github.com/LeonHEU-cesi/devbox-cli",
      status: ProjectStatus.PUBLISHED,
      isFeatured: false,
      tagSlugs: ["nodejs", "typescript", "docker"],
    },
    {
      slug: "homelab-iac",
      title: "homelab-iac",
      summary: "Infrastructure self-host as code — Proxmox + Docker Compose + Caddy.",
      content:
        "## Contexte\nDescription reproductible de mon homelab : VMs, conteneurs, reverse proxy, sauvegardes.\n\n## Stack\nDocker Compose, Caddy, scripts shell, Node.js (outillage), Proxmox.\n\n## Démos\n- Déploiement reproductible staging/prod\n- TLS automatique Let's Encrypt via Caddy\n- pg_dump + snapshot planifiés",
      repoUrl: "https://github.com/LeonHEU-cesi/homelab-iac",
      status: ProjectStatus.PUBLISHED,
      isFeatured: false,
      tagSlugs: ["docker", "nodejs"],
    },
    {
      slug: "demo-project",
      title: "Demo Project",
      summary: "Projet de démonstration pour tester le CRUD admin.",
      content: "## Description\nProjet exemple en draft pour tester l'éditeur admin.",
      status: ProjectStatus.DRAFT,
      isFeatured: false,
      tagSlugs: ["docker"],
    },
  ];

  for (const data of projectsData) {
    const { tagSlugs, ...projectData } = data;
    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: projectData,
    });

    await prisma.projectTag.deleteMany({ where: { projectId: project.id } });
    await Promise.all(
      tagSlugs.map((slug) => {
        const tagId = tagBySlug[slug];
        if (!tagId) return Promise.resolve();
        return prisma.projectTag.create({
          data: { projectId: project.id, tagId },
        });
      }),
    );
  }

  await prisma.article.upsert({
    where: { slug: "premier-article-draft" },
    update: {},
    create: {
      slug: "premier-article-draft",
      title: "Premier article (draft)",
      summary: "Brouillon d'article technique pour tester l'éditeur admin.",
      content:
        "# Premier article (draft)\n\nLe blog public sera livré en V2.\n\nEn V1, on prépare uniquement la structure DB et l'admin CRUD.",
      status: ArticleStatus.DRAFT,
    },
  });

  const published = projectsData.filter(
    (p) => p.status === ProjectStatus.PUBLISHED,
  ).length;
  const drafts = projectsData.length - published;
  const featured = projectsData.filter((p) => p.isFeatured).length;

  console.log("Seed terminé.");
  console.log(`Admin: ${admin.email}`);
  console.log(`Tags: ${tags.length}`);
  console.log(
    `Projets: ${projectsData.length} (${published} publiés, ${drafts} draft, ${featured} featured)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
