"use client";

import { useMemo, useState } from "react";

import {
  createStructuredRegistryEntryFromSample,
  getStructuredRegistrySample,
  listStructuredRegistrySampleCategories,
  listStructuredRegistrySamples,
} from "./structuredRegistrySampleLibrary.js";

function toOptions(values = []) {
  return [
    { value: "ALL", label: "All samples" },
    ...values.map((value) => ({ value, label: value })),
  ];
}

export function useStructuredRegistrySampleLibraryViewModel({
  registryType,
  onApply = null,
  onClose = null,
} = {}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selectedSampleId, setSelectedSampleId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const samples = useMemo(
    () => listStructuredRegistrySamples(registryType, { query, category }),
    [registryType, query, category]
  );
  const categoryOptions = useMemo(
    () => toOptions(listStructuredRegistrySampleCategories(registryType)),
    [registryType]
  );
  const selectedSample = selectedSampleId
    ? getStructuredRegistrySample(registryType, selectedSampleId)
    : null;

  function chooseCategory(value) {
    setCategory(value || "ALL");
    setSelectedSampleId("");
    setStatusMessage("");
  }

  function chooseSample(sampleId) {
    setSelectedSampleId(sampleId || "");
    setStatusMessage("");
  }

  function loadSample() {
    const entry = createStructuredRegistryEntryFromSample(
      registryType,
      selectedSampleId
    );

    if (!entry) {
      setStatusMessage("Choose a sample before loading it.");
      return;
    }

    onApply?.(entry, selectedSample);
    setStatusMessage("Sample loaded into the open builder.");
    onClose?.();
  }

  const noun = String(registryType || "").toUpperCase() === "EVENT_REGISTRY"
    ? "Event"
    : "Quest";

  return {
    title: `${noun} Sample Library`,
    description:
      `Load a small educational ${noun.toLowerCase()} example into the open registry, then inspect and rewrite it. Samples are learning aids only; they are copied into your draft and have no runtime or shared authority.`,
    query,
    category,
    categoryOptions,
    samples,
    selectedSampleId,
    selectedSample,
    statusMessage,
    canApply: Boolean(selectedSample),
    onClose,
    onChangeQuery: (value) => setQuery(String(value || "")),
    onChooseCategory: chooseCategory,
    onChooseSample: chooseSample,
    onApplySample: loadSample,
  };
}
