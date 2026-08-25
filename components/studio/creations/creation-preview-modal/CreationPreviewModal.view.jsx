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

import Eyebrow from "@/components/ui/Eyebrow";

const ICON_BUTTON_CLASS =
  "flex items-center justify-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] shadow-[var(--shadow-popover)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)]";

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
          className={`cf-btn cf-btn--secondary ${
            liked
              ? "border-[var(--gold-action)] bg-[var(--gold-action)]/15 text-[var(--gold-bright)]"
              : ""
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
          className={`cf-btn cf-btn--secondary ${
            bookmarked
              ? "border-[var(--gold-action)] bg-[var(--gold-action)]/15 text-[var(--gold-bright)]"
              : ""
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
            className="cf-btn cf-btn--primary"
          >
            <UserRound size={14} />
            {settingDefaultPc ? "Setting..." : "Set default PC"}
          </button>
        ) : null}

        {editHref ? (
          <LinkComponent
            href={editHref}
            className="cf-btn cf-btn--secondary"
          >
            <PenLine size={14} />
            Edit
          </LinkComponent>
        ) : (
          <button
            type="button"
            disabled
            className="cf-btn cf-btn--secondary"
          >
            <PenLine size={14} />
            Edit soon
          </button>
        )}

        {supportsChat ? (
          <button
            type="button"
            onClick={onStartStory}
            disabled={startingChat}
            className="cf-btn cf-btn--secondary"
          >
            <MessageCircle size={14} />
            {startingChat ? "Starting..." : "Chat"}
          </button>
        ) : null}

        <LinkComponent
          href={catalogueHref}
          className="cf-btn cf-btn--secondary"
        >
          <ImageIcon size={14} />
          Image library
        </LinkComponent>
      </div>
    );
  }

  if (context === "picker") {
    return (
      <button
        type="button"
        disabled
        className="cf-btn cf-btn--primary"
      >
        <Sparkles size={14} />
        Select soon
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
          className="cf-btn cf-btn--primary"
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
  activeInfoTab = "DETAILS",
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
  onSelectInfoTab,
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
  const hasCredits = credits.length > 0;
  const showingCredits = hasCredits && activeInfoTab === "CREDITS";

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`absolute right-4 top-4 z-20 h-[var(--control-md)] w-[var(--control-md)] ${ICON_BUTTON_CLASS}`}
        aria-label="Close preview"
      >
        <X size={18} />
      </button>

      <div className="grid lg:max-h-[92vh] lg:grid-cols-[0.95fr_1.05fr] lg:overflow-hidden">
        <div className="p-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
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

                <div className="relative z-10 max-w-xs rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-6 text-center shadow-[var(--shadow-popover)]">
                  <Eyebrow showRuleMark={false}>Want to see more?</Eyebrow>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
                    Open the full catalogue to view this creation&apos;s media
                    library, details, and future public gallery.
                  </p>

                  <LinkComponent
                    href={catalogueHref}
                    className="cf-btn cf-btn--primary mt-5"
                  >
                    View catalogue
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
                  <p className="font-display text-5xl text-[var(--gold-ornament)]">
                    {titleInitial}
                  </p>
                  <p className="mt-4 text-[var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-faint)]">
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
                  className={`absolute left-3 top-1/2 h-[var(--control-md)] w-[var(--control-md)] -translate-y-1/2 ${ICON_BUTTON_CLASS}`}
                  aria-label="Previous preview image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={onNextMedia}
                  className={`absolute right-3 top-1/2 h-[var(--control-md)] w-[var(--control-md)] -translate-y-1/2 ${ICON_BUTTON_CLASS}`}
                  aria-label="Next preview image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] px-3 py-2">
                  {mediaIndicators.map((indicator) => (
                    <button
                      key={indicator.id}
                      type="button"
                      onClick={() => onSelectMedia?.(indicator.index)}
                      className={`h-2 rounded-full transition ${
                        indicator.index === activeMediaIndex
                          ? "w-6 bg-[var(--gold-action)]"
                          : "w-2 bg-[var(--ink-faint)] hover:bg-[var(--ink-dim)]"
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
            <div className="mt-1">
              <Eyebrow showRuleMark={false}>{subtitle}</Eyebrow>
            </div>
          ) : null}

          {creator.handle ? (
            <p className="mt-3 text-sm text-[var(--ink-dim)]">
              by{" "}
              {creator.href ? (
                <LinkComponent
                  href={creator.href}
                  className="text-[var(--ink)] transition hover:text-[var(--gold-ornament)]"
                >
                  {creator.handle}
                </LinkComponent>
              ) : (
                <span className="text-[var(--ink)]">
                  {creator.handle}
                </span>
              )}
            </p>
          ) : null}

          {hasCredits ? (
            <div
              role="tablist"
              aria-label="Creation details"
              className="mt-5 flex gap-2 border-b border-[var(--line-whisper)] pb-2"
            >
              {[
                { id: "DETAILS", label: "Details" },
                { id: "CREDITS", label: "Credits" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeInfoTab === tab.id}
                  onClick={() => onSelectInfoTab?.(tab.id)}
                  className={`rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                    activeInfoTab === tab.id
                      ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                      : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}

          {showingCredits ? (
            <div className="mt-5">
              {CreditsComponent ? (
                  <CreditsComponent credits={credits} showHeading={false} />
                ) : null}
            </div>
          ) : (
            <>
              <div className="mt-5">
                <p className="whitespace-pre-line break-words leading-7 text-[var(--ink-dim)]">
                  {description.visibleText}

                  {description.hasLongDescription ? (
                    <>
                      {" "}
                      <button
                        type="button"
                        onClick={onToggleDescription}
                        className="cf-btn cf-btn--tertiary inline h-auto p-0"
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
                      className="rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-3 py-1 text-[var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-bright)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

            </>
          )}

          <LinkComponent
            href={catalogueHref}
            className="mt-5 inline-block text-[var(--text-ui)] uppercase leading-[var(--lh-ui)] tracking-[var(--track-label)] text-[var(--gold-ornament)] transition hover:text-[var(--ink)]"
          >
            View Full Catalogue →
          </LinkComponent>

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
              <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs text-[var(--status-danger)]">
                {chatError}
              </p>
            ) : null}

            {defaultPcError ? (
              <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs text-[var(--status-danger)]">
                {defaultPcError}
              </p>
            ) : null}

            {defaultPcStatus ? (
              <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--status-success-border)] bg-[var(--status-success-bed)] px-3 py-2 text-xs text-[var(--status-success)]">
                {defaultPcStatus}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
