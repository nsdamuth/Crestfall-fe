"use client";

import KitModalFrame from "@/components/kit/KitModalFrame";

function FormatExample({ syntax, meaning, note = "" }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)]">
      <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-2)]">
        <code className="text-[length:var(--text-body)] text-[var(--gold-ornament)]">
          {syntax}
        </code>
        <span className="text-[10px] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          {meaning}
        </span>
      </div>
      {note ? (
        <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export default function ChatFormatHelpView({ open = false, onClose = null }) {
  if (!open) return null;

  return (
    <KitModalFrame
      variant="modal"
      onClose={onClose}
      ariaLabelledBy="chat-format-help-title"
      panelClassName="w-full max-w-2xl"
    >
      <div className="p-[var(--space-5)] sm:p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Story Chat Formatting
        </p>
        <h2
          id="chat-format-help-title"
          className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
        >
          Write naturally. Crestfall reads the intent.
        </h2>
        <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          You can use either common RP convention. Explicit formatting wins when you mix styles in the same turn.
        </p>

        <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] sm:grid-cols-2">
          <section>
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
              Quote-style RP
            </p>
            <div className="mt-[var(--space-2)] grid gap-[var(--space-2)]">
              <FormatExample
                syntax={'"Don\'t touch that."'}
                meaning="Dialogue"
                note="When you use quoted speech, ordinary unquoted prose is treated as action."
              />
              <FormatExample
                syntax="I take one step back."
                meaning="Action"
              />
              <FormatExample
                syntax="*Why is that ticking?*"
                meaning="Private thought"
                note="Private thoughts are not ordinary character knowledge."
              />
            </div>
          </section>

          <section>
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
              Asterisk-action RP
            </p>
            <div className="mt-[var(--space-2)] grid gap-[var(--space-2)]">
              <FormatExample
                syntax="*I take one step back.*"
                meaning="Action"
                note="If you use asterisks for actions without quoted dialogue, ordinary text is treated as speech."
              />
              <FormatExample syntax="Don't touch that." meaning="Dialogue" />
              <FormatExample
                syntax="Thought mode"
                meaning="Private thought"
                note="Use the composer Thought mode when asterisks are already your action convention."
              />
            </div>
          </section>
        </div>

        <div className="mt-[var(--space-5)] grid gap-[var(--space-2)]">
          <FormatExample
            syntax="> Meet me behind the station."
            meaning="Written / digital message"
            note="Use for texts, notes, signs, terminals, and other written communication."
          />
          <FormatExample
            syntax="`Can you hear me?`"
            meaning="Telepathy"
            note="Intentionally transmitted mental communication; only authorized recipients should perceive it."
          />
        </div>

        <div className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--fill-whisper)] p-[var(--space-4)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Privacy
          </p>
          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            Private thoughts are withheld from ordinary characters. A character only receives them when the Story runtime grants an explicit thought-perception capability. Telepathy is a separate targeted communication channel.
          </p>
        </div>

        <div aria-hidden="true" className="mt-[var(--space-5)] h-px bg-[image:var(--line-fade)]" />
        <div className="mt-[var(--space-4)] flex justify-end">
          <button type="button" onClick={() => onClose?.()} className="goldring cf-btn cf-btn--primary">
            Got it
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}
