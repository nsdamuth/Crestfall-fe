"use client";

// Card law, 9 Aug 2026 (docs/BUILD-BLUEPRINT.md 2.6 second revision),
// semantic-background clarification 30 Aug 2026: full-bleed art/background in
// BOTH layouts, no bottom action bar anywhere. A semantic Crestfall identity
// surface replaces automatic legacy stock fallback art without changing card
// geometry, text placement, actions, or real assigned artwork.
// Actions are small overlay icons (like, save, expand); share,
// download, and delete live inside the open destination, because
// Ruling 6 (share always carries its word) and the destructive law
// (danger always carries its word) both forbid icon-only forms on
// the card face. Placement is top-right over the art, RULED 10 Aug
// 2026 (kit polish 3 pass, docs/BUILD-BLUEPRINT.md); the scrim-row
// alternative is retired.
//
// Art-anchor law, RULED 9 Aug 2026 (kit polish pass), REVISED 9 Aug
// 2026 (kit polish 2 pass): art anchors 18% down from the top of the
// frame in both layouts, not the hard top edge. Rendered against the
// draft asset set both ways: a hard top anchor clips foreheads and
// crowns on tighter crops (list layout, narrow grid columns) with no
// offsetting benefit, while 18% consistently keeps the face and
// primary subject in frame across the set without losing meaningful
// headroom. A future editor-side, per-view reposition capability is a
// later expansion, not built here.
//
// Overlay-action placement, RULED 10 Aug 2026 (kit polish 3 pass):
// overlay-top everywhere. The scrim-row alternative (icons bottom-right
// beside the title) is retired; icons top-right over the art, clear of
// the title block, is the only placement now.
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Archive,
  Bookmark,
  Heart,
  Image as ImageIcon,
  Maximize2,
  MoreVertical,
  Pencil,
  Play,
  Share2,
  Trash2,
  Users,
  Wand2,
} from "lucide-react";

import KitBadgeView from "../badge/KitBadge.view";
import KitArtPlaceholderView from "../art-placeholder/KitArtPlaceholder.view";

const STAT_ICONS = { plays: Play, hearts: Heart, saves: Bookmark, followers: Users };
const STAT_ORDER = ["plays", "hearts", "saves", "followers"];

function stopAndRun(event, handler) {
  event.preventDefault();
  event.stopPropagation();
  handler?.();
}

function resolveOpenHandler(assetKind, onOpenImageOverlay, onOpenAssetDetail) {
  return assetKind === "image" ? onOpenImageOverlay : onOpenAssetDetail;
}

// Contextual third face action, RULED 11 Aug 2026, card scope widened
// 22 Aug 2026 (Fable law review, Final Ruling Render close, NEW LAW A):
// play (Character, Story, Adventure), generate (Image asset), expand
// everywhere else, including any card whose caller passes no handler
// for its contextual action. Expand is the universal fallback; a card
// never renders a dead third icon.
//
// v3.3.0 addition, RULED 11 Aug 2026 (Sprint H render review, item 1):
// onContinue overrides every kind-based branch above when supplied,
// for in-progress items rendered as normal cards (Stories page
// Continue group). Label "Continue", same Play icon as the story/
// adventure branch since both resume a session.
function resolveContextualAction({ assetKind, onPlay, onGenerate, onOpen, onContinue }) {
  if (onContinue) {
    return { label: "Continue", Icon: Play, onClick: onContinue };
  }
  if ((assetKind === "character" || assetKind === "story" || assetKind === "adventure") && onPlay) {
    return { label: "Start Chat", Icon: Play, onClick: onPlay };
  }
  if (assetKind === "image" && onGenerate) {
    return { label: "Generate", Icon: Wand2, onClick: onGenerate };
  }
  return { label: "Expand", Icon: Maximize2, onClick: onOpen };
}

function IconActionButton({ label, active = false, onClick = null, children }) {
  // Selection-state law: active reads as a gold mark plus a light
  // wash, never a border change. The dark art-plate behind the icon
  // (--tag-bed-art) stays in both states for legibility over any
  // fixture art; RULED 9 Aug 2026 (kit polish 2 pass) its opacity
  // lowers when active instead of adding a border, so the gold wash
  // layered on top reads against both the lightest and darkest art.
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={(event) => stopAndRun(event, onClick)}
      className={`relative flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--line)] transition-colors [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)] ${
        active
          ? "text-[var(--gold-bright)]"
          : "text-[var(--art-ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--art-ink)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-[var(--tag-bed-art)] transition-opacity ${active ? "opacity-60" : "opacity-100"}`}
      />
      {active && <span aria-hidden="true" className="absolute inset-0 bg-[var(--fill)]" />}
      <span className="relative">{children}</span>
    </button>
  );
}

