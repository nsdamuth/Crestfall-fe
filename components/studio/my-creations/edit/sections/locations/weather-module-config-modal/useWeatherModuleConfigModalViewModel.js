"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createEngineModuleInstance,
  fetchEngineModuleInstance,
  updateEngineModuleInstance,
} from "@/lib/client/studio/engine-modules/engineModuleInstanceClient";

const WEATHER_MODULE_ID = "core.inWorldWeather.v1";

const detailLevelOptions = ["MINIMAL", "LOW", "MEDIUM", "HIGH", "RICH"];
const frequencyOptions = ["RARE", "OCCASIONAL", "NORMAL", "FREQUENT", "CONSTANT"];
const categoryOptions = [
  "TEMPERATE",
  "TEMPERATE_MAGICAL",
  "RAIN",
  "SNOW",
  "FOG",
  "STORM",
  "DESERT",
  "URBAN_DRY",
  "TROPICAL",
  "ARCTIC",
  "MAGICAL",
  "ALIEN",
  "CUSTOM",
];
const sceneImpactOptions = ["BACKGROUND", "ATMOSPHERIC", "SCENE_SHAPING", "OBSTACLE"];
const hazardLevelOptions = ["NONE", "LOW", "MEDIUM", "HIGH"];

const RECOMMENDED_WEATHER_CONDITIONS = [
  {
    id: "soft_clear",
    label: "Soft Clear",
    category: "TEMPERATE",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "NONE",
    sensoryNotes: {
      sight: "clear light and calm air",
    },
    composerGuidance: "Use as light atmospheric context. Do not over-describe.",
    tags: ["clear", "calm"],
    defaultWeight: 100,
  },
  {
    id: "warm_wind",
    label: "Warm Wind",
    category: "TEMPERATE_MAGICAL",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "NONE",
    sensoryNotes: {
      touch: "warm air moving through streets and open windows",
      smell: "dust, stone, market spice, and distant rain",
    },
    composerGuidance: "Use as light local climate atmosphere.",
    tags: ["wind", "warm", "city"],
    defaultWeight: 70,
  },
  {
    id: "light_rain",
    label: "Light Rain",
    category: "RAIN",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "thin rain on stone, glass, and rooftops",
      sound: "soft rain tapping on windows and awnings",
      smell: "wet stone and clean air",
    },
    composerGuidance: "Use for mood, texture, and travel atmosphere.",
    tags: ["rain", "wet", "calm"],
    defaultWeight: 40,
  },
  {
    id: "heavy_rain",
    label: "Heavy Rain",
    category: "RAIN",
    allowedIndoors: false,
    sceneImpact: "SCENE_SHAPING",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "sheets of rain obscuring distance",
      sound: "hard rain drumming on roofs and streets",
      touch: "cold water soaking exposed clothing",
    },
    composerGuidance: "Use as stronger scene atmosphere, but avoid making it a major obstacle unless appropriate.",
    tags: ["rain", "storm", "wet"],
    defaultWeight: 20,
  },
  {
    id: "fog",
    label: "Fog",
    category: "FOG",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "soft haze swallowing distant shapes",
      sound: "muffled footsteps and voices",
      touch: "cool damp air",
    },
    composerGuidance: "Use for mystery, reduced visibility, and quiet atmosphere.",
    tags: ["fog", "mist", "mystery"],
    defaultWeight: 35,
  },
  {
    id: "dust_haze",
    label: "Dust Haze",
    category: "URBAN_DRY",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "golden dust hanging in streetlight",
      smell: "dry stone, grit, and market air",
      touch: "fine dust clinging to exposed skin and fabric",
    },
    composerGuidance: "Use as street-level haze, not heavy danger.",
    tags: ["dust", "dry", "city"],
    defaultWeight: 10,
  },
  {
    id: "heat_haze",
    label: "Heat Haze",
    category: "DESERT",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "wavering air and bright glare",
      touch: "dry heat pressing against exposed skin",
    },
    composerGuidance: "Use for desert, summer, forge-city, or exposed-street atmosphere.",
    tags: ["heat", "desert", "dry"],
    defaultWeight: 30,
  },
  {
    id: "snowfall",
    label: "Snowfall",
    category: "SNOW",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "white flakes falling through dim air",
      sound: "quiet streets and softened footsteps",
      touch: "cold flakes melting on fabric",
    },
    composerGuidance: "Use as calm or isolating atmosphere unless intensified.",
    tags: ["snow", "cold", "quiet"],
    defaultWeight: 25,
  },
  {
    id: "blue_mist",
    label: "Blue Mist",
    category: "MAGICAL",
    allowedIndoors: true,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "soft blue vapor pooling near lamps and window glass",
      sound: "muffled city noise and faint glasslike ringing",
      touch: "cool damp air",
      smell: "rain, ozone, and mineral sweetness",
    },
    composerGuidance: "Use as magical atmosphere, not a hard obstacle unless intensified.",
    tags: ["mist", "magic", "blue"],
    defaultWeight: 30,
  },
  {
    id: "crystal_rain",
    label: "Crystal Rain",
    category: "ALIEN",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "tiny reflective crystal droplets falling slowly",
      sound: "soft glasslike chiming",
      touch: "cool pinprick impacts",
      smell: "clean mineral ozone",
    },
    composerGuidance: "Use as beautiful alien atmosphere unless intensified by the scene.",
    tags: ["alien", "crystal", "rain"],
    defaultWeight: 20,
  },
  {
    id: "silver_static",
    label: "Silver Static",
    category: "ALIEN",
    allowedIndoors: true,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "silver sparks crawling over metal and glass",
      sound: "dry crackling at the edge of hearing",
      touch: "static lifting hair and tingling fingertips",
    },
    composerGuidance: "Use for strange moons, magical machinery, or unstable air.",
    tags: ["alien", "static", "silver"],
    defaultWeight: 15,
  },
  {
    id: "glass_fog",
    label: "Glass Fog",
    category: "ALIEN",
    allowedIndoors: false,
    sceneImpact: "ATMOSPHERIC",
    hazardLevel: "LOW",
    sensoryNotes: {
      sight: "transparent fog glittering like powdered glass",
      sound: "faint crystalline whispers in the air",
      touch: "cool dry mist moving across skin",
    },
    composerGuidance: "Use as surreal alien weather. Keep it atmospheric unless the scene makes it dangerous.",
    tags: ["alien", "fog", "glass"],
    defaultWeight: 15,
  },
];

