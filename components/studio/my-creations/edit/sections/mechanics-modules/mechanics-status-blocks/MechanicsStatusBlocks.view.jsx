"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import {
  MECHANICS_STATUS_BLOCK_PLACEMENTS,
  MECHANICS_STATUS_BLOCK_VISIBILITIES,
} from "./MechanicsStatusBlocks.contract.js";
import {
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function SmallActionButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cf-btn cf-btn--secondary cf-btn--sm"
    >
      {children}
    </button>
  );
}

function StatusBlockCard({
  block,
  blockIndex,
  foldSignal,
  patchBlock,
  removeBlock,
  addLine,
  patchLine,
  removeLine,
}) {
  const [expanded, setExpanded] = useState(blockIndex === 0);
  const [lineDraft, setLineDraft] = useState("");

  useEffect(() => {
    if (!foldSignal?.revision) return;
    setExpanded(foldSignal.expanded === true);
  }, [foldSignal?.revision, foldSignal?.expanded]);

  function submitLine() {
    if (!lineDraft.trim()) return;
    addLine(blockIndex, lineDraft);
    setLineDraft("");
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <p className={EYEBROW_CLASS}>
            Status Block
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate text-xl text-[var(--ink)]">
                {block.label || block.id || `Status Block ${blockIndex + 1}`}
              </h4>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                {block.summary}
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`mt-1 shrink-0 text-[var(--gold-ornament)] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        <button
          type="button"
          onClick={() => removeBlock(blockIndex)}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove status block"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>

      {expanded ? (
        <div className="border-t border-white/10 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Block ID"
              value={block.id}
              onChange={(value) => patchBlock(blockIndex, { id: value })}
              placeholder="relationship_footer"
            />
            <TextField
              label="Label"
              value={block.label}
              onChange={(value) =>
                patchBlock(blockIndex, {
                  label: value,
                  ...(block.id ? {} : { id: value }),
                })
              }
              placeholder="Relationship Footer"
            />
            <TextField
              label="Slot"
              value={block.slot}
              onChange={(value) => patchBlock(blockIndex, { slot: value })}
              placeholder="main_footer"
            />

            <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
              <span>Placement</span>
              <select
                value={block.placement}
                onChange={(event) =>
                  patchBlock(blockIndex, { placement: event.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
              >
                {MECHANICS_STATUS_BLOCK_PLACEMENTS.map((placement) => (
                  <option key={placement} value={placement}>
                    {placement}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
              <span>Visibility</span>
              <select
                value={block.visibility}
                onChange={(event) =>
                  patchBlock(blockIndex, { visibility: event.target.value })
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
              >
                {MECHANICS_STATUS_BLOCK_VISIBILITIES.map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {visibility}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
              <input
                type="checkbox"
                checked={block.required}
                onChange={(event) =>
                  patchBlock(blockIndex, { required: event.target.checked })
                }
                className="h-4 w-4 accent-[var(--gold-ornament)]"
              />
              Required
            </label>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={EYEBROW_CLASS}>
                Rendered Lines
              </p>
              <SmallActionButton onClick={submitLine} disabled={!lineDraft.trim()}>
                <Plus size={14} />
                Add line
              </SmallActionButton>
            </div>

            <input
              value={lineDraft}
              onChange={(event) => setLineDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitLine();
                }
              }}
              placeholder="[❤️ Affection: {{trackers.affection.value}}/100]"
              className="mt-4 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
            />

            {block.lines.length ? (
              <div className="mt-4 grid gap-3">
                {block.lines.map((line, lineIndex) => (
                  <div
                    key={`${lineIndex}-${line}`}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/35 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <TextAreaField
                        label={`Line ${lineIndex + 1}`}
                        value={line}
                        onChange={(value) =>
                          patchLine(blockIndex, lineIndex, value)
                        }
                        maxLength={SHORT_LONGFORM_MAX_LENGTH}
                        mono
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(blockIndex, lineIndex)}
                      className="cf-btn cf-btn--danger cf-btn--sm"
                      title="Remove line"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
                No rendered lines yet. Add at least one line for this status block.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function MechanicsStatusBlocksView({
  statusBlocks = [],
  foldSignal,
  addBlock,
  patchBlock,
  removeBlock,
  addLine,
  patchLine,
  removeLine,
}) {
  return (
    <section className="rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={EYEBROW_CLASS}>
            Visual Builder
          </p>
          <h3 className="mt-2 font-display text-3xl">Status Blocks</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            Define deterministic footer/status lines. These save into
            instanceData.statusBlocks and are appended by services-api, not the
            LLM.
          </p>
        </div>
        <SmallActionButton onClick={addBlock}>
          <Plus size={14} />
          Add block
        </SmallActionButton>
      </div>

      {statusBlocks.length ? (
        <div className="mt-6 grid gap-4">
          {statusBlocks.map((block, blockIndex) => (
            <StatusBlockCard
              key={block.id || blockIndex}
              block={block}
              blockIndex={blockIndex}
              foldSignal={foldSignal}
              patchBlock={patchBlock}
              removeBlock={removeBlock}
              addLine={addLine}
              patchLine={patchLine}
              removeLine={removeLine}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-[var(--ink-dim)]">
          No status blocks defined yet. Add a footer such as relationship_footer.
        </div>
      )}
    </section>
  );
}
