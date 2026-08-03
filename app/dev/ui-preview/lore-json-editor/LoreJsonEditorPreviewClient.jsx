"use client";

import { useMemo, useState } from "react";

import LoreJsonEditorModalView from "@/components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.view";
import {
  loreJsonEditorErrorFixture,
  loreJsonEditorFixture,
} from "@/components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.fixtures";

export default function LoreJsonEditorPreviewClient() {
  const [mode, setMode] = useState("valid");
  const [open, setOpen] = useState(true);
  const [jsonText, setJsonText] = useState(loreJsonEditorFixture.jsonText);
  const base = mode === "error" ? loreJsonEditorErrorFixture : loreJsonEditorFixture;
  const props = useMemo(
    () => ({
      ...base,
      jsonText,
      characterCount: jsonText.length,
      lineCount: jsonText.split("\n").length,
      hasDraftChanges: jsonText !== loreJsonEditorFixture.jsonText,
    }),
    [base, jsonText]
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-8 text-[var(--foreground)]">
      <div className="mx-auto mb-4 flex max-w-7xl gap-3">
        <button type="button" onClick={() => { setMode("valid"); setJsonText(loreJsonEditorFixture.jsonText); setOpen(true); }} className="rounded-xl border border-white/10 px-4 py-2 text-xs">Open Valid JSON</button>
        <button type="button" onClick={() => { setMode("error"); setJsonText(loreJsonEditorErrorFixture.jsonText); setOpen(true); }} className="rounded-xl border border-white/10 px-4 py-2 text-xs">Open Validation Error</button>
      </div>
      {open ? <LoreJsonEditorModalView
        {...props}
        onChangeJson={setJsonText}
        onClose={() => setOpen(false)}
        onCopy={() => {}}
        onDownloadAiGuide={() => {}}
        onFormat={() => {}}
        onReset={() => setJsonText(base.jsonText)}
        onValidateAndApply={() => {}}
      /> : null}
    </main>
  );
}
