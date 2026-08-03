export const roomTemplateSummaryCompleteFixture = {
  eyebrow: "Story",
  summaryRows: [
    { id: "characters", label: "Characters", value: 4 },
    { id: "scenario", label: "Scenario", value: "The Ashen Procession" },
    { id: "narrator", label: "Narrator", value: "The Quiet Chronicler" },
    { id: "location", label: "Location", value: "Vesper Gate" },
  ],
};

export const roomTemplateSummaryEmptyFixture = {
  eyebrow: "Story",
  summaryRows: [
    { id: "characters", label: "Characters", value: "None selected" },
    { id: "scenario", label: "Scenario", value: "Not selected" },
    { id: "narrator", label: "Narrator", value: "Not selected" },
    { id: "location", label: "Location", value: "Optional" },
  ],
};

export const roomTemplateSummaryPartialFixture = {
  eyebrow: "Story",
  summaryRows: [
    { id: "characters", label: "Characters", value: 2 },
    { id: "scenario", label: "Scenario", value: "The Lantern Trial" },
    { id: "narrator", label: "Narrator", value: "Not selected" },
    { id: "location", label: "Location", value: "Optional" },
  ],
};

export const roomTemplateSummaryNoRowsFixture = {
  eyebrow: "Story",
  summaryRows: [],
};

export const roomTemplateSummaryCustomHeadingFixture = {
  eyebrow: "Package Snapshot",
  summaryRows: [
    { id: "characters", label: "Characters", value: 1 },
    { id: "scenario", label: "Scenario", value: "A Narrow Escape" },
  ],
};

export const roomTemplateSummaryLongContentFixture = {
  eyebrow: "Story",
  summaryRows: [
    { id: "characters", label: "Characters", value: 12 },
    {
      id: "scenario",
      label: "Scenario",
      value:
        "The Procession Beyond the Ninth Gate and the Last Cartographer's Unfinished Oath",
    },
    {
      id: "narrator",
      label: "Narrator",
      value:
        "The Patient Archivist Who Records Every Contradiction in the Unremembered Kingdoms",
    },
    {
      id: "location",
      label: "Location",
      value:
        "The Glass Observatory Above the Drowned Capital of Vespera",
    },
  ],
};
