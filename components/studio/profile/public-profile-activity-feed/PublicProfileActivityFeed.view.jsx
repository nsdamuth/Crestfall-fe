import { Gift, Sparkles } from "lucide-react";
import {
  PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS,
  PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_DEFAULTS,
} from "./PublicProfileActivityFeed.contract";

export default function PublicProfileActivityFeedView({
  events = PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_DEFAULTS.events,
  emptyTitle = PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_DEFAULTS.emptyTitle,
  emptyBody = PUBLIC_PROFILE_ACTIVITY_FEED_VIEW_DEFAULTS.emptyBody,
  LinkComponent = "a",
}) {
  const safeEvents = Array.isArray(events) ? events : [];

  if (!safeEvents.length) {
    return (
      <div className="mx-auto mt-5 w-full max-w-5xl rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
        <p className="font-display text-3xl">{emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--ink-dim)]">
          {emptyBody}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-5 w-full space-y-3">
      {safeEvents.map((event, index) =>
        event?.kind === PUBLIC_PROFILE_ACTIVITY_EVENT_KINDS.DONATION ? (
          <DonationActivityRow
            key={event.id || `donation-activity-${index}`}
            event={event}
          />
        ) : (
          <CreationActivityRow
            key={event?.id || `creation-activity-${index}`}
            event={event || {}}
            LinkComponent={LinkComponent}
          />
        )
      )}
    </div>
  );
}

function CreationActivityRow({ event, LinkComponent }) {
  const title = event.title || "Untitled Creation";

  return (
    <article className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
          <Sparkles size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--ink-dim)]">
            <span className="text-[var(--ink)]">
              @{event.username || "creator"}
            </span>{" "}
            {event.actionLabel || "released"} {event.typeLabel || "creation"}.
          </p>

          <LinkComponent
            href={event.href || "#"}
            className="mt-3 flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-[var(--gold-ornament)]/30 hover:bg-[var(--gold-ornament)]/10"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/45">
              {event.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.imageUrl}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--gold-ornament)]">
                  <Sparkles size={18} />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="line-clamp-1 font-display text-xl text-[var(--ink)]">
                {title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
                {event.description || "No description available."}
              </p>
            </div>
          </LinkComponent>

          <p className="mt-3 text-xs text-[var(--ink-dim)]">
            {event.occurredLabel || "Recently"}
          </p>
        </div>
      </div>
    </article>
  );
}

function DonationActivityRow({ event }) {
  return (
    <article className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pink-400/25 bg-pink-400/10 text-pink-200">
          <Gift size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--ink-dim)]">
            Received{" "}
            <span className="font-semibold text-pink-200">
              {event.amountNet} coins
            </span>{" "}
            from{" "}
            <span className="text-[var(--ink)]">
              {event.senderLabel || "Mystery Donor"}
            </span>
          </p>

          {event.message ? (
            <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm italic leading-6 text-[var(--ink-dim)]">
              “{event.message}”
            </p>
          ) : null}

          <p className="mt-3 text-xs text-[var(--ink-dim)]">
            {event.occurredLabel || "Recently"}
          </p>
        </div>
      </div>
    </article>
  );
}
