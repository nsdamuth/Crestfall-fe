"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape): owns
// Crestfall-specific integration. Next.js navigation (useRouter,
// Link) is one piece; the other is the read-only creation-edit-shell
// lineage (components/studio/my-creations/**), which this file
// imports and composes into ReactNode slots exactly the way the
// existing, unmodified `components/studio/my-creations/CreationEditShell.jsx`
// does for the legacy `/studio/my-creations/[id]/edit` page (read for
// precedent, never edited). Nothing in `components/studio/my-creations/**`
// is changed by this brief.
import { useRouter, useSearchParams } from "next/navigation";

import CreationEditMediaPanel from "@/components/studio/my-creations/CreationEditMediaPanel";
import CreationEditStickyActionBar from "@/components/studio/my-creations/edit/CreationEditStickyActionBar";
import CreationFeaturedImagePickerModal from "@/components/studio/my-creations/image-library/CreationFeaturedImagePickerModal";
import CreationEditSectionContent from "@/components/studio/my-creations/creation-edit-shell/CreationEditSectionContent";
import CreationEditMechanicsRuntimeQuickNav from "@/components/studio/my-creations/creation-edit-shell/CreationEditMechanicsRuntimeQuickNav";

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

export default function Editor({ creationId, harnessSlot = null, originOverride }) {
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
    mediaPanelProps,
    mechanicsQuickNavProps,
    sectionContentProps,
    stickyActionBarProps,
    featuredImagePickerProps,
    defaultPcStatus,
    defaultPcError,
    mobileNavOpen,
    onToggleMobileNav,
  } = useEditorViewModel({ creationId });

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
      defaultPcStatus={defaultPcStatus}
      defaultPcError={defaultPcError}
      mobileNavOpen={mobileNavOpen}
      onToggleMobileNav={onToggleMobileNav}
      backLabel="Back"
      onBack={() => router.push(backHref)}
      isLoreDraftPreview={isLoreDraftPreview}
      imageLibraryHref={imageLibraryHref}
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
      stickyActionBar={<CreationEditStickyActionBar {...stickyActionBarProps} />}
      featuredImagePicker={
        featuredImagePickerProps ? (
          <CreationFeaturedImagePickerModal {...featuredImagePickerProps} />
        ) : null
      }
      harnessSlot={harnessSlot}
    />
  );
}
