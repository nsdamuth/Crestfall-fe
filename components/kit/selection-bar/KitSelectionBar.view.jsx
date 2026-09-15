"use client";

// KitSelectionBar.view: stateless presentation of the one selection
// bar (contract 1.0.0, ASSET-FOLDERS package AF4). No selection
// state, no item ids: the count and every handler arrive as props.
//
// Placement: below md the bar is fixed above the mobile dock at the
// create-page action bar's own offset (control-md plus space-4 plus
// the safe area, inset by the space-5 gutter); at md and up it is
// fixed to the bottom of the viewport with a space-5 margin from the
// bottom edge, never in flow under the grid (AF5 follow-up 2, item
// 1), centered between two dock insets the page may supply
// (dockInsets, 1.1.0: the page column's left and right distances
// from the viewport edges, so the bar centers on the column rather
// than the viewport; absent, the space-5 gutter on both sides), at a
// fixed max width. Surface-3 with a whisper line, no blur, no shadow
// utility. Every control is 44px. Below 700 the Add to folder and
// Download labels drop to their glyphs (aria-label keeps the word);
// Delete and Done keep their words at every width.
import { Download, FolderMinus, FolderPlus, Loader2, Trash2 } from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import { SoonChip } from "../form-field/SoonChip";
import { MENU_PANEL_RECIPE, MenuRow } from "../form-field/menuRecipe";

const BAR_RECIPE =
  "z-40 flex w-full min-w-0 items-center gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] px-[var(--space-3)] py-[var(--space-2)] max-md:fixed max-md:inset-x-[var(--space-5)] max-md:bottom-[calc(var(--control-md)+var(--space-4)+env(safe-area-inset-bottom))] max-md:w-auto md:fixed md:bottom-[var(--space-5)] md:left-[var(--selection-dock-left,var(--space-5))] md:right-[var(--selection-dock-right,var(--space-5))] md:mx-auto md:w-auto md:max-w-[40rem]";

// The two dock insets become the custom properties the md recipe
// reads; without them the recipe's own gutter fallback applies.
function dockStyle(dockInsets) {
  if (!dockInsets) return undefined;
  return {
    "--selection-dock-left": `${dockInsets.left}px`,
    "--selection-dock-right": `${dockInsets.right}px`,
  };
}

// The ruled small button plus the touch floor, and the label that
// hides below 700 while the glyph stays.
const LABEL_BELOW_700 = "hidden min-[700px]:inline";

function BarButton({ label, Icon, onClick, disabled = false, soon = false, danger = false, hideLabelOnPhone = false, title, children }) {
  const recipe = danger ? "cf-btn cf-btn--danger cf-btn--sm" : "cf-btn cf-btn--secondary cf-btn--sm";
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      disabled={disabled || soon}
      aria-label={label}
      title={soon ? title : undefined}
      className={`${recipe} min-h-[var(--control-md)] flex-none`}
    >
      {children || <Icon size={14} aria-hidden="true" />}
      <span className={hideLabelOnPhone ? LABEL_BELOW_700 : ""}>{label}</span>
      {soon ? <SoonChip inline /> : null}
    </button>
  );
}

function FolderPicker({ host, rows, copy, onPick, onClose }) {
  const list = (
    <div role="listbox" aria-label={copy.pickerTitle} className={`${MENU_PANEL_RECIPE.replace("absolute z-50 ", "")} max-h-[50vh]`}>
      {rows.length === 0 ? (
        <p className="px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {copy.pickerEmpty}
        </p>
      ) : (
        rows.map((row) => (
          <div key={row.id} style={{ paddingLeft: `calc(${Math.max(0, row.depth - 1)} * var(--space-5))` }}>
            <MenuRow label={row.name} onSelect={() => onPick?.(row.id)} />
          </div>
        ))
      )}
    </div>
  );

  if (host === "sheet") {
    return (
      <KitModalFrame
        variant="sheet"
        sheetGrabber
        onClose={onClose}
        ariaLabel={copy.pickerTitle}
        headerSlot={
          <span className="mr-auto text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {copy.pickerTitle}
          </span>
        }
        panelStyle={{
          backgroundImage: "none",
          backgroundColor: "var(--surface-3)",
          borderColor: "var(--line-whisper)",
          width: "calc(100% - var(--space-5) * 2)",
          maxWidth: "calc(100% - var(--space-5) * 2)",
        }}
      >
        <div className="max-h-[70dvh] overflow-y-auto p-[var(--space-2)]">{list}</div>
      </KitModalFrame>
    );
  }

  return (
    <KitModalFrame variant="modal" panelWidth="28rem" onClose={onClose} ariaLabel={copy.pickerTitle}>
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)] pt-[var(--space-8)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {copy.pickerTitle}
        </p>
        {list}
      </div>
    </KitModalFrame>
  );
}

