"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import CharacterTemplateBuilderEditor from "./CharacterTemplateBuilderEditor";
import CharacterTemplateBuilderView from "./character-template-builder/CharacterTemplateBuilder.view";
import { useCharacterTemplateBuilderViewModel } from "./character-template-builder/useCharacterTemplateBuilderViewModel";

export default function CharacterTemplateBuilder(props) {
  const { viewProps, applicationContentProps } =
    useCharacterTemplateBuilderViewModel(props);

  return (
    <CharacterTemplateBuilderView
      {...viewProps}
      browseTemplatesContent={
        <Link
          href="/studio/templates/characters"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Sparkles size={14} />
          Browse Templates
        </Link>
      }
      editorContent={
        <CharacterTemplateBuilderEditor {...applicationContentProps} />
      }
    />
  );
}
