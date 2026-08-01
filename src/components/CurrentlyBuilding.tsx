const PROJECTS = [
  {
    name: "AppStudioX",
    url: "https://appstudiox.com",
    description: "App and product studio — where the ideas actually ship.",
  },
  {
    name: "AI Vidhyarthi",
    url: "https://aividhyarthi.org",
    description: "AI-assisted learning for students.",
  },
  {
    name: "HerMidLife",
    url: "https://hermidlife.org",
    description: "A platform for women navigating midlife, built with real care.",
  },
  {
    name: "AppRankr",
    url: "https://apprankr.in",
    description: "An ASO tool for tracking and improving app store rankings.",
  },
];

export default function CurrentlyBuilding() {
  return (
    <div className="not-prose mt-12 rounded-xl border border-line p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-ink-soft">
        Currently building
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener"
            className="group block rounded-lg border border-line p-4 transition hover:border-accent"
          >
            <h3 className="font-display text-sm font-semibold text-ink group-hover:text-accent">
              {p.name}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{p.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
