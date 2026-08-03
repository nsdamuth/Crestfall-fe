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

function renderCharacterEditor({
  activeStep,
  form,
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
        form={form}
        updateField={updateField}
        advancedOpen={advancedOpen}
        setAdvancedOpen={setAdvancedOpen}
      />
    );
  }

  return null;
}

export default function CharacterCreator(props) {
  const { viewProps, applicationContentProps } =
    useCharacterCreatorViewModel(props);
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
            title="Create a Crestfall Character"
            description="Shape a legendary character worth adventuring with. Everything here can be refined later from My Creations."
          />
        }
        previewContent={<CharacterPreview form={form} />}
        editorContent={renderCharacterEditor({
          activeStep,
          form,
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
