import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type TokensProps = {
  mode: "editorial" | "tech";
  theme: "light" | "dark";
};

const SWATCHES = [
  { name: "background", description: "Fond principal" },
  { name: "foreground", description: "Texte principal" },
  { name: "primary", description: "Couleur d'accent dominante" },
  { name: "secondary", description: "Texte secondaire / sous-titres" },
  { name: "muted", description: "Surfaces atténuées (cards)" },
  { name: "accent", description: "Highlights / CTA" },
  { name: "destructive", description: "Erreurs / actions destructives" },
  { name: "border", description: "Bordures discrètes" },
] as const;

function TokensPanel({ mode, theme }: TokensProps) {
  return (
    <div
      data-mode={mode}
      data-theme={theme}
      style={{
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "2rem",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          marginBottom: "0.5rem",
        }}
      >
        Tokens — mode {mode} / theme {theme}
      </h1>
      <p style={{ color: "var(--secondary)", marginBottom: "2rem" }}>
        Direction visuelle hybride A+C — palette OKLCH, polices via{" "}
        <code style={{ fontFamily: "var(--font-mono)" }}>next/font/google</code>.
      </p>

      <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>Palette</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {SWATCHES.map((s) => (
          <div
            key={s.name}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              background: "var(--muted)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "60px",
                background: `var(--${s.name})`,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                marginBottom: "0.5rem",
              }}
            />
            <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
              --{s.name}
            </strong>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.8rem",
                marginTop: "0.25rem",
              }}
            >
              {s.description}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>Typographie</h2>
      <div style={{ display: "grid", gap: "1rem", marginBottom: "2.5rem" }}>
        <div>
          <div style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>--font-display</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}>
            Léon HEU — Portfolio
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>--font-body</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "1.125rem" }}>
            Développeur full-stack basé en France. Voici mon parcours, mes projets et mes expérimentations
            techniques.
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>--font-mono</div>
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
            const portfolio = await fetch(&apos;/api/projects&apos;).then(r =&gt; r.json());
          </code>
        </div>
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>Radius</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem" }}>
        {["sm", "md", "lg", "xl"].map((r) => (
          <div
            key={r}
            style={{
              width: "80px",
              height: "80px",
              background: "var(--primary)",
              borderRadius: `var(--radius-${r})`,
              color: "var(--primary-foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
            }}
          >
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof TokensPanel> = {
  title: "Design System/Tokens",
  component: TokensPanel,
  parameters: { layout: "fullscreen" },
  argTypes: {
    mode: { control: "select", options: ["editorial", "tech"] },
    theme: { control: "select", options: ["light", "dark"] },
  },
};

export default meta;
type Story = StoryObj<typeof TokensPanel>;

export const EditorialLight: Story = { args: { mode: "editorial", theme: "light" } };
export const EditorialDark: Story = { args: { mode: "editorial", theme: "dark" } };
export const TechDark: Story = { args: { mode: "tech", theme: "dark" } };
export const TechLight: Story = { args: { mode: "tech", theme: "light" } };
