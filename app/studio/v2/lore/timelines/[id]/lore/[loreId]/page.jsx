import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import LoreDocumentRenderer from "@/components/studio/create/lore/LoreDocumentRenderer";
import { normalizeTimelineDefinition } from "@/lib/shared/timelines/timelineContract";
import { getOwnedCreationPageData } from "@/lib/server/studio/getOwnedCreationPageData";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getLoreDocument(creation) {
  const data = normalizeObject(creation?.data);
  return normalizeObject(data.lore_document || data.loreDocument);
}

export default async function TimelineOwnedLoreReaderPage({ params }) {
  const { id: timelineId, loreId } = await params;

  const [{ creation: timeline }, { creation: lore }] = await Promise.all([
    getOwnedCreationPageData(timelineId),
    getOwnedCreationPageData(loreId),
  ]);

  if (normalizeString(timeline?.type).toUpperCase() !== "TIMELINE") {
    notFound();
  }
  if (normalizeString(lore?.type).toUpperCase() !== "LORE") {
    notFound();
  }

  const timelineData = normalizeObject(timeline?.data);
  const timelineDefinition = normalizeTimelineDefinition(timelineData.timeline);
  const isAttached = timelineDefinition.entries.some(
    (entry) => normalizeString(entry?.loreCreationId) === normalizeString(loreId)
  );

  // This route is intentionally stricter than a generic owner Lore reader:
  // both creations must be owned by the current actor (enforced by the owner
  // API read above) AND the Lore must actually be attached to this Timeline.
  if (!isAttached) {
    notFound();
  }

  const document = getLoreDocument(lore);
  const visibility = normalizeString(lore?.visibility).toUpperCase() || "PRIVATE";
  const status = normalizeString(lore?.status).toUpperCase() || "DRAFT";

  return (
    <div className="mx-auto w-full max-w-[112rem] pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/studio/v2/lore/timelines/${encodeURIComponent(timelineId)}`}
          className="cf-btn"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to Timeline
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-1)] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
          <LockKeyhole size={12} aria-hidden="true" /> Owner-only Lore · {visibility} · {status}
        </div>
      </div>

      <LoreDocumentRenderer
        document={document}
        title={normalizeString(lore?.title) || "Untitled Lore"}
        description={normalizeString(lore?.description)}
        parchmentSeed={normalizeString(lore?.id) || normalizeString(loreId)}
      />
    </div>
  );
}
