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
import { getCreationTypeDisplayName } from "@/lib/shared/presentation/terminology";

import { resolveMockSavedCreation } from "./editorSavedCreations.mock";

const VISIBILITY_LABELS = {
  PRIVATE: "Private",
  UNLISTED: "Unlisted",
  PUBLIC: "Public",
};

function resolveVisibilityChip(form = {}) {
  const isCanon = String(form.canonStatus || "NONE").toUpperCase() === "OFFICIAL";
  if (isCanon) return { visibilityLabel: "Canon", visibilityVariant: "canon" };
  const visibility = String(form.visibility || "PRIVATE").toUpperCase();
  return {
    visibilityLabel: VISIBILITY_LABELS[visibility] || visibility,
    visibilityVariant: "status",
  };
}

function resolveHeaderArt(form = {}) {
  const featured = Array.isArray(form.featuredMedia) ? form.featuredMedia : [];
  const primary = featured.find((slot) => slot?.id === "slot-1") || featured[0];
  return primary?.isPlaceholder ? null : primary?.imageUrl || null;
}

// Preview-only overrides, same precedent as Editor.jsx's own
// `originOverride`: the dev preview mirror simulates loading and
// load-error states without a real async gap (fixture-first
// resolution is synchronous). Product never passes these; they
// default to false/null.
export function useEditorViewModel({
  creationId,
  previewLoadingOverride = false,
  previewLoadErrorOverride = null,
} = {}) {
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

  function onSelectGroup(groupId) {
    shell.viewProps.onSelectGroup?.(groupId);
    setMobileNavOpen(false);
  }

  const form = shell.sectionContentProps?.form || {};
  const { visibilityLabel, visibilityVariant } = resolveVisibilityChip(form);

  const headerProps = {
    imageSrc: resolveHeaderArt(form),
    title: shell.viewProps.title,
    typeLabel: getCreationTypeDisplayName(shell.sectionContentProps?.creationType),
    visibilityLabel,
    visibilityVariant,
    hasUnsavedChanges: Boolean(shell.saveBarProps?.hasUnsavedChanges),
    switcherLabel: "Switch creation",
  };

  return {
    ...shell,
    viewProps: {
      ...shell.viewProps,
      onSelectSection,
      onSelectGroup,
      isLoading: Boolean(previewLoadingOverride),
      overviewDescription: form.description || null,
      overviewContentRating: form.contentRating || form.content_rating || null,
    },
    headerProps,
    loadError: previewLoadErrorOverride,
    isUsingMockCreation: Boolean(mockCreation),
    mobileNavOpen,
    onToggleMobileNav: () => setMobileNavOpen((current) => !current),
  };
}
