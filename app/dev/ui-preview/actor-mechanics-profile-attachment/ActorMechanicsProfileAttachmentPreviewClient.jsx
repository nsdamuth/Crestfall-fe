"use client";

import { useState } from "react";

import ActorMechanicsProfileAttachmentSectionView from "@/components/studio/characters/actor-mechanics-profile-attachment/ActorMechanicsProfileAttachmentSection.view";
import { actorMechanicsProfileAttachmentFixtures } from "@/components/studio/characters/actor-mechanics-profile-attachment/ActorMechanicsProfileAttachmentSection.fixtures";

const FIXTURE_KEYS = Object.keys(actorMechanicsProfileAttachmentFixtures);

export default function ActorMechanicsProfileAttachmentPreviewClient() {
  const [fixtureKey, setFixtureKey] = useState(FIXTURE_KEYS[0]);
  const fixture = actorMechanicsProfileAttachmentFixtures[fixtureKey];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              Development Preview
            </p>
            <h1 className="mt-2 font-display text-4xl">
              Actor Mechanics Profile Attachment
            </h1>
          </div>

          <label className="grid gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            Fixture
            <select
              value={fixtureKey}
              onChange={(event) => setFixtureKey(event.target.value)}
              className="rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm normal-case tracking-normal text-[var(--foreground)]"
            >
              {FIXTURE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
          <ActorMechanicsProfileAttachmentSectionView {...fixture} />
        </div>
      </div>
    </main>
  );
}
