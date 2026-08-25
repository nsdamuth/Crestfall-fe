"use client";

import { useState } from "react";
import { Download, PanelRightClose, Share2, Trash2 } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import { DeleteConfirmSheet } from "../chat-session-dialogs/ChatSessionDialogs.view";

const ACTION_ICONS = {
  share: Share2,
  download: Download,
  delete: Trash2,
};

// State panel, RULED 23 Aug 2026 (build-0823 pass 2): the management
// icon row (Share, Export, Delete) replaces the old button stack;
// Delete Story moved here from chat-cast-panel and carries the
// quiet-delete law (quiet trigger, no fill, --status-danger ink,
// visible word beside the icon). Below, World, Knowledge, and
// Mechanics render as quiet key-value rows separated by fade-line
// section labels, replacing the boxed StateCards.
function ManagementRow({ actions, onRequestDeleteRoom }) {
  const safeActions = Array.isArray(actions) ? actions : [];

  return (
    <div className="flex items-center gap-[var(--space-3)]">
      {safeActions.map((action) => {
        const ActionIcon = ACTION_ICONS[action.iconKey] || Share2;
        const isDelete = action.iconKey === "delete";

        return (
          <button
            key={action.id}
            type="button"
            disabled={Boolean(action.disabled)}
            onClick={() => (isDelete ? onRequestDeleteRoom?.() : action.onPress?.())}
            className={`flex h-[var(--control-filter)] w-[var(--control-filter)] touch-manipulation flex-col items-center justify-center gap-[2px] rounded-[var(--radius-md)] border transition [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)] ${
              action.disabled
                ? "cursor-not-allowed border-[var(--line-whisper)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)]"
                : isDelete
                  ? "border-[var(--line-whisper)] bg-transparent text-[var(--status-danger)] hover:bg-[var(--status-danger-bed)]"
                  : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
            aria-label={action.label}
            title={action.label}
          >
            <ActionIcon size={14} aria-hidden="true" />
            <span className="text-[length:var(--text-label)] uppercase leading-none tracking-[var(--track-label)]">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuietSection({ section }) {
  const rows = Array.isArray(section?.rows) ? section.rows : [];

  return (
    <div>
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
        {section?.title || "State"}
      </p>
      <div aria-hidden="true" className="mt-[var(--space-2)] h-px bg-[image:var(--line-fade)]" />

      <div className="mt-[var(--space-3)] space-y-[var(--space-2)]">
        {rows.map((row) => (
          <div key={row.id} className="flex items-baseline justify-between gap-[var(--space-3)]">
            <p className="shrink-0 text-[length:var(--text-label)] text-[var(--ink-dim)]">{row.label}</p>
            <p className="truncate text-right text-[length:var(--text-ui)] text-[var(--ink)]">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatePanelContent({
  eyebrow,
  title,
  sections,
  actions,
  showCloseControl,
  onClosePanel,
  deleteConfirm,
  onRequestDeleteRoom,
}) {
  const safeSections = Array.isArray(sections) ? sections : [];

  return (
    <div>
      <div className="mb-[var(--space-4)] flex items-center justify-between gap-[var(--space-3)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>

        {showCloseControl ? (
          <button
            type="button"
            onClick={() => onClosePanel?.()}
            className="flex h-[var(--control-sm)] w-[var(--control-sm)] touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
            aria-label="Hide state panel"
            title="Hide state panel"
          >
            <PanelRightClose size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)]">
        {title}
      </h2>

      <div className="mt-[var(--space-4)]">
        <ManagementRow actions={actions} onRequestDeleteRoom={onRequestDeleteRoom} />
      </div>

      <div className="mt-[var(--space-6)] space-y-[var(--space-5)]">
        {safeSections.map((section) => (
          <QuietSection key={section.id} section={section} />
        ))}
      </div>

      {deleteConfirm?.open ? <DeleteConfirmSheet {...deleteConfirm} /> : null}
    </div>
  );
}

export default function ChatStatePanelView(props) {
  const { initialMobileOpen = false, mobileOpen: controlledMobileOpen, onMobileOpenChange, ...contentProps } = props;

  const [localMobileOpen, setLocalMobileOpen] = useState(initialMobileOpen);
  const isControlled = typeof controlledMobileOpen === "boolean";
  const mobileOpen = isControlled ? controlledMobileOpen : localMobileOpen;

  function closeMobile() {
    if (isControlled) {
      onMobileOpenChange?.(false);
      return;
    }

    setLocalMobileOpen(false);
  }

  return (
    <>
      <aside className="hidden self-start rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-5)] xl:block">
        <StatePanelContent {...contentProps} />
      </aside>

      {mobileOpen ? (
        <KitModalFrame variant="sheet" sheetGrabber onClose={closeMobile} ariaLabel="Chronicle state">
          <div className="p-[var(--space-4)]">
            <StatePanelContent {...contentProps} showCloseControl={false} />
          </div>
        </KitModalFrame>
      ) : null}
    </>
  );
}
