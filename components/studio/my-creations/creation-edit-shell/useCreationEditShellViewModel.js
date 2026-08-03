"use client";

import { useCallback, useMemo, useState } from "react";

import {
  LOCATION_EDIT_SECTIONS,
  LOCATION_REGISTRY_EDIT_SECTIONS,
  OUTFIT_EDIT_SECTIONS,
  WARDROBE_EDIT_SECTIONS,
  POSE_EDIT_SECTIONS,
  IMAGE_PRESET_EDIT_SECTIONS,
  SCENARIO_EDIT_SECTIONS,
  NARRATOR_EDIT_SECTIONS,
  ROOM_TEMPLATE_EDIT_SECTIONS,
  STORYLINE_EDIT_SECTIONS,
  CHARACTER_TEMPLATE_EDIT_SECTIONS,
  NPC_REGISTRY_EDIT_SECTIONS,
  ITEM_REGISTRY_EDIT_SECTIONS,
  STRUCTURED_REGISTRY_EDIT_SECTIONS,
  MECHANICS_MODULE_EDIT_SECTIONS,
  RULES_CODEX_EDIT_SECTIONS,
  LORE_EDIT_SECTIONS,
  ACTOR_MECHANICS_PROFILE_EDIT_SECTIONS,
  STATS_POOLS_PROFILE_EDIT_SECTIONS,
  PROGRESSION_PROFILE_EDIT_SECTIONS,
  sections,
} from "@/components/studio/my-creations/edit/creationEditConstants";
import { useCreationEditViewModel } from "@/components/studio/my-creations/edit/hooks/useCreationEditViewModel";
import { isStructuredRegistryType } from "@/components/studio/registries/structuredRegistryConfigs";
import { setDefaultPlayerCharacter } from "@/lib/client/studio/profile/defaultPlayerCharacterClient";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";

export const FEATURED_SLOT_INDEX_BY_KEY = {
  primary: 0,
  alt1: 1,
  alt2: 2,
  alt3: 3,
};

export function buildCreationEditTypeFlags({ form = {}, creationId = "" } = {}) {
  const creationType = String(form.type || "").toUpperCase();
  const isCharacter = creationType === "CHARACTER";
  const isPlayerCharacter = creationType === "PLAYER_CHARACTER";

  return {
    creationType,
    isTemplate:
      form.type === "CHARACTER_TEMPLATE" ||
      form.type === "TEMPLATE" ||
      String(creationId || "").includes("template"),
    supportsChatMedia: isChatCapableCreationType(creationType),
    isCharacter,
    isPlayerCharacter,
    canSetDefaultPc: isPlayerCharacter && Boolean(creationId),
    isCharacterLike: isCharacter || isPlayerCharacter,
    isOutfit: creationType === "OUTFIT",
    isWardrobe: creationType === "WARDROBE",
    isLocation: creationType === "LOCATION",
    isPose: creationType === "POSE",
    isImagePreset: creationType === "IMAGE_PRESET",
    isScenario: creationType === "SCENARIO",
    isNarrator: creationType === "NARRATOR",
    isRoomTemplate: creationType === "ROOM_TEMPLATE",
    isStoryline: creationType === "STORYLINE",
    isCharacterTemplate: creationType === "CHARACTER_TEMPLATE",
    isNpcRegistry: creationType === "NPC_REGISTRY",
    isItemRegistry: creationType === "ITEM_REGISTRY",
    isLocationRegistry: creationType === "LOCATION_REGISTRY",
    isMechanicsModule: creationType === "MECHANICS_MODULE",
    isRulesCodex: creationType === "RULES_CODEX",
    isLore: creationType === "LORE",
    isActorMechanicsProfile: creationType === "ACTOR_MECHANICS_PROFILE",
    isStatsPoolsProfile: creationType === "STATS_POOLS_PROFILE",
    isProgressionProfile: creationType === "PROGRESSION_PROFILE",
    isStructuredRegistry: isStructuredRegistryType(creationType),
  };
}

export function resolveCreationEditSections(flags = {}) {
  return flags.isProgressionProfile
    ? PROGRESSION_PROFILE_EDIT_SECTIONS
    : flags.isStatsPoolsProfile
      ? STATS_POOLS_PROFILE_EDIT_SECTIONS
      : flags.isActorMechanicsProfile
        ? ACTOR_MECHANICS_PROFILE_EDIT_SECTIONS
        : flags.isLore
          ? LORE_EDIT_SECTIONS
          : flags.isRulesCodex
            ? RULES_CODEX_EDIT_SECTIONS
            : flags.isMechanicsModule
              ? MECHANICS_MODULE_EDIT_SECTIONS
              : flags.isLocationRegistry
                ? LOCATION_REGISTRY_EDIT_SECTIONS
                : flags.isStructuredRegistry
                  ? STRUCTURED_REGISTRY_EDIT_SECTIONS
                  : flags.isNpcRegistry
                    ? NPC_REGISTRY_EDIT_SECTIONS
                    : flags.isItemRegistry
                      ? ITEM_REGISTRY_EDIT_SECTIONS
                      : flags.isCharacterTemplate
                        ? CHARACTER_TEMPLATE_EDIT_SECTIONS
                        : flags.isStoryline
                          ? STORYLINE_EDIT_SECTIONS
                          : flags.isRoomTemplate
                            ? ROOM_TEMPLATE_EDIT_SECTIONS
                            : flags.isNarrator
                              ? NARRATOR_EDIT_SECTIONS
                              : flags.isScenario
                                ? SCENARIO_EDIT_SECTIONS
                                : flags.isOutfit
                                  ? OUTFIT_EDIT_SECTIONS
                                  : flags.isWardrobe
                                    ? WARDROBE_EDIT_SECTIONS
                                    : flags.isLocation
                                      ? LOCATION_EDIT_SECTIONS
                                      : flags.isPose
                                        ? POSE_EDIT_SECTIONS
                                        : flags.isImagePreset
                                          ? IMAGE_PRESET_EDIT_SECTIONS
                                          : sections;
}