const DEFAULT_WEATHER_INSTANCE_DATA = {
  contractVersion: "weather_instance_data.v0",
  defaultWeather: "Soft Clear",
  currentWeatherTypeId: "soft_clear",
  climateProfile: "Custom Weather Profile",
  weatherTypes: [conditionToWeatherType(RECOMMENDED_WEATHER_CONDITIONS[0])],
  allowedWeatherTypeIds: ["soft_clear"],
  blockedWeatherTypeIds: [],
  weatherWeights: {
    soft_clear: 100,
  },
  presentationPreferences: {
    detailLevel: "MEDIUM",
    frequency: "OCCASIONAL",
    tone: "ATMOSPHERIC",
    surfaceSensoryNotes: true,
    allowWeatherComplications: false,
    respectIndoorOutdoorLogic: true,
  },
};

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeInstancePayload(payload) {
  return (
    payload?.instance ||
    payload?.moduleInstance ||
    payload?.engineModuleInstance ||
    payload?.creation ||
    payload
  );
}

function getInstanceData(instance) {
  return normalizeObject(
    instance?.instanceData ||
      instance?.instance_data ||
      instance?.data?.instanceData ||
      instance?.data?.instance_data ||
      instance?.data?.data
  );
}

function slugifyWeatherLabel(value) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return slug || "custom_weather";
}

function getUniqueConditionId(baseId, conditions = []) {
  const existingIds = new Set(
    normalizeArray(conditions).map((condition) => condition.id).filter(Boolean)
  );

  if (!existingIds.has(baseId)) return baseId;

  let index = 2;
  let nextId = `${baseId}_${index}`;

  while (existingIds.has(nextId)) {
    index += 1;
    nextId = `${baseId}_${index}`;
  }

  return nextId;
}

