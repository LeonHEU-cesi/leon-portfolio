# Modèle Logique de Données — leon-portfolio

**Projet :** leon-portfolio
**Auteur :** HEU Léon
**Version :** 1.0 — MLD initial V1
**SGBD cible :** PostgreSQL 16
**ORM :** Prisma 5.x

---

## 1. Vue d'ensemble

Le modèle V1 vise à supporter :
- Auth admin (1 seul user en pratique)
- Catalogue de projets curés (CRUD admin)
- Articles de blog (CRUD admin V1, publication V2)
- Tags partagés entre projets et articles
- Auditing minimal (timestamps `created_at` / `updated_at`)

Hors périmètre V1 : commentaires, newsletter abonnés, visiteurs, logs analytics. Pas de tables associées.

---

## 2. Diagramme texte (ASCII)

```
+-----------+         +--------------+         +----------+
|   User    |         |   Project    |         |   Tag    |
+-----------+         +--------------+         +----------+
| id (PK)   |         | id (PK)      |         | id (PK)  |
| email     |         | slug (UQ)    |         | slug(UQ) |
| password  |         | title        |         | name     |
| name      |         | summary      |         | color    |
| role      |         | content      |         +----------+
| createdAt |         | repoUrl      |              |
| updatedAt |         | demoUrl      |              |
+-----------+         | imageUrl     |              |
                      | status       |              |
                      | isFeatured   |              |
                      | createdAt    |              |
                      | updatedAt    |              |
                      +------+-------+              |
                             |                      |
                             | M:N                  |
                             |                      |
                      +------+--------+      +------+-------+
                      | ProjectTag    |      |  ArticleTag  |
                      | projectId(FK) |      | articleId(FK)|
                      | tagId (FK)    |      | tagId (FK)   |
                      +---------------+      +------+-------+
                                                    |
                                                    |
                      +-----------+                 |
                      |  Article  |                 |
                      +-----------+                 |
                      | id (PK)   |-----------------+
                      | slug (UQ) |
                      | title     |
                      | summary   |
                      | content   |
                      | status    |
                      | publishedAt|
                      | createdAt |
                      | updatedAt |
                      +-----------+
```

---

## 3. Schéma DBML (source)

```dbml
Table users {
  id          uuid       [pk, default: `gen_random_uuid()`]
  email       varchar(255) [unique, not null]
  password    varchar(255) [not null, note: 'bcrypt hash, cost 12']
  name        varchar(100) [not null]
  role        varchar(20) [not null, default: 'admin']
  createdAt   timestamptz [not null, default: `now()`]
  updatedAt   timestamptz [not null, default: `now()`]

  Indexes {
    email [unique]
  }
}

Table projects {
  id          uuid       [pk, default: `gen_random_uuid()`]
  slug        varchar(150) [unique, not null]
  title       varchar(200) [not null]
  summary     varchar(500) [not null]
  content     text       [note: 'MDX']
  repoUrl     varchar(500)
  demoUrl     varchar(500)
  imageUrl    varchar(500)
  status      varchar(20) [not null, default: 'draft', note: 'draft | published']
  isFeatured  boolean    [not null, default: false]
  createdAt   timestamptz [not null, default: `now()`]
  updatedAt   timestamptz [not null, default: `now()`]

  Indexes {
    slug [unique]
    status
    isFeatured
    createdAt
  }
}

Table articles {
  id           uuid       [pk, default: `gen_random_uuid()`]
  slug         varchar(150) [unique, not null]
  title        varchar(200) [not null]
  summary      varchar(500) [not null]
  content      text       [note: 'MDX']
  status       varchar(20) [not null, default: 'draft', note: 'draft | published']
  publishedAt  timestamptz
  createdAt    timestamptz [not null, default: `now()`]
  updatedAt    timestamptz [not null, default: `now()`]

  Indexes {
    slug [unique]
    status
    publishedAt
  }
}

Table tags {
  id          uuid       [pk, default: `gen_random_uuid()`]
  slug        varchar(80) [unique, not null]
  name        varchar(80) [not null]
  color       varchar(7) [note: 'Hex color, ex #3B82F6']
  createdAt   timestamptz [not null, default: `now()`]

  Indexes {
    slug [unique]
  }
}

Table project_tags {
  projectId   uuid       [not null, ref: > projects.id]
  tagId       uuid       [not null, ref: > tags.id]
  createdAt   timestamptz [not null, default: `now()`]

  Indexes {
    (projectId, tagId) [pk]
  }
}

Table article_tags {
  articleId   uuid       [not null, ref: > articles.id]
  tagId       uuid       [not null, ref: > tags.id]
  createdAt   timestamptz [not null, default: `now()`]

  Indexes {
    (articleId, tagId) [pk]
  }
}
```

