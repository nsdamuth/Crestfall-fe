"use client";

import { useMemo } from "react";

import { useStorylineReferenceOptions } from "@/components/studio/storylines/hooks/useStorylineReferenceOptions";
import { normalizeStorylineData } from "@/lib/shared/storylines/storylineAuthoring.mjs";

const SECTION_COPY = Object.freeze({
  sequence: {
    eyebrow: "Sequence",
    title: "Ordered Stories and Scenarios",
    body: "Add saved Stories or Scenarios, place them in authored order, and keep the same chat continuous across the sequence.",
  },
  transitions: {
    eyebrow: "Transitions",
    title: "Node Completion and Activation",
    body: "Configure how each node ends, whether play returns to open world, and what makes the following node available.",
  },
  openWorld: {
    eyebrow: "Continuity",
    title: "Open-World Interludes",
    body: "Control what remains active after a Story or Scenario ends and before the next Storyline node becomes eligible.",
  },
});

export function useStorylineFieldsSectionViewModel({
  section = "sequence",
  form = {},
  updateDataField = null,
} = {}) {
  const storylineData = useMemo(
    () => normalizeStorylineData(form?.data || {}),
    [form?.data]
  );
  const { stories, scenarios, loadError, loadStatus } =
    useStorylineReferenceOptions();

  const activeSection = SECTION_COPY[section] ? section : "sequence";
  const sectionCopy = SECTION_COPY[activeSection];
  const isOpenWorldSection = activeSection === "openWorld";
  const editorMode = activeSection === "transitions" ? "transitions" : "sequence";

  function replaceStorylineData(nextData) {
    const normalized = normalizeStorylineData(nextData);

    Object.entries(normalized).forEach(([field, value]) => {
      updateDataField?.(field, value);
    });
  }

  return {
    activeSection,
    sectionEyebrow: sectionCopy.eyebrow,
    sectionTitle: sectionCopy.title,
    sectionDescription: sectionCopy.body,
    storylineData,
    stories,
    scenarios,
    loadError,
    loadStatus,
    isOpenWorldSection,
    editorMode,
    onReplaceStorylineData: replaceStorylineData,
  };
}
