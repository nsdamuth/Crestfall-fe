"use client";

import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  PenLine,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

function CreationEngagementButtons({
  liked = false,
  bookmarked = false,
  canLike = false,
  canBookmark = false,
  onToggleLike,
  onToggleBookmark,
}) {
  if (!canLike && !canBookmark) return null;

  return (
    <>
      {canLike ? (
        <button
          type="button"
          onClick={onToggleLike}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
            liked
              ? "border-pink-400/45 bg-pink-400/15 text-pink-200"
              : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
          }`}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
          {liked ? "Liked" : "Like"}
        </button>
      ) : null}

      {canBookmark ? (
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
            bookmarked
              ? "border-pink-400/45 bg-pink-400/15 text-pink-200"
              : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
          }`}
        >
          <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      ) : null}
    </>
  );
}

function PreviewActions({
  context,
  editHref,
  catalogueHref,
  supportsChat = false,
  canSetDefaultPc = false,
  isShareable = false,
  liked = false,
  bookmarked = false,
  canLike = false,
  canBookmark = false,
  startingChat = false,
  settingDefaultPc = false,
  onToggleLike,
  onToggleBookmark,
  onStartStory,
  onSetDefaultPc,
  LinkComponent,
  ShareButtonComponent,
}) {
  const engagementButtons = (
    <CreationEngagementButtons
      liked={liked}
      bookmarked={bookmarked}
      canLike={canLike}
      canBookmark={canBookmark}
      onToggleLike={onToggleLike}
      onToggleBookmark={onToggleBookmark}
    />
  );

  if (context === "owner") {
    return (
      <div className="flex flex-wrap gap-3">
        {engagementButtons}
        {canSetDefaultPc ? (
          <button
            type="button"
            onClick={onSetDefaultPc}
            disabled={settingDefaultPc}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
          >
            <UserRound size={14} />
            {settingDefaultPc ? "Setting..." : "Set Default PC"}
          </button>
        ) : null}

        {editHref ? (
          <LinkComponent
            href={editHref}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            <PenLine size={14} />
            Edit
          </LinkComponent>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] opacity-60"
          >
            <PenLine size={14} />
            Edit Soon
          </button>
        )}

        {supportsChat ? (
          <button
            type="button"
            onClick={onStartStory}
            disabled={startingChat}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
          >
            <MessageCircle size={14} />
            {startingChat ? "Starting..." : "Chat"}
          </button>
        ) : null}

        <LinkComponent
          href={catalogueHref}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          <ImageIcon size={14} />
          Image Library
        </LinkComponent>
      </div>
    );
  }

  if (context === "picker") {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] opacity-70"
      >
        <Sparkles size={14} />
        Select Soon
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {engagementButtons}
      {supportsChat ? (
        <button
          type="button"
          onClick={onStartStory}
          disabled={startingChat}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
        >
          <MessageCircle size={14} />
          {startingChat ? "Starting..." : "Chat"}
        </button>
      ) : null}

      {isShareable && ShareButtonComponent ? (
        <ShareButtonComponent href={catalogueHref} label="Share" />
      ) : null}
    </div>
  );
}

