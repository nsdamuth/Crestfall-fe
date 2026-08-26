"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape): owns
// Crestfall-specific integration. ED1C
// (docs/plans/ED1B-EDITOR-PAGE-SPEC.md) authorized changes: the page
// composition, the artwork hero, the accordion + rail model, and the
// section chrome suppression context; `useCreationEditViewModel`,
// `useCreationEditShellViewModel`, `CreationEditSectionContent`, and
// the section components' data flow are consumed unmodified.
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRound } from "lucide-react";

import KitBadge from "@/components/kit/KitBadge";
import CreationFeaturedImagePickerModal from "@/components/studio/my-creations/image-library/CreationFeaturedImagePickerModal";
import CreationEditSectionContent from "@/components/studio/my-creations/creation-edit-shell/CreationEditSectionContent";
import CreationEditMechanicsRuntimeQuickNav from "@/components/studio/my-creations/creation-edit-shell/CreationEditMechanicsRuntimeQuickNav";
import EditorHeader from "@/components/studio/my-creations/EditorHeader";
import CreationPicker from "@/components/studio/creation-picker/CreationPicker";
import { EditorSectionChromeContext } from "@/components/studio/my-creations/edit/sections/SharedFields";

import EditorView from "./editor/Editor.view";
import { useEditorViewModel } from "./editor/useEditorViewModel";

// Origin tracking, RULED 11 Aug 2026: the back control returns to the
// surface that opened the editor via `?origin=`, Vault fallback.
const ORIGIN_BACK_HREFS = {
  studio: "/studio/v2/studio",
  vault: "/studio/v2/vault",
};
const FALLBACK_BACK_HREF = "/studio/v2/vault";

// ED1C section chrome suppression: every mounted section body sits
// under this provider so the shared SectionTitle (and the converted
// hand-rolled header stacks) render nothing; the section box carries
// the one header.
const SECTION_CHROME = { suppressSectionTitle: true };

export default function Editor({
  creationId,
  creation = null,
  harnessSlot = null,
  originOverride,
  previewLoadingOverride,
  previewLoadErrorOverride,
  previewDirtyOverride,
}) {
  // Discard (carried from ED1): the read-only hydration hook exposes
  // no revert capability; remounting the subtree re-runs hydration
  // from the creationId/creation snapshot (which, after a fixture
  // save, is the mock overlay's saved form). Also the load-error
  // "Try again" action.
  const [discardKey, setDiscardKey] = useState(0);

  return (
    <EditorInner
      key={`${creationId || "none"}-${discardKey}`}
      creationId={creationId}
      creation={creation}
      harnessSlot={harnessSlot}
      originOverride={originOverride}
      previewLoadingOverride={previewLoadingOverride}
      previewLoadErrorOverride={previewLoadErrorOverride}
      previewDirtyOverride={previewDirtyOverride}
      onDiscard={() => setDiscardKey((current) => current + 1)}
    />
  );
}

function DefaultPcActions({ settingDefaultPc, onSetDefaultPc, status, error }) {
  return (
    <span className="flex flex-wrap items-center gap-[var(--space-2)]">
      <button
        type="button"
        onClick={() => onSetDefaultPc?.()}
        disabled={settingDefaultPc}
        className="cf-btn cf-btn--secondary cf-btn--sm"
      >
        <UserRound size={14} aria-hidden="true" />
        {settingDefaultPc ? "Setting..." : "Set default PC"}
      </button>
      {status ? (
        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-success-text)]">
          {status}
        </span>
      ) : null}
      {error ? (
        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]">
          {error}
        </span>
      ) : null}
    </span>
  );
}

function EditorInner({
  creationId,
  creation,
  harnessSlot,
  originOverride,
  previewLoadingOverride,
  previewLoadErrorOverride,
  previewDirtyOverride,
  onDiscard,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = originOverride !== undefined ? originOverride : searchParams.get("origin");
  const backHref = ORIGIN_BACK_HREFS[origin] || FALLBACK_BACK_HREF;

  const {
    viewProps,
    heroProps,
    sectionContentPropsFor,
    mechanicsQuickNavProps,
    featuredImagePickerProps,
    defaultPcStatus,
    defaultPcError,
    canSetDefaultPc,
    settingDefaultPc,
    onSetDefaultPc,
    showMechanicsQuickNav,
    isLore,
    loadError,
  } = useEditorViewModel({
    creationId,
    creation,
    previewLoadingOverride,
    previewLoadErrorOverride,
    previewDirtyOverride,
  });

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  function openSwitcherTo(nextCreationId) {
    setIsSwitcherOpen(false);
    router.push(
      `/studio/v2/editor/${encodeURIComponent(nextCreationId)}${
        origin ? `?origin=${encodeURIComponent(origin)}` : ""
      }`
    );
  }

  const imageLibraryHref = creationId
    ? `/studio/v2/editor/${encodeURIComponent(creationId)}/image-library${
        origin ? `?origin=${encodeURIComponent(origin)}` : ""
      }`
    : null;

  // One mounted section body per section id, each under the chrome
  // suppression provider with per-section-wrapped update callbacks
  // (the per-section dirty marks).
  const sectionNodes = {};
  const sectionBadges = {};
  for (const group of viewProps.groups || []) {
    for (const section of group.sections || []) {
      sectionNodes[section.id] = (
        <EditorSectionChromeContext.Provider value={SECTION_CHROME}>
          <CreationEditSectionContent {...sectionContentPropsFor(section.id)} />
        </EditorSectionChromeContext.Provider>
      );
    }
  }

  if (isLore && sectionNodes.preview) {
    sectionBadges.preview = (
      <div className="mb-[var(--space-3)]">
        <KitBadge label="Owner-only draft preview" variant="status" surface="canvas" />
      </div>
    );
  }

  const sectionLeads = showMechanicsQuickNav
    ? {
        fields: (
          <div className="mb-[var(--space-4)]">
            <CreationEditMechanicsRuntimeQuickNav {...mechanicsQuickNavProps} />
          </div>
        ),
      }
    : {};

  return (
    <EditorView
      {...viewProps}
      loadError={loadError}
      onRetryLoad={onDiscard}
      onOpenPickerFromError={() => setIsSwitcherOpen(true)}
      onOpenSwitcher={() => setIsSwitcherOpen(true)}
      onDiscard={onDiscard}
      backLabel="Back"
      onBack={() => router.push(backHref)}
      hero={
        <EditorHeader
          {...heroProps}
          imageLibraryHref={imageLibraryHref}
          actions={
            canSetDefaultPc ? (
              <DefaultPcActions
                settingDefaultPc={settingDefaultPc}
                onSetDefaultPc={onSetDefaultPc}
                status={defaultPcStatus}
                error={defaultPcError}
              />
            ) : null
          }
        />
      }
      sectionNodes={sectionNodes}
      sectionLeads={sectionLeads}
      sectionBadges={sectionBadges}
      sectionSeats={{
        // Named absorption seats, keyed by section id. Null this
        // pass; a future brief fills them.
        body: null,
        behavior: null,
        advanced: null,
      }}
      featuredImagePicker={
        featuredImagePickerProps ? (
          <CreationFeaturedImagePickerModal {...featuredImagePickerProps} />
        ) : null
      }
      creationPicker={
        isSwitcherOpen ? (
          <CreationPicker
            title="Switch creation"
            onSelect={(creation) => creation?.id && openSwitcherTo(creation.id)}
            onClose={() => setIsSwitcherOpen(false)}
          />
        ) : null
      }
      harnessSlot={harnessSlot}
    />
  );
}