// Viewer-owned kebab menu, RULED 22 Aug 2026 (Fable law review, Final
// Ruling Render close, NEW LAW A). Non-owned cards render no kebab at
// all: the caller gates this by passing isOwner. A separate,
// owner-only control, not a fourth face icon; the three-icon face law
// above is unchanged. Contents are exactly Edit, Generate Image,
// Share, Archive, Delete, a fade divider before the sole danger item
// (Delete), on the ratified glass surface (NEW LAW B: --panel-glass at
// --blur-panel, 2px, the same surface every menu and popover moves
// to).
function KebabMenuItem({ label, Icon, onClick, danger = false, disabled = false, title }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      title={title}
      onClick={(event) => stopAndRun(event, onClick)}
      className={`flex w-full items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "text-[var(--status-danger)] enabled:hover:bg-[var(--status-danger-fill)]"
          : "text-[var(--ink)] enabled:hover:bg-[var(--fill-whisper)]"
      }`}
    >
      <Icon size={15} aria-hidden="true" />
      {label}
    </button>
  );
}

function KebabMenu({
  open,
  onToggle,
  onClose,
  onEdit,
  onGenerateImage,
  onShare,
  onArchive,
  onDelete,
}) {
  // Card portal fix (ED1G): the card article is overflow-hidden (art
  // scale-on-hover, rounded corners), which clipped this menu's panel
  // at narrow list widths. Portaled to document.body and positioned
  // from the trigger's measured rect, the same escape-the-ancestor
  // pattern KitModalFrame already uses, so the panel is never
  // constrained by the card's own overflow.
  const triggerRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(null);

  useLayoutEffect(() => {
    if (!open || typeof window === "undefined" || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        title="More"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => stopAndRun(event, onToggle)}
        className="relative flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center overflow-hidden rounded-[var(--radius-full)] border border-[var(--line)] text-[var(--art-ink-dim)] transition-colors hover:border-[var(--gold-ornament)] hover:text-[var(--art-ink)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
      >
        <span aria-hidden="true" className="absolute inset-0 bg-[var(--tag-bed-art)]" />
        <MoreVertical size={16} aria-hidden="true" className="relative" />
      </button>

      {open && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <>
              {/* Full-viewport click catcher, closes the menu on outside
                  click; sits under the panel (z-[2] vs the panel's
                  z-[3]), the same click-transparent-backdrop pattern the
                  viewer veil uses. */}
              <div
                aria-hidden="true"
                className="fixed inset-0 z-[2]"
                onClick={(event) => stopAndRun(event, onClose)}
              />
              <div
                role="menu"
                style={{ top: menuPosition.top, right: menuPosition.right }}
                className="fixed z-[3] w-[12rem] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] py-[var(--space-1)] backdrop-blur-[var(--blur-panel)]"
              >
                <KebabMenuItem label="Edit" Icon={Pencil} onClick={() => { onEdit?.(); onClose?.(); }} />
                <KebabMenuItem
                  label="Generate Image"
                  Icon={ImageIcon}
                  onClick={() => { onGenerateImage?.(); onClose?.(); }}
                />
                <KebabMenuItem label="Share" Icon={Share2} onClick={() => { onShare?.(); onClose?.(); }} />
                <KebabMenuItem
                  label="Archive"
                  Icon={Archive}
                  disabled={!onArchive}
                  title={!onArchive ? "Archive is not available for this creation." : undefined}
                  onClick={() => { onArchive?.(); onClose?.(); }}
                />
                <div
                  aria-hidden="true"
                  className="mx-[var(--space-3)] my-[var(--space-1)] h-px bg-[image:var(--line-fade)]"
                />
                <KebabMenuItem
                  label="Delete"
                  Icon={Trash2}
                  danger
                  disabled={!onDelete}
                  title={!onDelete ? "Delete is not available for this creation." : undefined}
                  onClick={() => { onDelete?.(); onClose?.(); }}
                />
              </div>
            </>,
            document.body
          )
        : null}
    </div>
  );
}

function StatRow({ stats }) {
  const entries = STAT_ORDER.map((key) => [key, stats?.[key]]).filter(
    ([, value]) => value !== null && value !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className="flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--art-ink-dim)]">
      {entries.map(([key, value]) => {
        const Icon = STAT_ICONS[key];
        return (
          <span key={key} className="inline-flex items-center gap-[var(--space-1)] opacity-[.85]">
            <Icon size={16} aria-hidden="true" />
            <span className="tabular-nums">{value}</span>
          </span>
        );
      })}
    </div>
  );
}

