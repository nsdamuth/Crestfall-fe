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
          className="cf-btn cf-btn--secondary"
        >
          <Sparkles size={14} />
          Browse templates
        </Link>
      }
      editorContent={
        <CharacterTemplateBuilderEditor {...applicationContentProps} />
      }
    />
  );
}
