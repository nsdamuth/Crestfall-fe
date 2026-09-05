const noop = () => {};

const tone = (a, b) => `linear-gradient(135deg, ${a}, ${b})`;

export const segmentListSegments = [
  { id: "face", label: "Face", detail: "Auto detected", thumbnailTone: tone("var(--surface-4)", "var(--gold-deep)"), regionInset: "18% 30% 40% 30%" },
  { id: "hair", label: "Hair", detail: "Auto detected", thumbnailTone: tone("var(--surface-3)", "var(--neutral-6)"), regionInset: "8% 25% 55% 25%" },
  { id: "outfit", label: "Outfit", detail: "Linked to Court Regalia", thumbnailTone: tone("var(--surface-4)", "var(--gold-ornament)"), regionInset: "45% 20% 6% 20%" },
  { id: "left-hand", label: "Left hand", detail: "Low confidence", thumbnailTone: tone("var(--surface-3)", "var(--neutral-5)"), regionInset: "55% 70% 20% 8%" },
  { id: "background", label: "Background", detail: "Moonlit gallery", thumbnailTone: tone("var(--surface-2)", "var(--surface-4)"), regionInset: "4% 4% 4% 4%" },
];

export const segmentListFilledFixture = {
  title: "Detected segments",
  helpText: "Pick one region. The edit prompt applies only inside it.",
  segments: segmentListSegments,
  selectedSegmentId: "outfit",
  onSelectSegment: noop,
  onRedetect: noop,
};

export const segmentListEmptyFixture = {
  title: "Detected segments",
  helpText: "",
  segments: [],
  selectedSegmentId: "",
  onSelectSegment: noop,
  onRedetect: null,
};