function BadgeRow({ badges }) {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-[var(--space-1)]">
      {badges.map((badge) => (
        <KitBadgeView key={badge.label} label={badge.label} variant={badge.variant} surface="art" />
      ))}
    </div>
  );
}

function OverlayActions({ liked, bookmarked, onLike, onBookmark, contextualAction }) {
  const { label, Icon, onClick } = contextualAction;

  return (
    <>
      <IconActionButton label="Like" active={liked} onClick={onLike}>
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
      </IconActionButton>
      <IconActionButton label="Save" active={bookmarked} onClick={onBookmark}>
        <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
      </IconActionButton>
      <IconActionButton label={label} onClick={onClick}>
        <Icon size={16} />
      </IconActionButton>
    </>
  );
}

function OwnerQuickActions({ onEdit, onGenerateImage, contextualAction }) {
  const { label, Icon, onClick } = contextualAction;

  return (
    <>
      <IconActionButton label="Edit" onClick={onEdit}>
        <Pencil size={16} />
      </IconActionButton>
      <IconActionButton label="Generate Image" onClick={onGenerateImage}>
        <ImageIcon size={16} />
      </IconActionButton>
      <IconActionButton label={label} onClick={onClick}>
        <Icon size={16} />
      </IconActionButton>
    </>
  );
}

// Overlay actions reveal on hover/focus at fine pointers and stay
// visible at coarse pointers (touch has no hover; mobile law).
const OVERLAY_REVEAL =
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(pointer:coarse)]:opacity-100";

function GridCard({
  title,
  subtitle,
  imageSrc,
  creationType,
  assetKind,
  badges,
  stats,
  liked,
  bookmarked,
  onOpen,
  onLike,
  onBookmark,
  contextualAction,
  isOwner,
  promoteOwnerActions,
  kebabOpen,
  onToggleKebab,
  onCloseKebab,
  onEdit,
  onGenerateImage,
  onShare,
  onArchive,
  onDelete,
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <>
      <button
        type="button"
        onClick={(event) => stopAndRun(event, onOpen)}
        aria-label={`Open ${title || "creation"}`}
        className="absolute inset-0 z-[1] block w-full rounded-[var(--radius-md)] border border-transparent"
      >
        <span className="sr-only">Open {title || "creation"}</span>
      </button>

      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0">
          <KitArtPlaceholderView size="md" identityKey={creationType || assetKind} />
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_45%,transparent)] to-transparent"
      />

      <div className="pointer-events-none relative z-[2] flex h-full flex-col justify-between p-[var(--space-3)]">
        <div className="flex items-start justify-between gap-[var(--space-2)]">
          <div className="pointer-events-auto">
            <BadgeRow badges={badges} />
          </div>
          <div className={`pointer-events-auto flex items-start gap-[var(--space-1)] ${OVERLAY_REVEAL}`}>
            {isOwner ? (
              <KebabMenu
                open={kebabOpen}
                onToggle={onToggleKebab}
                onClose={onCloseKebab}
                onEdit={onEdit}
                onGenerateImage={onGenerateImage}
                onShare={onShare}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ) : null}
            {isOwner && promoteOwnerActions ? (
              <OwnerQuickActions
                onEdit={onEdit}
                onGenerateImage={onGenerateImage}
                contextualAction={contextualAction}
              />
            ) : (
              <OverlayActions
                liked={liked}
                bookmarked={bookmarked}
                onLike={onLike}
                onBookmark={onBookmark}
                contextualAction={contextualAction}
              />
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-[var(--space-2)]">
          <div className="min-w-0">
            <h3
              className={`truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--art-ink)]`}
            >
              {title || "Untitled"}
            </h3>
            {subtitle && (
              <p
                className={`truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]`}
              >
                {subtitle}
              </p>
            )}
            <StatRow stats={stats} />
          </div>
        </div>
      </div>
    </>
  );
}

