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
            className="cf-btn cf-btn--primary mt-5 w-full"
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
      className="cf-btn cf-btn--secondary cf-btn--sm"
    >
      <Icon size={13} />
      {children}
    </button>
  );
}