export function useCreationEditShellViewModel({ creationId, creation } = {}) {
  const edit = useCreationEditViewModel({
    creationId,
    creation,
  });
  const [activeSlotPickerKey, setActiveSlotPickerKey] = useState(null);
  const [defaultPcStatus, setDefaultPcStatus] = useState("");
  const [defaultPcError, setDefaultPcError] = useState("");
  const [settingDefaultPc, setSettingDefaultPc] = useState(false);

  const flags = useMemo(
    () =>
      buildCreationEditTypeFlags({
        form: edit.form,
        creationId,
      }),
    [creationId, edit.form]
  );

  const activeSections = useMemo(
    () => resolveCreationEditSections(flags),
    [flags]
  );

  const handleSetDefaultPc = useCallback(async () => {
    if (!flags.canSetDefaultPc || settingDefaultPc) return;

    setDefaultPcStatus("");
    setDefaultPcError("");
    setSettingDefaultPc(true);

    try {
      await setDefaultPlayerCharacter(creationId);
      setDefaultPcStatus("Default Player Character set.");
    } catch (error) {
      setDefaultPcError(
        error?.message || "Default Player Character could not be saved."
      );
    } finally {
      setSettingDefaultPc(false);
    }
  }, [creationId, flags.canSetDefaultPc, settingDefaultPc]);

  const handleFeaturedImageSelected = useCallback(
    ({ slotKey, image } = {}) => {
      edit.updateFeaturedMediaSlot(slotKey, image);

      const nextActiveIndex =
        FEATURED_SLOT_INDEX_BY_KEY[String(slotKey || "").toLowerCase()];

      if (Number.isInteger(nextActiveIndex)) {
        edit.setActiveMediaSlot(nextActiveIndex);
      }

      setActiveSlotPickerKey(null);
    },
    [edit]
  );

  const sectionContentProps = {
    creationId,
    creationType: flags.creationType,
    activeSection: edit.activeSection,
    form: edit.form,
    hasUnsavedChanges: edit.hasUnsavedChanges,
    updateField: edit.updateField,
    updateDataField: edit.updateDataField,
    isTemplate: flags.isTemplate,
    isCharacterLike: flags.isCharacterLike,
    isOutfit: flags.isOutfit,
    isWardrobe: flags.isWardrobe,
    isLocation: flags.isLocation,
    isPose: flags.isPose,
    isImagePreset: flags.isImagePreset,
    isScenario: flags.isScenario,
    isNarrator: flags.isNarrator,
    isRoomTemplate: flags.isRoomTemplate,
    isStoryline: flags.isStoryline,
    isCharacterTemplate: flags.isCharacterTemplate,
    isNpcRegistry: flags.isNpcRegistry,
    isItemRegistry: flags.isItemRegistry,
    isLocationRegistry: flags.isLocationRegistry,
    isMechanicsModule: flags.isMechanicsModule,
    isRulesCodex: flags.isRulesCodex,
    isLore: flags.isLore,
    isActorMechanicsProfile: flags.isActorMechanicsProfile,
    isStatsPoolsProfile: flags.isStatsPoolsProfile,
    isProgressionProfile: flags.isProgressionProfile,
    isStructuredRegistry: flags.isStructuredRegistry,
    reviewStatus: edit.reviewStatus,
    reviewMessage: edit.reviewMessage,
    reviewAction: edit.reviewAction,
    handleSubmitReview: edit.handleSubmitReview,
    archiveStatus: edit.archiveStatus,
    archiveMessage: edit.archiveMessage,
    handleArchive: edit.handleArchive,
    deleteStatus: edit.deleteStatus,
    deleteMessage: edit.deleteMessage,
    handleDelete: edit.handleDelete,
  };

  return {
    viewProps: {
      creationId,
      title: edit.form?.title || "Untitled Creation",
      isTemplate: flags.isTemplate,
      activeSection: edit.activeSection,
      activeSections,
      canSetDefaultPc: flags.canSetDefaultPc,
      settingDefaultPc,
      onSetDefaultPc: handleSetDefaultPc,
      onSelectSection: edit.setActiveSection,
      showMechanicsQuickNav:
        flags.isMechanicsModule && edit.activeSection === "fields",
    },
    mediaPanelProps: {
      creationId,
      form: edit.form,
      activeMediaSlot: edit.activeMediaSlot,
      setActiveMediaSlot: edit.setActiveMediaSlot,
      supportsChatMedia: flags.supportsChatMedia,
      onReplaceSlot: setActiveSlotPickerKey,
    },
    mechanicsQuickNavProps: {
      form: edit.form,
    },
    sectionContentProps,
    stickyActionBarProps: {
      form: edit.form,
      updateField: edit.updateField,
      onSave: edit.handleSave,
      saveStatus: edit.saveStatus,
      saveMessage: edit.saveMessage,
      onOpenPublishing: () => edit.setActiveSection("publishing"),
      onUnlistForEditing: edit.handleUnlistForEditing,
      onCancelReview: edit.handleCancelReview,
      reviewStatus: edit.reviewStatus,
    },
    featuredImagePickerProps: activeSlotPickerKey
      ? {
          creationId,
          slotKey: activeSlotPickerKey,
          onClose: () => setActiveSlotPickerKey(null),
          onSelected: handleFeaturedImageSelected,
        }
      : null,
    defaultPcStatus,
    defaultPcError,
  };
}
