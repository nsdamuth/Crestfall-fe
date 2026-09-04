"use client";

import { useEffect, useMemo, useState } from "react";

import {
  commitStoryAbilitySpellCharacterConfiguration,
  commitStorySkillsCharacterConfiguration,
  commitStoryStatsPoolsCharacterConfiguration,
  fetchStoryAbilitySpellCharacterConfiguration,
  fetchStoryRoom,
  fetchStorySkillsCharacterConfiguration,
  fetchStoryStatsPoolsCharacterConfiguration,
} from "@/lib/client/studio/story-rooms/storyRoomClient";
import {
  getStoryPlayerActorConfigurationDescriptor,
  isStoryPlayerActorConfigurationRequired,
} from "@/lib/shared/story-rooms/storyPlayerActorConfigurationContract";
import { buildStoryChatHref } from "@/lib/shared/story-rooms/storyRoomRouteAuthority";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveChoiceInputMode(mode, options = []) {
  const normalized = String(mode || "").trim().toUpperCase();
  if (normalized && normalized !== "AUTO") return normalized;
  return normalizeArray(options).length ? "FIXED_LIST" : "FREE_ENTRY";
}

function choiceValueValid({ value, options = [], inputMode = "AUTO", visible = true }) {
  if (!visible) return true;
  const mode = resolveChoiceInputMode(inputMode, options);
  if (mode !== "FIXED_LIST") return true;
  return normalizeArray(options).includes(String(value || "GENERAL").toUpperCase());
}

function customFieldValueValid(field = {}, value = "") {
  const normalizedValue = String(value || "");
  if (field?.required === true && !normalizedValue.trim()) return false;
  if (normalizedValue.length > normalizeNumber(field?.maxLength, 4000)) return false;
  const inputMode = String(field?.inputMode || "LONG_TEXT").toUpperCase();
  if (inputMode === "SINGLE_SELECT" && normalizedValue) {
    return normalizeArray(field?.options).includes(normalizedValue);
  }
  return true;
}

function buildAllocationDraft(statsConfiguration) {
  const draft = {};
  for (const profile of normalizeArray(statsConfiguration?.profiles)) {
    const bindingId = String(profile?.bindingId || "").trim();
    if (!bindingId) continue;
    draft[bindingId] = {};
    for (const stat of normalizeArray(profile?.configuration?.statValues)) {
      const definitionId = String(stat?.definitionId || "").trim();
      if (!definitionId) continue;
      draft[bindingId][definitionId] = stat?.configuredValue ?? stat?.defaultValue ?? 0;
    }
  }
  return draft;
}

function projectStatsProfiles(statsConfiguration, allocationDraft) {
  return normalizeArray(statsConfiguration?.profiles).map((profile) => {
    const bindingId = String(profile?.bindingId || "");
    const configuration = profile?.configuration || {};
    const statValues = normalizeArray(configuration.statValues).map((stat) => {
      const value = normalizeNumber(
        allocationDraft?.[bindingId]?.[stat.definitionId],
        normalizeNumber(stat.configuredValue, normalizeNumber(stat.defaultValue, 0))
      );
      const defaultValue = normalizeNumber(stat.defaultValue, 0);
      return {
        ...stat,
        configuredValue: value,
        spentPoints: Math.max(0, value - defaultValue),
      };
    });
    const spent = statValues.reduce(
      (total, stat) => total + normalizeNumber(stat.spentPoints, 0),
      0
    );
    const budget = normalizeNumber(configuration.budget, 0);
    const remaining = Math.max(0, budget - spent);
    const invalid = statValues.some(
      (stat) =>
        stat.configuredValue < normalizeNumber(stat.defaultValue, 0) ||
        (stat.maximum !== null &&
          stat.maximum !== undefined &&
          stat.configuredValue > normalizeNumber(stat.maximum, stat.configuredValue))
    );
    const ready =
      String(configuration.mode || "").toUpperCase() !== "POINT_BUDGET" ||
      (!invalid &&
        spent <= budget &&
        (!configuration.requireFullySpent || remaining === 0));

    return {
      ...profile,
      configuration: {
        ...configuration,
        statValues,
        spent,
        remaining,
      },
      clientReady: ready,
    };
  });
}

