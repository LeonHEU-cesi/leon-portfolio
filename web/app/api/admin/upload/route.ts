import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { validateUpload, verifyMagicBytes } from "@/lib/upload";

// Upload image admin : auth obligatoire, validation, resize + webp
// (sharp en import paresseux → pas de charge au build), stockage volume.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier requis." }, { status: 400 });
  }

  const check = validateUpload(file.type, file.size);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());

    // Vérification magic-bytes : le contenu réel doit correspondre au
    // type déclaré (défense au-delà de l'extension/MIME annoncé).
    const magic = verifyMagicBytes(file.type, new Uint8Array(input.subarray(0, 12)));
    if (!magic.ok) {
      return NextResponse.json({ error: magic.error }, { status: 400 });
    }

    const sharp = (await import("sharp")).default;
    const output = await sharp(input)
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const filename = `${randomUUID()}.webp`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), output);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("[admin] upload:", error);
    return NextResponse.json(
      { error: "Échec du traitement de l'image." },
      { status: 500 },
    );
  }
}
