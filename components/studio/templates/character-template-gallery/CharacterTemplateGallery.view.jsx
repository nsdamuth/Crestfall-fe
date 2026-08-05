import { Copy, Sparkles, UserRound } from "lucide-react";

export default function CharacterTemplateGalleryView({
  templates = [],
  createTemplateHref = "",
  createTemplateLabel = "Create Template",
  sidebarEyebrow = "Template Library",
  sidebarTitle = "Reusable Archetypes",
  sidebarBody = "",
  useTemplateLabel = "Use Template Soon",
  duplicateLabel = "Duplicate Soon",
  LinkComponent = "a",
}) {
  const safeTemplates = Array.isArray(templates) ? templates : [];

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="grid gap-5 md:grid-cols-2">
        {safeTemplates.map((template, index) => (
          <article
            key={template.id || `${template.title || "template"}-${index}`}
            className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-5"
          >
            {template.category ? (
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                {template.category}
              </p>
            ) : null}

            <h2 className="mt-2 font-display text-4xl">
              {template.title || "Untitled Template"}
            </h2>

            {template.description ? (
              <p className="mt-3 leading-7 text-[var(--ink-dim)]">
                {template.description}
              </p>
            ) : null}

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <DisabledAction icon={UserRound}>
                {useTemplateLabel}
              </DisabledAction>
              <DisabledAction icon={Copy}>{duplicateLabel}</DisabledAction>
            </div>
          </article>
        ))}

        {safeTemplates.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-8 text-center md:col-span-2">
            <h2 className="font-display text-2xl">No templates available</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
              Built-in and creator-made character templates will appear here.
            </p>
          </div>
        ) : null}
      </div>

      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        {sidebarEyebrow ? (
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            {sidebarEyebrow}
          </p>
        ) : null}

        <h2 className="mt-2 font-display text-3xl">
          {sidebarTitle || "Reusable Archetypes"}
        </h2>

        {sidebarBody ? (
          <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
            {sidebarBody}
          </p>
        ) : null}

        {createTemplateHref ? (
          <LinkComponent
            href={createTemplateHref}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
          >
            <Sparkles size={14} />
            {createTemplateLabel}
          </LinkComponent>
        ) : null}
      </aside>
    </section>
  );
}

function DisabledAction({ icon: Icon, children }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)] opacity-65"
    >
      <Icon size={13} />
      {children}
    </button>
  );
}
