"use client";

import { useState } from "react";

import RoomTemplateBuilderView from "@/components/studio/create/room-template/room-template-builder/RoomTemplateBuilder.view";
import {
  roomTemplateBuilderErrorFixture,
  roomTemplateBuilderMultiplayerFixture,
  roomTemplateBuilderRecommendationsFixture,
  roomTemplateBuilderReferenceFixture,
  roomTemplateBuilderSavingFixture,
} from "@/components/studio/create/room-template/room-template-builder/RoomTemplateBuilder.fixtures";

const STATES = [
  ["Reference", roomTemplateBuilderReferenceFixture],
  ["Recommendations", roomTemplateBuilderRecommendationsFixture],
  ["Multiplayer", roomTemplateBuilderMultiplayerFixture],
  ["Saving", roomTemplateBuilderSavingFixture],
  ["Error", roomTemplateBuilderErrorFixture],
];

function RuntimeFixture() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Rules Codices
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Fixture slot for application-owned Story Rules Codex attachments.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Story Registries
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Fixture slot for application-owned Registry attachments.
        </p>
      </div>
    </div>
  );
}

export default function RoomTemplateBuilderPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const fixture = STATES[selectedState][1];

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap gap-2">
          {STATES.map(([label], index) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedState(index)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                index === selectedState
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                  : "border-white/10 text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <RoomTemplateBuilderView
          {...fixture}
          runtimeAttachmentsContent={<RuntimeFixture />}
        />
      </div>
    </main>
  );
}
