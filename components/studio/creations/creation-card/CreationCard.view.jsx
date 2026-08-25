"use client";

import {
  Bookmark,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  PenLine,
  UserRound,
} from "lucide-react";

import CreationStatsRowView from "@/components/studio/creations/creation-stats-row/CreationStatsRow.view";
import CreationStatusBadgesView from "@/components/studio/creations/creation-status-badges/CreationStatusBadges.view";

function stopPropagationAndInvoke(event, callback) {
  event.stopPropagation();
  callback?.();
}

export default function CreationCardView({
  title = "Untitled Creation",
  fallbackInitial = "U",
  imageUrl = null,
  priority = false,
  mobileCompact = false,
  isPreviewLoading = false,
  statusBadges = {},
  statsRow = {},
  showLikeAction = false,
  liked = false,
  onToggleLike = null,
  showBookmarkAction = false,
  bookmarked = false,
  onToggleBookmark = null,
  showDefaultPlayerCharacterAction = false,
  isSettingDefaultPlayerCharacter = false,
  onSetDefaultPlayerCharacter = null,
  showStartChatAction = false,
  isStartingChat = false,
  onStartChat = null,
  imageHref = "/studio/image-studio",
  showEditAction = false,
  editHref = null,
  showCreatorAttribution = false,
  creatorHandle = "",
  creatorHref = null,
  subtitle = "",
  description = "",
  errorMessage = "",
  statusMessage = "",
  onOpenPreview = null,
  LinkComponent = "a",
}) {
  return (
    <div className="min-w-0">
      <article
        onClick={() => onOpenPreview?.()}
        aria-busy={isPreviewLoading}
        className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/35 transition hover:-translate-y-1 hover:border-[var(--gold-ornament)]/35"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "low"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p
                className={`font-display text-[var(--gold-ornament)] ${
                  mobileCompact ? "text-3xl sm:text-5xl" : "text-5xl"
                }`}
              >
                {fallbackInitial}
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--scrim)] via-black/20 to-transparent" />

          <div
            className={`absolute left-3 right-3 top-3 ${
              mobileCompact ? "origin-top-left scale-90 sm:scale-100" : ""
            }`}
          >
            <CreationStatusBadgesView {...statusBadges} />
          </div>

          <div
            className={`absolute right-3 top-3 gap-2 ${
              mobileCompact ? "hidden sm:flex" : "flex"
            }`}
          >
            {showLikeAction ? (
              <button
                type="button"
                onClick={(event) =>
                  stopPropagationAndInvoke(event, onToggleLike)
                }
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/65 transition hover:bg-[var(--gold-ornament)]/25 ${
                  liked ? "text-pink-300" : "text-[var(--ink)]"
                }`}
                title={liked ? "Unlike" : "Like"}
                aria-label={liked ? "Unlike creation" : "Like creation"}
              >
                <Heart size={15} fill={liked ? "currentColor" : "none"} />
              </button>
            ) : null}

            {showBookmarkAction ? (
              <button
                type="button"
                onClick={(event) =>
                  stopPropagationAndInvoke(event, onToggleBookmark)
                }
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/65 transition hover:bg-[var(--gold-ornament)]/25 ${
                  bookmarked ? "text-pink-300" : "text-[var(--ink)]"
                }`}
                title={bookmarked ? "Remove bookmark" : "Bookmark"}
                aria-label={
                  bookmarked
                    ? "Remove creation bookmark"
                    : "Bookmark creation"
                }
              >
                <Bookmark
                  size={15}
                  fill={bookmarked ? "currentColor" : "none"}
                />
              </button>
            ) : null}

            {showDefaultPlayerCharacterAction ? (
              <button
                type="button"
                onClick={(event) =>
                  stopPropagationAndInvoke(
                    event,
                    onSetDefaultPlayerCharacter
                  )
                }
                disabled={isSettingDefaultPlayerCharacter}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-[var(--ink)] transition hover:bg-[var(--gold-ornament)]/25 disabled:cursor-wait disabled:opacity-60"
                title={
                  isSettingDefaultPlayerCharacter
                    ? "Setting default Player Character..."
                    : "Set as default Player Character"
                }
                aria-label="Set as default Player Character"
              >
                <UserRound size={15} />
              </button>
            ) : null}

            {showStartChatAction ? (
              <button
                type="button"
                onClick={(event) =>
                  stopPropagationAndInvoke(event, onStartChat)
                }
                disabled={isStartingChat}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-[var(--ink)] transition hover:bg-[var(--gold-ornament)]/25 disabled:cursor-wait disabled:opacity-60"
                title={isStartingChat ? "Starting story..." : "Start chat"}
                aria-label={isStartingChat ? "Starting story" : "Start chat"}
              >
                <MessageCircle size={15} />
              </button>
            ) : null}

            <LinkComponent
              href={imageHref}
              onClick={(event) => event.stopPropagation()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-[var(--ink)] transition hover:bg-[var(--gold-ornament)]/25"
              title="Generate image"
            >
              <ImageIcon size={15} />
            </LinkComponent>

            {showEditAction && editHref ? (
              <LinkComponent
                href={editHref}
                onClick={(event) => event.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-[var(--ink)] transition hover:bg-[var(--gold-ornament)]/25"
                title="Edit"
              >
                <PenLine size={15} />
              </LinkComponent>
            ) : null}
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 ${
              mobileCompact ? "p-3 sm:p-4" : "p-4"
            }`}
          >
            <h2
              className={`font-display leading-none text-white ${
                mobileCompact ? "text-lg sm:text-2xl" : "text-2xl"
              }`}
            >
              {title}
            </h2>

            {showCreatorAttribution && creatorHandle ? (
              <p className="mt-1 line-clamp-1 text-xs text-white/75">
                by{" "}
                {creatorHref ? (
                  <LinkComponent
                    href={creatorHref}
                    onClick={(event) => event.stopPropagation()}
                    className="transition hover:text-[var(--gold-ornament)]"
                  >
                    {creatorHandle}
                  </LinkComponent>
                ) : (
                  <span>{creatorHandle}</span>
                )}
              </p>
            ) : null}

            {subtitle ? (
              <p
                className={`mt-1 line-clamp-1 text-xs text-white/75 ${
                  mobileCompact ? "hidden sm:block" : ""
                }`}
              >
                {subtitle}
              </p>
            ) : null}

            {description ? (
              <p
                className={`mt-2 overflow-hidden break-words text-xs leading-5 text-white/70 ${
                  mobileCompact ? "hidden sm:block" : ""
                }`}
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {description}
              </p>
            ) : null}

            <div className={mobileCompact ? "mt-3 hidden sm:block" : "mt-3"}>
              <CreationStatsRowView {...statsRow} />
            </div>
          </div>

          {errorMessage ? (
            <div className="absolute inset-x-3 bottom-3 z-30 rounded-xl border border-red-500/35 bg-red-950/90 px-3 py-3 text-xs leading-5 text-red-100 shadow-xl shadow-black/50">
              {errorMessage}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="absolute inset-x-3 bottom-3 z-30 rounded-xl border border-emerald-500/35 bg-emerald-950/90 px-3 py-3 text-xs leading-5 text-emerald-100 shadow-xl shadow-black/50">
              {statusMessage}
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}
