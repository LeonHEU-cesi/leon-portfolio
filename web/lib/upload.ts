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

// Détecte le vrai type via la signature (magic bytes), indépendamment
// du type déclaré. Renvoie null si signature inconnue.
export function sniffImageType(bytes: Uint8Array): string | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  // WebP : "RIFF"...."WEBP"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

// Vérifie que la signature correspond au type déclaré (et est autorisée).
export function verifyMagicBytes(
  declaredType: string,
  bytes: Uint8Array,
): UploadCheck {
  const sniffed = sniffImageType(bytes);
  if (!sniffed || !ALLOWED.includes(sniffed)) {
    return { ok: false, error: "Signature de fichier non reconnue." };
  }
  if (sniffed !== declaredType) {
    return { ok: false, error: "Le contenu ne correspond pas au type déclaré." };
  }
  return { ok: true };
}
