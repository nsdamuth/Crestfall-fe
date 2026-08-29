"use client";

import StudioPageHeader from "@/components/studio/StudioPageHeader";
import AppearanceStep from "@/components/studio/create/character/AppearanceStep";
import BehaviorStep from "@/components/studio/create/character/BehaviorStep";
import BodyStep from "@/components/studio/create/character/BodyStep";
import CharacterPreview from "@/components/studio/create/character/CharacterPreview";
import CharacterTemplateModal from "@/components/studio/create/character/CharacterTemplateModal";
import IdentityStep from "@/components/studio/create/character/IdentityStep";
import ReviewStep from "@/components/studio/create/character/ReviewStep";
import CharacterCreatorView from "./character-creator/CharacterCreator.view";
import { useCharacterCreatorViewModel } from "./character-creator/useCharacterCreatorViewModel";
import {
  CHARACTER_CREATOR_TYPES,
  normalizeCharacterCreatorType,
} from "./characterCreationMode";

function renderCharacterEditor({
  activeStep,
  form,
  creationType,
  advancedOpen,
  setAdvancedOpen,
  setTemplateModalOpen,
  updateField,
}) {
  if (activeStep === "identity") {
    return (
      <IdentityStep
        form={form}
        updateField={updateField}
        onOpenTemplates={() => setTemplateModalOpen(true)}
      />
    );
  }

  if (activeStep === "appearance") {
    return <AppearanceStep form={form} updateField={updateField} />;
  }

  if (activeStep === "body") {
    return <BodyStep form={form} updateField={updateField} />;
  }

  if (activeStep === "behavior") {
    return <BehaviorStep form={form} updateField={updateField} />;
  }

  if (activeStep === "review") {
    return (
      <ReviewStep
        creationType={creationType}
        form={form}
        updateField={updateField}
        advancedOpen={advancedOpen}
        setAdvancedOpen={setAdvancedOpen}
      />
    );
  }

  return null;
}

export default function CharacterCreator({
  creationType = CHARACTER_CREATOR_TYPES.CHARACTER,
  ...props
} = {}) {
  const normalizedCreationType = normalizeCharacterCreatorType(creationType);
  const isPlayerCharacter =
    normalizedCreationType === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER;
  const { viewProps, applicationContentProps } =
    useCharacterCreatorViewModel({
      ...props,
      creationType: normalizedCreationType,
    });
  const {
    activeStep,
    form,
    advancedOpen,
    templateModalOpen,
    characterTemplates,
    setAdvancedOpen,
    setTemplateModalOpen,
    updateField,
    applyTemplate,
  } = applicationContentProps;

  return (
    <>
      <CharacterCreatorView
        {...viewProps}
        headerContent={
          <StudioPageHeader
            eyebrow="Create"
            title={
              isPlayerCharacter
                ? "Create a Player Character"
                : "Create a Crestfall Character"
            }
            description={
              isPlayerCharacter
                ? "Build the playable identity you bring into Stories. Everything here can be refined later in the shared Character editor."
                : "Shape a legendary character worth adventuring with. Everything here can be refined later from My Creations."
            }
          />
        }
        previewContent={
          <CharacterPreview
            form={form}
            creationType={normalizedCreationType}
          />
        }
        editorContent={renderCharacterEditor({
          activeStep,
          form,
          creationType: normalizedCreationType,
          advancedOpen,
          setAdvancedOpen,
          setTemplateModalOpen,
          updateField,
        })}
      />

      {templateModalOpen ? (
        <CharacterTemplateModal
          templates={characterTemplates}
          onApply={applyTemplate}
          onClose={() => setTemplateModalOpen(false)}
        />
      ) : null}
    </>
  );
}
