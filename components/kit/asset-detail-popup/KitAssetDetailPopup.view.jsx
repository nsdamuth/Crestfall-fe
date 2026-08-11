"use client";

// Composed on the unified modal frame (docs/BUILD-BLUEPRINT.md 2.15).
// This is the content rendered inside KitModalFrame by the binding
// shell; it owns no veil, panel, or close control of its own.
//
// Recomposed 10 Aug 2026 (kit polish 3 pass, R3/R8/R9,
// docs/SPRINT-A-POLISH-PLAN.md section 2): the carousel frame moves to
// the panel top with title/subtitle/badges in the body below it
// (chrome cannot share the art with an over-art title block); the
// footer becomes exactly four actions, Like/Save/Share/Play.
//
// Stats placement, R8: both plan-2.5 readings were built against the
// longestCopy fixture. Reading A (stacked, description full-width
// then the stat row beneath) ships: at this panel's fixed
// max-w-xl (576px) width, Reading B's side-by-side split left too
// little room for both a legible description measure and the stat
// column, and read cramped at 390 where it collapses to Reading A
// anyway. Stacking also matches every other stat row already in the
// app (the card face). Logged per R8's render-time pick.
import { useMemo, useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, Heart, Pencil, Play, Search, Share2, Users } from "lucide-react";

import KitBadgeView from "../badge/KitBadge.view";
import KitCreditsModal from "../KitCreditsModal";

const STAT_ICONS = { plays: Play, hearts: Heart, saves: Bookmark, followers: Users };
const STAT_ORDER = ["plays", "hearts", "saves", "followers"];

export const KIT_ASSET_DETAIL_POPUP_TITLE_ID = "kit-asset-detail-popup-title";

const DESCRIPTION_CLAMP_THRESHOLD = 160;

function StatRow({ stats }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className="mt-[var(--space-3)] flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
      {entries.map(([key, value]) => {
        const Icon = STAT_ICONS[key];
        return (
          <span key={key} className="inline-flex items-center gap-[var(--space-1)]">
            <Icon size={16} aria-hidden="true" />
            <span className="tabular-nums">{value}</span>
          </span>
        );
      })}
    </div>
  );
}

function DescriptionBlock({ description }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  const shouldClamp = description.length > DESCRIPTION_CLAMP_THRESHOLD;

  return (
    <div>
      <p
        className={`max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)] ${
          shouldClamp && !expanded ? "line-clamp-3" : ""
        }`}
      >
        {description}
      </p>
      {shouldClamp && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="kit-focus mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-ornament)]"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}

// R1 credits collapse (10 Aug 2026, kit polish 3 pass, plan 1.3): the
// popup's space budget goes to art and description, not the credit
// list. One row tall regardless of credit count: the first credit
// only, plus a "View all credits (N)" control when more than one
// exists, opening the stacked KitCreditsModal. Zero credits render
// nothing, same as before.
function CollapsedCreditsBlock({ credits, LinkComponent, onOpenCreditsModal }) {
  if (!credits.length) return null;

  const [first] = credits;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        Credits
      </p>
      <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {first.kindLabel} from{" "}
        {first.creatorHref ? (
          <LinkComponent
            href={first.creatorHref}
            className="text-[var(--ink)] transition-colors hover:text-[var(--gold-ornament)]"
          >
            {first.creatorHandle}
          </LinkComponent>
        ) : (
          <span className="text-[var(--ink)]">{first.creatorHandle}</span>
        )}
      </p>
      {credits.length > 1 && (
        <button
          type="button"
          onClick={() => onOpenCreditsModal?.()}
          className="kit-focus -mx-[var(--space-2)] mt-[var(--space-1)] flex min-h-[var(--control-md)] items-center px-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-ornament)]"
        >
          View all credits ({credits.length})
        </button>
      )}
    </div>
  );
}

function CarouselArrow({ direction, onClick }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "previous" ? "Previous image" : "Next image"}
      className={`kit-focus absolute top-1/2 z-[2] flex h-[var(--control-md)] w-[var(--control-md)] -translate-y-1/2 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink)] shadow-[var(--shadow-popover)] ${
        direction === "previous" ? "left-[var(--space-3)]" : "right-[var(--space-3)]"
      }`}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}

function CarouselDots({ count, activeIndex, catalogueIndex, onSelect }) {
  return (
    <div className="pointer-events-auto absolute bottom-[var(--space-3)] left-1/2 z-[2] flex -translate-x-1/2 items-center gap-[var(--space-1)] rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-2)] py-[var(--space-1)]">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={
              index === catalogueIndex ? "View catalogue slide" : `Preview image ${index + 1}`
            }
            aria-current={isActive}
            className={`rounded-[var(--radius-full)] transition-[width] ${
              isActive
                ? "h-[var(--space-2)] w-[var(--space-6)] bg-[var(--gold-action)]"
                : "h-[var(--space-2)] w-[var(--space-2)] bg-[var(--ink-faint)]"
            }`}
          />
        );
      })}
    </div>
  );
}

