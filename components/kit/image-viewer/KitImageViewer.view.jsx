"use client";

// Image viewer View (FE/MEDIA-STUDIO session 3, notes 6 and 6a). The
// figure column inside KitModalFrame variant="viewer": the glass
// header (title, pixel size beside Upscale, the icon row), the gold
// hairline frame with zoom and pan, the gold-ink bottom bar (Edit,
// Assign, Share), and the thumbnail strip. In edit mode the frame,
// bar, and strip give way to KitImageEditor under the same header.
// Stateless: mode, menu state, and the measured size come from the
// ViewModel; every operation is the page's.
import {
  Bookmark,
  Coins,
  Download,
  Flag,
  Info,
  Link2,
  LoaderCircle,
  Pencil,
  Share2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

import KitImageEditor from "../KitImageEditor";
import { ImageFrame } from "../image-overlay/ImageFrame";
import { InfoTip } from "../form-field/InfoTip";
import { MENU_PANEL_RECIPE, MenuRow } from "../form-field/menuRecipe";
import { SoonChip } from "../form-field/SoonChip";

const NOT_AVAILABLE_LABEL = "Not available yet";

const UPSCALE_TIP =
  "Makes a larger version for fine edits, banners, print, and use off site. The size it produces comes from the server.";

// View-mode image caps: header (three rows), bottom bar, and the
// thumbnail strip are fixed; the image takes what is left.
const VIEWER_IMAGE_CLASSES =
  "block h-auto w-auto max-w-full select-none max-h-[calc(100dvh-20rem)] min-[700px]:max-h-[60dvh] min-[700px]:max-w-[min(88vw,76rem)]";

const GLASS_BAR =
  "pointer-events-auto flex w-full self-stretch rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] backdrop-blur-[var(--blur-panel)]";

// The Soon chip lives in ../form-field/SoonChip.jsx since session 4,
// shared with the composer.

// Quiet-ink icon button, the header row (B7 family).
function ViewerIconButton({ label, active = false, danger = false, expanded, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={expanded === undefined ? active : undefined}
      aria-expanded={expanded}
      onClick={() => onClick?.()}
      className={`flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border transition-colors ${
        active
          ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
          : danger
            ? "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--status-danger)] hover:border-[var(--status-danger)]"
            : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      {children}
    </button>
  );
}

// Upscale: the only place it exists, beside the current pixel size.
// Soon today (disabled, coin glyph and cost, Soon chip, "Not available
// yet"); pending keeps the button in place with the waiting glyph.
function UpscaleControl({ state, coinCost, onUpscale, upscaleRef }) {
  const isSoon = state === "soon";
  const isPending = state === "pending";
  return (
    <span className="relative inline-flex items-center gap-[var(--space-1)]">
      <button
        ref={upscaleRef}
        type="button"
        disabled={isSoon || isPending}
        title={isSoon ? NOT_AVAILABLE_LABEL : undefined}
        onClick={() => onUpscale?.()}
        className="cf-btn cf-btn--secondary cf-btn--sm disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
      >
        <span>Upscale</span>
        {isPending ? (
          <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Coins size={14} aria-hidden="true" />
        )}
        <span className="tabular-nums">{coinCost}</span>
        {isSoon ? <SoonChip /> : null}
      </button>
      <InfoTip label="About upscale" text={UPSCALE_TIP} align="left" />
    </span>
  );
}

function DownloadMenu({ options, open, onToggle, onClose }) {
  if (!options.length) return null;
  return (
    <span className="relative inline-flex">
      <ViewerIconButton label="Download" expanded={open} onClick={onToggle}>
        <Download size={17} aria-hidden="true" />
      </ViewerIconButton>
      {open ? (
        <>
          {/* Outside click closes the menu and nothing else. */}
          <button
            type="button"
            aria-label="Close download menu"
            onClick={() => onClose?.()}
            className="fixed inset-0 z-40 cursor-default bg-transparent"
          />
          <div
            role="listbox"
            aria-label="Download size"
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose?.();
            }}
            className={`${MENU_PANEL_RECIPE} right-0 top-[calc(100%+var(--space-1))] min-w-[14rem]`}
          >
            {options.map((option) => (
              <MenuRow
                key={option.id}
                label={option.label}
                detail={option.detail}
                href={option.href}
                disabled={option.disabled}
                tooltip={option.disabled ? option.tooltip || option.title : ""}
                onSelect={() => onClose?.()}
              />
            ))}
          </div>
        </>
      ) : null}
    </span>
  );
}

function ViewerHeader({
  title,
  pixelSizeLabel,
  upscaleState,
  upscaleCoinCost,
  onUpscale,
  upscaleRef,
  isSaved,
  onSave,
  onDelete,
  onReport,
  onDetails,
  downloadOptions,
  downloadMenuOpen,
  onToggleDownloadMenu,
  onCloseDownloadMenu,
}) {
  return (
    <div className={`${GLASS_BAR} flex-col gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-3)]`}>
      <h2 className="line-clamp-1 text-center font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
        {title || "Untitled"}
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]">
        <p className="text-[length:var(--text-ui)] tabular-nums text-[var(--ink-dim)]">
          {pixelSizeLabel || "Measuring size..."}
        </p>
        <UpscaleControl
          state={upscaleState}
          coinCost={upscaleCoinCost}
          onUpscale={onUpscale}
          upscaleRef={upscaleRef}
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-[var(--space-2)]">
        {onDelete ? (
          <ViewerIconButton label="Delete" danger onClick={onDelete}>
            <Trash2 size={17} aria-hidden="true" />
          </ViewerIconButton>
        ) : null}
        <ViewerIconButton label="Report" onClick={onReport}>
          <Flag size={17} aria-hidden="true" />
        </ViewerIconButton>
        <ViewerIconButton label="Details" onClick={onDetails}>
          <Info size={17} aria-hidden="true" />
        </ViewerIconButton>
        <DownloadMenu
          options={downloadOptions}
          open={downloadMenuOpen}
          onToggle={onToggleDownloadMenu}
          onClose={onCloseDownloadMenu}
        />
        <ViewerIconButton label="Save" active={isSaved} onClick={onSave}>
          <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
        </ViewerIconButton>
      </div>
    </div>
  );
}

// Gold-ink bottom bar: Edit, Assign, Share (note 6). Edit carries no
// cost; the cost sits on the editor's Generate.
function ViewerBarAction({ label, icon, onClick = null, disabled = false, title, soon = false }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      disabled={disabled}
      title={title || label}
      className="inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--gold-action)] transition-colors disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] enabled:hover:text-[var(--gold-bright)]"
    >
      {icon}
      {label}
      {soon ? <SoonChip /> : null}
    </button>
  );
}

function ViewerBottomBar({ onEnterEdit, assignState, onAssign, onShare }) {
  const assignSoon = assignState !== "ready";
  return (
    <div className={`${GLASS_BAR} flex-wrap items-center justify-center gap-[var(--space-2)] px-[var(--space-2)] py-[var(--space-1)]`}>
      <ViewerBarAction label="Edit" icon={<Pencil size={16} aria-hidden="true" />} onClick={onEnterEdit} />
      <ViewerBarAction
        label="Assign"
        icon={<Link2 size={16} aria-hidden="true" />}
        onClick={onAssign}
        disabled={assignSoon}
        soon={assignSoon}
        title={assignSoon ? NOT_AVAILABLE_LABEL : "Assign this image to one of your assets"}
      />
      <ViewerBarAction label="Share" icon={<Share2 size={16} aria-hidden="true" />} onClick={onShare} />
    </div>
  );
}

function ThumbnailButton({ item, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.title || "Image"}
      aria-current={active ? "true" : undefined}
      className={`aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] border transition-colors ${
        active
          ? "border-[var(--gold-bright)] bg-[var(--fill)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] hover:border-[var(--gold-ornament)]"
      }`}
    >
      {item.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.thumbnailUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">
          <ImageIcon size={16} aria-hidden="true" className="text-[var(--gold-ornament)]" />
        </span>
      )}
    </button>
  );
}

export default function KitImageViewerView({
  imageSrc = null,
  title = "",
  items = [],
  activeId = null,
  pixelSize = null,
  pixelSizeLabel = "",
  isSaved = false,
  shareMessage = "",
  downloadOptions = [],
  downloadMenuOpen = false,
  assignState = "soon",
  upscaleCoinCost = 0,
  upscaleState = "soon",
  editRunCoinCost = 0,
  editState = "soon",
  isEditing = false,
  upscaleRef = null,
  overlaySlot = null,
  overlayReplacesBody = false,
  onSelectItem = null,
  onImageLoad = null,
  onSave = null,
  onDelete = null,
  onReport = null,
  onDetails = null,
  onShare = null,
  onAssign = null,
  onUpscale = null,
  onSubmitEdit = null,
  onToggleDownloadMenu = null,
  onCloseDownloadMenu = null,
  onEnterEdit = null,
  onExitEdit = null,
  onFocusUpscale = null,
}) {
  if (overlayReplacesBody) {
    return (
      <div className="pointer-events-none flex h-full w-full items-center justify-center px-[var(--space-4)]">
        {overlaySlot}
      </div>
    );
  }

  return (
    // pointer-events-none continues the frame's click-transparent
    // viewer panel: only the header, the frame, the bars, the editor
    // rows, and the strip re-enable pointer events, so a click
    // anywhere else falls through to the veil and dismisses. w-fit so
    // the header and bars snap to the image's own width (R5).
    <div className="pointer-events-none flex h-full max-h-full w-fit max-w-full min-h-0 flex-col items-center justify-center gap-[var(--space-3)] px-[var(--space-2)] min-[700px]:h-auto min-[700px]:max-h-full min-[700px]:px-0">
      <ViewerHeader
        title={title}
        pixelSizeLabel={pixelSizeLabel}
        upscaleState={upscaleState}
        upscaleCoinCost={upscaleCoinCost}
        onUpscale={onUpscale}
        upscaleRef={upscaleRef}
        isSaved={isSaved}
        onSave={onSave}
        onDelete={onDelete}
        onReport={onReport}
        onDetails={onDetails}
        downloadOptions={downloadOptions}
        downloadMenuOpen={downloadMenuOpen}
        onToggleDownloadMenu={onToggleDownloadMenu}
        onCloseDownloadMenu={onCloseDownloadMenu}
      />

      {shareMessage ? (
        <p className="pointer-events-auto rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--fill)] px-[var(--space-4)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]">
          {shareMessage}
        </p>
      ) : null}

      {isEditing ? (
        <KitImageEditor
          imageSrc={imageSrc}
          title={title}
          pixelSize={pixelSize}
          editRunCoinCost={editRunCoinCost}
          editState={editState}
          onSubmit={onSubmitEdit}
          onClose={onExitEdit}
          onImageLoad={onImageLoad}
          onRequestUpscale={onFocusUpscale}
        />
      ) : (
        <>
          <ImageFrame
            imageSrc={imageSrc}
            title={title}
            zoomDisabled={!imageSrc}
            imageClassName={VIEWER_IMAGE_CLASSES}
            onImageLoad={onImageLoad}
          />

          <ViewerBottomBar
            onEnterEdit={onEnterEdit}
            assignState={assignState}
            onAssign={onAssign}
            onShare={onShare}
          />

          {items.length > 1 ? (
            <div className="pointer-events-auto flex w-full max-w-[min(92vw,64rem)] flex-none gap-[var(--space-2)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {items.map((item) => (
                <ThumbnailButton
                  key={item.id}
                  item={item}
                  active={item.id === activeId}
                  onClick={() => onSelectItem?.(item)}
                />
              ))}
            </div>
          ) : null}
        </>
      )}

      {overlaySlot}
    </div>
  );
}
