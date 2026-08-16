import { notFound } from "next/navigation";

import Ed1eEditorDesignClient from "./Ed1eEditorDesignClient";

// ED1e design exemplar renders (docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md).
// Harness only, never product. Self-contained: imports no shipped
// editor component, so the current editor stays the untouched
// before-instrument at /dev/ui-preview/editor-v2-page.
export default function Ed1eEditorDesignPreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <Ed1eEditorDesignClient />;
}
