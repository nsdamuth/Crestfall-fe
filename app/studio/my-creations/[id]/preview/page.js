import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";

import LoreDocumentRenderer from "@/components/studio/create/lore/LoreDocumentRenderer";
import { getEditCreationPageData } from "@/lib/server/studio/getEditCreationPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoreOwnerPreviewPage({ params }) {
  const { id } = await params;
  const { creation } = await getEditCreationPageData(id);

  if (String(creation?.type || "").toUpperCase() !== "LORE") {
    notFound();
  }

  const encodedCreationId = encodeURIComponent(creation.id);
  const editHref = `/studio/my-creations/${encodedCreationId}/edit`;
  const previewHref = `/studio/my-creations/${encodedCreationId}/preview`;
  const document =
    creation.data?.lore_document ||
    creation.data?.loreDocument ||
    {};

  return (
    <section className="pb-12">
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <Link
          href={editHref}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={14} />
          Back to Lore editor
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/5 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          <Eye size={13} />
          Owner-only draft preview
        </div>
      </div>

      <LoreDocumentRenderer
        document={document}
        title={creation.title}
        description={creation.description}
        publicHref={previewHref}
        showTestBanner
        testBannerText="Owner-only saved-draft preview. This route is available only to the Lore owner and does not change the public revision. Public readers receive only an immutable revision that has passed security validation and been explicitly published."
      />
    </section>
  );
}