function conditionToWeatherType(condition) {
  return {
    id: condition.id,
    label: condition.label,
    category: condition.category || "CUSTOM",
    allowedIndoors: Boolean(condition.allowedIndoors),
    sceneImpact: condition.sceneImpact || "ATMOSPHERIC",
    hazardLevel: condition.hazardLevel || "LOW",
    sensoryNotes: normalizeObject(condition.sensoryNotes),
    composerGuidance: condition.composerGuidance || "",
    tags: normalizeArray(condition.tags).filter(Boolean),
  };
}

function normalizeCondition(condition, existingConditions = []) {
  const label = condition?.label || condition?.name || condition?.title || "Custom Weather";
  const id =
    condition?.id ||
    condition?.weatherTypeId ||
    condition?.weather_type_id ||
    getUniqueConditionId(slugifyWeatherLabel(label), existingConditions);

  return conditionToWeatherType({
    ...condition,
    id,
    label,
  });
}

function getConditionLabel(conditions, conditionId) {
  return (
    normalizeArray(conditions).find((condition) => condition.id === conditionId)
      ?.label || ""
  );
}

function getDefaultTitle({ locationTitle }) {
  return locationTitle
    ? `${locationTitle} Weather Rules`
    : "Location Weather Rules";
}

function buildInitialForm({ instance, locationTitle }) {
  const instanceData = {
    ...DEFAULT_WEATHER_INSTANCE_DATA,
    ...getInstanceData(instance),
  };

  const weatherTypes = normalizeArray(instanceData.weatherTypes).length
    ? normalizeArray(instanceData.weatherTypes).map((condition, index, all) =>
        normalizeCondition(condition, all.slice(0, index))
      )
    : DEFAULT_WEATHER_INSTANCE_DATA.weatherTypes;

  const conditionIds = weatherTypes.map((condition) => condition.id);
  const presentationPreferences = {
    ...DEFAULT_WEATHER_INSTANCE_DATA.presentationPreferences,
    ...normalizeObject(instanceData.presentationPreferences),
  };

  const currentWeatherTypeId =
    conditionIds.includes(instanceData.currentWeatherTypeId)
      ? instanceData.currentWeatherTypeId
      : conditionIds[0] || "";

  return {
    title: instance?.title || getDefaultTitle({ locationTitle }),
    description:
      instance?.description ||
      "Configurable weather module instance for this location.",
    priority:
      instance?.priority !== null && instance?.priority !== undefined
        ? String(instance.priority)
        : "45",

    defaultWeather:
      instanceData.defaultWeather ||
      getConditionLabel(weatherTypes, currentWeatherTypeId) ||
      "",
    currentWeatherTypeId,
    climateProfile: instanceData.climateProfile || "Custom Weather Profile",

    weatherTypes,
    allowedWeatherTypeIds: normalizeArray(instanceData.allowedWeatherTypeIds).length
      ? normalizeArray(instanceData.allowedWeatherTypeIds).filter((id) =>
          conditionIds.includes(id)
        )
      : conditionIds,
    blockedWeatherTypeIds: normalizeArray(instanceData.blockedWeatherTypeIds).filter(
      (id) => conditionIds.includes(id)
    ),
    weatherWeights: {
      ...conditionIds.reduce(
        (weights, id) => ({
          ...weights,
          [id]: 10,
        }),
        {}
      ),
      ...normalizeObject(instanceData.weatherWeights),
    },

    detailLevel: presentationPreferences.detailLevel || "MEDIUM",
    frequency: presentationPreferences.frequency || "OCCASIONAL",
    tone: presentationPreferences.tone || "ATMOSPHERIC",
    surfaceSensoryNotes: presentationPreferences.surfaceSensoryNotes !== false,
    allowWeatherComplications:
      presentationPreferences.allowWeatherComplications === true,
    respectIndoorOutdoorLogic:
      presentationPreferences.respectIndoorOutdoorLogic !== false,
  };
}