function CatalogueSlide({ backgroundSrc, onViewCatalogue }) {
  return (
    <div className="absolute inset-0">
      {backgroundSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={backgroundSrc} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_18%]" />
      )}
      <div className="absolute inset-0 bg-[var(--scrim-strong)]" aria-hidden="true" />
      <div className="relative z-[1] flex h-full items-center justify-center p-[var(--space-4)]">
        <div className="max-w-xs rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-6)] text-center shadow-[var(--shadow-popover)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Want to see more?
          </p>
          <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            The full catalogue holds this creation&apos;s media library and details.
          </p>
          <button
            type="button"
            onClick={() => onViewCatalogue?.()}
            className="kit-focus cf-btn cf-btn--primary mt-[var(--space-4)]"
          >
            View catalogue
          </button>
        </div>
      </div>
    </div>
  );
}

function NoMediaFallback() {
  return (
    <div className="relative flex aspect-[5/3] w-full flex-col items-center justify-center gap-[var(--space-2)] overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface-2)]">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[var(--space-14)] w-[var(--space-14)] text-[var(--ink-faint)]">
        <use href="/assets/icons/icons-v7.svg#i-59" />
      </svg>
      <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">No image</span>
    </div>
  );
}

function Carousel({ media, onViewCatalogue }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const catalogueIndex = media.length;
  const slideCount = media.length + 1;

  function showPrevious() {
    setActiveIndex((current) => (current <= 0 ? catalogueIndex : current - 1));
  }
  function showNext() {
    setActiveIndex((current) => (current >= catalogueIndex ? 0 : current + 1));
  }

  const isCatalogueSlide = activeIndex === catalogueIndex;

  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--canvas)]">
      {isCatalogueSlide ? (
        <CatalogueSlide backgroundSrc={media[0]?.src} onViewCatalogue={onViewCatalogue} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media[activeIndex]?.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
      )}

      <CarouselArrow direction="previous" onClick={showPrevious} />
      <CarouselArrow direction="next" onClick={showNext} />
      <CarouselDots
        count={slideCount}
        activeIndex={activeIndex}
        catalogueIndex={catalogueIndex}
        onSelect={setActiveIndex}
      />
    </div>
  );
}

// Media library restored, 10 Aug 2026 (h-restore ruling 5): the
// original creation detail page's media tabs, sort, and search return
// here rather than at a separate detail surface, per Brian's ruling on
// candidate 6. Local state only (presentation interaction, same
// pattern as the carousel's own activeIndex above); it filters and
// sorts the same `media` array the carousel already receives, capped
// at four items per fixture. Videos and per-media Liked/Bookmarked
// state have no fixture field yet (the fixture model only carries
// images and creation-level like/save, not per-media), so those tabs
// render their honest empty or all-media state rather than inventing
// data; CR-035 filed for real per-media type and engagement fields.
const MEDIA_TABS = [
  { value: "images", label: "Images" },
  { value: "videos", label: "Videos" },
  { value: "liked", label: "Liked" },
  { value: "bookmarked", label: "Bookmarked" },
];

const MEDIA_SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "top", label: "Top" },
  { value: "likedFirst", label: "Liked First" },
];

