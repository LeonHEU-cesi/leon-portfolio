// Détecte un secret/mot de passe admin laissé à une valeur de placeholder
// ou trop faible. Pur → testable, utilisé par le seed (avertissement).
const PLACEHOLDERS = [
  "change_me_avant_prod",
  "change_me",
  "changeme",
  "password",
  "admin",
  "secret",
  "test",
];

export function isPlaceholderSecret(value: string | undefined | null): boolean {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  if (v.length < 12) return true;
  return PLACEHOLDERS.some((p) => v === p || v.includes(p));
}
