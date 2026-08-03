"use client";

import { useState } from "react";

import LoreDocumentRendererView from "@/components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view";
import {
  loreDocumentRendererCompactFixture,
  loreDocumentRendererFixture,
} from "@/components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.fixtures";

function PreviewLink({ href, children, ...props }) {
  return <a {...props} href={href} onClick={(event) => event.preventDefault()}>{children}</a>;
}

function PreviewShareButton({ href, label = "Copy link" }) {
  return (
    <button
      type="button"
      title={href}
      className="rounded-lg border border-[#7b5525]/30 bg-[#7b5525]/5 px-3 py-2 font-display text-[10px] uppercase tracking-[0.16em] text-[#6a481f]"
    >
      {label}
    </button>
  );
}

export default function LoreDocumentRendererPreviewClient() {
  const [compact, setCompact] = useState(false);
  const fixture = compact ? loreDocumentRendererCompactFixture : loreDocumentRendererFixture;

  return (
    <main className="min-h-screen bg-[#efe5d2] px-4 py-8 text-[#2f271f] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-xl border border-[#7b5525]/20 bg-white/40 p-4">
          <button type="button" onClick={() => setCompact((value) => !value)} className="rounded-lg border border-[#7b5525]/30 px-4 py-2 text-xs uppercase tracking-[0.16em]">
            {compact ? "Show Full Reader" : "Show Compact Reader"}
          </button>
        </div>
        <LoreDocumentRendererView
          {...fixture}
          LinkComponent={PreviewLink}
          ShareButtonComponent={PreviewShareButton}
        />
      </div>
    </main>
  );
}