function MediaLibrary({ media, isLiked, isSaved }) {
  const [tab, setTab] = useState("images");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    let items = media.map((item, index) => ({ ...item, index }));

    if (tab === "videos") items = [];
    if (tab === "liked" && !isLiked) items = [];
    if (tab === "bookmarked" && !isSaved) items = [];

    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      items = items.filter((item) => (item.id || "").toLowerCase().includes(needle));
    }

    const sorted = [...items];
    if (sort === "oldest") sorted.reverse();
    if (sort === "top" || sort === "likedFirst") {
      // No per-media popularity or like field exists yet (CR-035);
      // stable original order is the honest fallback for both.
    }
    return sorted;
  }, [media, tab, sort, query, isLiked, isSaved]);

  if (media.length === 0) return null;

  return (
    <div className="mt-[var(--space-6)]">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        Media
      </p>

      <div className="mt-[var(--space-2)] flex flex-wrap items-center gap-[var(--space-2)]">
        <div className="flex flex-wrap gap-[var(--space-1)]">
          {MEDIA_TABS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={tab === option.value}
              onClick={() => setTab(option.value)}
              className={`kit-focus min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
                tab === option.value
                  ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
                  : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="ml-auto flex min-h-[var(--control-sm)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-2)] [@media(pointer:coarse)]:min-h-[var(--control-md)]">
          <Search size={14} aria-hidden="true" className="text-[var(--ink-faint)]" />
          <span className="sr-only">Search media</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search media"
            className="w-24 bg-transparent text-[length:var(--text-label)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
          />
        </label>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="kit-focus min-h-[var(--control-sm)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-2)] text-[length:var(--text-label)] text-[var(--ink)] [@media(pointer:coarse)]:min-h-[var(--control-md)]"
        >
          {MEDIA_SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-faint)]">
          Nothing here yet.
        </p>
      ) : (
        <div className="mt-[var(--space-3)] grid grid-cols-4 gap-[var(--space-2)]">
          {visible.map((item) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.id || item.index}
              src={item.src}
              alt=""
              className="aspect-square w-full rounded-[var(--radius-md)] object-cover object-[center_18%]"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function KitAssetDetailPopupView({
  primaryActionLabel = "Play",
  title = "",
  subtitle = "",
  media = [],
  badges = [],
  stats = {},
  description = "",
  isLiked = false,
  isSaved = false,
  onLike = null,
  onPrimaryAction = null,
  onShare = null,
  onSave = null,
  onViewCatalogue = null,
  credits = [],
  creditsLinkComponent = "a",
  isCreditsModalOpen = false,
  onOpenCreditsModal = null,
  onCloseCreditsModal = null,
  // onEdit, ADDED 10 Aug 2026 (docs/STUDIO-SPEC.md section 5, Studio
  // brief S5): the single ruled edit path, own-work items only.
  // Optional; renders as a footer action only when provided, so
  // Community and every non-owner context stays pixel-stable.
  onEdit = null,
}) {
  const hasMedia = media.length > 0;
  const hasEdit = Boolean(onEdit);

  return (
    <div>
      {hasMedia ? (
        <Carousel media={media} onViewCatalogue={onViewCatalogue} />
      ) : (
        <NoMediaFallback />
      )}

      <div className="p-[var(--space-6)]">
        {badges.length > 0 && (
          <div className="mb-[var(--space-2)] flex flex-wrap gap-[var(--space-1)]">
            {badges.map((badge) => (
              <KitBadgeView key={badge.label} label={badge.label} variant={badge.variant} surface="canvas" />
            ))}
          </div>
        )}

        <h2
          id={KIT_ASSET_DETAIL_POPUP_TITLE_ID}
          className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
        >
          {title || "Untitled"}
        </h2>
        {subtitle && (
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {subtitle}
          </p>
        )}

        <div className="mt-[var(--space-4)]">
          <DescriptionBlock description={description} />
          <StatRow stats={stats} />
        </div>

        {credits.length > 0 && (
          <div className="mt-[var(--space-4)]">
            <CollapsedCreditsBlock
              credits={credits}
              LinkComponent={creditsLinkComponent}
              onOpenCreditsModal={onOpenCreditsModal}
            />
          </div>
        )}

        <MediaLibrary media={media} isLiked={isLiked} isSaved={isSaved} />

        <div className={`mt-[var(--space-4)] grid w-full gap-[var(--space-2)] ${hasEdit ? "grid-cols-5" : "grid-cols-4"}`}>
          <button
            type="button"
            aria-pressed={isLiked}
            onClick={() => onLike?.()}
            className={`kit-focus flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary ${isLiked ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]" : ""}`}
          >
            <Heart size={16} aria-hidden="true" fill={isLiked ? "currentColor" : "none"} />
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            type="button"
            aria-pressed={isSaved}
            onClick={() => onSave?.()}
            className={`kit-focus flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary ${isSaved ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]" : ""}`}
          >
            <Bookmark size={16} aria-hidden="true" fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => onShare?.()}
            className="kit-focus flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary"
          >
            <Share2 size={16} aria-hidden="true" />
            Share
          </button>
          {hasEdit ? (
            <button
              type="button"
              onClick={() => onEdit?.()}
              className="kit-focus flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--secondary"
            >
              <Pencil size={16} aria-hidden="true" />
              Edit
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onPrimaryAction?.()}
            className="kit-focus flex w-full items-center justify-center gap-[var(--space-1)] whitespace-nowrap cf-btn cf-btn--primary"
          >
            <Play size={16} aria-hidden="true" />
            {primaryActionLabel}
          </button>
        </div>
      </div>

      {isCreditsModalOpen && (
        <KitCreditsModal credits={credits} onClose={onCloseCreditsModal} />
      )}
    </div>
  );
}
