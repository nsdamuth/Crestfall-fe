"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape): owns
// Crestfall-specific integration. Next.js navigation (useRouter) is
// one piece; the other is the read-only creation-edit-shell lineage
// (components/studio/my-creations/**), which this file imports and
// composes into ReactNode slots. ED1B
// (docs/plans/ED1B-EDITOR-PAGE-SPEC.md) authorized changes: the page
// composition only; `useCreationEditViewModel`,
// `useCreationEditShellViewModel`, `CreationEditSectionContent`, and
// every section component are consumed unmodified. Multi-section
// rendering mounts `CreationEditSectionContent` once per section id
// with `activeSection` overridden per instance.
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRound } from "lucide-react";

import CreationEditMediaPanel from "@/components/studio/my-creations/CreationEditMediaPanel";
import CreationFeaturedImagePickerModal from "@/components/studio/my-creations/image-library/CreationFeaturedImagePickerModal";
import CreationEditSectionContent from "@/components/studio/my-creations/creation-edit-shell/CreationEditSectionContent";
import CreationEditMechanicsRuntimeQuickNav from "@/components/studio/my-creations/creation-edit-shell/CreationEditMechanicsRuntimeQuickNav";
import EditorHeader from "@/components/studio/my-creations/EditorHeader";
import EditorSaveBar from "@/components/studio/my-creations/EditorSaveBar";
import CreationPicker from "@/components/studio/creation-picker/CreationPicker";

import EditorView from "./editor/Editor.view";
import { useEditorViewModel } from "./editor/useEditorViewModel";

// Origin tracking, RULED 11 Aug 2026: the back control returns to the
// surface that opened the editor. A `?origin=` query param is the
// mechanism, read here at the Binding Shell so the portable View
// stays presentation only. Falls back to the Vault when no origin is
// present (direct link, cold load, refresh).
const ORIGIN_BACK_HREFS = {
  studio: "/studio/v2/studio",
  vault: "/studio/v2/vault",
};
const FALLBACK_BACK_HREF = "/studio/v2/vault";

export default function Editor({
  creationId,
  harnessSlot = null,
  originOverride,
  previewLoadingOverride,
  previewLoadErrorOverride,
  previewDirtyOverride,
}) {
  // Discard, ED1 (carried into ED1B): useCreationEditViewModel (the
  // existing hydration authority, not touched by this brief) exposes
  // no "revert form" capability. Remounting the whole live-data
  // subtree re-runs its hydration effect from the same
  // creationId/creation snapshot, which is the only safe way to
  // discard unsaved edits without editing that read-only hook. The
  // same remount is the "Try again" action on the load-error state.
  // discardKey lives on the OUTER component so the remount below
  // never resets the counter driving it.
  const [discardKey, setDiscardKey] = useState(0);

  return (
    <EditorInner
      key={`${creationId || "none"}-${discardKey}`}
      creationId={creationId}
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
        className="cf-btn cf-btn--secondary"
      >
        <UserRound size={14} aria-hidden="true" />
        {settingDefaultPc ? "Setting..." : "Set default PC"}
      </button>
      {status ? (
        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-success)]">
          {status}
        </span>
      ) : null}
      {error ? (
        <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]">
          {error}
        </span>
      ) : null}
    </span>
  );
}

function EditorInner({
  creationId,
  harnessSlot,
  originOverride,
  previewLoadingOverride,
  previewLoadErrorOverride,
  previewDirtyOverride,
  onDiscard,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // originOverride lets the auth-free preview mirror
  // (/dev/ui-preview/editor-v2-page) simulate every origin state
  // without real navigation; product always resolves origin from the
  // URL.
  const origin = originOverride !== undefined ? originOverride : searchParams.get("origin");
  const backHref = ORIGIN_BACK_HREFS[origin] || FALLBACK_BACK_HREF;

  const {
    viewProps,
    headerProps,
    saveBarProps,
    mediaPanelProps,
    mechanicsQuickNavProps,
    sectionContentProps,
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

  // One mounted section body per section id in the page grammar.
  // CreationEditSectionContent is a pure dispatch on
  // (creationType, activeSection); overriding activeSection per
  // instance renders every section on the one scrolling surface.
  const sectionNodes = {};
  const sectionBadges = {};
  for (const group of viewProps.groups || []) {
    for (const section of group.sections || []) {
      sectionNodes[section.id] = (
        <CreationEditSectionContent
          {...sectionContentProps}
          activeSection={section.id}
        />
      );
    }
  }

  if (isLore && sectionNodes.preview) {
    sectionBadges.preview = (
      <p className="mb-[var(--space-3)] inline-flex items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]">
        Owner-only draft preview
      </p>
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
      backLabel="Back"
      onBack={() => router.push(backHref)}
      imageLibraryHref={imageLibraryHref}
      header={
        <EditorHeader
          {...headerProps}
          onOpenSwitcher={() => setIsSwitcherOpen(true)}
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
      saveBar={<EditorSaveBar {...saveBarProps} onDiscard={onDiscard} />}
      mediaPanel={<CreationEditMediaPanel {...mediaPanelProps} />}
      sectionNodes={sectionNodes}
      sectionLeads={sectionLeads}
      sectionBadges={sectionBadges}
      sectionSeats={{
        // Named absorption seats, re-keyed by section id (was
        // seats.bodyDetail / behaviorDetail / advancedPrompting).
        // Null this pass; a future brief fills them.
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
