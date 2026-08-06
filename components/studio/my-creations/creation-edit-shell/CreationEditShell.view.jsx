import { UserRound } from "lucide-react";

export default function CreationEditShellView({
  creationId,
  title = "Untitled Creation",
  isTemplate = false,
  activeSection = "overview",
  activeSections = [],
  canSetDefaultPc = false,
  settingDefaultPc = false,
  onSetDefaultPc,
  onSelectSection,
  showMechanicsQuickNav = false,
  backAction = null,
  mediaPanel = null,
  mechanicsQuickNav = null,
  sectionContent = null,
  stickyActionBar = null,
  featuredImagePicker = null,
}) {
  return (
    <section className="mt-8 pb-28">
      <div className="grid gap-6 xl:grid-cols-[0.42fr_1fr]">
        <div className="space-y-5 self-start">
          {mediaPanel}

          {showMechanicsQuickNav ? mechanicsQuickNav : null}
        </div>

        <div className="space-y-5">
          <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
                  {isTemplate ? "Editing Template" : "Editing"}
                </p>
                <h2 className="mt-2 font-display text-4xl">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-[var(--ink-dim)]">
                  Creation ID:{" "}
                  <span className="text-[var(--ink)]">
                    {creationId}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canSetDefaultPc ? (
                  <button
                    type="button"
                    onClick={() => onSetDefaultPc?.()}
                    disabled={settingDefaultPc}
                    className="cf-btn cf-btn--secondary"
                  >
                    <UserRound size={14} />
                    {settingDefaultPc ? "Setting..." : "Set default PC"}
                  </button>
                ) : null}

                {backAction}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {activeSections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => onSelectSection?.(section.id)}
                    className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                      active
                        ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                        : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
                    }`}
                  >
                    {Icon ? <Icon size={14} /> : null}
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
            {sectionContent}
          </div>
        </div>
      </div>

      {stickyActionBar}
      {featuredImagePicker}
    </section>
  );
}
