import { slugify } from "@/lib/project-input";

// V1 : articles en DRAFT uniquement (pas de publication / page publique).
export type ArticleInput = {
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  tagSlugs: string[];
};

export type ArticleValidation =
  | { ok: true; data: ArticleInput }
  | { ok: false; error: string };

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateArticleInput(form: FormData): ArticleValidation {
  const title = str(form.get("title"));
  if (!title) return { ok: false, error: "Le titre est requis." };

  const slug = slugify(str(form.get("slug")) || title);
  if (!slug) return { ok: false, error: "Slug invalide." };

  const summary = str(form.get("summary"));
  if (!summary) return { ok: false, error: "Le résumé est requis." };

  const content = str(form.get("content")) || null;
  const tagSlugs = Array.from(
    new Set(
      str(form.get("tags"))
        .split(",")
        .map((t) => slugify(t))
        .filter(Boolean),
    ),
  );

  return { ok: true, data: { title, slug, summary, content, tagSlugs } };
}
