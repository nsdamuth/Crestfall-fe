"use client";

import { useState } from "react";
import Link from "next/link";

import CreationStudioView from "./creation-studio/CreationStudio.view";
import { useCreationStudioViewModel } from "./creation-studio/useCreationStudioViewModel";
import CharacterCreatorModal from "./character/creator-stops/CharacterCreatorModal";

export default function CreationStudioExperience() {
  const viewModel = useCreationStudioViewModel();
  const [isCharacterCreatorOpen, setIsCharacterCreatorOpen] = useState(false);

  return (
    <>
      <CreationStudioView
        {...viewModel}
        LinkComponent={Link}
        onOpenCharacterCreator={() => setIsCharacterCreatorOpen(true)}
      />

      {isCharacterCreatorOpen ? (
        <CharacterCreatorModal
          onClose={() => setIsCharacterCreatorOpen(false)}
        />
      ) : null}
    </>
  );
}
