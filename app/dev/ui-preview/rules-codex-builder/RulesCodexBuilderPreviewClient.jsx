"use client";

import { useState } from "react";

import RulesCodexBuilderShell from "@/components/studio/create/rules-codex/RulesCodexBuilderShell";
import { RULES_CODEX_BUILDER_FIXTURES } from "@/components/studio/create/rules-codex/rules-codex-builder/RulesCodexBuilder.fixtures";

export default function RulesCodexBuilderPreviewClient() {
  const [createdTitle, setCreatedTitle] = useState("");

  return (
    <div className="space-y-5">
      {createdTitle ? (
        <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-3 text-sm text-emerald-100">
          Preview create completed: {createdTitle}
        </div>
      ) : null}

      <RulesCodexBuilderShell
        initialDraft={RULES_CODEX_BUILDER_FIXTURES.economy}
        createDraft={async (payload) => ({
          data: {
            creation: {
              id: "preview-rules-codex-id",
              title: payload.title,
            },
          },
        })}
        onCreated={(creation) => setCreatedTitle(creation.title)}
      />
    </div>
  );
}
