"use client";

// Chassis / orchestration adapter (docs/CRESTFALL-DESIGN-CONTEXT.md
// LOOM shape), ED1C. Composes the existing, read-only
// `useCreationEditShellViewModel` (creation-edit-shell lineage, NOT
// edited by this wave) with the ED1C page model: the accordion
// (single open section), per-section dirty/saved marks, the artwork
// hero props, the fixture-mode save (persisting to the mock overlay,
// never the live client), and plain-language error mapping. Returns
// plain prop bags and builders only; it builds no JSX.
import { useMemo, useState } from "react";

import { useCreationEditShellViewModel } from "@/components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel";
import {
  resolveEditorPageGroups,
  typeMeta,
} from "@/components/studio/my-creations/edit/creationEditConstants";
import { getCreationTypeDisplayName } from "@/lib/shared/presentation/terminology";

import {
  resolveMockSavedCreation,
  saveMockCreation,
} from "./editorSavedCreations.mock";

const VISIBILITY_LABELS = {
  PRIVATE: "Private",
  UNLISTED: "Unlisted",
  PUBLIC: "Public",
};

const SAVE_ERROR_COPY = "Your changes could not be saved. Please try again.";

const FEATURED_SLOT_KEYS = ["primary", "alt1", "alt2", "alt3"];

function resolveVisibilityChip(form = {}) {
  const isCanon = String(form.canonStatus || "NONE").toUpperCase() === "OFFICIAL";
  if (isCanon) return { visibilityLabel: "Canon", visibilityVariant: "canon" };
  const visibility = String(form.visibility || "PRIVATE").toUpperCase();
  return {
    visibilityLabel: VISIBILITY_LABELS[visibility] || visibility,
    visibilityVariant: "status",
  };
}