export default function CreationPreviewModalView({
  title,
  subtitle,
  titleInitial,
  description,
  tags = [],
  creator = {},
  credits = [],
  catalogueHref,
  editHref,
  statusBadgesProps,
  statsRowProps,
  moreSlideBackgroundImage,
  hasFeaturedMedia = false,
  activeMediaIndex = 0,
  activeMedia,
  isMoreSlide = false,
  mediaIndicators = [],
  context = "owner",
  liked = false,
  bookmarked = false,
  canLike = false,
  canBookmark = false,
  supportsChat = false,
  canSetDefaultPc = false,
  isShareable = false,
  startingChat = false,
  settingDefaultPc = false,
  chatError = "",
  defaultPcError = "",
  defaultPcStatus = "",
  onClose,
  onToggleDescription,
  onSelectMedia,
  onPreviousMedia,
  onNextMedia,
  onToggleLike,
  onToggleBookmark,
  onStartStory,
  onSetDefaultPc,
  LinkComponent = "a",
  StatusBadgesComponent,
  StatsRowComponent,
  CreditsComponent,
  ShareButtonComponent,
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-lg border border-white/10 bg-black/50 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
        aria-label="Close preview"
      >
        <X size={18} />
      </button>

      <div className="grid lg:max-h-[92vh] lg:grid-cols-[0.95fr_1.05fr] lg:overflow-hidden">
        <div className="border-b border-white/10 bg-black/35 p-5 lg:border-b-0 lg:border-r">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
            {isMoreSlide ? (
              <div
                className="relative flex h-full w-full items-center justify-center overflow-hidden p-6"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.86)), url(${moreSlideBackgroundImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="absolute inset-0 bg-black/25" />

                <div className="relative z-10 max-w-xs rounded-2xl border border-[var(--muted-gold)]/25 bg-black/65 p-6 text-center shadow-2xl shadow-black/40 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                    Want to see more?
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    Open the full catalogue to view this creation&apos;s media
                    library, details, and future public gallery.
                  </p>

                  <LinkComponent
                    href={catalogueHref}
                    className="mt-5 inline-flex rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/25"
                  >
                    View Catalogue
                  </LinkComponent>
                </div>
              </div>
            ) : activeMedia ? (
              <img
                src={activeMedia.url}
                alt={activeMedia.title || title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-5xl text-[var(--muted-gold)]">
                    {titleInitial}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                    Preview Pending
                  </p>
                </div>
              </div>
            )}

            {hasFeaturedMedia ? (
              <>
                <button
                  type="button"
                  onClick={onPreviousMedia}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-[var(--foreground)] shadow-lg shadow-black/40 backdrop-blur transition hover:border-[var(--muted-gold)]/50 hover:bg-[var(--muted-gold)]/15"
                  aria-label="Previous preview image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={onNextMedia}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-[var(--foreground)] shadow-lg shadow-black/40 backdrop-blur transition hover:border-[var(--muted-gold)]/50 hover:bg-[var(--muted-gold)]/15"
                  aria-label="Next preview image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 backdrop-blur">
                  {mediaIndicators.map((indicator) => (
                    <button
                      key={indicator.id}
                      type="button"
                      onClick={() => onSelectMedia?.(indicator.index)}
                      className={`h-2 rounded-full transition ${
                        indicator.index === activeMediaIndex
                          ? "w-6 bg-[var(--muted-gold)]"
                          : "w-2 bg-white/35 hover:bg-white/60"
                      }`}
                      aria-label={indicator.label}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {StatsRowComponent ? (
            <div className="mt-4">
              <StatsRowComponent {...statsRowProps} />
            </div>
          ) : null}
        </div>

        <div className="p-6 lg:max-h-[92vh] lg:overflow-y-auto">
          {StatusBadgesComponent ? (
            <StatusBadgesComponent {...statusBadgesProps} />
          ) : null}

          <h2 className="mt-4 font-display text-4xl">{title}</h2>

          {subtitle ? (
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              {subtitle}
            </p>
          ) : null}

          {creator.handle ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              by{" "}
              {creator.href ? (
                <LinkComponent
                  href={creator.href}
                  className="text-[var(--foreground)] transition hover:text-[var(--muted-gold)]"
                >
                  {creator.handle}
                </LinkComponent>
              ) : (
                <span className="text-[var(--foreground)]">
                  {creator.handle}
                </span>
              )}
            </p>
          ) : null}

          <div className="mt-5">
            <p className="whitespace-pre-line break-words leading-7 text-[var(--muted)]">
              {description.visibleText}

              {description.hasLongDescription ? (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={onToggleDescription}
                    className="inline text-[var(--muted-gold)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {description.toggleLabel}
                  </button>
                </>
              ) : null}
            </p>
          </div>

          {tags.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <LinkComponent
            href={catalogueHref}
            className="mt-5 inline-block text-sm uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:text-[var(--foreground)]"
          >
            View Full Catalogue →
          </LinkComponent>

          {credits.length && CreditsComponent ? (
            <CreditsComponent credits={credits} />
          ) : null}

          <div className="mt-8">
            <PreviewActions
              context={context}
              editHref={editHref}
              catalogueHref={catalogueHref}
              supportsChat={supportsChat}
              canSetDefaultPc={canSetDefaultPc}
              isShareable={isShareable}
              liked={liked}
              bookmarked={bookmarked}
              canLike={canLike}
              canBookmark={canBookmark}
              startingChat={startingChat}
              settingDefaultPc={settingDefaultPc}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              onStartStory={onStartStory}
              onSetDefaultPc={onSetDefaultPc}
              LinkComponent={LinkComponent}
              ShareButtonComponent={ShareButtonComponent}
            />

            {chatError ? (
              <p className="mt-3 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {chatError}
              </p>
            ) : null}

            {defaultPcError ? (
              <p className="mt-3 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {defaultPcError}
              </p>
            ) : null}

            {defaultPcStatus ? (
              <p className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                {defaultPcStatus}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