function buildSkillSelectionDraft(skillsConfiguration) {
  const draft = {};
  for (const profile of normalizeArray(skillsConfiguration?.profiles)) {
    const bindingId = String(profile?.bindingId || "").trim();
    if (!bindingId) continue;
    draft[bindingId] = {};
    for (const slot of normalizeArray(profile?.configuration?.slots)) {
      const slotId = String(slot?.id || "").trim();
      if (!slotId) continue;
      draft[bindingId][slotId] = String(slot?.selectedSkillId || "").trim();
    }
  }
  return draft;
}

function projectSkillProfiles(skillsConfiguration, selectionDraft) {
  return normalizeArray(skillsConfiguration?.profiles).map((profile) => {
    const bindingId = String(profile?.bindingId || "");
    const configuration = profile?.configuration || {};
    const skills = normalizeArray(profile?.skills);
    const slots = normalizeArray(configuration.slots).map((slot) => {
      const selectedSkillId = String(
        selectionDraft?.[bindingId]?.[slot.id] ?? slot.selectedSkillId ?? ""
      ).trim();
      const eligibleSkills = skills.filter(
        (skill) => normalizeNumber(skill?.maximumRank, 0) >= normalizeNumber(slot?.targetRank, 0)
      );
      const selectedDefinition = eligibleSkills.find(
        (skill) => String(skill?.id || "") === selectedSkillId
      );
      return {
        ...slot,
        selectedSkillId,
        eligibleSkills,
        selectionValid: !selectedSkillId || Boolean(selectedDefinition),
      };
    });
    const selectedIds = slots
      .map((slot) => slot.selectedSkillId)
      .filter(Boolean);
    const duplicateSelection =
      Boolean(configuration.requireUniqueSkills) &&
      new Set(selectedIds).size !== selectedIds.length;
    const missingRequired = slots.some(
      (slot) => slot?.required === true && !slot.selectedSkillId
    );
    const invalidSelection = slots.some((slot) => slot.selectionValid === false);
    const mode = String(configuration.mode || "").toUpperCase();
    const clientReady =
      mode !== "SLOTS" || (!duplicateSelection && !missingRequired && !invalidSelection);

    return {
      ...profile,
      configuration: {
        ...configuration,
        slots,
      },
      duplicateSelection,
      clientReady,
    };
  });
}

function buildAbilitySpellSelectionDraft(abilitySpellConfiguration) {
  const draft = {};
  for (const profile of normalizeArray(abilitySpellConfiguration?.profiles)) {
    const profileId = String(profile?.profileId || "").trim();
    if (!profileId) continue;
    draft[profileId] = {};
    for (const group of normalizeArray(profile?.configuration?.groups)) {
      const groupId = String(group?.id || "").trim();
      if (!groupId) continue;
      draft[profileId][groupId] = normalizeArray(group?.selectedDefinitionIds)
        .map((value) => String(value || "").trim())
        .filter(Boolean);
    }
  }
  return draft;
}

function buildRoomLocalDefinitionDraft(group = {}, index = 0) {
  const typeOptions = normalizeArray(group.typeOptions);
  const schoolOptions = normalizeArray(group.schoolOptions);
  const categoryOptions = normalizeArray(group.categoryOptions);
  const schoolInputMode = resolveChoiceInputMode(group.schoolInputMode, schoolOptions);
  const categoryInputMode = resolveChoiceInputMode(group.categoryInputMode, categoryOptions);
  return {
    draftId: `draft-${String(group.id || "definition")}-${index + 1}`,
    groupId: String(group.id || "").trim(),
    title: "",
    type: String(typeOptions[0] || "ABILITY").toUpperCase(),
    school: String(
      ["FIXED_LIST", "LIST_PLUS_CUSTOM"].includes(schoolInputMode)
        ? schoolOptions[0] || "GENERAL"
        : "GENERAL"
    ).toUpperCase(),
    category: String(
      ["FIXED_LIST", "LIST_PLUS_CUSTOM"].includes(categoryInputMode)
        ? categoryOptions[0] || "GENERAL"
        : "GENERAL"
    ).toUpperCase(),
    description: "",
    narrativeDescription: "",
    customText: {},
  };
}

