// New this wave (docs/plans/FABLE-GATE-2-STUDIO.md, ED1): the editor
// index. `/studio/v2/editor/[id]` stays the deep-linkable address;
// this route is the "nothing selected" entry. Reached from the
// Studio hub's CREATE zone quiet line, "Prefer full control? Start
// in the advanced editor" (build-0823 pass 4/5, RULED 23 Aug 2026),
// which supersedes the earlier "Full Studio primary door" plan (S1,
// never built; the Full Studio tool-card grid itself was dropped by
// the three-zone hub ruling).
import EditorIndexClient from "./EditorIndexClient";

export default function EditorIndexPage() {
  return <EditorIndexClient />;
}
