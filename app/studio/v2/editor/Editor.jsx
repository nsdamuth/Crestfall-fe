"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape): owns
// Crestfall-specific integration. Next.js navigation (useRouter,
// Link) is one piece; the other is the read-only creation-edit-shell
// lineage (components/studio/my-creations/**), which this file
// imports and composes into ReactNode slots. ED1
// (docs/plans/FABLE-GATE-2-STUDIO.md) authorized changes: the
// section registry inside useCreationEditShellViewModel.js and
// CreationEditSectionContent.jsx moved from an if-chain to data (see
// those files' own comments); everything else in the lineage is
// unmodified.
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
// mechanism (the pattern this repo already uses to carry navigation
// context across a hard page boundary, e.g. FilterableIndex's
// query-string-driven state), read here at the Binding Shell so the
// portable View stays presentation only. Falls back to the Vault
// when no origin is present (direct link, cold load, refresh).
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
}) {
  // Discard, ED1: useCreationEditViewModel (the existing hydration
  // authority, not touched by this brief) exposes no "revert form"
  // capability. Remounting the whole live-data subtree re-runs its
  // hydration effect from the same creationId/creation snapshot,
  // which is the only safe way to discard unsaved edits without
  // editing that read-only hook. discardKey lives on the OUTER
  // component so the remount below never resets the counter driving
  // it.
  const [discardKey, setDiscardKey] = useState(0);

  return (
    <EditorInner
      key={`${creationId || "none"}-${discardKey}`}
      creationId={creationId}
      harnessSlot={harnessSlot}
      originOverride={originOverride}
      previewLoadingOverride={previewLoadingOverride}
      previewLoadErrorOverride={previewLoadErrorOverride}
      onDiscard={() => setDiscardKey((current) => current + 1)}
    />
  );
}

function EditorInner({
  creationId,
  harnessSlot,
  originOverride,
  previewLoadingOverride,
  previewLoadErrorOverride,
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
    mobileNavOpen,
    onToggleMobileNav,
    loadError,
  } = useEditorViewModel({ creationId, previewLoadingOverride, previewLoadErrorOverride });

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  function openSwitcherTo(nextCreationId) {
    setIsSwitcherOpen(false);
    router.push(
      `/studio/v2/editor/${encodeURIComponent(nextCreationId)}${
        origin ? `?origin=${encodeURIComponent(origin)}` : ""
      }`
    );
  }

  // Vault-edit-tree pass, 11 Aug 2026: two rows (CSV 839, 409-421 +
  // 430) close by composing already-built read-only surfaces rather
  // than editing the forbidden creation-edit-shell lineage. Both
  // derive from data the Shell already has (sectionContentProps.isLore
  // and the [id] itself); the View stays a pure function of props.
  const isLoreDraftPreview =
    Boolean(sectionContentProps?.isLore) &&
    sectionContentProps?.activeSection === "preview";
  const imageLibraryHref = creationId
    ? `/studio/v2/editor/${encodeURIComponent(creationId)}/image-library${
        origin ? `?origin=${encodeURIComponent(origin)}` : ""
      }`
    : null;

  return (
    <EditorView
      {...viewProps}
      loadError={loadError}
      defaultPcStatus={defaultPcStatus}
      defaultPcError={defaultPcError}
      mobileNavOpen={mobileNavOpen}
      onToggleMobileNav={onToggleMobileNav}
      backLabel="Back"
      onBack={() => router.push(backHref)}
      isLoreDraftPreview={isLoreDraftPreview}
      imageLibraryHref={imageLibraryHref}
      header={
        <EditorHeader
          {...headerProps}
          onOpenSwitcher={() => setIsSwitcherOpen(true)}
        />
      }
      saveBar={<EditorSaveBar {...saveBarProps} onDiscard={onDiscard} />}
      mediaPanel={<CreationEditMediaPanel {...mediaPanelProps} />}
      mechanicsQuickNav={
        <CreationEditMechanicsRuntimeQuickNav {...mechanicsQuickNavProps} />
      }
      sectionContent={<CreationEditSectionContent {...sectionContentProps} />}
      seats={{
        // Named, no placeholder UI. A future brief (S4) fills these.
        bodyDetail: null,
        behaviorDetail: null,
        advancedPrompting: null,
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
