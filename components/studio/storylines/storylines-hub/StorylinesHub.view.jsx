"use client";

import { BookOpen, Plus } from "lucide-react";

export default function StorylinesHubView({
  heading = "Your Storylines",
  description =
    "Link Stories and Scenarios in order, then define whether the next node starts immediately or waits in open-world play for a trigger.",
  createHref = "/studio/create/storyline",
  createLabel = "Create Storyline",
  loadingMessage = "Loading Storylines...",
  emptyTitle = "No Storylines Yet",
  emptyMessage =
    "Create the continuity path that connects your existing Stories and Scenarios while preserving the same chat between them.",
  cards = [],
  showLoading = false,
  showEmpty = false,
  errorMessage = "",
  InternalLinkComponent = "a",
}) {
  const safeCards = Array.isArray(cards) ? cards : [];

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl">{heading}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <InternalLinkComponent
          href={createHref}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]"
        >
          <Plus size={15} />
          {createLabel}
        </InternalLinkComponent>
      </div>

      {showLoading ? (
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-6 text-sm text-[var(--ink-dim)]">
          {loadingMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[var(--radius-md)] border border-red-400/25 bg-red-400/10 p-5 text-sm text-red-100">
          {errorMessage}
        </div>
      ) : null}

      {showEmpty ? (
        <div className="rounded-[var(--radius-md)] border border-dashed border-white/15 p-10 text-center">
          <BookOpen className="mx-auto text-[var(--gold-ornament)]" size={26} />
          <h3 className="mt-4 font-display text-3xl">{emptyTitle}</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
            {emptyMessage}
          </p>
        </div>
      ) : null}

      {safeCards.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {safeCards.map((card) => (
            <InternalLinkComponent
              key={card.id}
              href={card.href}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-5 transition hover:border-[var(--gold-ornament)]/35"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                {card.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-3xl">{card.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--ink-dim)]">
                {card.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
                {card.nodeCountLabel}
              </p>
            </InternalLinkComponent>
          ))}
        </div>
      ) : null}
    </div>
  );
}
