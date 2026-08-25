"use client";

// Ported from the old-design credits panel
// (components/studio/creations/creation-credits/, read-only
// reference) onto current tokens (R11). Empty credits render null,
// never the old design's literal `0` text-node bug
// (credits.length && CreditsComponent).
export default function KitCreditsView({ credits = [], LinkComponent = "a" }) {
  if (!credits.length) return null;

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        Credits
      </p>

      <div className="mt-[var(--space-3)] grid gap-[var(--space-3)]">
        {credits.map((credit) => (
          <div key={credit.id}>
            <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {credit.kindLabel} from{" "}
              {credit.creatorHref ? (
                <LinkComponent
                  href={credit.creatorHref}
                  className="text-[var(--ink)] transition-colors hover:text-[var(--gold-ornament)]"
                >
                  {credit.creatorHandle}
                </LinkComponent>
              ) : (
                <span className="text-[var(--ink)]">{credit.creatorHandle}</span>
              )}
            </p>

            {credit.assetTitle ? (
              <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
                {credit.assetTitle}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
