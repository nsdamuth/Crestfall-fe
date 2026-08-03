"use client";

import { useEffect, useMemo, useState } from "react";

import WeatherModuleConfigModalView from "@/components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view";
import {
  weatherModuleConfigBlockedFixture,
  weatherModuleConfigExistingFixture,
  weatherModuleConfigLoadingFixture,
} from "@/components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.fixtures";

const STATES = {
  existing: {
    label: "Existing Module",
    fixture: weatherModuleConfigExistingFixture,
  },
  blocked: {
    label: "Blocked Condition",
    fixture: weatherModuleConfigBlockedFixture,
  },
  loading: {
    label: "Loading",
    fixture: weatherModuleConfigLoadingFixture,
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function WeatherModuleConfigModalPreviewClient() {
  const [stateKey, setStateKey] = useState("existing");
  const [viewState, setViewState] = useState(() =>
    clone(STATES.existing.fixture)
  );
  const [feedback, setFeedback] = useState("Fixture preview ready.");

  useEffect(() => {
    setViewState(clone(STATES[stateKey].fixture));
    setFeedback(`${STATES[stateKey].label} fixture loaded.`);
  }, [stateKey]);

  function updateField(field, value, label) {
    setViewState((current) => ({ ...current, [field]: value }));
    setFeedback(`${label} updated.`);
  }

  function updateCondition(conditionId, field, value, label) {
    setViewState((current) => ({
      ...current,
      conditionCards: (current.conditionCards || []).map((condition) =>
        condition.id === conditionId
          ? { ...condition, [field]: value }
          : condition
      ),
    }));
    setFeedback(`${label} updated.`);
  }

  const viewProps = useMemo(() => {
    const props = { ...viewState };

    props.onClose = () => setFeedback("Close callback received.");
    props.onSave = () => setFeedback("Fixture save callback received.");
    props.onModuleTitleChange = (value) =>
      updateField("moduleTitle", value, "Module title");
    props.onPriorityChange = (value) =>
      updateField("priority", value, "Priority");
    props.onModuleDescriptionChange = (value) =>
      updateField("moduleDescription", value, "Description");
    props.onCurrentConditionChange = (value) => {
      const selected = (viewState.currentConditionOptions || []).find(
        (option) => option.value === value
      );
      setViewState((current) => ({
        ...current,
        currentConditionId: value,
        weatherDisplayName: selected?.label || "",
        conditionCards: (current.conditionCards || []).map((condition) => ({
          ...condition,
          isCurrent: condition.id === value,
        })),
      }));
      setFeedback("Current condition changed.");
    };
    props.onWeatherDisplayNameChange = (value) =>
      updateField("weatherDisplayName", value, "Weather display name");
    props.onClimateProfileChange = (value) =>
      updateField("climateProfile", value, "Climate profile");
    props.onSelectedPresetChange = (value) =>
      updateField("selectedPresetId", value, "Recommended condition");
    props.onAddRecommendedCondition = () =>
      setFeedback("Add Recommended callback received.");
    props.onAddCustomCondition = () =>
      setFeedback("Add Custom Draft callback received.");
    props.onDetailLevelChange = (value) =>
      updateField("detailLevel", value, "Detail level");
    props.onFrequencyChange = (value) =>
      updateField("frequency", value, "Frequency");
    props.onToneChange = (value) =>
      updateField("tone", value.toUpperCase(), "Tone");
    props.onSurfaceSensoryNotesChange = (value) =>
      updateField("surfaceSensoryNotes", value, "Sensory-note visibility");
    props.onAllowWeatherComplicationsChange = (value) =>
      updateField(
        "allowWeatherComplications",
        value,
        "Weather complications"
      );
    props.onRespectIndoorOutdoorLogicChange = (value) =>
      updateField(
        "respectIndoorOutdoorLogic",
        value,
        "Indoor/outdoor logic"
      );

    props.conditionCards = (viewState.conditionCards || []).map(
      (condition) => ({
        ...condition,
        onSetCurrent: () => {
          setViewState((current) => ({
            ...current,
            currentConditionId: condition.id,
            weatherDisplayName: condition.label,
            conditionCards: (current.conditionCards || []).map((item) => ({
              ...item,
              isCurrent: item.id === condition.id,
            })),
          }));
          setFeedback(`${condition.label} set as current.`);
        },
        onRemove: () => {
          setViewState((current) => ({
            ...current,
            conditionCards: (current.conditionCards || []).filter(
              (item) => item.id !== condition.id
            ),
            currentConditionOptions: (current.currentConditionOptions || []).filter(
              (option) => option.value !== condition.id
            ),
          }));
          setFeedback(`${condition.label} removed from the fixture.`);
        },
        onLabelChange: (value) =>
          updateCondition(condition.id, "label", value, "Condition name"),
        onCategoryChange: (value) =>
          updateCondition(condition.id, "category", value, "Category"),
        onWeightChange: (value) =>
          updateCondition(condition.id, "weight", value, "Weight"),
        onSceneImpactChange: (value) =>
          updateCondition(condition.id, "sceneImpact", value, "Scene impact"),
        onHazardLevelChange: (value) =>
          updateCondition(condition.id, "hazardLevel", value, "Hazard level"),
        onTagsChange: (value) =>
          updateCondition(condition.id, "tagsText", value, "Tags"),
        onAllowedChange: (value) =>
          updateCondition(condition.id, "allowed", value, "Availability"),
        onBlockedChange: (value) =>
          updateCondition(condition.id, "blocked", value, "Blocked state"),
        onAllowedIndoorsChange: (value) =>
          updateCondition(
            condition.id,
            "allowedIndoors",
            value,
            "Interior behavior"
          ),
        onSensoryNotesChange: (value) =>
          updateCondition(
            condition.id,
            "sensoryNotesText",
            value,
            "Sensory notes"
          ),
        onComposerGuidanceChange: (value) =>
          updateCondition(
            condition.id,
            "composerGuidance",
            value,
            "Composer guidance"
          ),
      })
    );

    return props;
  }, [viewState]);

  return (
    <main className="min-h-screen bg-[#080706] text-[var(--foreground)]">
      <div className="fixed left-4 top-4 z-[60] max-w-sm rounded-xl border border-[var(--muted-gold)]/35 bg-[#080706]/95 p-3 shadow-2xl">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Weather Modal Preview
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(STATES).map(([key, state]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStateKey(key)}
              className={`rounded-lg border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${
                stateKey === key
                  ? "border-[var(--muted-gold)]/50 text-[var(--foreground)]"
                  : "border-white/10 text-[var(--muted)]"
              }`}
            >
              {state.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{feedback}</p>
      </div>

      <WeatherModuleConfigModalView {...viewProps} />
    </main>
  );
}
