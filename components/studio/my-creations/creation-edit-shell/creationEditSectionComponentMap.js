// Registry-as-data, ED1 (docs/plans/FABLE-GATE-2-STUDIO.md, ruling N1
// option A): replaces the 42-guard dispatch chain
// CreationEditSectionContent.jsx used to be. One entry per
// (creationType, sectionId) pair that had a matching arm in the old
// chain, mechanically transcribed: same Component, same props, same
// condition, now data instead of JSX conditionals. A pair absent here
// renders nothing, exactly as an unmatched condition rendered nothing
// before (e.g. ITEM_REGISTRY's "media" section, a known defect ED8
// closes later, not this wave).
import RulesCodexEditor from "@/components/studio/create/rules-codex/RulesCodexEditor";
import LoreEditor from "@/components/studio/create/lore/LoreEditor";
import LoreDocumentRenderer from "@/components/studio/create/lore/LoreDocumentRenderer";
import ActorMechanicsProfileEditor from "@/components/studio/create/actor-mechanics-profile/ActorMechanicsProfileEditor";
import StatsPoolsEditor from "@/components/studio/create/stats-pools/StatsPoolsEditor";
import ProgressionProfileEditor from "@/components/studio/create/progression/ProgressionProfileEditor";
import SkillsProfileEditor from "@/components/studio/create/skills/SkillsProfileEditor";
import AbilitySpellProfileEditor from "@/components/studio/create/ability-spell/AbilitySpellProfileEditor";
import WalletProfileEditor from "@/components/studio/create/wallet/WalletProfileEditor";

import OverviewSection from "@/components/studio/my-creations/edit/sections/OverviewSection";
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

const basicFieldProps = (ctx) => ({ form: ctx.form, updateField: ctx.updateField, updateDataField: ctx.updateDataField });
const dataFieldProps = (ctx) => ({ form: ctx.form, updateDataField: ctx.updateDataField });

function familySection(Component, section) {
  return {
    Component,
    buildProps: (ctx) => ({
      section,
      form: ctx.form,
      updateField: ctx.updateField,
      updateDataField: ctx.updateDataField,
    }),
  };
}

function runtimeModulesEntry({ ownerLabel, defaultInheritanceMode, defaultMechanicsScopeMode }) {
  return {
    Component: RuntimeMechanicsModulesSection,
    buildProps: (ctx) => ({
      form: ctx.form,
      updateDataField: ctx.updateDataField,
      ownerLabel,
      defaultInheritanceMode,
      defaultMechanicsScopeMode,
    }),
  };
}

const CHARACTER_LIKE_SECTIONS = {
  identity: { Component: IdentitySection, buildProps: dataFieldProps },
  appearance: { Component: AppearanceSection, buildProps: dataFieldProps },
  body: { Component: BodySection, buildProps: dataFieldProps },
  behavior: { Component: BehaviorSection, buildProps: dataFieldProps },
  advanced: { Component: AdvancedSection, buildProps: dataFieldProps },
  visualReferences: {
    Component: VisualReferencesSection,
    buildProps: (ctx) => ({ creationId: ctx.creationId, form: ctx.form, updateDataField: ctx.updateDataField }),
  },
  mechanicsProfile: {
    Component: ActorMechanicsProfileAttachmentSection,
    buildProps: (ctx) => ({
      data: ctx.form.data,
      updateDataField: ctx.updateDataField,
      actorType: ctx.creationType,
      actorId: ctx.creationId,
      actorTitle: ctx.form.title || ctx.form.data?.name || "",
    }),
  },
  runtimeModules: runtimeModulesEntry({
    ownerLabel: "this character",
    defaultInheritanceMode: "LOCAL_ONLY",
    defaultMechanicsScopeMode: "BINDING_OWNER",
  }),
};

