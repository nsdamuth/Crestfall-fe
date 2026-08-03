"use client";

import { useState } from "react";

import LorePublicationReadinessView from "@/components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.view";
import {
  lorePublicationActiveValidationFixture,
  lorePublicationReadinessFixture,
  lorePublicationUnsavedFixture,
} from "@/components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.fixtures";

function PreviewLink({ href, children, ...props }) {
  return <a {...props} href={href} onClick={(event) => event.preventDefault()}>{children}</a>;
}

const states = {
  published: lorePublicationReadinessFixture,
  unsaved: lorePublicationUnsavedFixture,
  validating: lorePublicationActiveValidationFixture,
};

export default function LorePublicationReadinessPreviewClient() {
  const [state, setState] = useState("published");

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">Fixture-Driven UI Preview</p>
          <h1 className="mt-2 font-display text-4xl">Lore Publication Readiness</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.keys(states).map((key) => (
              <button key={key} type="button" onClick={() => setState(key)} className="rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.14em]">
                {key}
              </button>
            ))}
          </div>
        </header>

        <LorePublicationReadinessView
          {...states[state]}
          LinkComponent={PreviewLink}
        />
      </div>
    </main>
  );
}
