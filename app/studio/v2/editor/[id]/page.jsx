// PRE-PARITY. The advanced editor, its own page per
// docs/STUDIO-SPEC.md section 4.1 ("its own page, not a state of the
// Studio page"), sitting beside the nine destinations rather than
// under app/studio/v2/studio/** so the hub and this editor can build
// in parallel (disjoint file sets). Stays out of the sidebar until
// the whole nine-page set clears the cutover sequence in
// docs/CRESTFALL-DESIGN-CONTEXT.md; this address is an engineering
// seat, not a user promise (docs/STUDIO-SPEC.md 4.1).
//
// docs/STUDIO-SPEC.md Brief S3 (section 8.3): the advanced editor
// shell, rehost move. Composition lives in ../Editor.jsx (Binding
// Shell) and is mirrored at /dev/ui-preview/editor-v2-page for
// auth-free verification. The live route deliberately reuses the legacy
// edit-page loader so Creation data and image-library featured-slot
// assignments arrive as one hydrated edit payload. Fixture-first preview
// resolution remains inside ../Editor.jsx / editorSavedCreations.mock.js.

import Editor from "../Editor";
import TimelineBuilderShell from "@/components/studio/create/timeline/TimelineBuilderShell";
import { getEditCreationPageData } from "@/lib/server/studio/getEditCreationPageData";

export default async function EditorV2Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};
  const { creation } = await getEditCreationPageData(id);

  if (String(creation?.type || "").toUpperCase() === "TIMELINE") {
    const origin = String(query.origin || "");
    const backHref =
      origin === "vault"
        ? "/studio/v2/vault"
        : origin === "timeline"
          ? `/studio/v2/lore/timelines/${encodeURIComponent(id)}`
          : "/studio/v2/lore";

    return (
      <TimelineBuilderShell
        timelineId={id}
        initialCreation={creation}
        backHref={backHref}
      />
    );
  }

  return <Editor creationId={id} creation={creation} />;
}
