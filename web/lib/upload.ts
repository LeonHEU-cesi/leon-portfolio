// Validation pure d'un upload image (type + taille). Testable sans I/O.
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 Mo

export type UploadCheck = { ok: true } | { ok: false; error: string };

export function validateUpload(
  type: string | undefined,
  size: number | undefined,
): UploadCheck {
  if (!type || !ALLOWED.includes(type)) {
    return { ok: false, error: "Format non supporté (jpeg, png, webp)." };
  }
  if (!size || size <= 0) {
    return { ok: false, error: "Fichier vide." };
  }
  if (size > MAX_BYTES) {
    return { ok: false, error: "Fichier trop volumineux (5 Mo max)." };
  }
  return { ok: true };
}
