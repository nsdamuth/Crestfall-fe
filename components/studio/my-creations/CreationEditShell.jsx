"use client";

import Link from "next/link";

import CreationEditMediaPanel from "@/components/studio/my-creations/CreationEditMediaPanel";
import CreationFeaturedImagePickerModal from "@/components/studio/my-creations/image-library/CreationFeaturedImagePickerModal";
import CreationEditStickyActionBar from "@/components/studio/my-creations/edit/CreationEditStickyActionBar";

import CreationEditShellView from "./creation-edit-shell/CreationEditShell.view";
import CreationEditSectionContent from "./creation-edit-shell/CreationEditSectionContent";
import CreationEditMechanicsRuntimeQuickNav from "./creation-edit-shell/CreationEditMechanicsRuntimeQuickNav";
import { useCreationEditShellViewModel } from "./creation-edit-shell/useCreationEditShellViewModel";

export default function CreationEditShell({ creationId, creation }) {
  const {
    viewProps,
    mediaPanelProps,
    mechanicsQuickNavProps,
    sectionContentProps,
    stickyActionBarProps,
    featuredImagePickerProps,
  } = useCreationEditShellViewModel({
    creationId,
    creation,
  });

  return (
    <CreationEditShellView
      {...viewProps}
      backAction={
        <Link
          href="/studio/my-creations"
          className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          ← My Creations
        </Link>
      }
      mediaPanel={<CreationEditMediaPanel {...mediaPanelProps} />}
      mechanicsQuickNav={
        <CreationEditMechanicsRuntimeQuickNav
          {...mechanicsQuickNavProps}
        />
      }
      sectionContent={
        <CreationEditSectionContent {...sectionContentProps} />
      }
      stickyActionBar={
        <CreationEditStickyActionBar {...stickyActionBarProps} />
      }
      featuredImagePicker={
        featuredImagePickerProps ? (
          <CreationFeaturedImagePickerModal
            {...featuredImagePickerProps}
          />
        ) : null
      }
    />
  );
}
