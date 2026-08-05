"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import RulesCodexEditor from "@/components/studio/create/rules-codex/RulesCodexEditor";
import LoreEditor from "@/components/studio/create/lore/LoreEditor";
import LoreDocumentRenderer from "@/components/studio/create/lore/LoreDocumentRenderer";
import LorePublicationReadiness from "@/components/studio/create/lore/LorePublicationReadiness";
import ActorMechanicsProfileEditor from "@/components/studio/create/actor-mechanics-profile/ActorMechanicsProfileEditor";
import StatsPoolsEditor from "@/components/studio/create/stats-pools/StatsPoolsEditor";
import ProgressionProfileEditor from "@/components/studio/create/progression/ProgressionProfileEditor";

import OverviewSection from "@/components/studio/my-creations/edit/sections/OverviewSection";
import DangerSection from "@/components/studio/my-creations/edit/sections/DangerSection";
import PublishingSection from "@/components/studio/my-creations/edit/sections/PublishingSection";
import IdentitySection from "@/components/studio/my-creations/edit/sections/IdentitySection";
import AppearanceSection from "@/components/studio/my-creations/edit/sections/AppearanceSection";
import BodySection from "@/components/studio/my-creations/edit/sections/BodySection";
import BehaviorSection from "@/components/studio/my-creations/edit/sections/BehaviorSection";
import AdvancedSection from "@/components/studio/my-creations/edit/sections/AdvancedSection";

import OutfitIdentitySection from "@/components/studio/my-creations/edit/sections/outfits/OutfitIdentitySection";
import OutfitGarmentDesignSection from "@/components/studio/my-creations/edit/sections/outfits/OutfitGarmentDesignSection";
import OutfitMaterialsDetailsSection from "@/components/studio/my-creations/edit/sections/outfits/OutfitMaterialsDetailsSection";
import OutfitPromptGuidanceSection from "@/components/studio/my-creations/edit/sections/outfits/OutfitPromptGuidanceSection";

import LocationIdentitySection from "@/components/studio/my-creations/edit/sections/locations/LocationIdentitySection";
import LocationPromptGuidanceSection from "@/components/studio/my-creations/edit/sections/locations/LocationPromptGuidanceSection";
import LocationSceneAtmosphereSection from "@/components/studio/my-creations/edit/sections/locations/LocationSceneAtmosphereSection";
import LocationVisualDescriptionSection from "@/components/studio/my-creations/edit/sections/locations/LocationVisualDescriptionSection";
import LocationRuntimeModulesSection from "@/components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection";

import PoseBodyPositionSection from "@/components/studio/my-creations/edit/sections/poses/PoseBodyPositionSection";
import PoseIdentitySection from "@/components/studio/my-creations/edit/sections/poses/PoseIdentitySection";
import PoseMotionStagingSection from "@/components/studio/my-creations/edit/sections/poses/PoseMotionStagingSection";
import PosePromptGuidanceSection from "@/components/studio/my-creations/edit/sections/poses/PosePromptGuidanceSection";

import ImagePresetIdentitySection from "@/components/studio/my-creations/edit/sections/image-presets/ImagePresetIdentitySection";
import ImagePresetPromptStackSection from "@/components/studio/my-creations/edit/sections/image-presets/ImagePresetPromptStackSection";
import ImagePresetRenderingNotesSection from "@/components/studio/my-creations/edit/sections/image-presets/ImagePresetRenderingNotesSection";
import ImagePresetStyleMediumSection from "@/components/studio/my-creations/edit/sections/image-presets/ImagePresetStyleMediumSection";

import ScenarioCastRequirementsSection from "@/components/studio/my-creations/edit/sections/scenarios/ScenarioCastRequirementsSection";
import ScenarioIdentitySection from "@/components/studio/my-creations/edit/sections/scenarios/ScenarioIdentitySection";
import ScenarioMiddlewareSection from "@/components/studio/my-creations/edit/sections/scenarios/ScenarioMiddlewareSection";
import ScenarioRuntimeGuidanceSection from "@/components/studio/my-creations/edit/sections/scenarios/ScenarioRuntimeGuidanceSection";
import ScenarioStoryCircleSection from "@/components/studio/my-creations/edit/sections/scenarios/ScenarioStoryCircleSection";

