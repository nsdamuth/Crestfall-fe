// New this wave (docs/plans/FABLE-GATE-2-STUDIO.md, ED1): the editor
// index. `/studio/v2/editor/[id]` stays the deep-linkable address;
// this route is the "nothing selected" entry, reached from Full
// Studio's primary "Open the Editor" door (S1, not this wave).
import EditorIndexClient from "./EditorIndexClient";

export default function EditorIndexPage() {
  return <EditorIndexClient />;
}