function ListCard({
  title,
  subtitle,
  imageSrc,
  creationType,
  assetKind,
  badges,
  stats,
  liked,
  bookmarked,
  onOpen,
  onLike,
  onBookmark,
  contextualAction,
  isOwner,
  promoteOwnerActions,
  kebabOpen,
  onToggleKebab,
  onCloseKebab,
  onEdit,
  onGenerateImage,
  onShare,
  onArchive,
  onDelete,
}) {
  const hasImage = Boolean(imageSrc);

  return (
    <>
      <button
        type="button"
        onClick={(event) => stopAndRun(event, onOpen)}
        aria-label={`Open ${title || "creation"}`}
        className="absolute inset-0 z-[1] block w-full rounded-[var(--radius-md)] border border-transparent"
      >
        <span className="sr-only">Open {title || "creation"}</span>
      </button>

      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[center_18%] transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0">
          <KitArtPlaceholderView size="lg" identityKey={creationType || assetKind} />
        </div>
      )}
      {/* List rows read left to right, so the legibility fade anchors to the
          left edge for both assigned art and semantic fallback backgrounds. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--canvas)] via-[color-mix(in_srgb,var(--canvas)_55%,transparent)] to-transparent"
      />

      <div className="pointer-events-none relative z-[2] flex h-full items-center justify-between gap-[var(--space-3)] p-[var(--space-4)]">
        <div className="min-w-0">
          <div className="pointer-events-auto mb-[var(--space-1)]">
            <BadgeRow badges={badges} />
          </div>
          <h3
            className={`truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--art-ink)]`}
          >
            {title || "Untitled"}
          </h3>
          {subtitle && (
            <p
              className={`truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--art-ink-dim)]`}
            >
              {subtitle}
            </p>
          )}
          <StatRow stats={stats} />
        </div>

        <div
          className={`pointer-events-auto flex flex-none items-start gap-[var(--space-1)] ${OVERLAY_REVEAL}`}
        >
          {isOwner ? (
            <KebabMenu
              open={kebabOpen}
              onToggle={onToggleKebab}
              onClose={onCloseKebab}
              onEdit={onEdit}
              onGenerateImage={onGenerateImage}
              onShare={onShare}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ) : null}
          {isOwner && promoteOwnerActions ? (
            <OwnerQuickActions
              onEdit={onEdit}
              onGenerateImage={onGenerateImage}
              contextualAction={contextualAction}
            />
          ) : (
            <OverlayActions
              liked={liked}
              bookmarked={bookmarked}
              onLike={onLike}
              onBookmark={onBookmark}
              contextualAction={contextualAction}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default function KitCreationCardView({
  layout = "grid",
  assetKind = "character",
  creationType = null,
  title = "",
  subtitle = "",
  imageSrc = null,
  badges = [],
  stats = {},
  liked = false,
  bookmarked = false,
  isDisabled = false,
  onOpenImageOverlay = null,
  onOpenAssetDetail = null,
  onLike = null,
  onBookmark = null,
  onPlay = null,
  onGenerate = null,
  onContinue = null,
  isOwner = false,
  promoteOwnerActions = false,
  onEdit = null,
  onGenerateImage = null,
  onShare = null,
  onArchive = null,
  onDelete = null,
}) {
  const isList = layout === "list";
  const onOpen = resolveOpenHandler(assetKind, onOpenImageOverlay, onOpenAssetDetail);
  const contextualAction = resolveContextualAction({ assetKind, onPlay, onGenerate, onOpen, onContinue });

  const disabledClasses = isDisabled
    ? "pointer-events-none opacity-[var(--state-disabled-opacity)]"
    : "";

  // Kebab open state is presentation-only local UI state, the same
  // precedent as KitImageOverlay's delete-confirm gating: no product
  // data, reset by construction whenever the card unmounts.
  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabProps = {
    isOwner,
    promoteOwnerActions,
    kebabOpen,
    onToggleKebab: () => setKebabOpen((current) => !current),
    onCloseKebab: () => setKebabOpen(false),
    onEdit,
    onGenerateImage,
    onShare,
    onArchive,
    onDelete,
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] transition-[transform,box-shadow] duration-[var(--dur-hover)] hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)] ${
        isList ? "aspect-[5/2] min-[700px]:aspect-[16/5]" : "aspect-[3/4]"
      } ${disabledClasses}`}
    >
      {isList ? (
        <ListCard
          title={title}
          subtitle={subtitle}
          imageSrc={imageSrc}
          creationType={creationType}
          assetKind={assetKind}
          badges={badges}
          stats={stats}
          liked={liked}
          bookmarked={bookmarked}
          onOpen={onOpen}
          onLike={onLike}
          onBookmark={onBookmark}
          contextualAction={contextualAction}
          {...kebabProps}
        />
      ) : (
        <GridCard
          title={title}
          subtitle={subtitle}
          imageSrc={imageSrc}
          creationType={creationType}
          assetKind={assetKind}
          badges={badges}
          stats={stats}
          liked={liked}
          bookmarked={bookmarked}
          onOpen={onOpen}
          onLike={onLike}
          onBookmark={onBookmark}
          contextualAction={contextualAction}
          {...kebabProps}
        />
      )}
    </article>
  );
}