import NarratorGuidanceSection from "@/components/studio/my-creations/edit/sections/narrators/NarratorGuidanceSection";
import NarratorIdentitySection from "@/components/studio/my-creations/edit/sections/narrators/NarratorIdentitySection";
import NarratorModulesSection from "@/components/studio/my-creations/edit/sections/narrators/NarratorModulesSection";

import RoomTemplateIdentitySection from "@/components/studio/my-creations/edit/sections/room-templates/RoomTemplateIdentitySection";
import RoomTemplatePackageSection from "@/components/studio/my-creations/edit/sections/room-templates/RoomTemplatePackageSection";
import RoomTemplateMultiplayerSection from "@/components/studio/my-creations/edit/sections/room-templates/RoomTemplateMultiplayerSection";
import RoomTemplateOpeningSection from "@/components/studio/my-creations/edit/sections/room-templates/RoomTemplateOpeningSection";
import RoomTemplateRuntimeSection from "@/components/studio/my-creations/edit/sections/room-templates/RoomTemplateRuntimeSection";
import StoryNarrativeRuntimeSection from "@/components/studio/my-creations/edit/sections/room-templates/StoryNarrativeRuntimeSection";
import StorylineFieldsSection from "@/components/studio/my-creations/edit/sections/storylines/StorylineFieldsSection";

import CharacterTemplateFieldsSection from "@/components/studio/my-creations/edit/sections/character-templates/CharacterTemplateFieldsSection";
import NpcRegistryFieldsSection from "@/components/studio/my-creations/edit/sections/npc-registries/NpcRegistryFieldsSection";
import ItemRegistryFieldsSection from "@/components/studio/my-creations/edit/sections/item-registries/ItemRegistryFieldsSection";
import LocationRegistryFieldsSection from "@/components/studio/my-creations/edit/sections/location-registries/LocationRegistryFieldsSection";
import VisualReferencesSection from "@/components/studio/my-creations/edit/sections/VisualReferencesSection";
import WardrobeFieldsSection from "@/components/studio/my-creations/edit/sections/wardrobes/WardrobeFieldsSection";
import StructuredRegistryFieldsSection from "@/components/studio/my-creations/edit/sections/structured-registries/StructuredRegistryFieldsSection";
import MechanicsModuleFieldsSection from "@/components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection";
import RuntimeMechanicsModulesSection from "@/components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection";
import ActorMechanicsProfileAttachmentSection from "@/components/studio/characters/ActorMechanicsProfileAttachmentSection";

