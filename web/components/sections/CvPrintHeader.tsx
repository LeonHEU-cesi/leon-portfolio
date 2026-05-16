// En-tête visible uniquement à l'impression (.print-only) : identité +
// contact en tête du PDF généré depuis /cv.
export function CvPrintHeader({
  name = "Léon HEU",
  title = "Concepteur Développeur d'Applications",
  email = "leonheu97@gmail.com",
  site = "leonheu.fr",
  github = "github.com/LeonHEU-cesi",
}: {
  name?: string;
  title?: string;
  email?: string;
  site?: string;
  github?: string;
}) {
  return (
    <div className="print-only mb-8 border-b border-black pb-4">
      <p className="text-2xl font-semibold">{name}</p>
      <p className="text-sm">{title}</p>
      <p className="mt-1 text-xs">
        {email} · {site} · {github}
      </p>
    </div>
  );
}
