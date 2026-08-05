
export default function CreationCreditsView({
  credits = [],
  LinkComponent = "a",
}) {
  return (
    <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        Credits
      </p>

      <div className="mt-3 grid gap-3">
        {credits.map((credit) => (
          <div key={credit.id}>
            <p className="text-sm text-[var(--foreground)]">
              {credit.kindLabel} from{" "}
              {credit.creatorHref ? (
                <LinkComponent
                  href={credit.creatorHref}
                  className="text-[var(--muted-gold)] transition hover:text-[var(--foreground)]"
                >
                  {credit.creatorHandle}
                </LinkComponent>
              ) : (
                <span className="text-[var(--muted-gold)]">
                  {credit.creatorHandle}
                </span>
              )}
            </p>

            {credit.assetTitle ? (
              <span className="mt-1 text-xs leading-5 text-[var(--muted)]">
                {credit.assetTitle}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