export default function CreationEditSectionContent({
  creationId,
  creationType,
  activeSection,
  form,
  hasUnsavedChanges = false,
  updateField,
  updateDataField,
  isTemplate,
  isCharacterLike,
  isOutfit,
  isWardrobe,
  isLocation,
  isPose,
  isImagePreset,
  isScenario,
  isNarrator,
  isRoomTemplate,
  isStoryline,
  isCharacterTemplate,
  isNpcRegistry,
  isItemRegistry,
  isLocationRegistry,
  isMechanicsModule,
  isRulesCodex,
  isLore,
  isActorMechanicsProfile,
  isStatsPoolsProfile,
  isProgressionProfile,
  isStructuredRegistry,
  reviewStatus,
  reviewMessage,
  reviewAction,
  handleSubmitReview,
  archiveStatus,
  archiveMessage,
  handleArchive,
  deleteStatus,
  deleteMessage,
  handleDelete,
}) {
  return (
    <>
      {isNpcRegistry && activeSection === "overview" ? (
        <NpcRegistryFieldsSection
          section="overview"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {!isStructuredRegistry &&
        !isNpcRegistry &&
        !isItemRegistry &&
        !isLocationRegistry &&
        activeSection === "overview" ? (
          <OverviewSection form={form} updateField={updateField} />
      ) : null}
      {isNarrator && activeSection === "narrator" ? (
        <NarratorIdentitySection form={form} updateDataField={updateDataField} />
      ) : null}

      {isNarrator && activeSection === "modules" ? (
        <NarratorModulesSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isNarrator && activeSection === "guidance" ? (
        <NarratorGuidanceSection form={form} updateDataField={updateDataField} />
      ) : null}
      {isScenario && activeSection === "scenario" ? (
        <ScenarioIdentitySection form={form} updateDataField={updateDataField} />
      ) : null}

      {isScenario && activeSection === "storyCircle" ? (
        <ScenarioStoryCircleSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isRoomTemplate && activeSection === "room" ? (
        <RoomTemplateIdentitySection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isRoomTemplate && activeSection === "package" ? (
        <RoomTemplatePackageSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isRoomTemplate && activeSection === "multiplayer" ? (
        <RoomTemplateMultiplayerSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isRoomTemplate && activeSection === "opening" ? (
        <RoomTemplateOpeningSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isRoomTemplate && activeSection === "runtime" ? (
        <RoomTemplateRuntimeSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}
      {isRoomTemplate && activeSection === "narrative" ? (
        <StoryNarrativeRuntimeSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isStoryline && ["sequence", "transitions", "openWorld"].includes(activeSection) ? (
        <StorylineFieldsSection
          section={activeSection}
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}
      {isCharacterTemplate && activeSection === "template" ? (
        <CharacterTemplateFieldsSection
          section="template"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isCharacterTemplate && activeSection === "identity" ? (
        <CharacterTemplateFieldsSection
          section="identity"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isCharacterTemplate && activeSection === "appearance" ? (
        <CharacterTemplateFieldsSection
          section="appearance"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}
      {isCharacterLike && activeSection === "visualReferences" ? (
        <VisualReferencesSection
          creationId={creationId}
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}
      {isCharacterTemplate && activeSection === "body" ? (
        <CharacterTemplateFieldsSection
          section="body"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isCharacterTemplate && activeSection === "behavior" ? (
        <CharacterTemplateFieldsSection
          section="behavior"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}
      {isStructuredRegistry &&
        ["overview", "entries", "relationships", "rules", "prompt", "review"].includes(
          activeSection
        ) ? (
          <StructuredRegistryFieldsSection
            section={activeSection}
            form={form}
            updateField={updateField}
            updateDataField={updateDataField}
          />
        ) : null}
      {isNpcRegistry && activeSection === "entries" ? (
        <NpcRegistryFieldsSection
          section="entries"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}
      {isLocationRegistry &&
        [
          "overview",
          "entries",
          "connections",
          "presence",
          "weather",
          "runtime",
        ].includes(activeSection) ? (
          <LocationRegistryFieldsSection
            section={activeSection}
            form={form}
            updateField={updateField}
            updateDataField={updateDataField}
          />
      ) : null}
      {isNpcRegistry && activeSection === "relationships" ? (
        <NpcRegistryFieldsSection
          section="relationships"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isNpcRegistry && activeSection === "knowledge" ? (
        <NpcRegistryFieldsSection
          section="knowledge"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isNpcRegistry && activeSection === "aliases" ? (
        <NpcRegistryFieldsSection
          section="aliases"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}
      {isItemRegistry && activeSection === "overview" ? (
        <ItemRegistryFieldsSection
          section="overview"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isItemRegistry && activeSection === "entries" ? (
        <ItemRegistryFieldsSection
          section="entries"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isItemRegistry && activeSection === "associations" ? (
        <ItemRegistryFieldsSection
          section="associations"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isItemRegistry && activeSection === "tracking" ? (
        <ItemRegistryFieldsSection
          section="tracking"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isItemRegistry && activeSection === "prompt" ? (
        <ItemRegistryFieldsSection
          section="prompt"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isItemRegistry && activeSection === "review" ? (
        <ItemRegistryFieldsSection
          section="review"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}
      {isScenario && activeSection === "cast" ? (
        <ScenarioCastRequirementsSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isScenario && activeSection === "middleware" ? (
        <ScenarioMiddlewareSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isScenario && activeSection === "runtime" ? (
        <ScenarioRuntimeGuidanceSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}
      {isOutfit && activeSection === "outfit" ? (
          <OutfitIdentitySection form={form} updateDataField={updateDataField} />
        ) : null}

        {isOutfit && activeSection === "garment" ? (
          <OutfitGarmentDesignSection
            form={form}
            updateDataField={updateDataField}
          />
        ) : null}

        {isOutfit && activeSection === "materials" ? (
          <OutfitMaterialsDetailsSection
            form={form}
            updateDataField={updateDataField}
          />
        ) : null}

        {isOutfit && activeSection === "prompt" ? (
          <OutfitPromptGuidanceSection
            form={form}
            updateDataField={updateDataField}
          />
        ) : null}
        {isWardrobe && activeSection === "entries" ? (
        <WardrobeFieldsSection
          section="entries"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isWardrobe && activeSection === "rules" ? (
        <WardrobeFieldsSection
          section="rules"
          form={form}
          updateField={updateField}
          updateDataField={updateDataField}
        />
      ) : null}

      {isCharacterLike && activeSection === "identity" ? (
        <IdentitySection form={form} updateDataField={updateDataField} />
      ) : null}

      {isCharacterLike && activeSection === "appearance" ? (
        <AppearanceSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isCharacterLike && activeSection === "body" ? (
        <BodySection form={form} updateDataField={updateDataField} />
      ) : null}

      {isCharacterLike && activeSection === "behavior" ? (
        <BehaviorSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isCharacterLike && activeSection === "advanced" ? (
        <AdvancedSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isLocation && activeSection === "location" ? (
        <LocationIdentitySection
          form={form}
          creationId={creationId}
          updateDataField={updateDataField}
        />
      ) : null}

      {isLocation && activeSection === "visual" ? (
        <LocationVisualDescriptionSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isLocation && activeSection === "atmosphere" ? (
        <LocationSceneAtmosphereSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}
      {isLocation && activeSection === "runtimeModules" ? (
        <LocationRuntimeModulesSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}
      {isLocation && activeSection === "prompt" ? (
        <LocationPromptGuidanceSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isPose && activeSection === "pose" ? (
        <PoseIdentitySection form={form} updateDataField={updateDataField} />
      ) : null}

      {isPose && activeSection === "bodyPosition" ? (
        <PoseBodyPositionSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isPose && activeSection === "staging" ? (
        <PoseMotionStagingSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isPose && activeSection === "prompt" ? (
        <PosePromptGuidanceSection form={form} updateDataField={updateDataField} />
      ) : null}

      {isImagePreset && activeSection === "preset" ? (
        <ImagePresetIdentitySection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isImagePreset && activeSection === "style" ? (
        <ImagePresetStyleMediumSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isImagePreset && activeSection === "rendering" ? (
        <ImagePresetRenderingNotesSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}

      {isImagePreset && activeSection === "prompt" ? (
        <ImagePresetPromptStackSection
          form={form}
          updateDataField={updateDataField}
        />
      ) : null}
      {isMechanicsModule && activeSection === "fields" ? (
        <MechanicsModuleFieldsSection
          form={form}
          updateDataField={updateDataField}
          replaceData={(nextData) =>
            updateField("data", nextData)
          }
        />
      ) : null}
      {isRulesCodex && activeSection === "codex" ? (
        <RulesCodexEditor
          value={
            form.data?.rules_codex ||
            form.data?.rulesCodex ||
            {}
          }
          onChange={(nextCodex) =>
            updateDataField("rules_codex", nextCodex)
          }
        />
      ) : null}
      {isLore && activeSection === "document" ? (
        <LoreEditor
          value={
            form.data?.lore_document ||
            form.data?.loreDocument ||
            {}
          }
          onChange={(nextDocument) =>
            updateDataField("lore_document", nextDocument)
          }
          contentRating={
            form.content_rating || form.contentRating || "SFW"
          }
        />
      ) : null}
      {isLore && activeSection === "preview" ? (
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm leading-6 text-[var(--ink-dim)]">
              The full owner preview uses the last saved draft. Save changes
              before opening it.
            </p>

            <Link
              href={`/studio/my-creations/${encodeURIComponent(
                creationId
              )}/preview`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/5 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:border-[var(--gold-ornament)]/55 hover:text-[var(--ink)]"
            >
              <ExternalLink size={14} />
              Open full owner preview
            </Link>
          </div>

          <LoreDocumentRenderer
            document={
              form.data?.lore_document ||
              form.data?.loreDocument ||
              {}
            }
            title={form.title}
            description={form.description}
            showTestBanner
            testBannerText="Editor preview only. This does not make the Lore Asset public. Open the full owner preview to test chapter and section deep links."
            compact
          />
        </div>
      ) : null}
      {isActorMechanicsProfile && activeSection === "profile" ? (
        <ActorMechanicsProfileEditor
          value={
            form.data?.actor_mechanics_profile ||
            form.data?.actorMechanicsProfile ||
            form.data?.mechanics_loadout ||
            form.data?.mechanicsLoadout ||
            {}
          }
          onChange={(nextProfile) =>
            updateDataField("actor_mechanics_profile", nextProfile)
          }
        />
      ) : null}
      {isStatsPoolsProfile && activeSection === "statsPools" ? (
        <StatsPoolsEditor
          value={
            form.data?.stats_pools_profile ||
            form.data?.statsPoolsProfile ||
            {}
          }
          onChange={(nextProfile) =>
            updateDataField("stats_pools_profile", nextProfile)
          }
        />
      ) : null}
      {isProgressionProfile && activeSection === "progression" ? (
        <ProgressionProfileEditor
          value={
            form.data?.progression_profile ||
            form.data?.progressionProfile ||
            {}
          }
          onChange={(nextProfile) =>
            updateDataField("progression_profile", nextProfile)
          }
        />
      ) : null}
      {isCharacterLike && activeSection === "mechanicsProfile" ? (
        <ActorMechanicsProfileAttachmentSection
          data={form.data}
          updateDataField={updateDataField}
          actorType={creationType}
          actorId={creationId}
          actorTitle={form.title || form.data?.name || ""}
        />
      ) : null}

      {isCharacterLike && activeSection === "runtimeModules" ? (
        <RuntimeMechanicsModulesSection
          form={form}
          updateDataField={updateDataField}
          ownerLabel="this character"
          defaultInheritanceMode="LOCAL_ONLY"
          defaultMechanicsScopeMode="BINDING_OWNER"
        />
      ) : null}

      {isScenario && activeSection === "runtimeModules" ? (
        <RuntimeMechanicsModulesSection
          form={form}
          updateDataField={updateDataField}
          ownerLabel="this scenario"
          defaultInheritanceMode="LOCAL_ONLY"
          defaultMechanicsScopeMode="STORY_ROOM"
        />
      ) : null}

      {isNarrator && activeSection === "runtimeModules" ? (
        <RuntimeMechanicsModulesSection
          form={form}
          updateDataField={updateDataField}
          ownerLabel="this narrator"
          defaultInheritanceMode="LOCAL_ONLY"
          defaultMechanicsScopeMode="STORY_ROOM"
        />
      ) : null}

      {isRoomTemplate && activeSection === "runtimeModules" ? (
        <RuntimeMechanicsModulesSection
          form={form}
          updateDataField={updateDataField}
          ownerLabel="this story"
          defaultInheritanceMode="INHERITABLE"
          defaultMechanicsScopeMode="STORY_ROOM"
        />
      ) : null}
      {activeSection === "publishing" ? (
        isLore ? (
          <LorePublicationReadiness
            form={form}
            creationId={creationId}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        ) : (
          <PublishingSection
            form={form}
            updateField={updateField}
            isTemplate={isTemplate}
            onSubmitPublicReview={() => handleSubmitReview("PUBLIC")}
            onSubmitCanonReview={() => handleSubmitReview("CANON")}
            reviewStatus={reviewStatus}
            reviewMessage={reviewMessage}
            reviewAction={reviewAction}
          />
        )
      ) : null}

      {activeSection === "danger" ? (
        <DangerSection
          form={form}
          onArchive={handleArchive}
          archiveStatus={archiveStatus}
          archiveMessage={archiveMessage}
          onDelete={handleDelete}
          deleteStatus={deleteStatus}
          deleteMessage={deleteMessage}
        />
      ) : null}
    </>
  );
}