---

## 4. Schéma Prisma (`web/prisma/schema.prisma`)

```prisma
// Source de vérité côté codebase

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Project {
  id         String        @id @default(uuid())
  slug       String        @unique
  title      String
  summary    String
  content    String?
  repoUrl    String?
  demoUrl    String?
  imageUrl   String?
  status     ProjectStatus @default(DRAFT)
  isFeatured Boolean       @default(false)
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  tags ProjectTag[]

  @@index([status])
  @@index([isFeatured])
  @@index([createdAt])
  @@map("projects")
}

model Article {
  id          String        @id @default(uuid())
  slug        String        @unique
  title       String
  summary     String
  content     String?
  status      ArticleStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  tags ArticleTag[]

  @@index([status])
  @@index([publishedAt])
  @@map("articles")
}

model Tag {
  id        String   @id @default(uuid())
  slug      String   @unique
  name      String
  color     String?
  createdAt DateTime @default(now())

  projects ProjectTag[]
  articles ArticleTag[]

  @@map("tags")
}

model ProjectTag {
  projectId String
  tagId     String
  createdAt DateTime @default(now())

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([projectId, tagId])
  @@map("project_tags")
}

model ArticleTag {
  articleId String
  tagId     String
  createdAt DateTime @default(now())

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([articleId, tagId])
  @@map("article_tags")
}

enum ProjectStatus {
  DRAFT
  PUBLISHED
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
}
```

---

## 5. DDL généré (extrait Postgres)

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- pour gen_random_uuid()

-- Enums
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- Users
CREATE TABLE users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      varchar(255) NOT NULL UNIQUE,
  password   varchar(255) NOT NULL,
  name       varchar(100) NOT NULL,
  role       varchar(20)  NOT NULL DEFAULT 'admin',
  created_at timestamptz  NOT NULL DEFAULT now(),
  updated_at timestamptz  NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        varchar(150) NOT NULL UNIQUE,
  title       varchar(200) NOT NULL,
  summary     varchar(500) NOT NULL,
  content     text,
  repo_url    varchar(500),
  demo_url    varchar(500),
  image_url   varchar(500),
  status      "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
  is_featured boolean      NOT NULL DEFAULT false,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX projects_status_idx ON projects(status);
CREATE INDEX projects_is_featured_idx ON projects(is_featured);
CREATE INDEX projects_created_at_idx ON projects(created_at DESC);

-- Articles
CREATE TABLE articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         varchar(150) NOT NULL UNIQUE,
  title        varchar(200) NOT NULL,
  summary      varchar(500) NOT NULL,
  content      text,
  status       "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
  published_at timestamptz,
  created_at   timestamptz  NOT NULL DEFAULT now(),
  updated_at   timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX articles_status_idx ON articles(status);
CREATE INDEX articles_published_at_idx ON articles(published_at DESC);

-- Tags
CREATE TABLE tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       varchar(80) NOT NULL UNIQUE,
  name       varchar(80) NOT NULL,
  color      varchar(7),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Pivot project_tags
CREATE TABLE project_tags (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id     uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, tag_id)
);

-- Pivot article_tags
CREATE TABLE article_tags (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id     uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (article_id, tag_id)
);
```

---

## 6. Seed initial

Le seed peuple :
- 1 admin (toi) : email lu depuis `ADMIN_EMAIL`, mot de passe `ADMIN_PASSWORD` (hash bcrypt cost 12), name `Léon HEU`, role `admin`
- 8 tags : `React`, `Next.js`, `TypeScript`, `Tailwind`, `Node.js`, `Postgres`, `Docker`, `Expo`
- 3 projets exemples (status `published`, isFeatured `true` sur 2) pour valider la grille
- 1 article exemple (status `draft`)

Le script est dans `web/prisma/seed.ts` et déclenché via `npm run db:seed`.

---

## 7. Évolutions prévues (V2 et +)

| Évolution | Justification | Impact MLD |
|---|---|---|
| Table `media` séparée | Externaliser les images (S3 ou volume) | Nouvelle table + FK depuis projects/articles |
| Auditing complet | Suivre qui a modifié quoi | Champs `created_by`, `updated_by` + table `audit_log` |
| Multi-langue | Si version EN un jour | Champs `*_fr` / `*_en` ou table `translations` |
| Commentaires articles | Si décision V2+ | Nouvelles tables `comments`, `comment_likes` |
| Statistiques de vues | Tracking lecture | Table `article_views` ou intégration Plausible |
| Visiteurs / abonnés | Newsletter (hors périmètre actuel) | Table `subscribers` |