export function useWeatherModuleConfigModalViewModel({
  locationTitle = "",
  weatherBinding = null,
  onClose,
  onSaved,
}) {
  const moduleInstanceId = weatherBinding?.moduleInstanceId || "";
  const [instance, setInstance] = useState(null);
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState(moduleInstanceId ? "loading" : "loaded");
  const [message, setMessage] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState(
    RECOMMENDED_WEATHER_CONDITIONS[0].id
  );

  useEffect(() => {
    let cancelled = false;

    async function loadModuleInstance() {
      if (!moduleInstanceId) {
        setInstance(null);
        setForm(buildInitialForm({ instance: null, locationTitle }));
        setStatus("loaded");
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        const payload = await fetchEngineModuleInstance(moduleInstanceId);
        const loadedInstance = normalizeInstancePayload(payload);

        if (cancelled) return;

        setInstance(loadedInstance);
        setForm(buildInitialForm({ instance: loadedInstance, locationTitle }));
        setStatus("loaded");
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setMessage(
          error.message ||
            "Weather module instance could not be loaded. You can create a new one by saving."
        );
        setInstance(null);
        setForm(buildInitialForm({ instance: null, locationTitle }));
      }
    }

    loadModuleInstance();

    return () => {
      cancelled = true;
    };
  }, [moduleInstanceId, locationTitle]);

  const existingInstanceData = useMemo(
    () => getInstanceData(instance),
    [instance]
  );

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateCondition(conditionId, patch) {
    setForm((current) => ({
      ...current,
      weatherTypes: normalizeArray(current.weatherTypes).map((condition) =>
        condition.id === conditionId
          ? {
              ...condition,
              ...patch,
              sensoryNotes: {
                ...normalizeObject(condition.sensoryNotes),
                ...normalizeObject(patch.sensoryNotes),
              },
            }
          : condition
      ),
    }));
  }

  function updateConditionWeight(conditionId, value) {
    setForm((current) => ({
      ...current,
      weatherWeights: {
        ...normalizeObject(current.weatherWeights),
        [conditionId]: value,
      },
    }));
  }

  function toggleAllowedCondition(conditionId, checked) {
    setForm((current) => {
      const currentIds = new Set(normalizeArray(current.allowedWeatherTypeIds));

      if (checked) {
        currentIds.add(conditionId);
      } else {
        currentIds.delete(conditionId);
      }

      return {
        ...current,
        allowedWeatherTypeIds: [...currentIds],
      };
    });
  }

  function toggleBlockedCondition(conditionId, checked) {
    setForm((current) => {
      const currentIds = new Set(normalizeArray(current.blockedWeatherTypeIds));

      if (checked) {
        currentIds.add(conditionId);
      } else {
        currentIds.delete(conditionId);
      }

      return {
        ...current,
        blockedWeatherTypeIds: [...currentIds],
      };
    });
  }

  function addRecommendedCondition() {
    const preset = RECOMMENDED_WEATHER_CONDITIONS.find(
      (condition) => condition.id === selectedPresetId
    );

    if (!preset) return;

    const existingConditions = normalizeArray(form.weatherTypes);

    if (existingConditions.some((condition) => condition.id === preset.id)) {
      setMessage(`${preset.label} is already in this weather library.`);
      return;
    }

    const nextCondition = conditionToWeatherType(preset);

    setForm((current) => ({
      ...current,
      weatherTypes: [...normalizeArray(current.weatherTypes), nextCondition],
      allowedWeatherTypeIds: [
        ...new Set([...normalizeArray(current.allowedWeatherTypeIds), nextCondition.id]),
      ],
      weatherWeights: {
        ...normalizeObject(current.weatherWeights),
        [nextCondition.id]: preset.defaultWeight || 10,
      },
      currentWeatherTypeId:
        current.currentWeatherTypeId || nextCondition.id,
      defaultWeather:
        current.defaultWeather || nextCondition.label,
    }));

    setMessage(`${preset.label} added.`);
  }

  function addCustomDraftCondition() {
    const existingConditions = normalizeArray(form.weatherTypes);
    const id = getUniqueConditionId("custom_weather", existingConditions);

    const nextCondition = conditionToWeatherType({
      id,
      label: "Custom Weather",
      category: "CUSTOM",
      allowedIndoors: false,
      sceneImpact: "ATMOSPHERIC",
      hazardLevel: "LOW",
      sensoryNotes: {},
      composerGuidance: "",
      tags: [],
    });

    setForm((current) => ({
      ...current,
      weatherTypes: [...normalizeArray(current.weatherTypes), nextCondition],
      allowedWeatherTypeIds: [
        ...new Set([...normalizeArray(current.allowedWeatherTypeIds), nextCondition.id]),
      ],
      weatherWeights: {
        ...normalizeObject(current.weatherWeights),
        [nextCondition.id]: 10,
      },
    }));

    setMessage("Custom weather draft added. Prefer recommended conditions when possible.");
  }

  function removeCondition(conditionId) {
    setForm((current) => {
      const nextWeatherTypes = normalizeArray(current.weatherTypes).filter(
        (condition) => condition.id !== conditionId
      );

      const nextWeights = { ...normalizeObject(current.weatherWeights) };
      delete nextWeights[conditionId];

      const nextCurrentWeatherTypeId =
        current.currentWeatherTypeId === conditionId
          ? nextWeatherTypes[0]?.id || ""
          : current.currentWeatherTypeId;

      return {
        ...current,
        weatherTypes: nextWeatherTypes,
        allowedWeatherTypeIds: normalizeArray(current.allowedWeatherTypeIds).filter(
          (id) => id !== conditionId
        ),
        blockedWeatherTypeIds: normalizeArray(current.blockedWeatherTypeIds).filter(
          (id) => id !== conditionId
        ),
        weatherWeights: nextWeights,
        currentWeatherTypeId: nextCurrentWeatherTypeId,
        defaultWeather:
          current.currentWeatherTypeId === conditionId
            ? nextWeatherTypes[0]?.label || ""
            : current.defaultWeather,
      };
    });
  }

  function buildPayload() {
    const weatherTypes = normalizeArray(form.weatherTypes).map(conditionToWeatherType);
    const conditionIds = new Set(weatherTypes.map((condition) => condition.id));

    const weatherWeights = Object.entries(normalizeObject(form.weatherWeights)).reduce(
      (weights, [conditionId, value]) => {
        const numericValue = Number(value);

        if (!conditionIds.has(conditionId) || !Number.isFinite(numericValue)) {
          return weights;
        }

        return {
          ...weights,
          [conditionId]: numericValue,
        };
      },
      {}
    );

    const currentCondition = weatherTypes.find(
      (condition) => condition.id === form.currentWeatherTypeId
    );

    return {
      title: form.title,
      description: form.description,
      visibility: instance?.visibility || "PRIVATE",
      status: instance?.status || "DRAFT",
      moduleDefinitionId: WEATHER_MODULE_ID,
      priority: form.priority === "" ? 45 : Number(form.priority),
      operationTriggers: {
        chatTurnDefault: "get_weather_context",
      },
      instanceData: {
        ...existingInstanceData,
        contractVersion: "weather_instance_data.v0",
        defaultWeather:
          form.defaultWeather ||
          currentCondition?.label ||
          weatherTypes[0]?.label ||
          "",
        currentWeatherTypeId:
          form.currentWeatherTypeId || weatherTypes[0]?.id || "",
        climateProfile: form.climateProfile,
        weatherTypes,
        allowedWeatherTypeIds: normalizeArray(form.allowedWeatherTypeIds).filter(
          (id) => conditionIds.has(id)
        ),
        blockedWeatherTypeIds: normalizeArray(form.blockedWeatherTypeIds).filter(
          (id) => conditionIds.has(id)
        ),
        weatherWeights,
        presentationPreferences: {
          detailLevel: form.detailLevel,
          frequency: form.frequency,
          tone: form.tone,
          surfaceSensoryNotes: Boolean(form.surfaceSensoryNotes),
          allowWeatherComplications: Boolean(form.allowWeatherComplications),
          respectIndoorOutdoorLogic: Boolean(form.respectIndoorOutdoorLogic),
        },
      },
    };
  }

  async function handleSave() {
    setStatus("saving");
    setMessage("");

    try {
      const payload = buildPayload();

      const savedPayload = moduleInstanceId
        ? await updateEngineModuleInstance(moduleInstanceId, payload)
        : await createEngineModuleInstance(payload);

      const savedInstance = normalizeInstancePayload(savedPayload);

      if (!savedInstance?.id) {
        throw new Error("Weather module saved, but no instance id was returned.");
      }

      setInstance(savedInstance);
      setForm(buildInitialForm({ instance: savedInstance, locationTitle }));
      setStatus("loaded");
      setMessage("Weather module saved. Remember to save the Location to persist the binding.");

      onSaved?.({
        moduleInstanceId: savedInstance.id,
        moduleInstanceTitle: savedInstance.title || payload.title,
        priority:
          savedInstance.priority !== null && savedInstance.priority !== undefined
            ? savedInstance.priority
            : payload.priority,
      });
    } catch (error) {
      setStatus("loaded");
      setMessage(error.message || "Weather module could not be saved.");
    }
  }

  if (!form) {
    return {
      isInitializing: true,
      loadingMessage: "Loading weather module...",
      onClose,
    };
  }

  const selectedCurrentCondition = normalizeArray(form.weatherTypes).find(
    (condition) => condition.id === form.currentWeatherTypeId
  );

  function formatSensoryNotes(sensoryNotes) {
    const notes = normalizeObject(sensoryNotes);

    return [
      notes.sight ? `Sight: ${notes.sight}` : "",
      notes.sound ? `Sound: ${notes.sound}` : "",
      notes.touch ? `Touch: ${notes.touch}` : "",
      notes.smell ? `Smell: ${notes.smell}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function parseSensoryNotes(value) {
    return String(value || "")
      .split("\n")
      .reduce((notes, line) => {
        const [rawKey, ...rest] = line.split(":");
        const key = rawKey?.trim().toLowerCase();
        const note = rest.join(":").trim();

        if (!key || !note) return notes;

        return {
          ...notes,
          [key]: note,
        };
      }, {});
  }

  const conditionCards = normalizeArray(form.weatherTypes).map((condition) => {
    const conditionId = condition.id;

    return {
      id: conditionId,
      label: condition.label,
      summary: `${condition.category || "CUSTOM"} · ${
        condition.sceneImpact || "ATMOSPHERIC"
      } · ${condition.hazardLevel || "LOW"} hazard · ${
        condition.allowedIndoors ? "Can affect interiors" : "Primarily outdoor"
      }`,
      category: condition.category || "CUSTOM",
      sceneImpact: condition.sceneImpact || "ATMOSPHERIC",
      hazardLevel: condition.hazardLevel || "LOW",
      tagsText: normalizeArray(condition.tags).join(", "),
      sensoryNotesText: formatSensoryNotes(condition.sensoryNotes),
      composerGuidance: condition.composerGuidance || "",
      allowed: normalizeArray(form.allowedWeatherTypeIds).includes(conditionId),
      blocked: normalizeArray(form.blockedWeatherTypeIds).includes(conditionId),
      allowedIndoors: Boolean(condition.allowedIndoors),
      weight: String(normalizeObject(form.weatherWeights)[conditionId] ?? ""),
      isCurrent: form.currentWeatherTypeId === conditionId,
      categoryOptions: categoryOptions.map((option) => ({
        value: option,
        label: option,
      })),
      sceneImpactOptions: sceneImpactOptions.map((option) => ({
        value: option,
        label: option,
      })),
      hazardLevelOptions: hazardLevelOptions.map((option) => ({
        value: option,
        label: option,
      })),
      onSetCurrent: () => {
        updateField("currentWeatherTypeId", conditionId);
        updateField("defaultWeather", condition.label);
      },
      onRemove: () => removeCondition(conditionId),
      onLabelChange: (value) => updateCondition(conditionId, { label: value }),
      onCategoryChange: (value) =>
        updateCondition(conditionId, { category: value }),
      onWeightChange: (value) => updateConditionWeight(conditionId, value),
      onSceneImpactChange: (value) =>
        updateCondition(conditionId, { sceneImpact: value }),
      onHazardLevelChange: (value) =>
        updateCondition(conditionId, { hazardLevel: value }),
      onTagsChange: (value) =>
        updateCondition(conditionId, {
          tags: String(value || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      onAllowedChange: (value) => toggleAllowedCondition(conditionId, value),
      onBlockedChange: (value) => toggleBlockedCondition(conditionId, value),
      onAllowedIndoorsChange: (value) =>
        updateCondition(conditionId, { allowedIndoors: value }),
      onSensoryNotesChange: (value) =>
        updateCondition(conditionId, {
          sensoryNotes: parseSensoryNotes(value),
        }),
      onComposerGuidanceChange: (value) =>
        updateCondition(conditionId, { composerGuidance: value }),
    };
  });

  return {
    isInitializing: false,
    loadingMessage: "Loading weather module...",
    eyebrow: "Location Runtime Module",
    title: "Configure In-World Weather",
    description:
      "Choose recommended weather conditions, control which conditions are available here, and tune how strongly weather appears in the scene.",
    message,
    moduleTitle: form.title,
    priority: form.priority,
    moduleDescription: form.description,
    moduleTypeLabel: "In-World Weather",
    moduleStatusLabel: moduleInstanceId
      ? "Existing weather module"
      : "Will be created on save",
    currentConditionId: form.currentWeatherTypeId,
    currentConditionOptions: normalizeArray(form.weatherTypes).map(
      (condition) => ({
        value: condition.id,
        label: condition.label,
      })
    ),
    weatherDisplayName: form.defaultWeather,
    weatherDisplayPlaceholder: selectedCurrentCondition?.label || "Blue Mist",
    climateProfile: form.climateProfile,
    selectedPresetId,
    recommendedConditionOptions: RECOMMENDED_WEATHER_CONDITIONS.map(
      (condition) => ({
        value: condition.id,
        label: `${condition.label} · ${condition.category}`,
      })
    ),
    conditionCards,
    detailLevel: form.detailLevel,
    detailLevelOptions: detailLevelOptions.map((option) => ({
      value: option,
      label: option,
    })),
    frequency: form.frequency,
    frequencyOptions: frequencyOptions.map((option) => ({
      value: option,
      label: option,
    })),
    tone: form.tone,
    surfaceSensoryNotes: form.surfaceSensoryNotes,
    allowWeatherComplications: form.allowWeatherComplications,
    respectIndoorOutdoorLogic: form.respectIndoorOutdoorLogic,
    isSaving: status === "saving",
    footerNote:
      "Weather module changes save immediately. Location binding changes still require the normal Location save button.",
    onClose,
    onSave: handleSave,
    onModuleTitleChange: (value) => updateField("title", value),
    onPriorityChange: (value) => updateField("priority", value),
    onModuleDescriptionChange: (value) =>
      updateField("description", value),
    onCurrentConditionChange: (value) => {
      const condition = normalizeArray(form.weatherTypes).find(
        (item) => item.id === value
      );

      updateField("currentWeatherTypeId", value);
      updateField("defaultWeather", condition?.label || "");
    },
    onWeatherDisplayNameChange: (value) =>
      updateField("defaultWeather", value),
    onClimateProfileChange: (value) => updateField("climateProfile", value),
    onSelectedPresetChange: setSelectedPresetId,
    onAddRecommendedCondition: addRecommendedCondition,
    onAddCustomCondition: addCustomDraftCondition,
    onDetailLevelChange: (value) => updateField("detailLevel", value),
    onFrequencyChange: (value) => updateField("frequency", value),
    onToneChange: (value) => updateField("tone", value.toUpperCase()),
    onSurfaceSensoryNotesChange: (value) =>
      updateField("surfaceSensoryNotes", value),
    onAllowWeatherComplicationsChange: (value) =>
      updateField("allowWeatherComplications", value),
    onRespectIndoorOutdoorLogicChange: (value) =>
      updateField("respectIndoorOutdoorLogic", value),
  };
}
