"use client";

import { useState } from "react";

import LoreBuilderView from "@/components/studio/create/lore/lore-builder/LoreBuilder.view";
import { loreBuilderFixture } from "@/components/studio/create/lore/lore-builder/LoreBuilder.fixtures";

function PreviewLink({ href, children, ...props }) {
  return <a {...props} href={href} onClick={(event) => event.preventDefault()}>{children}</a>;
}

function PreviewShareButton({ label = "Copy link" }) {
  return (
    <button type="button" className="rounded-lg border border-[#7b5525]/30 px-3 py-2 text-xs text-[#6a481f]">
      {label}
    </button>
  );
}

export default function LoreBuilderPreviewClient() {
  const [mode, setMode] = useState("EDIT");
  const [message, setMessage] = useState("Fixture-only builder. No Creation is connected.");

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">Fixture-Driven UI Preview</p>
          <h1 className="mt-2 font-display text-4xl">Lore Builder</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
        </header>

        <LoreBuilderView
          {...loreBuilderFixture}
          activeMode={mode}
          onSetActiveMode={setMode}
          onSave={() => setMessage("Save was simulated locally. No product data changed.")}
          LinkComponent={PreviewLink}
          editorViewProps={{
            ...loreBuilderFixture.editorViewProps,
            jsonEditorSlot: null,
          }}
          rendererViewProps={{
            ...loreBuilderFixture.rendererViewProps,
            ShareButtonComponent: PreviewShareButton,
          }}
        />
      </div>
    </main>
  );
}