function buildAbilitySpellAuthoringDraft(abilitySpellConfiguration) {
  const draft = {};
  for (const profile of normalizeArray(abilitySpellConfiguration?.profiles)) {
    const profileId = String(profile?.profileId || "").trim();
    if (!profileId) continue;
    const authoring = profile?.configuration?.roomLocalDefinitionAuthoring || {};
    const definitions = normalizeArray(authoring.authoredDefinitions).map((entry) => ({
      draftId: String(entry?.draftId || entry?.id || "").trim(),
      groupId: String(entry?.groupId || "").trim(),
      title: String(entry?.title || ""),
      type: String(entry?.type || "ABILITY").toUpperCase(),
      school: String(entry?.school || "GENERAL").toUpperCase(),
      category: String(entry?.category || "GENERAL").toUpperCase(),
      description: String(entry?.description || ""),
      narrativeDescription: String(entry?.narrativeDescription || ""),
      customText:
        entry?.customText && typeof entry.customText === "object" && !Array.isArray(entry.customText)
          ? { ...entry.customText }
          : {},
    }));
    for (const group of normalizeArray(authoring.groups)) {
      const minimumDefinitions = Math.max(0, normalizeNumber(group?.minimumDefinitions, 0));
      let groupCount = definitions.filter(
        (entry) => String(entry.groupId || "") === String(group?.id || "")
      ).length;
      while (groupCount < minimumDefinitions) {
        definitions.push(buildRoomLocalDefinitionDraft(group, groupCount));
        groupCount += 1;
      }
    }
    draft[profileId] = definitions;
  }
  return draft;
}

function projectRoomLocalDefinitionAuthoring(configuration = {}, authoredDraft = []) {
  const source = configuration?.roomLocalDefinitionAuthoring || {};
  const mode = String(source.mode || "").toUpperCase();
  if (mode !== "GROUPS") {
    return {
      ...source,
      groups: normalizeArray(source.groups),
      authoredDefinitions: [],
      duplicateTitle: false,
      clientReady: true,
    };
  }

  const authoredDefinitions = normalizeArray(authoredDraft).map((entry) => ({
    ...entry,
    title: String(entry?.title || ""),
    type: String(entry?.type || "ABILITY").toUpperCase(),
    school: String(entry?.school || "GENERAL").toUpperCase(),
    category: String(entry?.category || "GENERAL").toUpperCase(),
    description: String(entry?.description || ""),
    narrativeDescription: String(entry?.narrativeDescription || ""),
    customText:
      entry?.customText && typeof entry.customText === "object" && !Array.isArray(entry.customText)
        ? entry.customText
        : {},
  }));
  const titleKeys = authoredDefinitions
    .map((entry) => String(entry.title || "").trim().toLowerCase())
    .filter(Boolean);
  const duplicateTitle =
    Boolean(source.requireUniqueTitles) && new Set(titleKeys).size !== titleKeys.length;

  const groups = normalizeArray(source.groups).map((group) => {
    const groupId = String(group?.id || "");
    const definitions = authoredDefinitions.filter(
      (entry) => String(entry?.groupId || "") === groupId
    );
    const minimumDefinitions = Math.max(0, normalizeNumber(group?.minimumDefinitions, 0));
    const maximumDefinitions = Math.max(
      minimumDefinitions,
      normalizeNumber(group?.maximumDefinitions, minimumDefinitions)
    );
    const allowedTypes = normalizeArray(group?.allowedTypes).map((value) =>
      String(value || "").toUpperCase()
    );
    const allowedSchools = normalizeArray(group?.allowedSchools).map((value) =>
      String(value || "").toUpperCase()
    );
    const allowedCategories = normalizeArray(group?.allowedCategories).map((value) =>
      String(value || "").toUpperCase()
    );
    const requiredFields = new Set(
      normalizeArray(group?.requiredFields).map((value) => String(value || "").toUpperCase())
    );
    const incompleteDefinition = definitions.some((entry) => {
      if (!String(entry?.title || "").trim()) return true;
      if (allowedTypes.length && !allowedTypes.includes(String(entry?.type || "").toUpperCase())) {
        return true;
      }
      if (!choiceValueValid({
        value: entry?.school,
        options: allowedSchools,
        inputMode: group?.schoolInputMode,
        visible: group?.showSchool !== false,
      })) {
        return true;
      }
      if (!choiceValueValid({
        value: entry?.category,
        options: allowedCategories,
        inputMode: group?.categoryInputMode,
        visible: group?.showCategory !== false,
      })) {
        return true;
      }
      if (
        group?.showDescription !== false &&
        requiredFields.has("DESCRIPTION") &&
        !String(entry?.description || "").trim()
      ) {
        return true;
      }
      if (
        group?.showNarrativeDescription !== false &&
        requiredFields.has("NARRATIVE_DESCRIPTION") &&
        !String(entry?.narrativeDescription || "").trim()
      ) {
        return true;
      }
      return normalizeArray(group?.customTextFields).some((field) =>
        !customFieldValueValid(field, entry?.customText?.[field?.id])
      );
    });
    const schools = new Set(
      definitions.map((entry) => String(entry?.school || "GENERAL").toUpperCase())
    );
    const sameSchoolInvalid =
      Boolean(group?.requireSameSchool) && group?.showSchool !== false && schools.size > 1;
    const countInvalid =
      definitions.length < minimumDefinitions || definitions.length > maximumDefinitions;
    return {
      ...group,
      minimumDefinitions,
      maximumDefinitions,
      authoredDefinitions: definitions,
      countInvalid,
      incompleteDefinition,
      sameSchoolInvalid,
      clientReady: !countInvalid && !incompleteDefinition && !sameSchoolInvalid,
    };
  });

  return {
    ...source,
    groups,
    authoredDefinitions,
    duplicateTitle,
    clientReady: !duplicateTitle && groups.every((group) => group.clientReady),
  };
}

