
import StudioBackLinkView from "@/components/studio/studio-back-link/StudioBackLink.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";

export default function AccountStubPageView({
  eyebrow = "Account",
  title = "",
  description = "",
  cards = [],
  notice = "",
  backHref = "/studio/account",
  backLabel = "Back to Account",
  returnHref = "/studio/account",
  returnLabel = "Return to Account",
  LinkComponent = "a",
}) {
  const visibleCards = Array.isArray(cards) ? cards : [];

  return (
    <div className="space-y-8">
      <StudioBackLinkView
        href={backHref}
        label={backLabel}
        LinkComponent={LinkComponent}
      />

      <StudioPageHeaderView
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {visibleCards.map((card, index) => (
          <section
            key={card?.id ?? `${card?.title ?? "account-card"}-${index}`}
            className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-5"
          >
            {card?.eyebrow ? (
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {card.eyebrow}
              </p>
            ) : null}

            {card?.title ? (
              <h2 className="mt-3 font-serif text-2xl text-[var(--foreground)]">
                {card.title}
              </h2>
            ) : null}

            {card?.body ? (
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {card.body}
              </p>
            ) : null}
          </section>
        ))}
      </div>

      {notice ? (
        <div className="rounded-2xl border border-[var(--muted-gold)]/15 bg-black/20 p-5 text-sm leading-7 text-[var(--muted)]">
          {notice}
        </div>
      ) : null}

      <LinkComponent
        href={returnHref}
        className="inline-flex rounded-xl border border-[var(--muted-gold)]/25 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/60 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
      >
        {returnLabel}
      </LinkComponent>
    </div>
  );
}
