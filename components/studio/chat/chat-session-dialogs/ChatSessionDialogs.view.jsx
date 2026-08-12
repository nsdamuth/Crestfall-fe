"use client";

import { useState } from "react";
import { Copy, Download, Flag, Loader2, Share2, Sparkles, Trash2 } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

const COUNTER_WARN_RATIO = 0.8;

function ErrorLine({ children }) {
  return (
    <p
      className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]"
      role="alert"
    >
      {children}
    </p>
  );
}

function DialogHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {eyebrow}
      </p>
      <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--ink)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({ label, value, onChange, options = [], disabled = false }) {
  return (
    <label className="flex flex-col gap-[var(--space-2)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={disabled}
        className="kit-focus min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition-colors hover:border-[var(--state-hover-line)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)]"
      >
        {options.map((option) => (
          <option key={option.id || option.value} value={option.id || option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReportDialog({
  speaker = "Message",
  reasonOptions = [],
  reasonCode = "",
  comment = "",
  pending = false,
  error = "",
  onReasonCodeChange,
  onCommentChange,
  onSubmit,
  onClose,
}) {
  const [commentFocused, setCommentFocused] = useState(false);
  const maxLength = 2000;
  const count = comment.length;
  const atLimit = count >= maxLength;
  const showCounter = commentFocused || count >= maxLength * COUNTER_WARN_RATIO;

  return (
    <KitModalFrame variant="modal" onClose={onClose} ariaLabel={`Report ${speaker}`} panelClassName="max-w-lg">
      <div className="p-[var(--space-5)]">
        <DialogHeading
          eyebrow="Message Report"
          title={`Report ${speaker}`}
          description="This sends a snapshot of this message for review. It does not alter the Story or its runtime state."
        />

        <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-4)]">
          <SelectField
            label="Reason"
            value={reasonCode}
            onChange={onReasonCodeChange}
            options={reasonOptions}
            disabled={pending}
          />

          <label className="flex flex-col gap-[var(--space-2)]">
            <div className="flex items-center justify-between gap-[var(--space-2)]">
              <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                Additional details <span className="normal-case tracking-normal">(optional)</span>
              </span>
              {showCounter ? (
                <span
                  className={`flex-none tabular-nums text-[length:var(--text-label)] ${
                    atLimit ? "text-[var(--status-danger)]" : "text-[var(--ink-faint)]"
                  }`}
                >
                  {count}/{maxLength}
                  {atLimit ? " limit" : ""}
                </span>
              ) : null}
            </div>
            <textarea
              value={comment}
              onChange={(event) => onCommentChange?.(event.target.value.slice(0, maxLength))}
              onFocus={() => setCommentFocused(true)}
              onBlur={() => setCommentFocused(false)}
              disabled={pending}
              rows={4}
              maxLength={maxLength}
              placeholder="Describe what should be reviewed."
              className={`kit-focus min-h-[calc(var(--control-md)*2)] resize-none rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] ${
                atLimit
                  ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)]"
                  : "border-[var(--line-whisper)] hover:border-[var(--state-hover-line)]"
              }`}
            />
          </label>
        </div>

        {error ? <div className="mt-[var(--space-4)]"><ErrorLine>{error}</ErrorLine></div> : null}

        <div className="mt-[var(--space-5)] flex flex-wrap justify-end gap-[var(--space-2)]">
          <button type="button" onClick={() => onClose?.()} className="cf-btn cf-btn--secondary" disabled={pending}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit?.()}
            className="cf-btn cf-btn--primary"
            disabled={pending}
          >
            {pending ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Flag size={14} aria-hidden="true" />}
            {pending ? "Submitting" : "Submit report"}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

function ExportDialog({
  presets = [],
  preset = "",
  formats = [],
  format = "",
  customRange = false,
  messageOptions = [],
  startMessageId = "",
  endMessageId = "",
  pending = false,
  error = "",
  onPresetChange,
  onFormatChange,
  onStartMessageChange,
  onEndMessageChange,
  onSubmit,
  onClose,
}) {
  return (
    <KitModalFrame variant="modal" onClose={onClose} ariaLabel="Export chat" panelClassName="max-w-lg">
      <div className="p-[var(--space-5)]">
        <DialogHeading
          eyebrow="Private Download"
          title="Export Chat"
          description="Download a visibility-filtered copy of the selected transcript. This does not create a public link."
        />

        <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-4)]">
          <SelectField label="Range" value={preset} onChange={onPresetChange} options={presets} disabled={pending} />

          {customRange ? (
            <div className="grid gap-[var(--space-4)] min-[700px]:grid-cols-2">
              <SelectField
                label="Start message"
                value={startMessageId}
                onChange={onStartMessageChange}
                options={messageOptions}
                disabled={pending}
              />
              <SelectField
                label="End message"
                value={endMessageId}
                onChange={onEndMessageChange}
                options={messageOptions}
                disabled={pending}
              />
            </div>
          ) : null}

          <SelectField label="File format" value={format} onChange={onFormatChange} options={formats} disabled={pending} />
        </div>

        {error ? <div className="mt-[var(--space-4)]"><ErrorLine>{error}</ErrorLine></div> : null}

        <div className="mt-[var(--space-5)] flex flex-wrap justify-end gap-[var(--space-2)]">
          <button type="button" onClick={() => onClose?.()} className="cf-btn cf-btn--secondary" disabled={pending}>
            Cancel
          </button>
          <button type="button" onClick={() => onSubmit?.()} className="cf-btn cf-btn--primary" disabled={pending}>
            {pending ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Download size={14} aria-hidden="true" />}
            {pending ? "Preparing" : "Download"}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

function ShareResultPanel({ result, copied, onCopy }) {
  const status = result?.status;

  const statusLabel =
    status === "ACTIVE"
      ? "Share link"
      : status === "REJECTED"
        ? "Review rejected"
        : status === "FAILED"
          ? "Review failed"
          : "Share revoked";

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {statusLabel}
      </p>

      {status === "ACTIVE" ? (
        <>
          <p className="mt-[var(--space-2)] break-all text-[length:var(--text-ui)] text-[var(--ink)]">{result.shareUrl}</p>
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] text-[var(--ink-dim)]">
            {result.shareMode === "TEMPORARY" ? `Expires: ${result.expiresAt}` : "Persistent until revoked"}
          </p>
          <button
            type="button"
            onClick={() => onCopy?.()}
            className="mt-[var(--space-3)] inline-flex min-h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)]"
          >
            <Copy size={14} aria-hidden="true" />
            {copied ? "Copied" : "Copy link"}
          </button>
        </>
      ) : (
        <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          {status === "REJECTED"
            ? "Llama Guard did not approve this snapshot for persistent sharing."
            : status === "FAILED"
              ? "The Llama Guard review could not be completed."
              : "This link is no longer available."}
        </p>
      )}
    </div>
  );
}

function RevokeConfirmSheet({ pending = false, error = "", onConfirm, onCancel }) {
  return (
    <KitModalFrame variant="sheet" onClose={onCancel} ariaLabel="Confirm revoke share link">
      <div className="p-[var(--space-5)]">
        <p className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
          Revoke this share link?
        </p>
        <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          Anyone holding this link loses access immediately. This cannot be undone.
        </p>

        {error ? <div className="mt-[var(--space-4)]"><ErrorLine>{error}</ErrorLine></div> : null}

        <div className="mt-[var(--space-5)] flex justify-end gap-[var(--space-2)]">
          <button type="button" onClick={() => onCancel?.()} className="cf-btn cf-btn--secondary" disabled={pending}>
            Cancel
          </button>
          <button type="button" onClick={() => onConfirm?.()} className="cf-btn cf-btn--danger-filled" disabled={pending}>
            {pending ? "Revoking" : "Revoke Link"}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

function ShareDialog({
  mode = "TEMPORARY",
  presets = [],
  preset = "",
  customRange = false,
  messageOptions = [],
  startMessageId = "",
  endMessageId = "",
  result = null,
  copied = false,
  pending = false,
  error = "",
  revokeConfirmOpen = false,
  onModeChange,
  onPresetChange,
  onStartMessageChange,
  onEndMessageChange,
  onSubmit,
  onCopy,
  onRequestRevoke,
  onConfirmRevoke,
  onCancelRevoke,
  onClose,
}) {
  const persistent = mode === "PERSISTENT_REVIEWED";
  const activeResult = result?.status === "ACTIVE";

  return (
    <>
      <KitModalFrame variant="modal" onClose={onClose} ariaLabel="Share snapshot" panelClassName="max-w-lg">
        <div className="p-[var(--space-5)]">
          <DialogHeading
            eyebrow={persistent ? "Persistent Reviewed Link" : "Temporary Unlisted Link"}
            title="Share Snapshot"
            description={
              persistent
                ? "The frozen snapshot is scanned by Llama Guard before a durable unlisted link is activated. It is not listed publicly or submitted for search indexing."
                : "Anyone with this link can view the frozen snapshot for one hour. It is not listed publicly or submitted for search indexing."
            }
          />

          {!result ? (
            <div className="mt-[var(--space-5)] flex flex-col gap-[var(--space-4)]">
              <SelectField
                label="Share mode"
                value={mode}
                onChange={onModeChange}
                options={[
                  { id: "TEMPORARY", label: "Temporary one-hour link" },
                  { id: "PERSISTENT_REVIEWED", label: "Persistent reviewed link" },
                ]}
                disabled={pending}
              />

              <SelectField label="Range" value={preset} onChange={onPresetChange} options={presets} disabled={pending} />

              {customRange ? (
                <div className="grid gap-[var(--space-4)] min-[700px]:grid-cols-2">
                  <SelectField
                    label="Start message"
                    value={startMessageId}
                    onChange={onStartMessageChange}
                    options={messageOptions}
                    disabled={pending}
                  />
                  <SelectField
                    label="End message"
                    value={endMessageId}
                    onChange={onEndMessageChange}
                    options={messageOptions}
                    disabled={pending}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-[var(--space-5)]">
              <ShareResultPanel result={result} copied={copied} onCopy={onCopy} />
            </div>
          )}

          {error ? <div className="mt-[var(--space-4)]"><ErrorLine>{error}</ErrorLine></div> : null}

          <div className="mt-[var(--space-5)] flex flex-wrap justify-end gap-[var(--space-2)]">
            <button type="button" onClick={() => onClose?.()} className="cf-btn cf-btn--secondary" disabled={pending}>
              Done
            </button>

            {!result ? (
              <button type="button" onClick={() => onSubmit?.()} className="cf-btn cf-btn--primary" disabled={pending}>
                {pending ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Share2 size={14} aria-hidden="true" />
                )}
                {pending ? (persistent ? "Reviewing" : "Creating") : "Create link"}
              </button>
            ) : activeResult ? (
              <button
                type="button"
                onClick={() => onRequestRevoke?.()}
                disabled={pending}
                className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-transparent bg-transparent px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--status-danger)] transition hover:bg-[var(--status-danger-bed)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
              >
                <Trash2 size={14} aria-hidden="true" />
                Revoke
              </button>
            ) : null}
          </div>
        </div>
      </KitModalFrame>

      {revokeConfirmOpen ? (
        <RevokeConfirmSheet pending={pending} error={error} onConfirm={onConfirmRevoke} onCancel={onCancelRevoke} />
      ) : null}
    </>
  );
}

function DeleteConfirmDialog({ message = "", pending = false, error = "", onConfirm, onCancel }) {
  const lines = String(message || "").split("\n");

  return (
    <KitModalFrame variant="sheet" onClose={onCancel} ariaLabel="Confirm delete Story">
      <div className="p-[var(--space-5)]">
        {lines.map((line, index) =>
          line ? (
            <p
              key={`delete-line-${index}`}
              className={
                index === 0
                  ? "font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
                  : "mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]"
              }
            >
              {line}
            </p>
          ) : (
            <div key={`delete-gap-${index}`} className="h-[var(--space-2)]" />
          )
        )}

        {error ? <div className="mt-[var(--space-4)]"><ErrorLine>{error}</ErrorLine></div> : null}

        <div className="mt-[var(--space-5)] flex justify-end gap-[var(--space-2)]">
          <button type="button" onClick={() => onCancel?.()} className="cf-btn cf-btn--secondary" disabled={pending}>
            Cancel
          </button>
          <button type="button" onClick={() => onConfirm?.()} className="cf-btn cf-btn--danger-filled" disabled={pending}>
            {pending ? "Deleting" : "Delete Story"}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

function SummaryPendingCard({ visible = false, eyebrow = "Scene Recap", message = "" }) {
  if (!visible) return null;

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-[var(--space-3)]">
        <Loader2 size={18} className="shrink-0 animate-spin text-[var(--gold-ornament)]" aria-hidden="true" />
        <div>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatSessionDialogsView({ activeDialog = null, summaryPending = null }) {
  const safeSummaryPending = summaryPending || {};

  return (
    <>
      {activeDialog?.open && activeDialog.kind === "REPORT" ? <ReportDialog {...activeDialog} /> : null}
      {activeDialog?.open && activeDialog.kind === "EXPORT" ? <ExportDialog {...activeDialog} /> : null}
      {activeDialog?.open && activeDialog.kind === "SHARE" ? <ShareDialog {...activeDialog} /> : null}
      {activeDialog?.open && activeDialog.kind === "DELETE_CONFIRM" ? <DeleteConfirmDialog {...activeDialog} /> : null}

      <SummaryPendingCard
        visible={safeSummaryPending.visible}
        eyebrow={safeSummaryPending.eyebrow}
        message={safeSummaryPending.message}
      />
    </>
  );
}

export { ReportDialog, ExportDialog, ShareDialog, DeleteConfirmDialog, SummaryPendingCard };