// Lifted from the Media grid view's bulk section (BulkDeleteConfirmModal)
// with the count and the page's noun in the copy; the page's handler
// runs from the primary only.
function DeleteConfirm({ selectedCount, noun, body, copy, isBusy, onCancel, onConfirm }) {
  return (
    <KitModalFrame variant="modal" panelWidth="28rem" onClose={isBusy ? null : onCancel} ariaLabel={copy.deleteTitle(selectedCount, noun)}>
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)] pt-[var(--space-8)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--status-danger)]">
          {copy.deleteEyebrow}
        </p>
        <h2 className="break-words font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
          {copy.deleteTitle(selectedCount, noun)}
        </h2>
        <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">{body}</p>
        <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />
        <div className="flex flex-wrap justify-end gap-[var(--space-3)]">
          <button type="button" onClick={onCancel} disabled={isBusy} className="cf-btn cf-btn--secondary cf-btn--sm">
            {copy.cancel}
          </button>
          <button type="button" onClick={onConfirm} disabled={isBusy || !selectedCount} className="cf-btn cf-btn--danger cf-btn--sm">
            <Trash2 size={14} aria-hidden="true" />
            {copy.deleteConfirm(selectedCount)}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

export default function KitSelectionBarView({
  isVisible = false,
  selectedCount = 0,
  countLabel = "",
  noun = "items",
  copy,
  isBusy = false,
  isDownloadSoon = false,
  isDeleteSoon = false,
  deleteBody = "",
  pickerHost = "modal",
  pickerOpen = false,
  folderRows = [],
  confirmOpen = false,
  onOpenPicker = null,
  onClosePicker = null,
  onPickFolder = null,
  onDownload = null,
  removeFromFolderName = "",
  onRemoveFromFolder = null,
  onOpenDeleteConfirm = null,
  onCloseDeleteConfirm = null,
  onConfirmDelete = null,
  onDone = null,
  dockInsets = null,
}) {
  if (!isVisible) return null;

  return (
    <>
      <div role="toolbar" aria-label={countLabel} className={BAR_RECIPE} style={dockStyle(dockInsets)}>
        <p className="min-w-0 flex-1 truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-ornament)]">
          {countLabel}
        </p>
        {/* Order after the count (AF5 follow-up 2, item 7): Delete,
            Add to folder, Download, Done. */}
        <BarButton
          label={isBusy ? copy.deleting : copy.delete}
          Icon={Trash2}
          onClick={onOpenDeleteConfirm}
          disabled={isBusy}
          soon={isDeleteSoon}
          title={copy.notAvailable}
          danger
        >
          {isBusy ? <Loader2 size={14} aria-hidden="true" className="animate-spin" /> : null}
        </BarButton>
        {/* The second control (AF5 follow-up 3, item 1): with a folder
            other than All chosen it reads Remove from folder and
            unfiles the selection; at the root it opens the picker.
            Both drop to the glyph below 700. */}
        {removeFromFolderName ? (
          <BarButton label={copy.removeFromFolder} Icon={FolderMinus} onClick={onRemoveFromFolder} disabled={isBusy} hideLabelOnPhone />
        ) : (
          <BarButton label={copy.addToFolder} Icon={FolderPlus} onClick={onOpenPicker} disabled={isBusy} hideLabelOnPhone />
        )}
        <BarButton
          label={copy.download}
          Icon={Download}
          onClick={onDownload}
          disabled={isBusy}
          soon={isDownloadSoon}
          title={copy.notAvailable}
          hideLabelOnPhone
        />
        <BarButton label={copy.done} Icon={null} onClick={onDone}>
          <span className="sr-only">{copy.done}</span>
        </BarButton>
      </div>

      {pickerOpen ? (
        <FolderPicker host={pickerHost} rows={folderRows} copy={copy} onPick={onPickFolder} onClose={onClosePicker} />
      ) : null}

      {confirmOpen ? (
        <DeleteConfirm
          selectedCount={selectedCount}
          noun={noun}
          body={deleteBody}
          copy={copy}
          isBusy={isBusy}
          onCancel={onCloseDeleteConfirm}
          onConfirm={onConfirmDelete}
        />
      ) : null}
    </>
  );
}
