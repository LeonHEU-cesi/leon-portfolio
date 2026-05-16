import { slugify } from "@/lib/project-input";

export type TagNameResult =
  | { ok: true; name: string; slug: string }
  | { ok: false; error: string };

// Validation/normalisation pure d'un nom de tag.
export function normalizeTagName(raw: unknown): TagNameResult {
  const name = typeof raw === "string" ? raw.trim() : "";
  if (!name) return { ok: false, error: "Le nom du tag est requis." };
  if (name.length > 40) return { ok: false, error: "Nom trop long (40 max)." };
  const slug = slugify(name);
  if (!slug) return { ok: false, error: "Nom invalide." };
  return { ok: true, name, slug };
}
