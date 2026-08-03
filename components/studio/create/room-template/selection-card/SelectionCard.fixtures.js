import { BookOpen, Sparkles, Theater } from "lucide-react";

export const selectionCardEditScenarioFixture = {
  label: "Scenario",
  icon: BookOpen,
  value: {
    title: "The Ashen Parliament",
    subtitle: "A brittle alliance convenes after the northern wards fail.",
  },
  placeholder: "Select Scenario",
};

export const selectionCardEditNarratorFixture = {
  label: "Narrator",
  icon: Theater,
  value: {
    title: "The Lantern Archivist",
    subtitle: "Patient, precise, and unwilling to omit inconvenient truths.",
  },
  placeholder: "Select Narrator",
};

export const selectionCardEditEmptyFixture = {
  label: "Location / Scene",
  icon: Sparkles,
  value: null,
  placeholder: "Optional Location",
};

export const selectionCardEditTitleOnlyFixture = {
  label: "Scenario",
  icon: BookOpen,
  value: {
    title: "The Last Ferry",
  },
  placeholder: "Select Scenario",
};

export const selectionCardEditMissingIconFixture = {
  label: "Reference",
  icon: null,
  value: null,
  placeholder: "Choose a reference",
};

export const selectionCardEditLongContentFixture = {
  label: "Location / Scene Reference With An Intentionally Long Label",
  icon: Sparkles,
  value: {
    title: "The Collapsed Gallery Beneath the Western Hall of Saint Orison",
    subtitle:
      "A deliberately long supporting description used to verify wrapping, card height, and narrow-layout behavior inside the existing Story edit workflow.",
  },
  placeholder: "Optional Location",
};
