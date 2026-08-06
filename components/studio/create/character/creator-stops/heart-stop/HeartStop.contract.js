import { interestOptions, speechStyleOptions } from "../../constants/constants";

export const HEART_TEXT_MAX_LENGTH = 800;
export const HEART_NOTES_MAX_LENGTH = 480;

export const SPEECH_STYLE_OPTIONS = speechStyleOptions;
export const INTEREST_OPTIONS = interestOptions;

export const VERBOSITY_OPTIONS = [
  { value: "1", label: "1 · Terse" },
  { value: "2", label: "2 · Concise" },
  { value: "3", label: "3 · Balanced" },
  { value: "4", label: "4 · Expressive" },
  { value: "5", label: "5 · Highly verbose" },
];
