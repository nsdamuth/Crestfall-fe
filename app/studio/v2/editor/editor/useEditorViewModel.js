"use client";

// Chassis / orchestration adapter (docs/CRESTFALL-DESIGN-CONTEXT.md
// LOOM shape), ED1B. Composes the existing, read-only
// `useCreationEditShellViewModel` (creation-edit-shell lineage, NOT
// edited by this wave) with the ED1B page model: the per-type page
// grammar (open essentials group + collapsible advanced groups),
// group open/close state, the O11 sheet state, plain-language error
// mapping (no raw client error string ever reaches a View), and the
// fixture-first [id] resolution. Returns plain prop bags only; it
// builds no JSX. The Binding Shell (../Editor.jsx) mounts the
// read-only section components once per section id and passes them
// into `Editor.view.jsx` as ReactNode maps.
import { useMemo, useState } from "react";

import { useCreationEditShellViewModel } from "@/components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel";
import {
  resolveEditorPageGroups,
  typeMeta,
} from "@/components/studio/my-creations/edit/creationEditConstants";
import { getCreationTypeDisplayName } from "@/lib/shared/presentation/terminology";

import { resolveMockSavedCreation } from "./editorSavedCreations.mock";

const VISIBILITY_LABELS = {
  PRIVATE: "Private",
  UNLISTED: "Unlisted",
  PUBLIC: "Public",
};

const SAVE_ERROR_COPY = "Your changes could not be saved. Please try again.";

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
// `originOverride`: the dev preview mirror simulates loading,
// load-error, and dirty states without a real async gap or real
// edits. Product never passes these.
export function useEditorViewModel({
  creationId,
  previewLoadingOverride = false,
  previewLoadErrorOverride = null,
  previewDirtyOverride = false,
} = {}) {
  const mockCreation = useMemo(
    () => resolveMockSavedCreation(creationId),
    [creationId]
  );

  const shell = useCreationEditShellViewModel({
    creationId,
    // Fixture-first: a matched mock creation (which carries ownerId
    // and updatedAt so it passes the existing hook's
    // `hasUsableCreation` check) seeds the read-only ViewModel
    // directly and NO fetch fires. An unmatched id leaves `creation`
    // undefined and the existing live `fetchOwnedCreation` path runs
    // unmodified.
    creation: mockCreation || undefined,
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openGroupIds, setOpenGroupIds] = useState([]);
  // Distinguishes a failed initial load (the hydrate effect writes
  // its error into saveStatus/saveMessage) from a failed user action:
  // before any wrapped action fires, an error state at rest can only
  // be the load path.
  const [actionAttempted, setActionAttempted] = useState(false);

  const form = shell.sectionContentProps?.form || {};
  const creationType = shell.sectionContentProps?.creationType || "";

  const groups = useMemo(() => {
    const sectionsById = new Map(
      (shell.viewProps?.activeSections || []).map((section) => [section.id, section])
    );
    return resolveEditorPageGroups(creationType).map((group) => ({
      id: group.id,
      label: group.label,
      hostsMedia: Boolean(group.hostsMedia),
      sections: (group.sectionIds || [])
        .map((id) => sectionsById.get(id))
        .filter(Boolean),
    }));
  }, [creationType, shell.viewProps?.activeSections]);

  function onToggleGroup(groupId) {
    setOpenGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId]
    );
  }

  function onJumpToGroup(groupId) {
    setOpenGroupIds((current) =>
      current.includes(groupId) ? current : [...current, groupId]
    );
    setMobileNavOpen(false);
  }

  const markActionAttempted = () => setActionAttempted(true);

  const rawSaveBar = shell.saveBarProps || {};
  const hasUnsavedChanges =
    Boolean(rawSaveBar.hasUnsavedChanges) || Boolean(previewDirtyOverride);

  // A save-status error with no user action behind it is a failed
  // initial load on the live path: present the friendly load-error
  // state, never the raw client message.
  const loadFailed =
    rawSaveBar.saveStatus === "error" && !actionAttempted && !hasUnsavedChanges;
  const loadError =
    previewLoadErrorOverride || (loadFailed ? { message: "load-failed" } : null);

  const saveBarProps = {
    hasUnsavedChanges,
    saveStatus: loadFailed ? "idle" : rawSaveBar.saveStatus,
    saveMessage: rawSaveBar.saveStatus === "error" ? SAVE_ERROR_COPY : "",
    onSave: () => {
      markActionAttempted();
      rawSaveBar.onSave?.();
    },
  };

  // Publishing/danger actions also write into the shared save/review
  // status channels; wrapping them keeps the load-vs-action
  // disambiguation honest without touching the read-only lineage.
  const sectionContentProps = {
    ...shell.sectionContentProps,
    handleSubmitReview: (...args) => {
      markActionAttempted();
      return shell.sectionContentProps?.handleSubmitReview?.(...args);
    },
    handleArchive: (...args) => {
      markActionAttempted();
      return shell.sectionContentProps?.handleArchive?.(...args);
    },
    handleDelete: (...args) => {
      markActionAttempted();
      return shell.sectionContentProps?.handleDelete?.(...args);
    },
    onUnlistForEditing: (...args) => {
      markActionAttempted();
      return shell.sectionContentProps?.onUnlistForEditing?.(...args);
    },
    onCancelReview: (...args) => {
      markActionAttempted();
      return shell.sectionContentProps?.onCancelReview?.(...args);
    },
  };

  const { visibilityLabel, visibilityVariant } = resolveVisibilityChip(form);

  const headerProps = {
    imageSrc: resolveHeaderArt(form),
    title: shell.viewProps?.title || "Untitled Creation",
    typeLabel: getCreationTypeDisplayName(creationType),
    typeIcon: typeMeta[creationType]?.icon || null,
    visibilityLabel,
    visibilityVariant,
    hasUnsavedChanges,
    switcherLabel: "Switch creation",
    onOpenSections: () => setMobileNavOpen(true),
  };

  return {
    ...shell,
    sectionContentProps,
    saveBarProps,
    headerProps,
    viewProps: {
      groups,
      openGroupIds,
      onToggleGroup,
      onJumpToGroup,
      isLoading: Boolean(previewLoadingOverride),
      mobileNavOpen,
      onToggleMobileNav: () => setMobileNavOpen((current) => !current),
    },
    creationType,
    isLore: Boolean(shell.sectionContentProps?.isLore),
    canSetDefaultPc: Boolean(shell.viewProps?.canSetDefaultPc),
    settingDefaultPc: Boolean(shell.viewProps?.settingDefaultPc),
    onSetDefaultPc: shell.viewProps?.onSetDefaultPc,
    showMechanicsQuickNav: creationType === "MECHANICS_MODULE",
    loadError,
    isUsingMockCreation: Boolean(mockCreation),
  };
}
