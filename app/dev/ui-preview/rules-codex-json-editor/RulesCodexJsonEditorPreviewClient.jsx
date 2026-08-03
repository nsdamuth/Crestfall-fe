"use client";

import { useState } from "react";

import RulesCodexJsonEditorModal from "@/components/studio/create/rules-codex/rules-codex-json-editor/RulesCodexJsonEditorModal";
import { rulesCodexJsonEditorFixture } from "@/components/studio/create/rules-codex/rules-codex-json-editor/rulesCodexJsonEditor.fixtures";

export default function RulesCodexJsonEditorPreviewClient() {
  const [codex, setCodex] = useState(
    () => rulesCodexJsonEditorFixture
  );
  const [open, setOpen] = useState(true);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Development Preview
      </p>
      <h1 className="mt-3 font-display text-5xl">
        Rules Codex JSON Editor
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
        This preview uses local fixture state only. It does not authenticate,
        call an API, select runtime sections, call a provider, mutate state, or persist a
        creation.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
      >
        Open JSON Editor
      </button>

      {open ? (
        <RulesCodexJsonEditorModal
          rulesCodex={codex}
          onApply={setCodex}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </main>
  );
}
