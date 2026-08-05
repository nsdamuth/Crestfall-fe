import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";

const pageDefaults = [
  {
    eyebrow: "Community",
    title: "Community Filter Panel",
    body: "Default whether the Community browser filters start open or collapsed.",
    options: [
      "Desktop: Open by default",
      "Mobile: Closed by default",
      "Remember last state later",
    ],
  },
  {
    eyebrow: "My Creations",
    title: "Creation Library Filter Panel",
    body: "Default whether My Creations search, tags, and type filters start open or collapsed.",
    options: [
      "Desktop: Open by default",
      "Mobile: Closed by default",
      "Remember last state later",
    ],
  },
  {
    eyebrow: "Browsing",
    title: "Default Browser View",
    body: "Choose preferred default layouts for creation-heavy pages.",
    options: ["Grid view", "List view later", "Compact cards later"],
  },
  {
    eyebrow: "Image Studio",
    title: "Image Studio Defaults",
    body: "Future defaults for Image Studio mode, grid density, composer drawer behavior, and output settings.",
    options: [
      "Default mode: Image",
      "Mobile grid: Compact",
      "Composer: Collapsed on mobile",
    ],
  },
  {
    eyebrow: "Creation Flow",
    title: "Creator Workflow Defaults",
    body: "Future defaults for builder steps, review panels, visibility, content rating, and draft behavior.",
    options: [
      "New creations start private",
      "SFW by default",
      "Guided builders preferred",
    ],
  },
  {
    eyebrow: "Discovery",
    title: "Discovery Preferences",
    body: "Future defaults for community browsing, creator discovery, canon visibility, and preferred content types.",
    options: [
      "Show community creations",
      "Show official canon",
      "Favorites and liked assets later",
    ],
  },
];

export default function PreferencesPage() {
  return (
    <div className="space-y-8">
      <StudioBackLink href="/studio/account" label="Back to Account" />

      <StudioPageHeader
        eyebrow="Account"
        title="Preferences"
        description="Set default workflow, browsing, discovery, and page behavior preferences for Studio."
      />

      <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Page Defaults
        </p>

        <h2 className="mt-2 font-display text-4xl">
          Default Studio Behavior
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-[var(--muted)]">
          These are placeholder preference controls for global defaults we want
          users to configure later. They are not saved yet, but this page gives
          us a place to collect and organize them as we find more.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pageDefaults.map((setting) => (
            <PreferenceCard key={setting.title} setting={setting} />
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/15 bg-black/20 p-5 text-sm leading-7 text-[var(--muted)]">
        These controls are frontend placeholders. Later, preferences should save
        to a profile/settings table and be consumed by pages like Community, My
        Creations, Image Studio, and creation builders.
      </section>
    </div>
  );
}

function PreferenceCard({ setting }) {
  return (
    <article className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {setting.eyebrow}
      </p>

      <h3 className="mt-2 font-display text-3xl">{setting.title}</h3>

      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {setting.body}
      </p>

      <div className="mt-5 grid gap-2">
        {setting.options.map((option, index) => (
          <button
            key={option}
            type="button"
            disabled
            className={`rounded-xl border px-4 py-3 text-left text-xs uppercase tracking-[0.14em] ${
              index === 0
                ? "border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]"
                : "border-white/10 bg-black/30 text-[var(--muted)]"
            } opacity-80`}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
        Save support coming later
      </p>
    </article>
  );
}