const STRUCTURED_REGISTRY_SECTION_IDS = ["overview", "entries", "relationships", "rules", "prompt", "review"];
const STRUCTURED_REGISTRY_SECTIONS = Object.fromEntries(
  STRUCTURED_REGISTRY_SECTION_IDS.map((section) => [section, familySection(StructuredRegistryFieldsSection, section)])
);

const NPC_REGISTRY_SECTIONS = {
  overview: familySection(NpcRegistryFieldsSection, "overview"),
  entries: familySection(NpcRegistryFieldsSection, "entries"),
  relationships: familySection(NpcRegistryFieldsSection, "relationships"),
  knowledge: familySection(NpcRegistryFieldsSection, "knowledge"),
  aliases: familySection(NpcRegistryFieldsSection, "aliases"),
};

const ITEM_REGISTRY_SECTIONS = {
  overview: familySection(ItemRegistryFieldsSection, "overview"),
  entries: familySection(ItemRegistryFieldsSection, "entries"),
  associations: familySection(ItemRegistryFieldsSection, "associations"),
  tracking: familySection(ItemRegistryFieldsSection, "tracking"),
  prompt: familySection(ItemRegistryFieldsSection, "prompt"),
  review: familySection(ItemRegistryFieldsSection, "review"),
};

const LOCATION_REGISTRY_SECTION_IDS = ["overview", "entries", "connections", "presence", "weather", "runtime"];
const LOCATION_REGISTRY_SECTIONS = Object.fromEntries(
  LOCATION_REGISTRY_SECTION_IDS.map((section) => [section, familySection(LocationRegistryFieldsSection, section)])
);

const WARDROBE_SECTIONS = {
  entries: familySection(WardrobeFieldsSection, "entries"),
  rules: familySection(WardrobeFieldsSection, "rules"),
};

const CHARACTER_TEMPLATE_SECTION_IDS = ["template", "identity", "appearance", "body", "behavior"];
const CHARACTER_TEMPLATE_SECTIONS = Object.fromEntries(
  CHARACTER_TEMPLATE_SECTION_IDS.map((section) => [section, familySection(CharacterTemplateFieldsSection, section)])
);

