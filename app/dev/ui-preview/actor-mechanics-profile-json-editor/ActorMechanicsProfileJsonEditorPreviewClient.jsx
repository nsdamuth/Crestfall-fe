"use client";

import { useState } from "react";

import ActorMechanicsProfileJsonEditorModal from "@/components/studio/create/actor-mechanics-profile/actor-mechanics-profile-json-editor/ActorMechanicsProfileJsonEditorModal";
import { actorMechanicsProfileJsonEditorFixture } from "@/components/studio/create/actor-mechanics-profile/actor-mechanics-profile-json-editor/actorMechanicsProfileJsonEditor.fixtures";

export default function ActorMechanicsProfileJsonEditorPreviewClient() {
  const [profile, setProfile] = useState(
    () => actorMechanicsProfileJsonEditorFixture
  );
  const [open, setOpen] = useState(true);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Development Preview
      </p>
      <h1 className="mt-3 font-display text-5xl">
        Actor Mechanics Profile JSON Editor
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
        This preview uses local fixture state only. It does not authenticate,
        call an API, create references, mutate actor state, or persist a
        creation.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
      >
        Open JSON Editor
      </button>

      {open ? (
        <ActorMechanicsProfileJsonEditorModal
          actorMechanicsProfile={profile}
          onApply={setProfile}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </main>
  );
}
