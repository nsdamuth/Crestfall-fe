"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import LorePublicationReadiness from "@/components/studio/create/lore/LorePublicationReadiness";
import DangerSection from "@/components/studio/my-creations/edit/sections/DangerSection";
import PublishingSection from "@/components/studio/my-creations/edit/sections/PublishingSection";

import {
  SECTION_COMPONENT_REGISTRY,
  OverviewSection,
  LoreDocumentRenderer,
  buildLorePreviewProps,
} from "./creationEditSectionComponentMap";

// Registry-as-data dispatch, ED1 (docs/plans/FABLE-GATE-2-STUDIO.md,
// ruling N1 option A): one component map (creationEditSectionComponentMap.js)
// replaces the 42-guard if-chain this file used to be. "publishing"
// and "danger" stay explicit below: both are universal (every type
// reaches them) and "publishing" carries one real branch (Lore's
// rehosted readiness surface) the registry doesn't model as a plain
// (type, section) pair.
export default function CreationEditSectionContent(ctx) {
  const {
    creationId,
    activeSection,
    form,
    hasUnsavedChanges = false,
    updateField,
    isTemplate,
    isLore,
    reviewStatus,
    reviewMessage,
    reviewAction,
    handleSubmitReview,
    archiveStatus,
    archiveMessage,
    handleArchive,
    deleteStatus,
    deleteMessage,
    handleDelete,
  } = ctx;

  if (activeSection === "publishing") {
    return isLore ? (
      <LorePublicationReadiness
        form={form}
        creationId={creationId}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    ) : (
      <PublishingSection
        form={form}
        updateField={updateField}
        isTemplate={isTemplate}
        onSubmitPublicReview={() => handleSubmitReview("PUBLIC")}
        onSubmitCanonReview={() => handleSubmitReview("CANON")}
        reviewStatus={reviewStatus}
        reviewMessage={reviewMessage}
        reviewAction={reviewAction}
        onUnlistForEditing={ctx.onUnlistForEditing}
        onCancelReview={ctx.onCancelReview}
      />
    );
  }

  if (activeSection === "danger") {
    return (
      <DangerSection
        form={form}
        onArchive={handleArchive}
        archiveStatus={archiveStatus}
        archiveMessage={archiveMessage}
        onDelete={handleDelete}
        deleteStatus={deleteStatus}
        deleteMessage={deleteMessage}
      />
    );
  }

  if (activeSection === "preview" && isLore) {
    return (
      <CreationEditLorePreviewRow creationId={creationId}>
        <LoreDocumentRenderer {...buildLorePreviewProps(ctx)} />
      </CreationEditLorePreviewRow>
    );
  }

  const entry = SECTION_COMPONENT_REGISTRY[ctx.creationType]?.[activeSection];

  if (entry) {
    const { Component, buildProps } = entry;
    return <Component {...buildProps(ctx)} />;
  }

  if (activeSection === "overview") {
    return <OverviewSection form={form} updateField={updateField} />;
  }

  return null;
}

// Lore preview row wrapper: composes the "open full owner preview"
// link above LoreDocumentRenderer, exactly as the old chain did.
function CreationEditLorePreviewRow({ creationId, children }) {
  return (
    <div>
      <div className="mb-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-3)]">
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          The full owner preview uses the last saved draft. Save changes
          before opening it.
        </p>

        <Link
          href={`/studio/my-creations/${encodeURIComponent(creationId)}/preview`}
          target="_blank"
          rel="noreferrer"
          className="cf-btn cf-btn--secondary"
        >
          <ExternalLink size={14} />
          Open full owner preview
        </Link>
      </div>

      {children}
    </div>
  );
}
