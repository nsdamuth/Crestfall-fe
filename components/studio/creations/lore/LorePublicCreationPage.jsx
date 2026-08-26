"use client";

import Link from "next/link";
import { ArrowLeft, BookOpenText } from "lucide-react";
import CreationShareButton from "@/components/studio/creations/CreationShareButton";
import CreationStatusBadges from "@/components/studio/creations/CreationStatusBadges";
import LoreDocumentRenderer from "@/components/studio/create/lore/LoreDocumentRenderer";

export default function LorePublicCreationPage({ creation, loadError = null }) {
  if (loadError) {
    return (
      <section className="pb-12">
        <div className="rounded-2xl border border-red-400/25 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
          Lore publication could not be loaded: {loadError}
        </div>
      </section>
    );
  }

  if (!creation) return null;

  const document = creation.data?.lore_document || creation.data?.loreDocument || {};

  return (
    <section className="pb-16">
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3 border-b border-[var(--gold-ornament)]/15 pb-4">
        <Link
          href="/studio/v2/lore"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] hover:text-[var(--ink)]"
        >
          <ArrowLeft size={14} />
          Lore
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <CreationStatusBadges creation={creation} />
          <CreationShareButton
            href={`/studio/creations/${encodeURIComponent(creation.id)}`}
            label="Share"
          />
        </div>
      </div>

      <div className="mx-auto mb-6 max-w-5xl">
        <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
          <BookOpenText size={18} />
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] after:h-px after:w-10 after:bg-[image:var(--grad-rule)]">
            Lore Publication
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
          A structured world record presented as a Crestfall archive document.
        </p>
      </div>

      <LoreDocumentRenderer
        document={document}
        title={creation.title}
        description={creation.description}
        creator={creation.creator}
        publicHref={`/studio/creations/${encodeURIComponent(creation.id)}`}
        parchmentSeed={creation.id}
      />
    </section>
  );
}
