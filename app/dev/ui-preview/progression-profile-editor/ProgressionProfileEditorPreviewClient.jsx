"use client";

import { useState } from "react";

import ProgressionProfileEditor from "@/components/studio/create/progression/ProgressionProfileEditor";
import { createDefaultProgressionProfile } from "@/components/studio/create/progression/progression-profile-editor/ProgressionProfileEditor.contract";

export default function ProgressionProfileEditorPreviewClient() {
  const [value, setValue] = useState(() => createDefaultProgressionProfile());

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Development Preview
      </p>
      <h1 className="mt-3 font-display text-5xl">Progression Profile Editor</h1>
      <div className="mt-8">
        <ProgressionProfileEditor value={value} onChange={setValue} />
      </div>
    </main>
  );
}
