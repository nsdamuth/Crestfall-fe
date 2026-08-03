"use client";

import { useState } from "react";

import LoreEditorView from "@/components/studio/create/lore/lore-editor/LoreEditor.view";
import {
  loreEditorFixture,
  loreEditorValidationFixture,
} from "@/components/studio/create/lore/lore-editor/LoreEditor.fixtures";

export default function LoreEditorPreviewClient() {
  const [state, setState] = useState("populated");
  const fixture = state === "warning" ? loreEditorValidationFixture : loreEditorFixture;

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">Fixture-Driven UI Preview</p>
          <h1 className="mt-2 font-display text-4xl">Lore Editor</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--muted)]">
            The portable editor renders local fixture data only. Reference loading, image-library requests, JSON application, and Creation saving are disconnected.
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => setState("populated")} className="rounded-xl border border-white/10 px-4 py-2 text-xs">Populated</button>
            <button type="button" onClick={() => setState("warning")} className="rounded-xl border border-white/10 px-4 py-2 text-xs">Warning</button>
          </div>
        </header>

        <LoreEditorView
          {...fixture}
          jsonEditorSlot={
            <div className="rounded-xl border border-dashed border-[var(--muted-gold)]/30 bg-black/30 p-4 text-sm text-[var(--muted)]">
              Injected JSON editor slot fixture.
            </div>
          }
        />
      </div>
    </main>
  );
}