function projectAbilitySpellProfiles(abilitySpellConfiguration, selectionDraft, authoringDraft) {
  return normalizeArray(abilitySpellConfiguration?.profiles).map((profile) => {
    const profileId = String(profile?.profileId || "");
    const configuration = profile?.configuration || {};
    const groups = normalizeArray(configuration.groups).map((group) => {
      const eligibleDefinitions = normalizeArray(group?.eligibleDefinitions);
      const eligibleIds = new Set(eligibleDefinitions.map((definition) => String(definition?.id || "")));
      const selectedDefinitionIds = normalizeArray(
        selectionDraft?.[profileId]?.[group.id] ?? group.selectedDefinitionIds
      )
        .map((value) => String(value || "").trim())
        .filter(Boolean);
      const invalidSelection = selectedDefinitionIds.some((definitionId) => !eligibleIds.has(definitionId));
      const selectedDefinitions = selectedDefinitionIds
        .map((definitionId) => eligibleDefinitions.find((definition) => String(definition?.id || "") === definitionId))
        .filter(Boolean);
      const schools = new Set(
        selectedDefinitions.map((definition) => String(definition?.school || "GENERAL").toUpperCase())
      );
      const sameSchoolInvalid = Boolean(group?.requireSameSchool) && schools.size > 1;
      const minimumSelections = normalizeNumber(group?.minimumSelections, 0);
      const maximumSelections = normalizeNumber(group?.maximumSelections, minimumSelections);
      const countInvalid =
        selectedDefinitionIds.length < minimumSelections ||
        selectedDefinitionIds.length > maximumSelections;
      return {
        ...group,
        eligibleDefinitions,
        selectedDefinitionIds,
        invalidSelection,
        sameSchoolInvalid,
        countInvalid,
        clientReady: !invalidSelection && !sameSchoolInvalid && !countInvalid,
      };
    });
    const selectedAcrossGroups = groups.flatMap((group) => group.selectedDefinitionIds);
    const duplicateSelection =
      Boolean(configuration.requireUniqueDefinitions) &&
      new Set(selectedAcrossGroups).size !== selectedAcrossGroups.length;
    const mode = String(configuration.mode || "").toUpperCase();
    const selectionReady =
      mode !== "GROUPS" ||
      (!duplicateSelection && groups.every((group) => group.clientReady));
    const roomLocalDefinitionAuthoring = projectRoomLocalDefinitionAuthoring(
      configuration,
      authoringDraft?.[profileId]
    );

    return {
      ...profile,
      configuration: {
        ...configuration,
        groups,
        roomLocalDefinitionAuthoring,
      },
      duplicateSelection,
      clientReady: selectionReady && roomLocalDefinitionAuthoring.clientReady,
    };
  });
}