// Preview-only overrides, same precedent as Editor.jsx's own
// `originOverride`. Product never passes these.
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
    // Fixture-first: a matched mock creation (ownerId + updatedAt
    // present, so it passes the read-only hook's hasUsableCreation
    // check) seeds the ViewModel directly and NO fetch fires. An
    // unmatched id runs the existing live path unmodified.
    creation: mockCreation || undefined,
  });

  const isMockMode = Boolean(mockCreation);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // undefined = "not chosen yet": the first section of the first
  // group opens by default so a couch-drafted creation's quick
  // fields are immediately in front of the person.
  const [openSectionChoice, setOpenSectionChoice] = useState(undefined);
  const [dirtySectionIds, setDirtySectionIds] = useState(() => new Set());
  const [savedSectionIds, setSavedSectionIds] = useState(() => new Set());
  // Load-vs-action disambiguation on the live path (unchanged from
  // ED1B): an error status with no wrapped user action behind it is
  // a failed initial load.
  const [actionAttempted, setActionAttempted] = useState(false);
  // Fixture-mode clean snapshot: the read-only hook cannot reset its
  // own hasUnsavedChanges without a live round trip, so mock mode
  // masks it by reference-comparing the form against the last saved
  // snapshot (every edit produces a new form object).
  const [mockSavedSnapshot, setMockSavedSnapshot] = useState(null);

  const form = shell.sectionContentProps?.form || {};
  const creationType = shell.sectionContentProps?.creationType || "";

  // ED1C grammar: the ED1B groups minus the media hosting (artwork
  // moved into the hero); groups left with no sections drop.
  const groups = useMemo(() => {
    const sectionsById = new Map(
      (shell.viewProps?.activeSections || []).map((section) => [section.id, section])
    );
    return resolveEditorPageGroups(creationType)
      .map((group) => ({
        id: group.id,
        label: group.label,
        sections: (group.sectionIds || [])
          .map((id) => sectionsById.get(id))
          .filter(Boolean),
      }))
      .filter((group) => group.sections.length > 0);
  }, [creationType, shell.viewProps?.activeSections]);

  const firstSectionId = groups[0]?.sections?.[0]?.id || null;
  const openSectionId =
    openSectionChoice === undefined ? firstSectionId : openSectionChoice;

  function onOpenSection(sectionId) {
    setOpenSectionChoice(sectionId ?? null);
    setMobileNavOpen(false);
  }

  function markSectionDirty(sectionId) {
    setDirtySectionIds((current) => {
      if (current.has(sectionId)) return current;
      const next = new Set(current);
      next.add(sectionId);
      return next;
    });
    setSavedSectionIds((current) => {
      if (!current.has(sectionId)) return current;
      const next = new Set(current);
      next.delete(sectionId);
      return next;
    });
  }

  const markActionAttempted = () => setActionAttempted(true);

  const rawSaveBar = shell.saveBarProps || {};
  const hookDirty = Boolean(rawSaveBar.hasUnsavedChanges);

  const isDirty = isMockMode
    ? (hookDirty && form !== mockSavedSnapshot) || Boolean(previewDirtyOverride)
    : hookDirty || Boolean(previewDirtyOverride);

  const loadFailed =
    !isMockMode &&
    rawSaveBar.saveStatus === "error" &&
    !actionAttempted &&
    !hookDirty;
  const loadError =
    previewLoadErrorOverride || (loadFailed ? { message: "load-failed" } : null);

  // Fixture-mode save (docs/plans/ED1B-EDITOR-PAGE-SPEC.md 3.8):
  // persist the edited form into the mock overlay, snapshot it as
  // the clean baseline, and flip every dirty mark to saved. NO live
  // mutation fires for a fixture id.
  function onSave() {
    if (isMockMode) {
      saveMockCreation(creationId, form);
      setMockSavedSnapshot(form);
      setSavedSectionIds((current) => {
        const next = new Set(current);
        dirtySectionIds.forEach((id) => next.add(id));
        return next;
      });
      setDirtySectionIds(new Set());
      return;
    }
    markActionAttempted();
    rawSaveBar.onSave?.();
  }

  const saveStatus = isMockMode
    ? "idle"
    : loadFailed
      ? "idle"
      : rawSaveBar.saveStatus || "idle";

  // Per-section prop bags: the Binding Shell mounts one section body
  // per id; the field-update callbacks are wrapped per section so
  // edits mark their own section dirty. Publishing/danger actions
  // also mark the action flag for the live-path disambiguation.
  function sectionContentPropsFor(sectionId) {
    const base = shell.sectionContentProps || {};
    return {
      ...base,
      activeSection: sectionId,
      updateField: (...args) => {
        markSectionDirty(sectionId);
        return base.updateField?.(...args);
      },
      updateDataField: (...args) => {
        markSectionDirty(sectionId);
        return base.updateDataField?.(...args);
      },
      handleSubmitReview: (...args) => {
        markActionAttempted();
        return base.handleSubmitReview?.(...args);
      },
      handleArchive: (...args) => {
        markActionAttempted();
        return base.handleArchive?.(...args);
      },
      handleDelete: (...args) => {
        markActionAttempted();
        return base.handleDelete?.(...args);
      },
      onUnlistForEditing: (...args) => {
        markActionAttempted();
        return base.onUnlistForEditing?.(...args);
      },
      onCancelReview: (...args) => {
        markActionAttempted();
        return base.onCancelReview?.(...args);
      },
    };
  }

  const sectionMarks = useMemo(() => {
    const marks = {};
    savedSectionIds.forEach((id) => {
      marks[id] = "saved";
    });
    dirtySectionIds.forEach((id) => {
      marks[id] = "dirty";
    });
    // Harness only: the preview dirty override marks the first
    // section so the per-section dot is demonstrable without edits.
    if (previewDirtyOverride && firstSectionId && !marks[firstSectionId]) {
      marks[firstSectionId] = "dirty";
    }
    return marks;
  }, [dirtySectionIds, savedSectionIds, previewDirtyOverride, firstSectionId]);

  // Artwork hero (editor-header 3.0.0): all four featured slots as
  // thumbs, the active one shown large.
  const { visibilityLabel, visibilityVariant } = resolveVisibilityChip(form);
  const featured = Array.isArray(form.featuredMedia) ? form.featuredMedia : [];
  const activeSlotIndex = shell.mediaPanelProps?.activeMediaSlot ?? 0;
  const heroSlots = featured.map((slot, index) => ({
    id: slot?.id || `slot-${index + 1}`,
    index,
    label: slot?.label || `Slot ${index + 1}`,
    imageSrc: slot?.isPlaceholder ? null : slot?.imageUrl || null,
    isActive: index === activeSlotIndex,
  }));
  const activeHeroSlot = heroSlots[activeSlotIndex] || heroSlots[0] || null;

  const heroProps = {
    primaryImageSrc: activeHeroSlot?.imageSrc || null,
    slots: heroSlots,
    onSelectSlot: (index) => shell.mediaPanelProps?.setActiveMediaSlot?.(index),
    onReplaceActiveSlot: () =>
      shell.mediaPanelProps?.onReplaceSlot?.(
        FEATURED_SLOT_KEYS[activeSlotIndex] || "primary"
      ),
    generateHref: "/studio/v2/images",
    title: shell.viewProps?.title || "Untitled Creation",
    typeLabel: getCreationTypeDisplayName(creationType),
    typeIcon: typeMeta[creationType]?.icon || null,
    visibilityLabel,
    visibilityVariant,
  };

  return {
    ...shell,
    heroProps,
    sectionContentPropsFor,
    viewProps: {
      groups,
      openSectionId,
      onOpenSection,
      sectionMarks,
      isDirty,
      saveStatus,
      saveErrorCopy: saveStatus === "error" ? SAVE_ERROR_COPY : "",
      onSave,
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
    isUsingMockCreation: isMockMode,
  };
}
