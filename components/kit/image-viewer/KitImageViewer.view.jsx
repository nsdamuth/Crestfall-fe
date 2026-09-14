"use client";

// Image viewer View (FE/MEDIA-STUDIO session 3, notes 6 and 6a). The
// figure column inside KitModalFrame variant="viewer": the glass
// header (title, pixel size beside Upscale, the icon row), the gold
// hairline frame with zoom and pan, and the gold-ink bottom bar (Edit,
// then Assign or Remix, then Share). In edit mode the frame and bar
// give way to KitImageEditor under the same header. Stateless: mode,
// menu state, and the measured size come from the ViewModel; every
// operation is the page's.
//
// 2.0.0, RULED 12 Sep 2026 (Brian's browser review): the thumbnail
// strip under the bottom bar is removed; it duplicated the page's own
// list. The bottom bar's middle action is now chosen by the page:
// "assign" for the viewer's own library, "remix" for a public image
// (creator cards), which creates a new asset off the public one.
import {
  Bookmark,
  Coins,
  Download,
  Flag,
  GitFork,
  Info,
  Link2,
  LoaderCircle,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";

import KitImageEditor from "../KitImageEditor";
import { ImageDetailsPanel, ReassignDialog } from "../../studio/media/media-lightbox/MediaLightbox.view";
import { ImageFrame } from "../image-overlay/ImageFrame";
import { InfoTip } from "../form-field/InfoTip";
import { MENU_PANEL_RECIPE, MenuRow } from "../form-field/menuRecipe";
import { SoonChip } from "../form-field/SoonChip";

const NOT_AVAILABLE_LABEL = "Not available yet";

const UPSCALE_TIP =
  "Makes a larger version for fine edits, banners, print, and use off site. The size it produces comes from the server.";

// View-mode sizing. Mobile keeps the chrome-aware cap. Desktop must
// actively SCALE the image into the available viewer envelope, not only
// cap its intrinsic dimensions. The prior h-auto/w-auto + max-* recipe
// never enlarged an 832x1040 source, which is why the new Kit viewer
// appeared much smaller than the legacy full-screen MediaLightbox.
//
// Details restoration, RULED 13 Sep 2026: Details is the reverse face of
// the exact fitted image box. The image stays mounted so zoom/pan state
// survives the flip; the hidden face cannot receive pointer input, and
// the details face owns its own vertical scroll. Reduced-motion users get
// the same face swap with no transition.
// --viewer-expanded-width is derived from the measured image aspect
// ratio so portrait and landscape images both grow until they meet
// either the 78dvh height envelope or the 88vw/76rem width envelope.
// Image sizing, RULED 12 Sep 2026 (Brian's browser review, second
// pass): the ViewModel measures the frame slot (the column's height
// after the header and the bar) and fits the image's own ratio into
// it, publishing the result as --viewer-image-w and --viewer-image-h.
// The image takes exactly that box, so it keeps its fixed ratio at
// every window shape, is never cropped, and the hairline hugs it.
// Until the box exists (the first paint before the slot is measured,
// or an image with no size yet) the image sits on caps only. The
// former 78dvh formula squashed the image in short windows, and a
// percentage cap chain through the nested frames cropped it.
const VIEWER_IMAGE_FITTED_CLASSES =
  "block select-none w-[var(--viewer-image-w)] h-[var(--viewer-image-h)] max-w-full";
const VIEWER_IMAGE_FALLBACK_CLASSES =
  "block h-auto w-auto max-h-full max-w-full select-none min-[700px]:max-w-[min(88vw,76rem)]";

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
  detailsActive = false,
  detailsLabel = "Details",
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
        <ViewerIconButton label={detailsLabel} active={detailsActive} onClick={onDetails}>
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

function ViewerBottomBar({
  onEnterEdit,
  bottomBarAction,
  assignState,
  assignActive = false,
  onAssign,
  remixState,
  onRemix,
  onShare,
}) {
  const isRemix = bottomBarAction === "remix";
  const middleSoon = isRemix ? remixState !== "ready" : assignState !== "ready";
  return (
    <div className={`${GLASS_BAR} flex-wrap items-center justify-center gap-[var(--space-2)] px-[var(--space-2)] py-[var(--space-1)]`}>
      <ViewerBarAction label="Edit" icon={<Pencil size={16} aria-hidden="true" />} onClick={onEnterEdit} />
      {isRemix ? (
        <ViewerBarAction
          label="Remix"
          icon={<GitFork size={16} aria-hidden="true" />}
          onClick={onRemix}
          disabled={middleSoon}
          soon={middleSoon}
          title={middleSoon ? NOT_AVAILABLE_LABEL : "Remix this image into a new asset of your own"}
        />
      ) : (
        <ViewerBarAction
          label={assignActive ? "Back to image" : "Assign"}
          icon={<Link2 size={16} aria-hidden="true" />}
          onClick={onAssign}
          disabled={middleSoon}
          soon={middleSoon}
          title={
            middleSoon
              ? NOT_AVAILABLE_LABEL
              : assignActive
                ? "Return to the image"
                : "Assign this image to one of your assets"
          }
        />
      )}
      <ViewerBarAction label="Share" icon={<Share2 size={16} aria-hidden="true" />} onClick={onShare} />
    </div>
  );
}

export default function KitImageViewerView({
  imageSrc = null,
  title = "",
  pixelSize = null,
  pixelSizeLabel = "",
  frameSlotRef = null,
  hasImageBox = false,
  imageBoxStyle = undefined,
  isSaved = false,
  shareMessage = "",
  downloadOptions = [],
  downloadMenuOpen = false,
  assignState = "soon",
  bottomBarAction = "assign",
  remixState = "soon",
  upscaleCoinCost = 0,
  upscaleState = "soon",
  editRunCoinCost = 0,
  editState = "soon",
  isEditing = false,
  upscaleRef = null,
  overlaySlot = null,
  overlayReplacesBody = false,
  detailsOpen = false,
  detailsPanel = null,
  assignOpen = false,
  assignPanel = null,
  onImageLoad = null,
  onSave = null,
  onDelete = null,
  onReport = null,
  onDetails = null,
  onShare = null,
  onAssign = null,
  onRemix = null,
  onUpscale = null,
  onSubmitEdit = null,
  onCloseDetails = null,
  onCloseAssign = null,
  onAssignDestinationChange = null,
  onSubmitAssign = null,
  onToggleDownloadMenu = null,
  onCloseDownloadMenu = null,
  onEnterEdit = null,
  onExitEdit = null,
  onFocusUpscale = null,
}) {
  const backFaceOpen = Boolean(detailsOpen || assignOpen);

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
    // the header and bars snap to the image's own width (R5). The
    // column is the full viewer height at every width with --space-4
    // above and below (RULED 12 Sep 2026: never flush with the
    // window); the frame slot takes what the header and bar leave and
    // is measured by the ViewModel, which sizes the image to it.
    <div
      style={imageBoxStyle}
      className="pointer-events-none flex h-full max-h-full w-fit max-w-full min-h-0 flex-col items-center justify-center gap-[var(--space-3)] px-[var(--space-2)] py-[var(--space-4)] min-[700px]:px-0"
    >
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
        detailsActive={detailsOpen}
        detailsLabel={detailsOpen ? "Back to image" : "Details"}
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
          <div
            ref={frameSlotRef}
            className="flex min-h-0 max-w-full flex-1 items-center justify-center self-stretch"
          >
            <div
              className={`relative max-h-full max-w-full [perspective:1200px] ${
                hasImageBox
                  ? "h-[var(--viewer-image-h)] w-[var(--viewer-image-w)]"
                  : "h-full w-full min-h-[16rem] max-w-[40rem]"
              }`}
            >
              <div
                data-viewer-flip-surface
                className="relative h-full w-full transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
                style={{
                  transform: backFaceOpen ? "rotateY(180deg)" : "rotateY(0deg)",
                  willChange: "transform",
                }}
              >
                <div
                  aria-hidden={backFaceOpen}
                  inert={backFaceOpen ? true : undefined}
                  className={`absolute inset-0 flex items-center justify-center [backface-visibility:hidden] ${
                    backFaceOpen ? "pointer-events-none" : "pointer-events-auto"
                  }`}
                >
                  <ImageFrame
                    imageSrc={imageSrc}
                    title={title}
                    zoomDisabled={!imageSrc}
                    imageClassName={hasImageBox ? VIEWER_IMAGE_FITTED_CLASSES : VIEWER_IMAGE_FALLBACK_CLASSES}
                    onImageLoad={onImageLoad}
                  />
                </div>

                <div
                  aria-hidden={!backFaceOpen}
                  inert={!backFaceOpen ? true : undefined}
                  className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    backFaceOpen ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  {assignOpen ? (
                    <ReassignDialog
                      embedded
                      {...assignPanel}
                      onDestinationChange={onAssignDestinationChange}
                      onSubmit={onSubmitAssign}
                      onClose={onCloseAssign}
                    />
                  ) : (
                    <ImageDetailsPanel embedded {...detailsPanel} onClose={onCloseDetails} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <ViewerBottomBar
            onEnterEdit={onEnterEdit}
            bottomBarAction={bottomBarAction}
            assignState={assignState}
            assignActive={assignOpen}
            onAssign={onAssign}
            remixState={remixState}
            onRemix={onRemix}
            onShare={onShare}
          />
        </>
      )}

      {overlaySlot}
    </div>
  );
}
