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
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
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
