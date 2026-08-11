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
import { useRouter } from "next/navigation";

import CreationEditMediaPanel from "@/components/studio/my-creations/CreationEditMediaPanel";
import CreationEditStickyActionBar from "@/components/studio/my-creations/edit/CreationEditStickyActionBar";
import CreationFeaturedImagePickerModal from "@/components/studio/my-creations/image-library/CreationFeaturedImagePickerModal";
import CreationEditSectionContent from "@/components/studio/my-creations/creation-edit-shell/CreationEditSectionContent";
import CreationEditMechanicsRuntimeQuickNav from "@/components/studio/my-creations/creation-edit-shell/CreationEditMechanicsRuntimeQuickNav";

import EditorView from "./editor/Editor.view";
import { useEditorViewModel } from "./editor/useEditorViewModel";

export default function Editor({ creationId, harnessSlot = null }) {
  const router = useRouter();

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

  return (
    <EditorView
      {...viewProps}
      defaultPcStatus={defaultPcStatus}
      defaultPcError={defaultPcError}
      mobileNavOpen={mobileNavOpen}
      onToggleMobileNav={onToggleMobileNav}
      backAction={
        // Judgment call, flagged: the legacy editor's back action
        // returns to /studio/my-creations. This v2 page is reached
        // from the Studio hub's quick-create CTA and the Vault's
        // single edit path (docs/STUDIO-SPEC.md sections 3.3, 5), so
        // "back" here returns to the v2 Vault, the v2 list surface
        // this editor serves. Not settled explicitly by the spec;
        // documented rather than silently assumed.
        <button
          type="button"
          onClick={() => router.push("/studio/v2/vault")}
          className="cf-btn cf-btn--secondary"
        >
          ← Vault
        </button>
      }
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
