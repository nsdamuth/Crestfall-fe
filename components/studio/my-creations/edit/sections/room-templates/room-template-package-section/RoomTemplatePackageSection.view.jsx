import { BookOpen, Sparkles, Theater } from "lucide-react";

import SelectedCharactersPanelView from "@/components/studio/create/room-template/selected-characters-panel/SelectedCharactersPanel.view";
import SelectionCardView from "@/components/studio/create/room-template/selection-card/SelectionCard.view";
import RoomTemplatePackagePickerModalView from "@/components/studio/create/room-template/room-template-package-picker/RoomTemplatePackagePickerModal.view";
import ScenarioRecommendationsPanelView from "@/components/studio/room-templates/scenario-recommendations-panel/ScenarioRecommendationsPanel.view";
import StoryOpeningLocationAuthoringView from "@/components/studio/create/room-template/story-opening-location-authoring/StoryOpeningLocationAuthoring.view";
import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

const SELECTION_ICONS = {
  scenario: BookOpen,
  narrator: Theater,
  location: Sparkles,
};

export default function RoomTemplatePackageSectionView({
  sectionEyebrow = "Story Editor",
  sectionTitle = "Story Package",
  sectionDescription = "",
  selectedCharactersPanelProps = {},
  showScenarioRecommendations = false,
  scenarioRecommendationsPanelProps = {},
  selectionCards = [],
  openingLocationProps = {},
  referenceLoadError = "",
  pickerViewProps = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4">
        <SelectedCharactersPanelView {...selectedCharactersPanelProps} />

        {showScenarioRecommendations ? (
          <ScenarioRecommendationsPanelView
            {...scenarioRecommendationsPanelProps}
          />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {selectionCards.map((card) => (
            <SelectionCardView
              key={card.id}
              label={card.label}
              icon={SELECTION_ICONS[card.iconName] || null}
              value={card.value}
              placeholder={card.placeholder}
              onOpen={card.onOpen}
            />
          ))}
        </div>

        <StoryOpeningLocationAuthoringView {...openingLocationProps} />

        {referenceLoadError ? (
          <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--status-danger)]">
            {referenceLoadError}
          </p>
        ) : null}
      </div>

      {pickerViewProps ? (
        <RoomTemplatePackagePickerModalView {...pickerViewProps} />
      ) : null}
    </div>
  );
}
