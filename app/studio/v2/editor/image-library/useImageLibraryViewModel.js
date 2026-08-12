"use client";

// Chassis / orchestration adapter (docs/CRESTFALL-DESIGN-CONTEXT.md
// LOOM shape). Resolves the v2 back destination only; the actual
// library data, filters, and mutations come from the composed,
// read-only `CreationImageLibraryPage` (../ImageLibrary.jsx owns that
// composition, not this hook). Returns a plain prop bag, builds no
// JSX.
export function useImageLibraryViewModel({ creationId, origin } = {}) {
  const backHref = creationId
    ? `/studio/v2/editor/${encodeURIComponent(creationId)}${
        origin ? `?origin=${encodeURIComponent(origin)}` : ""
      }`
    : "/studio/v2/vault";

  return { backHref };
}
