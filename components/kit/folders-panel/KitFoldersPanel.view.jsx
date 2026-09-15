"use client";

// KitFoldersPanel.view: stateless presentation of the Folders panel
// (contract 1.0.0, ASSET-FOLDERS package AF3). Reads no storage and
// holds no state; every open menu, draft, and dialog arrives from the
// ViewModel. Folder glyph only (R4). Two hosts: the column (18rem,
// sticky under the shared filter bar) and the Kit frame's sheet.
//
// Row menu placement: the menu expands inline directly under its row,
// on the shared menu recipe minus the floating position, pushing the
// rows below it down. A floating menu inside the list's scroller
// would be clipped by that scroller and could open past the sheet's
// bottom edge at 390; an inline block is always inside the viewport
// by construction, in both hosts.
//
// Column sticky offset: the shared filter bar sits at
// top: calc(var(--topbar-h) - 1px) with --control-filter content
// and --space-3 padding above and below at 700 and up, so the column
// pins just beneath it with one --space-4 gap, every term a token.
import { ChevronRight, Ellipsis, Folder, FolderPlus } from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import { menuPanelRecipe, MenuRow } from "../form-field/menuRecipe";

const COLUMN_STICKY_TOP =
  "calc(var(--topbar-h) - 1px + var(--control-filter) + var(--space-3) * 2 + var(--space-4))";

// Same surface, radius, padding, and hover as every other menu, in
// flow rather than floating (see the placement note above).
const INLINE_MENU_RECIPE = menuPanelRecipe("inline");

const ROW_RECIPE =
  "flex min-h-[var(--control-md)] w-full min-w-0 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)]";

const ROW_INK = {
  rest: "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)]",
  selected: "bg-[var(--fill)] text-[var(--gold-bright)]",
};

const ICON_BUTTON_RECIPE =
  "flex h-[var(--control-md)] w-[var(--control-md)] flex-none items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-faint)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]";

// The field recipe (KitFormField's input bed): a control you type
// into sinks one step below its container.
const FIELD_RECIPE =
  "min-h-[var(--control-md)] w-full min-w-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--bed-deep)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] shadow-[var(--shadow-bed)] transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]";

function indentStyle(depth) {
  // Root rows sit at --space-3; each level steps in one --space-5.
  return { paddingLeft: `calc(var(--space-3) + ${Math.max(0, depth - 1)} * var(--space-5))` };
}

function CountChip({ count }) {
  if (count === null || count === undefined) return null;
  return (
    <span className="flex-none tabular-nums text-[length:var(--text-label)] text-[var(--ink-faint)]">{count}</span>
  );
}

function RenameField({ value, onChange, onCommit, onCancel }) {
  return (
    <input
      type="text"
      value={value}
      autoFocus
      aria-label="Folder name"
      onChange={(event) => onChange?.(event.target.value)}
      onBlur={() => onCommit?.()}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onCommit?.();
        } else if (event.key === "Escape") {
          event.preventDefault();
          onCancel?.();
        }
      }}
      className={`${FIELD_RECIPE} my-[var(--space-1)]`}
    />
  );
}

