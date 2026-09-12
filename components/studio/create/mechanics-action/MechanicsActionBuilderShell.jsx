"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import { createMechanicsActionDraft } from "@/lib/client/studio/mechanics-actions/mechanicsActionClient";
import MechanicsActionJsonEditor from "./MechanicsActionJsonEditor";
import {
  MECHANICS_ACTION_CREATION_TYPE,
  buildMechanicsActionData,
  createMechanicsActionStarterDefinition,
} from "./mechanicsActionContract";

const VISIBILITY_OPTIONS = [
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
];
const CONTENT_RATING_OPTIONS = [
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
];

export default function MechanicsActionBuilderShell() {
  const router = useRouter();
  const [title, setTitle] = useState("Example Action");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [contentRating, setContentRating] = useState("SFW");
  const [action, setAction] = useState(() => createMechanicsActionStarterDefinition());
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const actionKey = useMemo(
    () => (typeof action?.id === "string" ? action.id.trim() : ""),
    [action]
  );

  async function saveDraft() {
    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    setSaveMessage("");
    try {
      const payload = await createMechanicsActionDraft({
        type: MECHANICS_ACTION_CREATION_TYPE,
        title: title.trim() || action?.title || actionKey || "Untitled Action",
        description: description.trim(),
        visibility,
        status: "DRAFT",
        content_rating: contentRating,
        data: buildMechanicsActionData({ ...action, title: action?.title || title.trim() }),
      });
      const creation = payload?.creation || payload?.data?.creation || null;
      if (!creation?.id) throw new Error("Action draft saved without a creation ID.");
      setSaveStatus("saved");
      setSaveMessage("Draft saved.");
      router.push(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Mechanics Action draft could not be saved.");
    }
  }

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.34fr_1fr]">
      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Mechanics Action</p>
        <h2 className="mt-2 font-display text-4xl">{title || "Untitled Action"}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
          A reusable actor-agnostic executable rule. Story and actor availability are attached separately.
        </p>
        <div className="mt-5 rounded-xl border border-white/10 bg-[var(--surface-1)] p-4 text-sm text-[var(--ink-dim)]">
          <p>Action key</p>
          <p className="mt-1 break-all text-[var(--ink)]">{actionKey || "Set action.id in JSON"}</p>
        </div>
        <button type="button" onClick={saveDraft} disabled={saveStatus === "saving"} className="cf-btn cf-btn--primary mt-6 w-full">
          <Save size={15} /> {saveStatus === "saving" ? "Saving..." : "Save draft"}
        </button>
        {saveMessage ? <p className={`mt-3 text-sm ${saveStatus === "error" ? "text-[var(--status-danger)]" : "text-[var(--status-success)]"}`}>{saveMessage}</p> : null}
      </aside>

      <div className="space-y-6">
        <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Identity</p>
          <div className="mt-5 grid gap-4">
            <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Name</span><input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm" /></label>
            <label className="block"><span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 min-h-28 w-full resize-y rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm" /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <CrestfallSelect label="Visibility" value={visibility} onChange={setVisibility} options={VISIBILITY_OPTIONS} />
              <CrestfallSelect label="Content Rating" value={contentRating} onChange={setContentRating} options={CONTENT_RATING_OPTIONS} />
            </div>
          </div>
        </section>
        <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Action Definition</p>
          <h3 className="mt-2 font-display text-3xl">Author the executable rule</h3>
          <div className="mt-5"><MechanicsActionJsonEditor value={action} onChange={setAction} /></div>
        </section>
      </div>
    </section>
  );
}
