"use client";

// Binding Shell for the editor's empty index state. Composes the
// SW1 creation picker directly; no section registry, no
// creation-edit-shell lineage involved (there is no creation loaded
// yet).
import { useState } from "react";
import { useRouter } from "next/navigation";

import CreationPicker from "@/components/studio/creation-picker/CreationPicker";

export default function EditorIndexClient() {
  const router = useRouter();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <section className="mx-auto flex w-full max-w-[var(--container)] flex-col items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-16)] text-center sm:px-[var(--space-6)]">
      <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
        Editor
      </p>
      <h1 className="font-display text-[length:var(--text-title-m)] leading-[var(--lh-title-m)] text-[var(--ink)] sm:text-[length:var(--text-title)] sm:leading-[var(--lh-title)]">
        Select a creation to edit
      </h1>
      <p className="max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Choose any of your owned creations from the picker to open the advanced editor.
      </p>
      <button
        type="button"
        onClick={() => setIsPickerOpen(true)}
        className="cf-btn cf-btn--primary"
      >
        Open the picker
      </button>

      {isPickerOpen ? (
        <CreationPicker
          title="Select a creation to edit"
          onSelect={(creation) =>
            creation?.id && router.push(`/studio/v2/editor/${encodeURIComponent(creation.id)}`)
          }
          onClose={() => setIsPickerOpen(false)}
        />
      ) : null}
    </section>
  );
}