function FolderRow({
  row,
  copy,
  isRenaming,
  renameDraft,
  isMenuOpen,
  onSelectFolder,
  onToggleOpen,
  onToggleMenu,
  onBeginRename,
  onChangeRenameDraft,
  onCancelRename,
  onCommitRename,
  onOpenMove,
  onOpenDelete,
}) {
  return (
    <li className="min-w-0">
      <div
        className={`${ROW_RECIPE} pr-[var(--space-1)] ${row.isSelected ? ROW_INK.selected : ROW_INK.rest}`}
        style={indentStyle(row.depth)}
      >
        {/* Collapse and expand (AF5 follow-up 4, item 2): a 44px
            chevron at the left of every row with children, turning
            90 degrees on open; a childless row keeps the same width
            blank so names align within a level. */}
        {row.hasChildren ? (
          <button
            type="button"
            aria-label={copy.toggleLabel(row.name, row.isOpen)}
            aria-expanded={row.isOpen}
            onClick={() => onToggleOpen?.(row.id)}
            className={ICON_BUTTON_RECIPE}
          >
            <ChevronRight
              size={16}
              aria-hidden="true"
              className={`transition-transform duration-[var(--dur-fast)] ${row.isOpen ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span aria-hidden="true" className="w-[var(--control-md)] flex-none" />
        )}
        <Folder size={16} aria-hidden="true" className="flex-none" />
        {isRenaming ? (
          <RenameField
            value={renameDraft}
            onChange={onChangeRenameDraft}
            onCommit={onCommitRename}
            onCancel={onCancelRename}
          />
        ) : (
          <button
            type="button"
            aria-pressed={row.isSelected}
            aria-label={copy.rowLabel(row.name, row.count)}
            onClick={() => onSelectFolder?.(row.id)}
            className="flex min-h-[var(--control-md)] min-w-0 flex-1 items-center gap-[var(--space-2)] text-left"
          >
            <span className="min-w-0 flex-1 truncate">{row.name}</span>
            <CountChip count={row.count} />
          </button>
        )}
        <button
          type="button"
          aria-label={copy.menuLabel(row.name)}
          aria-expanded={isMenuOpen}
          onClick={() => onToggleMenu?.(row.id)}
          className={ICON_BUTTON_RECIPE}
        >
          <Ellipsis size={16} aria-hidden="true" />
        </button>
      </div>

      {isMenuOpen ? (
        <div role="listbox" aria-label={copy.menuLabel(row.name)} className={`${INLINE_MENU_RECIPE} my-[var(--space-1)]`} style={indentStyle(row.depth)}>
          <MenuRow label={copy.rename} onSelect={() => onBeginRename?.(row.id)} />
          <MenuRow label={copy.moveTo} onSelect={() => onOpenMove?.(row.id)} />
          <MenuRow label={copy.delete} onSelect={() => onOpenDelete?.(row.id)} />
        </div>
      ) : null}
    </li>
  );
}

function ParentChoices({ choices = [], selectedId = null, onChoose, copy }) {
  return (
    <div role="listbox" aria-label={copy.createInsideLabel} className={`${INLINE_MENU_RECIPE} max-h-[14rem]`}>
      {choices.map((choice) => (
        <div key={choice.id ?? "root"} style={indentStyle(choice.depth + 1)}>
          <MenuRow
            label={choice.name}
            isSelected={(choice.id ?? null) === (selectedId ?? null)}
            disabled={!choice.isAllowed}
            tooltip={choice.isAllowed ? "" : "Full"}
            onSelect={() => onChoose?.(choice.id ?? null)}
          />
        </div>
      ))}
    </div>
  );
}

function DialogFrame({ ariaLabel, onClose, children }) {
  return (
    <KitModalFrame variant="modal" panelWidth="28rem" onClose={onClose} ariaLabel={ariaLabel}>
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)] pt-[var(--space-8)]">{children}</div>
    </KitModalFrame>
  );
}

function DialogEyebrow({ children, tone = "neutral" }) {
  const ink = tone === "danger" ? "text-[var(--status-danger)]" : "text-[var(--gold-ornament)]";
  return (
    <p className={`text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] ${ink}`}>{children}</p>
  );
}

function DialogTitle({ children }) {
  return (
    <h2 className="break-words font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
      {children}
    </h2>
  );
}

function DialogError({ error }) {
  if (!error) return null;
  return (
    <p role="alert" className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
      {error}
    </p>
  );
}

function DialogActions({ children }) {
  return (
    <>
      <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />
      <div className="flex flex-wrap justify-end gap-[var(--space-3)]">{children}</div>
    </>
  );
}

function PanelDialog({ dialog, copy, onCloseDialog, onChangeCreateDraft, onChooseCreateParent, onCommitCreate, onChooseMoveTarget, onCommitMove, onCommitDelete }) {
  if (!dialog) return null;

  if (dialog.kind === "create") {
    return (
      <DialogFrame ariaLabel={copy.createTitle} onClose={onCloseDialog}>
        <DialogEyebrow>{copy.title}</DialogEyebrow>
        <DialogTitle>{copy.createTitle}</DialogTitle>
        <label className="flex flex-col gap-[var(--space-2)]">
          <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
            {copy.createNameLabel}
          </span>
          <input
            type="text"
            value={dialog.draft}
            autoFocus
            placeholder={copy.createNamePlaceholder}
            onChange={(event) => onChangeCreateDraft?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onCommitCreate?.();
              }
            }}
            className={FIELD_RECIPE}
          />
        </label>
        <div className="flex flex-col gap-[var(--space-2)]">
          <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
            {copy.createInsideLabel}
          </span>
          <ParentChoices choices={dialog.parentChoices} selectedId={dialog.parentId} onChoose={onChooseCreateParent} copy={copy} />
        </div>
        <DialogError error={dialog.error} />
        <DialogActions>
          <button type="button" onClick={onCloseDialog} className="cf-btn cf-btn--secondary cf-btn--sm">
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={onCommitCreate}
            disabled={!dialog.draft.trim()}
            className="cf-btn cf-btn--primary cf-btn--sm"
          >
            {copy.create}
          </button>
        </DialogActions>
      </DialogFrame>
    );
  }

  if (dialog.kind === "move") {
    return (
      <DialogFrame ariaLabel={`${copy.moveTitle} ${dialog.folderName}`} onClose={onCloseDialog}>
        <DialogEyebrow>{copy.moveTitle}</DialogEyebrow>
        <DialogTitle>{dialog.folderName}</DialogTitle>
        <ParentChoices choices={dialog.parentChoices} selectedId={dialog.parentId} onChoose={onChooseMoveTarget} copy={copy} />
        <DialogError error={dialog.error} />
        <DialogActions>
          <button type="button" onClick={onCloseDialog} className="cf-btn cf-btn--secondary cf-btn--sm">
            {copy.cancel}
          </button>
          <button type="button" onClick={onCommitMove} className="cf-btn cf-btn--primary cf-btn--sm">
            {copy.move}
          </button>
        </DialogActions>
      </DialogFrame>
    );
  }

  if (dialog.kind === "delete") {
    return (
      <DialogFrame ariaLabel={copy.deleteTitle(dialog.folderName)} onClose={onCloseDialog}>
        <DialogEyebrow tone="danger">{copy.deleteEyebrow}</DialogEyebrow>
        <DialogTitle>{copy.deleteTitle(dialog.folderName)}</DialogTitle>
        <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          {copy.deleteBody(dialog.childCount, dialog.itemCount, dialog.parentName)}
        </p>
        <DialogError error={dialog.error} />
        <DialogActions>
          <button type="button" onClick={onCloseDialog} className="cf-btn cf-btn--secondary cf-btn--sm">
            {copy.cancel}
          </button>
          {/* The bordered danger recipe (B5, the modal-confirm CTA), the
              same height and shape as Cancel (follow-up 4, item 3). */}
          <button type="button" onClick={onCommitDelete} className="cf-btn cf-btn--danger-filled cf-btn--sm">
            {copy.delete}
          </button>
        </DialogActions>
      </DialogFrame>
    );
  }

  return null;
}

function PanelBody(props) {
  const {
    title,
    copy,
    rows,
    allCount,
    isAllSelected,
    footerNote,
    menuOpenId,
    renamingId,
    renameDraft,
    onSelectFolder,
    onOpenCreate,
    showTitle = true,
  } = props;

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-col">
      <div className="flex min-h-[var(--control-md)] items-center justify-between gap-[var(--space-3)] px-[var(--space-3)]">
        {showTitle ? (
          <h2 className="min-w-0 truncate font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
            {title}
          </h2>
        ) : (
          <span />
        )}
        <button type="button" onClick={() => onOpenCreate?.(null)} className="cf-btn cf-btn--secondary cf-btn--sm">
          <FolderPlus size={14} aria-hidden="true" />
          {copy.newFolder}
        </button>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-[var(--space-2)] py-[var(--space-2)]">
        <li className="min-w-0">
          <button
            type="button"
            aria-pressed={isAllSelected}
            onClick={() => onSelectFolder?.(null)}
            className={`${ROW_RECIPE} px-[var(--space-3)] ${isAllSelected ? ROW_INK.selected : ROW_INK.rest}`}
          >
            <Folder size={16} aria-hidden="true" className="flex-none" />
            <span className="min-w-0 flex-1 truncate">{copy.allLabel}</span>
            <CountChip count={allCount} />
          </button>
        </li>

        {rows.length === 0 ? (
          <li className="px-[var(--space-3)] py-[var(--space-4)]">
            <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">{copy.emptyTitle}</p>
            <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
              {copy.emptyBody}
            </p>
          </li>
        ) : (
          rows.map((row) => (
            <FolderRow
              key={row.id}
              row={row}
              copy={copy}
              isRenaming={renamingId === row.id}
              renameDraft={renameDraft}
              isMenuOpen={menuOpenId === row.id}
              onSelectFolder={onSelectFolder}
              onToggleOpen={props.onToggleOpen}
              onToggleMenu={props.onToggleMenu}
              onBeginRename={props.onBeginRename}
              onChangeRenameDraft={props.onChangeRenameDraft}
              onCancelRename={props.onCancelRename}
              onCommitRename={props.onCommitRename}
              onOpenMove={props.onOpenMove}
              onOpenDelete={props.onOpenDelete}
            />
          ))
        )}
      </ul>

      {footerNote ? (
        <p className="border-t border-[var(--line-whisper)] px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
          {footerNote}
        </p>
      ) : null}
    </div>
  );
}

export default function KitFoldersPanelView(props) {
  const { host = "column", title = "Folders", onClose = null, dialog = null, copy } = props;

  const dialogNode = (
    <PanelDialog
      dialog={dialog}
      copy={copy}
      onCloseDialog={props.onCloseDialog}
      onChangeCreateDraft={props.onChangeCreateDraft}
      onChooseCreateParent={props.onChooseCreateParent}
      onCommitCreate={props.onCommitCreate}
      onChooseMoveTarget={props.onChooseMoveTarget}
      onCommitMove={props.onCommitMove}
      onCommitDelete={props.onCommitDelete}
    />
  );

  if (host === "sheet") {
    return (
      <>
        <KitModalFrame
          variant="sheet"
          sheetGrabber
          onClose={onClose}
          ariaLabel={title}
          headerSlot={
            <span className="mr-auto text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              {title}
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
          {/* The frame's sheet caps at 92dvh; the list scrolls inside
              a bounded column so the footer line stays in view. The
              space-4 above keeps the New folder control off the
              sheet header's separator line (AF5 follow-up 2, item 2). */}
          <div className="flex max-h-[70dvh] min-h-0 w-full max-w-full flex-col overflow-hidden pt-[var(--space-4)]">
            <PanelBody {...props} showTitle={false} />
          </div>
        </KitModalFrame>
        {dialogNode}
      </>
    );
  }

  return (
    <>
      <aside
        aria-label={title}
        className="sticky flex w-[18rem] flex-none flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] py-[var(--space-2)]"
        style={{
          top: COLUMN_STICKY_TOP,
          maxHeight: `calc(100dvh - ${COLUMN_STICKY_TOP} - var(--space-8))`,
        }}
      >
        <PanelBody {...props} />
      </aside>
      {dialogNode}
    </>
  );
}
