import {
  CREATOR_DIRECTIVE_SECTIONS,
  CREATOR_DIRECTIVES_TOTAL_LIMIT,
} from "./AdvancedPromptingEditor.contract";

const noop = () => {};

function makeLongText(seed, targetLength) {
  const text = `${String(seed || "Directive").trim()} `;
  return text.repeat(Math.ceil(targetLength / text.length)).slice(0, targetLength);
}

function makeSections({ values = {}, expandedIds = [] } = {}) {
  const expanded = new Set(expandedIds);

  return CREATOR_DIRECTIVE_SECTIONS.map((section) => {
    const value = String(values[section.id] || "");

    return {
      ...section,
      value,
      characterCount: value.length,
      expanded: expanded.has(section.id),
    };
  });
}

function countCharacters(sections) {
  return sections.reduce(
    (total, section) => total + Number(section.characterCount || 0),
    0
  );
}

function makeFixture({
  enabled = true,
  values = {},
  expandedIds = [],
  securityStatus = "INACTIVE",
  sanitizedFragmentCount = 0,
} = {}) {
  const sections = makeSections({ values, expandedIds });

  return {
    enabled,
    sections,
    totalCharacters: countCharacters(sections),
    totalLimit: CREATOR_DIRECTIVES_TOTAL_LIMIT,
    securityStatus,
    sanitizedFragmentCount,
    onSetEnabled: noop,
    onToggleSection: noop,
    onUpdateSection: noop,
    onClearSection: noop,
  };
}

export const advancedPromptingDisabledFixture = makeFixture({
  enabled: false,
  securityStatus: "INACTIVE",
});

export const advancedPromptingEnabledEmptyFixture = makeFixture({
  enabled: true,
  securityStatus: "INACTIVE",
  expandedIds: ["core_identity"],
});

export const advancedPromptingApprovedFixture = makeFixture({
  securityStatus: "APPROVED",
  expandedIds: ["core_identity", "portrayal_boundaries"],
  values: {
    core_identity:
      "She values honest craft, enforceable bargains, and understanding how an object works before trusting it.",
    portrayal_boundaries:
      "Do not portray her as a generic mage, passive shopkeeper, thief, or socially rejected outsider.",
  },
});

export const advancedPromptingNeedsRescanFixture = makeFixture({
  securityStatus: "NEEDS_RESCAN",
  expandedIds: ["voice_and_verbal_texture"],
  values: {
    voice_and_verbal_texture:
      "She speaks with deliberate precision, favors material metaphors, and uses dry humor when testing another person's confidence.",
  },
});

export const advancedPromptingSanitizedFixture = makeFixture({
  securityStatus: "APPROVED_WITH_SANITIZATION",
  sanitizedFragmentCount: 2,
  expandedIds: ["relationship_behavior"],
  values: {
    relationship_behavior:
      "Trust is earned through consistent action. She becomes warmer slowly, but she does not ignore verified betrayal or abandon established boundaries.",
  },
});

export const advancedPromptingReviewRequiredFixture = makeFixture({
  securityStatus: "REVIEW_REQUIRED",
  expandedIds: ["power_escalation"],
  values: {
    power_escalation:
      "When a verified escalation state is active, her speech becomes shorter and her priorities narrow toward immediate containment.",
  },
});

export const advancedPromptingBlockedFixture = makeFixture({
  securityStatus: "BLOCKED",
  expandedIds: ["portrayal_boundaries"],
  values: {
    portrayal_boundaries:
      "This fixture represents directives that require revision before they can become active.",
  },
});

const nearLimitValues = Object.fromEntries(
  CREATOR_DIRECTIVE_SECTIONS.map((section) => [
    section.id,
    makeLongText(
      `${section.shortLabel} guidance remains specific and internally consistent.`,
      Math.floor(section.maxLength * 0.9)
    ),
  ])
);

export const advancedPromptingNearLimitFixture = makeFixture({
  securityStatus: "NEEDS_RESCAN",
  expandedIds: ["core_identity"],
  values: nearLimitValues,
});

export const ADVANCED_PROMPTING_FIXTURES = Object.freeze({
  disabled: advancedPromptingDisabledFixture,
  enabledEmpty: advancedPromptingEnabledEmptyFixture,
  approvedExample: advancedPromptingApprovedFixture,
  needsRescan: advancedPromptingNeedsRescanFixture,
  approvedWithSanitization: advancedPromptingSanitizedFixture,
  reviewRequired: advancedPromptingReviewRequiredFixture,
  blocked: advancedPromptingBlockedFixture,
  nearLimit: advancedPromptingNearLimitFixture,
});
