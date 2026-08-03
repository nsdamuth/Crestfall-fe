"use client";

import { useState } from "react";
import StatsPoolsBuilderView from "@/components/studio/create/stats-pools/stats-pools-builder/StatsPoolsBuilder.view";
import { useStatsPoolsBuilderViewModel } from "@/components/studio/create/stats-pools/stats-pools-builder/useStatsPoolsBuilderViewModel";

export default function StatsPoolsBuilderPreviewClient() {
  const [created, setCreated] = useState(null);
  const viewProps = useStatsPoolsBuilderViewModel({
    createDraft: async (payload) => ({
      data: {
        creation: {
          id: "preview-stats-pools-profile",
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
      <StatsPoolsBuilderView {...viewProps} />
    </main>
  );
}
