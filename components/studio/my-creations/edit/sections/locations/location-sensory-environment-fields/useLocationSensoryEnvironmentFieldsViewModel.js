"use client";

import { useState } from "react";

export const LOCATION_SENSORY_SCALE_MIN = 1;
export const LOCATION_SENSORY_SCALE_MAX = 10;

const DEFAULT_COPY = Object.freeze({
  guidanceText:
    "These 1–10 values are qualitative narrative guidance, not physical measurements. Leave a field blank to inherit the nearest authored parent value or use the runtime default when no parent value exists.",
  visionEyebrow: "Vision",
  visionTitle: "Light and Visibility",
  visionDescription:
    "Describe how much usable light and visual interference normally exist here. Temporary weather, spells, devices, and scene actions can modify these values later.",
  hearingEyebrow: "Hearing",
  hearingTitle: "Sound Environment",
  hearingDescription:
    "Describe the normal sound pressure of the scene and how difficult it is to locate or interpret sounds within it.",
  scentEyebrow: "Scent",
  scentTitle: "Ambient Scent Palette",
  scentDescription:
    "Define the location's normal scent notes and how strongly the environment masks or disperses other scents. Parent and local scent notes can accumulate.",
  emptyScentNotesText:
    "No local scent notes are authored. The location may still inherit scent notes from its parent hierarchy.",
  addScentNoteLabel: "Add Scent Note",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeLocationSensoryScaleInput(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return null;

  return Math.min(
    Math.max(Math.round(parsed), LOCATION_SENSORY_SCALE_MIN),
    LOCATION_SENSORY_SCALE_MAX
  );
}

export function normalizeLocationScentTag(value) {
  return String(value || "")
    .trim()
    .replace(/^\[+|\]+$/g, "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
}

export function normalizeLocationScentTags(value) {
  const seen = new Set();

  return normalizeArray(value).reduce((tags, rawTag) => {
    const tag = normalizeLocationScentTag(rawTag);
    const identity = tag.toLowerCase();

    if (!tag || seen.has(identity)) return tags;

    seen.add(identity);
    tags.push(tag);
    return tags;
  }, []);
}

export function parseLocationScentTagDraft(value) {
  const raw = String(value || "").trim();

  if (!raw) return [];

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return normalizeLocationScentTags(parsed);
      }
    } catch {
      // Fall through to the forgiving comma parser.
    }
  }

  return normalizeLocationScentTags(raw.split(","));
}

export function normalizeLocationScentNote(note = {}, index = 0) {
  const source = normalizeObject(note);

  return {
    ...source,
    loomViewId: source.id || `scent-note-${index}`,
    loomRowIndex: index,
    label: source.label || source.name || "",
    strength: normalizeLocationSensoryScaleInput(source.strength) ?? 5,
    tags: normalizeLocationScentTags(source.tags),
  };
}

export function normalizeLocationSensoryProfile(sensoryProfile = null) {
  const profile = normalizeObject(sensoryProfile);
  const environment = normalizeObject(profile.environment);
  const vision = normalizeObject(environment.VISION || environment.vision);
  const hearing = normalizeObject(environment.HEARING || environment.hearing);
  const scent = normalizeObject(environment.SCENT || environment.scent);

  return {
    profile,
    environment,
    vision,
    hearing,
    scent,
    scentNotes: normalizeArray(scent.notes).map(normalizeLocationScentNote),
  };
}

