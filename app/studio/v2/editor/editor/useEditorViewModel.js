"use client";

// Chassis / orchestration adapter (docs/CRESTFALL-DESIGN-CONTEXT.md
// LOOM shape). Composes the existing, read-only
// `useCreationEditShellViewModel` (creation-edit-shell lineage,
// components/studio/my-creations/creation-edit-shell/**, NOT edited
// by this brief) with this page's own mobile-chrome state (section
// nav open/close on phone) and the fixture-first [id] resolution
// (docs/STUDIO-SPEC.md 4.3, brief S3 item 3). Returns plain prop bags
// only; it builds no JSX. The Binding Shell (../Editor.jsx) turns
// `mediaPanelProps`, `sectionContentProps`, `stickyActionBarProps`,
// `mechanicsQuickNavProps`, and `featuredImagePickerProps` into the
// actual read-only components and passes them into `Editor.view.jsx`
// as ReactNode slots, the same split `CreationEditShell.jsx` already
// uses in production.
import { useMemo, useState } from "react";

import { useCreationEditShellViewModel } from "@/components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel";

import { resolveMockSavedCreation } from "./editorSavedCreations.mock";

export function useEditorViewModel({ creationId } = {}) {
  const mockCreation = useMemo(
    () => resolveMockSavedCreation(creationId),
    [creationId]
  );

  const shell = useCreationEditShellViewModel({
    creationId,
    // Fixture-first: a matched mock creation seeds the existing
    // ViewModel's `hasUsableCreation` check directly, so no fetch
    // fires. An unmatched id leaves `creation` undefined and
    // `useCreationEditViewModel` (inside the shell hook) falls
    // through to its own existing `fetchOwnedCreation` live call,
    // unmodified, per brief S3 item 3.
    creation: mockCreation || undefined,
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function onSelectSection(sectionId) {
    shell.viewProps.onSelectSection?.(sectionId);
    setMobileNavOpen(false);
  }

  return {
    ...shell,
    viewProps: {
      ...shell.viewProps,
      onSelectSection,
    },
    isUsingMockCreation: Boolean(mockCreation),
    mobileNavOpen,
    onToggleMobileNav: () => setMobileNavOpen((current) => !current),
  };
}
