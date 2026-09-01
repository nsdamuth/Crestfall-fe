export const NARRATOR_DIRECTIVES_CONTRACT_VERSION =
  "narrator.creatorDirectives.v1";

export const NARRATOR_DIRECTIVES_EDITOR_VIEW_CONTRACT_VERSION = "1.0.0";

export const NARRATOR_DIRECTIVES_TOTAL_LIMIT = 16000;

export const NARRATOR_DIRECTIVE_SECTIONS = Object.freeze([
  {
    id: "narrative_identity",
    label: "Narrative Identity & Voice",
    shortLabel: "Voice",
    maxLength: 3000,
    activation: "ALWAYS",
    description:
      "The Narrator's own prose voice, observational temperament, sentence rhythm, and stable storytelling personality. It does not define Character voices.",
    placeholder:
      "Describe the Narrator's stable prose voice, observational temperament, sentence rhythm, and storytelling personality...",
  },
  {
    id: "scene_framing",
    label: "Scene Framing & Description",
    shortLabel: "Framing",
    maxLength: 2500,
    activation: "ALWAYS",
    description:
      "How already-authorized scenes are framed and described: sensory emphasis, spatial clarity, descriptive focus, and narrative distance.",
    placeholder:
      "Describe how established scenes should be framed, what sensory details deserve emphasis, and how spatial clarity should be maintained...",
  },
  {
    id: "tension_and_reveal",
    label: "Tension, Mystery & Reveal Discipline",
    shortLabel: "Tension",
    maxLength: 2500,
    activation: "CONTEXTUAL",
    description:
      "How suspense, clues, uncertainty, and reveals are presented after Crestfall establishes what is actually known and true.",
    placeholder:
      "Describe how to present suspense, clues, uncertainty, dramatic irony, and already-authorized reveals without inventing facts...",
  },
  {
    id: "transitions_and_time",
    label: "Transitions & Temporal Texture",
    shortLabel: "Transitions",
    maxLength: 2000,
    activation: "CONTEXTUAL",
    description:
      "How authorized travel, downtime, montage, and time passage are narrated. This section cannot authorize a time skip or Story progression.",
    placeholder:
      "Describe how authorized travel, downtime, montage, scene transitions, and time passage should feel in the prose...",
  },
  {
    id: "world_presentation",
    label: "World & Environment Presentation",
    shortLabel: "World",
    maxLength: 2500,
    activation: "CONTEXTUAL",
    description:
      "How established locations, weather, crowds, institutions, and environmental activity are rendered without changing world state.",
    placeholder:
      "Describe how established locations, weather, crowds, institutions, and environmental activity should be presented...",
  },
  {
    id: "ensemble_presentation",
    label: "Cast & Ensemble Presentation",
    shortLabel: "Ensemble",
    maxLength: 2500,
    activation: "CONTEXTUAL",
    description:
      "How authorized cast presence and visible ensemble activity are staged without taking dialogue or action control from Characters or the Player Character.",
    placeholder:
      "Describe ensemble staging, entrances, visible reactions, crowd texture, and attention balance without assigning unauthorized dialogue or actions...",
  },
  {
    id: "theme_and_motif",
    label: "Theme & Motif Handling",
    shortLabel: "Theme",
    maxLength: 2000,
    activation: "CONTEXTUAL",
    description:
      "Optional recurring imagery, motifs, symbolic emphasis, and genre texture when supported by the current scene.",
    placeholder:
      "Describe recurring imagery, motifs, symbolism, or genre texture that may be emphasized when the authorized scene supports it...",
  },
  {
    id: "narrative_boundaries",
    label: "Narrative Boundaries",
    shortLabel: "Boundaries",
    maxLength: 2500,
    activation: "ALWAYS",
    description:
      "Anti-drift narration limits: omniscience, premature reveals, player control, character control, repetitive habits, or unsupported assertions the Narrator must avoid.",
    placeholder:
      "List narration boundaries and anti-drift guidance, such as avoiding omniscient knowledge, premature reveals, Player Character control, Character control, or unsupported assertions...",
  },
]);

export const EMPTY_NARRATOR_DIRECTIVE_SOURCE = Object.freeze(
  Object.fromEntries(
    NARRATOR_DIRECTIVE_SECTIONS.map((section) => [section.id, ""])
  )
);

export function getNarratorDirectiveCharacterCount(source = {}) {
  return NARRATOR_DIRECTIVE_SECTIONS.reduce(
    (total, section) => total + String(source?.[section.id] || "").length,
    0
  );
}
