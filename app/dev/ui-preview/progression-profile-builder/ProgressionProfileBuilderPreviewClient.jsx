"use client";

import { useState } from "react";

import ProgressionProfileBuilderView from "@/components/studio/create/progression/progression-profile-builder/ProgressionProfileBuilder.view";
import { useProgressionProfileBuilderViewModel } from "@/components/studio/create/progression/progression-profile-builder/useProgressionProfileBuilderViewModel";

export default function ProgressionProfileBuilderPreviewClient() {
  const [created, setCreated] = useState(null);
  const viewProps = useProgressionProfileBuilderViewModel({
    createDraft: async (payload) => ({
      data: {
        creation: {
          id: "preview-progression-profile",
          ...payload,
        },
      },
    }),
    onCreated: setCreated,
  });

  return (
    <main className="mx-auto max-w-[1500px] px-6 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Development Preview
      </p>
      {created ? (
        <p className="mt-3 text-sm text-emerald-200">
          Preview save created {created.title}.
        </p>
      ) : null}
      <ProgressionProfileBuilderView {...viewProps} />
    </main>
  );
}
