export const storylineReferencePickerFixture = Object.freeze({
  stories: [
    {
      id: "story-brasswhisker",
      title: "The Brasswhisker Mystery",
      subtitle:
        "A complete playable package centered on Kessa and a suspicious silver charm.",
    },
    {
      id: "story-old-crescent",
      title: "Old Crescent After Dark",
      subtitle:
        "An open-ended city story spanning workshops, bazaars, and hidden routes.",
    },
  ],
  scenarios: [
    {
      id: "scenario-ledger",
      title: "Charm Ledger Scenario",
      subtitle:
        "A reusable mystery structure for purchases, dropped items, and memory lookup.",
    },
    {
      id: "scenario-market",
      title: "Market Pressure",
      subtitle:
        "A commercial conflict structure with competing merchants and escalating stakes.",
    },
  ],
  selectedReferenceIds: ["story-brasswhisker"],
});

export const storylineReferencePickerEmptyFixture = Object.freeze({
  stories: [],
  scenarios: [],
  selectedReferenceIds: [],
});
