import {
  ArrowDown,
  ArrowUp,
  GitBranch,
  Plus,
  Trash2,
} from "lucide-react";

export default function StorylineNodeListEditorView({
  headerEyebrow = "Narrative Sequence",
  headerDescription = "",
  nodeCountLabel = "0 Adventure Nodes",
  addReferenceLabel = "Add story or scenario",
  showStructureControls = true,
  showTransitionControls = true,
  loadError = "",
  emptyStateMessage = "",
  nodes = [],
  validationErrors = [],
  visibleWarnings = [],
  errorsTitle = "Adventure authoring errors",
  warningsTitle = "Draft readiness notes",
  onOpenReferencePicker = null,
  onMoveNodeUp = null,
  onMoveNodeDown = null,
  onRemoveNode = null,
  onChangeCompletionGuidance = null,
  onChangeTransitionPolicy = null,
  onChangeTriggerMode = null,
  onAddTrigger = null,
  onChangeTriggerType = null,
  onChangeTriggerLabel = null,
  onChangeTriggerDescription = null,
  onRemoveTrigger = null,
  onChangeOpenWorldGuidance = null,
  onChangePressureGuidance = null,
  referencePickerSlot = null,
} = {}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {headerEyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl">{nodeCountLabel}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {headerDescription}
          </p>
        </div>

        {showStructureControls ? (
          <button
            type="button"
            onClick={() => onOpenReferencePicker?.()}
            className="cf-btn cf-btn--primary"
          >
            <Plus size={15} />
            {addReferenceLabel}
          </button>
        ) : null}
      </div>

      {showStructureControls && loadError ? (
        <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-100">
          {loadError}
        </div>
      ) : null}

      {!nodes.length ? (
        <div className="rounded-[var(--radius-md)] border border-dashed border-white/15 p-8 text-center text-sm leading-6 text-[var(--ink-dim)]">
          {emptyStateMessage}
        </div>
      ) : null}

      {nodes.map((node) => (
        <article
          key={node.id}
          className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 font-display text-xl text-[var(--gold-ornament)]">
                {node.positionLabel}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                  {node.referenceTypeLabel}
                  {node.finalNodeLabel}
                </p>
                <h4 className="mt-1 font-display text-3xl">{node.title}</h4>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
                  {node.subtitle}
                </p>
              </div>
            </div>

            {showStructureControls ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={node.isFirst}
                  onClick={() => onMoveNodeUp?.(node.index)}
                  className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] disabled:opacity-35"
                  aria-label="Move node up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={node.isLast}
                  onClick={() => onMoveNodeDown?.(node.index)}
                  className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] disabled:opacity-35"
                  aria-label="Move node down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveNode?.(node.index)}
                  className="cf-btn cf-btn--danger cf-btn--sm"
                  aria-label="Remove node"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            ) : null}
          </div>

          {showTransitionControls ? (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                    Completion Guidance
                  </span>
                  <textarea
                    rows={3}
                    value={node.completionGuidance}
                    onChange={(event) =>
                      onChangeCompletionGuidance?.(
                        node.index,
                        event.target.value
                      )
                    }
                    placeholder="Optional evidence or authored condition that indicates this node has concluded."
                    className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                    Transition After Completion
                  </span>
                  <select
                    value={node.transitionPolicy}
                    disabled={node.isLast}
                    onChange={(event) =>
                      onChangeTransitionPolicy?.(
                        node.index,
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {node.transitionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                    {node.transitionDescription}
                  </p>
                </label>
              </div>

              {node.needsTriggers ? (
                <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/15 bg-black/25 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <GitBranch
                        size={18}
                        className="mt-1 text-[var(--gold-ornament)]"
                      />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                          Next-Node Triggers
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--ink-dim)]">
                          Triggers make the following node eligible. They do not
                          invent player consent or force the player onto the
                          path.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={node.triggerMode}
                        onChange={(event) =>
                          onChangeTriggerMode?.(
                            node.index,
                            event.target.value
                          )
                        }
                        className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs outline-none"
                      >
                        {node.triggerModeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => onAddTrigger?.(node.index)}
                        className="cf-btn cf-btn--secondary cf-btn--sm"
                      >
                        Add trigger
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {node.triggers.map((trigger) => (
                      <div
                        key={trigger.id}
                        className="grid gap-3 rounded-xl border border-white/10 bg-black/25 p-3 lg:grid-cols-[0.75fr_1fr_1.4fr_auto]"
                      >
                        <select
                          value={trigger.type}
                          onChange={(event) =>
                            onChangeTriggerType?.(
                              node.index,
                              trigger.index,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-xs outline-none"
                        >
                          {node.triggerTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <input
                          value={trigger.label}
                          onChange={(event) =>
                            onChangeTriggerLabel?.(
                              node.index,
                              trigger.index,
                              event.target.value
                            )
                          }
                          placeholder="Trigger label"
                          className="rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-sm outline-none"
                        />
                        <input
                          value={trigger.description}
                          onChange={(event) =>
                            onChangeTriggerDescription?.(
                              node.index,
                              trigger.index,
                              event.target.value
                            )
                          }
                          placeholder="What must occur or be confirmed?"
                          className="rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onRemoveTrigger?.(node.index, trigger.index)
                          }
                          className="cf-btn cf-btn--danger cf-btn--sm"
                          aria-label="Remove trigger"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    ))}

                    {!node.triggers.length ? (
                      <p className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-[var(--ink-dim)]">
                        Add at least one trigger before treating this Adventure as
                        runtime-ready.
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {node.showOpenWorldGuidance ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                      Open-World Guidance
                    </span>
                    <textarea
                      rows={3}
                      value={node.openWorldGuidance}
                      onChange={(event) =>
                        onChangeOpenWorldGuidance?.(
                          node.index,
                          event.target.value
                        )
                      }
                      placeholder="What remains naturally available after this node?"
                      className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                      Consequence / Pressure Guidance
                    </span>
                    <textarea
                      rows={3}
                      value={node.pressureGuidance}
                      onChange={(event) =>
                        onChangePressureGuidance?.(
                          node.index,
                          event.target.value
                        )
                      }
                      placeholder="Optional world-facing pressure that may surface without controlling the player."
                      className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 outline-none"
                    />
                  </label>
                </div>
              ) : null}
            </>
          ) : null}
        </article>
      ))}

      {validationErrors.length ? (
        <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
          <p className="font-medium">{errorsTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {visibleWarnings.length ? (
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          <p className="font-medium">{warningsTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {visibleWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {referencePickerSlot}
    </div>
  );
}
