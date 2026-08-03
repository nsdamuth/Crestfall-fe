import { BookOpen, Sparkles, Theater } from "lucide-react";

export const selectionCardScenarioFixture = {
  label: "Scenario",
  icon: BookOpen,
  value: {
    title: "The Lantern Court",
    subtitle: "A tense diplomatic gathering beneath a failing ward.",
  },
  placeholder: "Select Scenario",
};

export const selectionCardNarratorFixture = {
  label: "Narrator",
  icon: Theater,
  value: {
    title: "The Gilded Witness",
    subtitle: "Measured, observant, and quietly ominous.",
  },
  placeholder: "Select Narrator",
};

export const selectionCardEmptyFixture = {
  label: "Location / Scene",
  icon: Sparkles,
  value: null,
  placeholder: "Optional Location",
};

export const selectionCardTitleOnlyFixture = {
  label: "Scenario",
  icon: BookOpen,
  value: {
    title: "A Quiet Arrival",
  },
  placeholder: "Select Scenario",
};

export const selectionCardMissingIconFixture = {
  label: "Reference",
  icon: null,
  value: null,
  placeholder: "Choose a reference",
};

export const selectionCardLongContentFixture = {
  label: "Location / Scene Reference With An Intentionally Long Label",
  icon: Sparkles,
  value: {
    title: "The Observatory Above the Storm-Wrapped City of Saint Veyra",
    subtitle:
      "A deliberately long supporting description used to verify wrapping, card height, and narrow-layout behavior without changing the selection contract.",
  },
  placeholder: "Optional Location",
};
