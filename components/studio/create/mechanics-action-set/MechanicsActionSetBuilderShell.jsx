"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import CrestfallSelect from "@/components/ui/CrestfallSelect";
import { createMechanicsActionSetDraft } from "@/lib/client/studio/mechanics-action-sets/mechanicsActionSetClient";
import MechanicsActionSetEditor from "./MechanicsActionSetEditor";
import {
  MECHANICS_ACTION_SET_CREATION_TYPE,
  buildMechanicsActionSetData,
  createMechanicsActionSetStarterDefinition,
} from "./mechanicsActionSetContract";

const VISIBILITY_OPTIONS = [{value:"PRIVATE",label:"Private"},{value:"UNLISTED",label:"Unlisted"}];
const CONTENT_RATING_OPTIONS = [{value:"SFW",label:"SFW"},{value:"MATURE",label:"Mature"},{value:"EXPLICIT",label:"Explicit"}];

export default function MechanicsActionSetBuilderShell() {
  const router = useRouter();
  const [title, setTitle] = useState("Core Actions");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [contentRating, setContentRating] = useState("SFW");
  const [definition, setDefinition] = useState(() => createMechanicsActionSetStarterDefinition());
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  async function saveDraft() {
    if (saveStatus === "saving") return;
    setSaveStatus("saving"); setSaveMessage("");
    try {
      const nextDefinition = { ...definition, title: definition.title || title.trim(), description: definition.description || description.trim() };
      const payload = await createMechanicsActionSetDraft({ type: MECHANICS_ACTION_SET_CREATION_TYPE, title: title.trim() || nextDefinition.title || nextDefinition.id || "Untitled Action Set", description: description.trim(), visibility, status: "DRAFT", content_rating: contentRating, data: buildMechanicsActionSetData(nextDefinition) });
      const creation = payload?.creation || payload?.data?.creation || null;
      if (!creation?.id) throw new Error("Action Set draft saved without a creation ID.");
      setSaveStatus("saved"); setSaveMessage("Draft saved."); router.push(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) { setSaveStatus("error"); setSaveMessage(error?.message || "Mechanics Action Set draft could not be saved."); }
  }

  return <section className="mt-8 grid gap-6 xl:grid-cols-[0.34fr_1fr]">
    <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-5 xl:sticky xl:top-24"><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Mechanics Action Set</p><h2 className="mt-2 font-display text-4xl">{title || "Untitled Action Set"}</h2><p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">Group reusable Mechanics Actions once, then attach the Set to Stories or actor mechanics packages.</p><button type="button" onClick={saveDraft} disabled={saveStatus === "saving"} className="cf-btn cf-btn--primary mt-6 w-full"><Save size={15} />{saveStatus === "saving" ? "Saving..." : "Save draft"}</button>{saveMessage ? <p className={`mt-3 text-sm ${saveStatus === "error" ? "text-[var(--status-danger)]" : "text-[var(--status-success)]"}`}>{saveMessage}</p> : null}</aside>
    <div className="space-y-6"><section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-6"><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Identity</p><div className="mt-5 grid gap-4"><label><span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Name</span><input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm" /></label><label><span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-sm" /></label><div className="grid gap-4 md:grid-cols-2"><CrestfallSelect label="Visibility" value={visibility} onChange={setVisibility} options={VISIBILITY_OPTIONS}/><CrestfallSelect label="Content Rating" value={contentRating} onChange={setContentRating} options={CONTENT_RATING_OPTIONS}/></div></div></section><section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-6"><p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">Action Set</p><h3 className="mt-2 font-display text-3xl">Organize reusable Actions</h3><div className="mt-5"><MechanicsActionSetEditor value={definition} onChange={setDefinition}/></div></section></div>
  </section>;
}
