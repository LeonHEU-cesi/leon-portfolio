// Validation/normalisation pure des entrées projet admin (sans I/O).
export type ProjectStatusInput = "DRAFT" | "PUBLISHED";

export type ProjectInput = {
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  status: ProjectStatusInput;
  tagSlugs: string[];
};

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export type ValidationResult =
  | { ok: true; data: ProjectInput }
  | { ok: false; error: string };

export function validateProjectInput(form: FormData): ValidationResult {
  const title = str(form.get("title"));
  if (!title) return { ok: false, error: "Le titre est requis." };

  const rawSlug = str(form.get("slug"));
  const slug = slugify(rawSlug || title);
  if (!slug) return { ok: false, error: "Slug invalide." };

  const summary = str(form.get("summary"));
  if (!summary) return { ok: false, error: "Le résumé est requis." };

  const statusRaw = str(form.get("status"));
  const status: ProjectStatusInput =
    statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  const content = str(form.get("content")) || null;
  const repoUrl = str(form.get("repoUrl")) || null;
  const demoUrl = str(form.get("demoUrl")) || null;

  const tagSlugs = Array.from(
    new Set(
      str(form.get("tags"))
        .split(",")
        .map((t) => slugify(t))
        .filter(Boolean),
    ),
  );

  return {
    ok: true,
    data: { title, slug, summary, content, repoUrl, demoUrl, status, tagSlugs },
  };
}
