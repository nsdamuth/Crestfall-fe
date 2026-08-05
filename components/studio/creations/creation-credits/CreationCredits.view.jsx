
export default function CreationCreditsView({
  credits = [],
  LinkComponent = "a",
}) {
  return (
    <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        Credits
      </p>

      <div className="mt-3 grid gap-3">
        {credits.map((credit) => (
          <div key={credit.id}>
            <p className="text-sm text-[var(--ink)]">
              {credit.kindLabel} from{" "}
              {credit.creatorHref ? (
                <LinkComponent
                  href={credit.creatorHref}
                  className="text-[var(--gold-ornament)] transition hover:text-[var(--ink)]"
                >
                  {credit.creatorHandle}
                </LinkComponent>
              ) : (
                <span className="text-[var(--gold-ornament)]">
                  {credit.creatorHandle}
                </span>
              )}
            </p>

            {credit.assetTitle ? (
              <span className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                {credit.assetTitle}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
