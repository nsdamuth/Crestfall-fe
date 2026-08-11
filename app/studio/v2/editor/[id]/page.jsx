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
// auth-free verification. Resolution of [id] is fixture-first
// (../editor/editorSavedCreations.mock.js) with a fall-through to the
// existing live creation client; see that module's header comment
// (mock, pending CR-031).

import Editor from "../Editor";

export default async function EditorV2Page({ params }) {
  const { id } = await params;

  return <Editor creationId={id} />;
}