export function useLocationSensoryEnvironmentFieldsViewModel({
  sensoryProfile = null,
  onChange = null,
} = {}) {
  const [scentTagDrafts, setScentTagDrafts] = useState({});
  const { profile, environment, vision, hearing, scent, scentNotes } =
    normalizeLocationSensoryProfile(sensoryProfile);

  function emitChange(nextProfile) {
    onChange?.(nextProfile);
  }

  function updateSenseField(sense, field, rawValue) {
    const currentSense = normalizeObject(
      environment[sense] || environment[sense.toLowerCase()]
    );
    const nextSense = { ...currentSense };
    const nextValue = normalizeLocationSensoryScaleInput(rawValue);

    if (nextValue === null) {
      delete nextSense[field];
    } else {
      nextSense[field] = nextValue;
    }

    const nextEnvironment = {
      ...environment,
      [sense]: nextSense,
    };

    delete nextEnvironment[sense.toLowerCase()];

    emitChange({
      ...profile,
      environment: nextEnvironment,
    });
  }

  function writeScentNotes(nextNotes) {
    const nextEnvironment = {
      ...environment,
      SCENT: {
        ...scent,
        notes: nextNotes.map((note, index) => {
          const normalized = normalizeLocationScentNote(note, index);
          const { loomViewId: _loomViewId, loomRowIndex: _loomRowIndex, ...storedNote } = normalized;
          return storedNote;
        }),
      },
    };

    delete nextEnvironment.scent;

    emitChange({
      ...profile,
      environment: nextEnvironment,
    });
  }

  function updateScentNote(index, patch) {
    writeScentNotes(
      scentNotes.map((note, noteIndex) =>
        noteIndex === index
          ? {
              ...note,
              ...patch,
            }
          : note
      )
    );
  }

  function changeScentNoteStrength(index, value) {
    updateScentNote(index, {
      strength: normalizeLocationSensoryScaleInput(value) ?? 5,
    });
  }

  function changeScentTagDraft(index, value) {
    setScentTagDrafts((current) => ({
      ...current,
      [index]: value,
    }));
  }

  function addScentTags(index) {
    const additions = parseLocationScentTagDraft(scentTagDrafts[index]);

    if (!additions.length) return;

    const currentTags = scentNotes[index]?.tags || [];
    updateScentNote(index, {
      tags: normalizeLocationScentTags([...currentTags, ...additions]),
    });
    setScentTagDrafts((current) => ({
      ...current,
      [index]: "",
    }));
  }

  function removeScentTag(index, tagToRemove) {
    const identity = normalizeLocationScentTag(tagToRemove).toLowerCase();
    const currentTags = scentNotes[index]?.tags || [];

    updateScentNote(index, {
      tags: currentTags.filter((tag) => tag.toLowerCase() !== identity),
    });
  }

  function addScentNote() {
    writeScentNotes([
      ...scentNotes,
      {
        label: "",
        strength: 5,
        tags: [],
      },
    ]);
    setScentTagDrafts({});
  }

  function removeScentNote(index) {
    writeScentNotes(scentNotes.filter((_note, noteIndex) => noteIndex !== index));
    setScentTagDrafts({});
  }

  return {
    ...DEFAULT_COPY,
    scaleMin: LOCATION_SENSORY_SCALE_MIN,
    scaleMax: LOCATION_SENSORY_SCALE_MAX,
    visionLightLevelValue: vision.lightLevel ?? null,
    visionObstructionLevelValue: vision.obstructionLevel ?? null,
    visionGlareLevelValue: vision.glareLevel ?? null,
    hearingAmbientNoiseLevelValue: hearing.ambientNoiseLevel ?? null,
    hearingObstructionLevelValue: hearing.obstructionLevel ?? null,
    hearingEchoLevelValue: hearing.echoLevel ?? null,
    scentMaskingLevelValue: scent.maskingLevel ?? null,
    scentDispersalLevelValue: scent.dispersalLevel ?? null,
    scentNotes: scentNotes.map((note) => {
      const tagDraft = scentTagDrafts[note.loomRowIndex] || "";

      return {
        ...note,
        tagDraft,
        canAddTags: Boolean(tagDraft.trim()),
      };
    }),
    onChangeVisionLightLevel: (value) =>
      updateSenseField("VISION", "lightLevel", value),
    onChangeVisionObstructionLevel: (value) =>
      updateSenseField("VISION", "obstructionLevel", value),
    onChangeVisionGlareLevel: (value) =>
      updateSenseField("VISION", "glareLevel", value),
    onChangeHearingAmbientNoiseLevel: (value) =>
      updateSenseField("HEARING", "ambientNoiseLevel", value),
    onChangeHearingObstructionLevel: (value) =>
      updateSenseField("HEARING", "obstructionLevel", value),
    onChangeHearingEchoLevel: (value) =>
      updateSenseField("HEARING", "echoLevel", value),
    onChangeScentMaskingLevel: (value) =>
      updateSenseField("SCENT", "maskingLevel", value),
    onChangeScentDispersalLevel: (value) =>
      updateSenseField("SCENT", "dispersalLevel", value),
    onChangeScentNoteLabel: (index, value) =>
      updateScentNote(index, { label: value }),
    onChangeScentNoteStrength: changeScentNoteStrength,
    onChangeScentTagDraft: changeScentTagDraft,
    onAddScentTags: addScentTags,
    onRemoveScentTag: removeScentTag,
    onAddScentNote: addScentNote,
    onRemoveScentNote: removeScentNote,
  };
}
