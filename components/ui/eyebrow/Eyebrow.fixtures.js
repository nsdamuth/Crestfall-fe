export const eyebrowFixtures = [
  {
    id: "short-label",
    label: "Short Label",
    props: {
      children: "Choose their kind",
      showRuleMark: true,
    },
  },
  {
    id: "long-label",
    label: "Long Label (wraps)",
    props: {
      children:
        "A deliberately long eyebrow label used to verify wrapping behavior stays readable at narrow widths",
      showRuleMark: true,
    },
  },
  {
    id: "no-rule-mark",
    label: "No Rule Mark",
    props: {
      children: "Studio",
      showRuleMark: false,
    },
  },
];