// Section registry, keyed by creationType then sectionId. "overview"
// is intentionally absent from every entry here: it is handled as a
// universal default (any type NOT in the four overview-owning
// families below renders OverviewSection), matching the old chain's
// negated condition exactly.
export const SECTION_COMPONENT_REGISTRY = {
  CHARACTER: CHARACTER_LIKE_SECTIONS,
  PLAYER_CHARACTER: CHARACTER_LIKE_SECTIONS,

  OUTFIT: {
    outfit: { Component: OutfitIdentitySection, buildProps: dataFieldProps },
    garment: { Component: OutfitGarmentDesignSection, buildProps: dataFieldProps },
    materials: { Component: OutfitMaterialsDetailsSection, buildProps: dataFieldProps },
    prompt: { Component: OutfitPromptGuidanceSection, buildProps: dataFieldProps },
  },

  WARDROBE: WARDROBE_SECTIONS,

  LOCATION: {
    location: {
      Component: LocationIdentitySection,
      buildProps: (ctx) => ({ form: ctx.form, creationId: ctx.creationId, updateDataField: ctx.updateDataField }),
    },
    visual: { Component: LocationVisualDescriptionSection, buildProps: dataFieldProps },
    atmosphere: { Component: LocationSceneAtmosphereSection, buildProps: dataFieldProps },
    runtimeModules: { Component: LocationRuntimeModulesSection, buildProps: dataFieldProps },
    prompt: { Component: LocationPromptGuidanceSection, buildProps: dataFieldProps },
  },

  POSE: {
    pose: { Component: PoseIdentitySection, buildProps: dataFieldProps },
    bodyPosition: { Component: PoseBodyPositionSection, buildProps: dataFieldProps },
    staging: { Component: PoseMotionStagingSection, buildProps: dataFieldProps },
    prompt: { Component: PosePromptGuidanceSection, buildProps: dataFieldProps },
  },

  IMAGE_PRESET: {
    preset: { Component: ImagePresetIdentitySection, buildProps: dataFieldProps },
    style: { Component: ImagePresetStyleMediumSection, buildProps: dataFieldProps },
    rendering: { Component: ImagePresetRenderingNotesSection, buildProps: dataFieldProps },
    prompt: { Component: ImagePresetPromptStackSection, buildProps: dataFieldProps },
  },

  SCENARIO: {
    scenario: { Component: ScenarioIdentitySection, buildProps: dataFieldProps },
    storyCircle: { Component: ScenarioStoryCircleSection, buildProps: dataFieldProps },
    cast: { Component: ScenarioCastRequirementsSection, buildProps: dataFieldProps },
    middleware: { Component: ScenarioMiddlewareSection, buildProps: dataFieldProps },
    runtime: { Component: ScenarioRuntimeGuidanceSection, buildProps: dataFieldProps },
    runtimeModules: runtimeModulesEntry({
      ownerLabel: "this scenario",
      defaultInheritanceMode: "LOCAL_ONLY",
      defaultMechanicsScopeMode: "STORY_ROOM",
    }),
  },

  NARRATOR: {
    narrator: { Component: NarratorIdentitySection, buildProps: dataFieldProps },
    modules: { Component: NarratorModulesSection, buildProps: dataFieldProps },
    guidance: { Component: NarratorGuidanceSection, buildProps: dataFieldProps },
    runtimeModules: runtimeModulesEntry({
      ownerLabel: "this narrator",
      defaultInheritanceMode: "LOCAL_ONLY",
      defaultMechanicsScopeMode: "STORY_ROOM",
    }),
  },

  ROOM_TEMPLATE: {
    room: { Component: RoomTemplateIdentitySection, buildProps: dataFieldProps },
    package: { Component: RoomTemplatePackageSection, buildProps: dataFieldProps },
    multiplayer: { Component: RoomTemplateMultiplayerSection, buildProps: dataFieldProps },
    opening: { Component: RoomTemplateOpeningSection, buildProps: dataFieldProps },
    runtime: { Component: RoomTemplateRuntimeSection, buildProps: dataFieldProps },
    narrative: { Component: StoryNarrativeRuntimeSection, buildProps: dataFieldProps },
    runtimeModules: runtimeModulesEntry({
      ownerLabel: "this story",
      defaultInheritanceMode: "INHERITABLE",
      defaultMechanicsScopeMode: "STORY_ROOM",
    }),
  },

  STORYLINE: {
    sequence: familySection(StorylineFieldsSection, "sequence"),
    transitions: familySection(StorylineFieldsSection, "transitions"),
    openWorld: familySection(StorylineFieldsSection, "openWorld"),
  },

  CHARACTER_TEMPLATE: CHARACTER_TEMPLATE_SECTIONS,
  NPC_REGISTRY: NPC_REGISTRY_SECTIONS,
  ITEM_REGISTRY: ITEM_REGISTRY_SECTIONS,
  LOCATION_REGISTRY: LOCATION_REGISTRY_SECTIONS,
  FACTION_REGISTRY: STRUCTURED_REGISTRY_SECTIONS,
  ORGANIZATION_REGISTRY: STRUCTURED_REGISTRY_SECTIONS,
  EVENT_REGISTRY: STRUCTURED_REGISTRY_SECTIONS,
  QUEST_REGISTRY: STRUCTURED_REGISTRY_SECTIONS,

  MECHANICS_MODULE: {
    fields: {
      Component: MechanicsModuleFieldsSection,
      buildProps: (ctx) => ({
        form: ctx.form,
        updateDataField: ctx.updateDataField,
        replaceData: (nextData) => ctx.updateField("data", nextData),
      }),
    },
  },

  RULES_CODEX: {
    codex: {
      Component: RulesCodexEditor,
      buildProps: (ctx) => ({
        value: ctx.form.data?.rules_codex || ctx.form.data?.rulesCodex || {},
        onChange: (nextCodex) => ctx.updateDataField("rules_codex", nextCodex),
      }),
    },
  },

  LORE: {
    document: {
      Component: LoreEditor,
      buildProps: (ctx) => ({
        value: ctx.form.data?.lore_document || ctx.form.data?.loreDocument || {},
        onChange: (nextDocument) => ctx.updateDataField("lore_document", nextDocument),
        contentRating: ctx.form.content_rating || ctx.form.contentRating || "SFW",
      }),
    },
    // "preview" is handled specially by CreationEditSectionContent
    // (wrapped in the owner-preview link row), not through this
    // registry; see LORE_PREVIEW_PROPS below for its shared props.
  },

  ACTOR_MECHANICS_PROFILE: {
    profile: {
      Component: ActorMechanicsProfileEditor,
      buildProps: (ctx) => ({
        value:
          ctx.form.data?.actor_mechanics_profile ||
          ctx.form.data?.actorMechanicsProfile ||
          ctx.form.data?.mechanics_loadout ||
          ctx.form.data?.mechanicsLoadout ||
          {},
        onChange: (nextProfile) => ctx.updateDataField("actor_mechanics_profile", nextProfile),
      }),
    },
  },

  STATS_POOLS_PROFILE: {
    statsPools: {
      Component: StatsPoolsEditor,
      buildProps: (ctx) => ({
        value: ctx.form.data?.stats_pools_profile || ctx.form.data?.statsPoolsProfile || {},
        onChange: (nextProfile) => ctx.updateDataField("stats_pools_profile", nextProfile),
      }),
    },
  },

  PROGRESSION_PROFILE: {
    progression: {
      Component: ProgressionProfileEditor,
      buildProps: (ctx) => ({
        value: ctx.form.data?.progression_profile || ctx.form.data?.progressionProfile || {},
        onChange: (nextProfile) => ctx.updateDataField("progression_profile", nextProfile),
      }),
    },
  },

  SKILLS_PROFILE: {
    skills: {
      Component: SkillsProfileEditor,
      buildProps: (ctx) => ({
        value: ctx.form.data?.skills_profile || ctx.form.data?.skillsProfile || {},
        onChange: (nextProfile) => ctx.updateDataField("skills_profile", nextProfile),
      }),
    },
  },

  ABILITY_SPELL_PROFILE: {
    abilitySpell: {
      Component: AbilitySpellProfileEditor,
      buildProps: (ctx) => ({
        value:
          ctx.form.data?.ability_spell_profile ||
          ctx.form.data?.abilitySpellProfile ||
          {},
        onChange: (nextProfile) =>
          ctx.updateDataField("ability_spell_profile", nextProfile),
      }),
    },
  },

  WALLET_PROFILE: {
    wallet: {
      Component: WalletProfileEditor,
      buildProps: (ctx) => ({
        value: ctx.form.data?.wallet_profile || ctx.form.data?.walletProfile || {},
        onChange: (nextProfile) => ctx.updateDataField("wallet_profile", nextProfile),
      }),
    },
  },
};

// A registry entry for (type, "overview") always wins, exactly the
// old chain's negated condition (`!isStructuredRegistry &&
// !isNpcRegistry && !isItemRegistry && !isLocationRegistry`): every
// type above with its own "overview" arm owns it; every other type
// falls through to the generic OverviewSection default below.
export { OverviewSection };

export { LoreDocumentRenderer };

export function buildLorePreviewProps(ctx) {
  return {
    document: ctx.form.data?.lore_document || ctx.form.data?.loreDocument || {},
    title: ctx.form.title,
    description: ctx.form.description,
    showTestBanner: true,
    testBannerText:
      "Editor preview only. This does not make the Lore Asset public. Open the full owner preview to test chapter and section deep links.",
    compact: true,
    parchmentSeed: ctx.creationId || ctx.form.title || "lore-editor-preview",
  };
}