export function useStoryCharacterConfigurationViewModel({ roomId } = {}) {
  const [snapshot, setSnapshot] = useState(null);
  const [statsConfiguration, setStatsConfiguration] = useState(null);
  const [skillsConfiguration, setSkillsConfiguration] = useState(null);
  const [abilitySpellConfiguration, setAbilitySpellConfiguration] = useState(null);
  const [allocationDraft, setAllocationDraft] = useState({});
  const [skillSelectionDraft, setSkillSelectionDraft] = useState({});
  const [abilitySpellSelectionDraft, setAbilitySpellSelectionDraft] = useState({});
  const [abilitySpellAuthoringDraft, setAbilitySpellAuthoringDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingStats, setSavingStats] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [savingAbilitySpell, setSavingAbilitySpell] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [roomData, statsData, skillsData, abilitySpellData] = await Promise.all([
        fetchStoryRoom(roomId),
        fetchStoryStatsPoolsCharacterConfiguration(roomId).catch((loadError) => {
          if (loadError?.code === "PLAYER_ACTOR_CONFIGURATION_NOT_ACTIVE") return null;
          throw loadError;
        }),
        fetchStorySkillsCharacterConfiguration(roomId).catch((loadError) => {
          if (loadError?.code === "PLAYER_ACTOR_CONFIGURATION_NOT_ACTIVE") return null;
          throw loadError;
        }),
        fetchStoryAbilitySpellCharacterConfiguration(roomId).catch((loadError) => {
          if (loadError?.code === "PLAYER_ACTOR_CONFIGURATION_NOT_ACTIVE") return null;
          throw loadError;
        }),
      ]);
      setSnapshot(roomData || null);
      setStatsConfiguration(statsData || null);
      setSkillsConfiguration(skillsData || null);
      setAbilitySpellConfiguration(abilitySpellData || null);
      setAllocationDraft(buildAllocationDraft(statsData));
      setSkillSelectionDraft(buildSkillSelectionDraft(skillsData));
      setAbilitySpellSelectionDraft(buildAbilitySpellSelectionDraft(abilitySpellData));
      setAbilitySpellAuthoringDraft(buildAbilitySpellAuthoringDraft(abilitySpellData));
    } catch (loadError) {
      setError(loadError?.message || "Character Configuration could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      setError("Story room id is required.");
      return;
    }
    load();
    // roomId is the lifecycle boundary; load is intentionally local to the hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const statsProfiles = useMemo(
    () => projectStatsProfiles(statsConfiguration, allocationDraft),
    [allocationDraft, statsConfiguration]
  );
  const skillsProfiles = useMemo(
    () => projectSkillProfiles(skillsConfiguration, skillSelectionDraft),
    [skillSelectionDraft, skillsConfiguration]
  );
  const abilitySpellProfiles = useMemo(
    () => projectAbilitySpellProfiles(
      abilitySpellConfiguration,
      abilitySpellSelectionDraft,
      abilitySpellAuthoringDraft
    ),
    [abilitySpellConfiguration, abilitySpellSelectionDraft, abilitySpellAuthoringDraft]
  );

  async function saveStats() {
    if (savingStats || !roomId) return;
    setSavingStats(true);
    setError("");
    setSaveMessage("");
    try {
      const allocations = statsProfiles.map((profile) => ({
        bindingId: profile.bindingId,
        statValues: Object.fromEntries(
          normalizeArray(profile?.configuration?.statValues).map((stat) => [
            stat.definitionId,
            stat.configuredValue,
          ])
        ),
      }));
      const result = await commitStoryStatsPoolsCharacterConfiguration(roomId, allocations);
      setSaveMessage(
        result?.configurationStatus === "READY"
          ? "Stats & Pools configuration complete. This character is ready for normal play."
          : "Stats & Pools configuration saved. Continue with the remaining required mechanics."
      );
      await load();
    } catch (saveError) {
      setError(saveError?.message || "Stats & Pools Character Configuration could not be saved.");
    } finally {
      setSavingStats(false);
    }
  }

  async function saveSkills() {
    if (savingSkills || !roomId) return;
    setSavingSkills(true);
    setError("");
    setSaveMessage("");
    try {
      const selections = skillsProfiles.map((profile) => ({
        bindingId: profile.bindingId,
        selectedSkills: Object.fromEntries(
          normalizeArray(profile?.configuration?.slots)
            .filter((slot) => slot.selectedSkillId)
            .map((slot) => [slot.id, slot.selectedSkillId])
        ),
      }));
      const result = await commitStorySkillsCharacterConfiguration(roomId, selections);
      setSaveMessage(
        result?.configurationStatus === "READY"
          ? "Skills configuration complete. This character is ready for normal play."
          : "Skills configuration saved. Continue with the remaining required mechanics."
      );
      await load();
    } catch (saveError) {
      setError(saveError?.message || "Skills Character Configuration could not be saved.");
    } finally {
      setSavingSkills(false);
    }
  }

  async function saveAbilitySpell() {
    if (savingAbilitySpell || !roomId) return;
    setSavingAbilitySpell(true);
    setError("");
    setSaveMessage("");
    try {
      const selections = abilitySpellProfiles.map((profile) => ({
        profileId: profile.profileId,
        selectedDefinitions: Object.fromEntries(
          normalizeArray(profile?.configuration?.groups).map((group) => [
            group.id,
            normalizeArray(group.selectedDefinitionIds),
          ])
        ),
      }));
      const authoredDefinitions = abilitySpellProfiles.map((profile) => ({
        profileId: profile.profileId,
        definitions: normalizeArray(
          profile?.configuration?.roomLocalDefinitionAuthoring?.authoredDefinitions
        ),
      }));
      const result = await commitStoryAbilitySpellCharacterConfiguration(
        roomId,
        selections,
        authoredDefinitions
      );
      setSaveMessage(
        result?.configurationStatus === "READY"
          ? "Ability/Spell configuration complete. This character is ready for normal play."
          : "Ability/Spell configuration saved. Continue with the remaining required mechanics."
      );
      await load();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Ability/Spell Character Configuration could not be saved."
      );
    } finally {
      setSavingAbilitySpell(false);
    }
  }

  return useMemo(() => {
    const descriptor = getStoryPlayerActorConfigurationDescriptor({
      room: snapshot?.room,
      state: snapshot?.state,
    });
    const plan = descriptor?.configurationPlan || {};
    const required = isStoryPlayerActorConfigurationRequired(descriptor);
    const requiredDomains = normalizeArray(plan.attachmentDomains)
      .concat(normalizeArray(plan.configurationDomains))
      .map((domain) => String(domain || "").toUpperCase());
    const statsRequired = requiredDomains.includes("STATS");
    const skillsRequired = requiredDomains.includes("SKILLS");
    const abilitySpellRequired =
      requiredDomains.includes("MAGIC") || requiredDomains.includes("ABILITIES");
    const statsReady = statsProfiles.every((profile) => profile.clientReady !== false);
    const skillsReady = skillsProfiles.every((profile) => profile.clientReady !== false);
    const abilitySpellReady = abilitySpellProfiles.every(
      (profile) => profile.clientReady !== false
    );

    return {
      loading,
      error,
      saveMessage,
      savingStats,
      savingSkills,
      savingAbilitySpell,
      roomId,
      roomTitle: snapshot?.room?.title || "Story",
      hasPlayerActor: Boolean(descriptor),
      actorMode: descriptor?.actorMode || "NONE",
      required,
      status: descriptor?.configurationStatus || "NOT_APPLICABLE",
      attachmentDomains: normalizeArray(plan.attachmentDomains),
      configurationDomains: normalizeArray(plan.configurationDomains),
      statsConfiguration: statsRequired
        ? {
            required: true,
            status: statsConfiguration?.status || "UNAVAILABLE",
            profiles: statsProfiles,
            canSave: Boolean(statsProfiles.length) && statsReady && !savingStats,
            onChangeStat: (bindingId, definitionId, value) => {
              setAllocationDraft((current) => ({
                ...current,
                [bindingId]: {
                  ...(current?.[bindingId] || {}),
                  [definitionId]: value,
                },
              }));
              setSaveMessage("");
            },
            onSave: saveStats,
          }
        : null,
      skillsConfiguration: skillsRequired
        ? {
            required: true,
            status: skillsConfiguration?.status || "UNAVAILABLE",
            profiles: skillsProfiles,
            canSave: Boolean(skillsProfiles.length) && skillsReady && !savingSkills,
            onSelectSkill: (bindingId, slotId, skillId) => {
              setSkillSelectionDraft((current) => ({
                ...current,
                [bindingId]: {
                  ...(current?.[bindingId] || {}),
                  [slotId]: skillId,
                },
              }));
              setSaveMessage("");
            },
            onSave: saveSkills,
          }
        : null,
      abilitySpellConfiguration: abilitySpellRequired
        ? {
            required: true,
            status: abilitySpellConfiguration?.status || "UNAVAILABLE",
            profiles: abilitySpellProfiles,
            canSave:
              Boolean(abilitySpellProfiles.length) &&
              abilitySpellReady &&
              !savingAbilitySpell,
            onToggleDefinition: (profileId, groupId, definitionId, checked) => {
              setAbilitySpellSelectionDraft((current) => {
                const selected = normalizeArray(current?.[profileId]?.[groupId]);
                const next = checked
                  ? [...new Set([...selected, definitionId])]
                  : selected.filter((value) => value !== definitionId);
                return {
                  ...current,
                  [profileId]: {
                    ...(current?.[profileId] || {}),
                    [groupId]: next,
                  },
                };
              });
              setSaveMessage("");
            },
            onAddAuthoredDefinition: (profileId, group) => {
              setAbilitySpellAuthoringDraft((current) => {
                const definitions = normalizeArray(current?.[profileId]);
                const groupDefinitions = definitions.filter(
                  (entry) => String(entry?.groupId || "") === String(group?.id || "")
                );
                if (groupDefinitions.length >= normalizeNumber(group?.maximumDefinitions, 0)) {
                  return current;
                }
                return {
                  ...current,
                  [profileId]: [
                    ...definitions,
                    buildRoomLocalDefinitionDraft(group, groupDefinitions.length),
                  ],
                };
              });
              setSaveMessage("");
            },
            onRemoveAuthoredDefinition: (profileId, draftId) => {
              setAbilitySpellAuthoringDraft((current) => ({
                ...current,
                [profileId]: normalizeArray(current?.[profileId]).filter(
                  (entry) => String(entry?.draftId || "") !== String(draftId || "")
                ),
              }));
              setSaveMessage("");
            },
            onChangeAuthoredDefinition: (profileId, draftId, field, value) => {
              setAbilitySpellAuthoringDraft((current) => ({
                ...current,
                [profileId]: normalizeArray(current?.[profileId]).map((entry) =>
                  String(entry?.draftId || "") === String(draftId || "")
                    ? { ...entry, [field]: value }
                    : entry
                ),
              }));
              setSaveMessage("");
            },
            onChangeAuthoredCustomText: (profileId, draftId, fieldId, value) => {
              setAbilitySpellAuthoringDraft((current) => ({
                ...current,
                [profileId]: normalizeArray(current?.[profileId]).map((entry) =>
                  String(entry?.draftId || "") === String(draftId || "")
                    ? {
                        ...entry,
                        customText: {
                          ...(entry?.customText || {}),
                          [fieldId]: value,
                        },
                      }
                    : entry
                ),
              }));
              setSaveMessage("");
            },
            onSave: saveAbilitySpell,
          }
        : null,
      backHref: roomId
        ? buildStoryChatHref(roomId)
        : "/studio/v2/stories",
    };
  }, [
    abilitySpellAuthoringDraft,
    abilitySpellConfiguration,
    abilitySpellProfiles,
    abilitySpellSelectionDraft,
    allocationDraft,
    error,
    loading,
    roomId,
    saveMessage,
    savingAbilitySpell,
    savingSkills,
    savingStats,
    skillSelectionDraft,
    skillsConfiguration,
    skillsProfiles,
    snapshot,
    statsConfiguration,
    statsProfiles,
  ]);
}
