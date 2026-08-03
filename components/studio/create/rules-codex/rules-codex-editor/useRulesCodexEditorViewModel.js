"use client";

import { useMemo, useState } from "react";

import {
  EMPTY_RULES_CODEX_ACTIVATION,
  RULES_CODEX_ACTIVATION_MODES,
  RULES_CODEX_ACTIVATION_SIGNAL_FIELDS,
  RULES_CODEX_AUTHORITY,
  RULES_CODEX_CONTRACT_VERSION,
  RULES_CODEX_EDITOR_LIMITS,
  RULES_CODEX_KNOWN_DOMAINS,
  RULES_CODEX_KNOWN_SCOPE_TYPES,
  RULES_CODEX_MATCH_MODES,
} from "./RulesCodexEditor.contract.js";

const IDENTIFIER_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;
const ACTIVATION_VALUE_PATTERN = /^[A-Z0-9][A-Z0-9._:-]*$/;

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function normalizeEnum(value, allowed, fallback) {
  const normalized = normalizeString(value).toUpperCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function uniqueStrings(values, { uppercase = false, lowercase = false } = {}) {
  const seen = new Set();
  const result = [];

  for (const value of normalizeArray(values)) {
    const text = normalizeString(value);
    const candidate = uppercase
      ? text.toUpperCase()
      : lowercase
        ? text.toLowerCase()
        : text;

    if (!candidate || seen.has(candidate)) continue;

    seen.add(candidate);
    result.push(candidate);

    if (result.length >= RULES_CODEX_EDITOR_LIMITS.maxActivationValuesPerField) {
      break;
    }
  }

  return result;
}

function normalizeActivation(value) {
  const source = normalizeObject(value);

  return {
    mode: normalizeEnum(
      source.mode,
      RULES_CODEX_ACTIVATION_MODES,
      EMPTY_RULES_CODEX_ACTIVATION.mode
    ),
    matchMode: normalizeEnum(
      source.matchMode,
      RULES_CODEX_MATCH_MODES,
      EMPTY_RULES_CODEX_ACTIVATION.matchMode
    ),
    domains: uniqueStrings(source.domains, { uppercase: true }),
    commandIds: uniqueStrings(source.commandIds, { uppercase: true }),
    trackerIds: uniqueStrings(source.trackerIds, { uppercase: true }),
    guardIds: uniqueStrings(source.guardIds, { uppercase: true }),
    registryRefs: uniqueStrings(source.registryRefs, { uppercase: true }),
    tags: uniqueStrings(source.tags, { uppercase: true }),
    actorTypes: uniqueStrings(source.actorTypes, { uppercase: true }),
    scopeTypes: uniqueStrings(source.scopeTypes, { uppercase: true }),
  };
}

function normalizeSection(value, index) {
  const source = normalizeObject(value);

  return {
    id: normalizeString(source.id).toLowerCase(),
    title: normalizeString(source.title),
    body: typeof source.body === "string" ? source.body : "",
    authority: RULES_CODEX_AUTHORITY,
    enabled: source.enabled !== false,
    priority: normalizeInteger(source.priority, 50, 0, 100),
    order: index,
    activation: normalizeActivation(source.activation),
    metadata: normalizeObject(source.metadata),
  };
}

export function normalizeRulesCodexEditorValue(value) {
  const source = normalizeObject(value);
  const sections = normalizeArray(source.sections)
    .slice(0, RULES_CODEX_EDITOR_LIMITS.maxSections)
    .map(normalizeSection);
  const selectionPolicy = normalizeObject(source.selectionPolicy);

  return {
    contractVersion: RULES_CODEX_CONTRACT_VERSION,
    summary:
      typeof source.summary === "string"
        ? source.summary.slice(0, RULES_CODEX_EDITOR_LIMITS.maxSummaryLength)
        : "",
    enabled: source.enabled !== false,
    selectionPolicy: {
      maxSelectedSections: normalizeInteger(
        selectionPolicy.maxSelectedSections,
        RULES_CODEX_EDITOR_LIMITS.defaultMaxSelectedSections,
        1,
        RULES_CODEX_EDITOR_LIMITS.maxSelectedSections
      ),
      maxContextCharacters: normalizeInteger(
        selectionPolicy.maxContextCharacters,
        RULES_CODEX_EDITOR_LIMITS.defaultMaxContextCharacters,
        1000,
        RULES_CODEX_EDITOR_LIMITS.maxContextCharacters
      ),
    },
    sections,
    metadata: normalizeObject(source.metadata),
  };
}

function createIssue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

export function validateRulesCodexEditorValue(codex) {
  const issues = [];
  const sectionIds = new Set();
  let totalBodyCharacters = 0;

  if (!codex.sections.length) {
    issues.push(
      createIssue(
        "RULES_CODEX_SECTIONS_REQUIRED",
        "sections",
        "Add at least one rules section before this Codex can be saved."
      )
    );
  }

  codex.sections.forEach((section, index) => {
    const path = `sections[${index}]`;

    if (!section.id) {
      issues.push(
        createIssue(
          "RULES_CODEX_SECTION_ID_REQUIRED",
          `${path}.id`,
          "Section identifier is required."
        )
      );
    } else {
      if (section.id.length > RULES_CODEX_EDITOR_LIMITS.maxSectionIdLength) {
        issues.push(
          createIssue(
            "RULES_CODEX_SECTION_ID_TOO_LONG",
            `${path}.id`,
            `Section identifier cannot exceed ${RULES_CODEX_EDITOR_LIMITS.maxSectionIdLength} characters.`
          )
        );
      }

      if (!IDENTIFIER_PATTERN.test(section.id)) {
        issues.push(
          createIssue(
            "RULES_CODEX_SECTION_ID_INVALID",
            `${path}.id`,
            "Use lowercase letters, numbers, dots, colons, underscores, or hyphens."
          )
        );
      }

      if (sectionIds.has(section.id)) {
        issues.push(
          createIssue(
            "RULES_CODEX_SECTION_ID_DUPLICATE",
            `${path}.id`,
            `Section identifier “${section.id}” is already in use.`
          )
        );
      }

      sectionIds.add(section.id);
    }

    if (!section.title) {
      issues.push(
        createIssue(
          "RULES_CODEX_SECTION_TITLE_REQUIRED",
          `${path}.title`,
          "Section title is required."
        )
      );
    }

    if (!normalizeString(section.body)) {
      issues.push(
        createIssue(
          "RULES_CODEX_SECTION_BODY_REQUIRED",
          `${path}.body`,
          "Section guidance is required."
        )
      );
    }

    totalBodyCharacters += section.body.length;

    for (const signal of RULES_CODEX_ACTIVATION_SIGNAL_FIELDS) {
      for (const value of section.activation[signal.key] || []) {
        if (!ACTIVATION_VALUE_PATTERN.test(value)) {
          issues.push(
            createIssue(
              "RULES_CODEX_ACTIVATION_VALUE_INVALID",
              `${path}.activation.${signal.key}`,
              `${signal.label} values must use uppercase letters, numbers, dots, colons, underscores, or hyphens.`
            )
          );
          break;
        }
      }
    }

    if (
      section.activation.mode === "CONTEXTUAL" &&
      !RULES_CODEX_ACTIVATION_SIGNAL_FIELDS.some(
        (signal) => (section.activation[signal.key] || []).length > 0
      )
    ) {
      issues.push(
        createIssue(
          "RULES_CODEX_CONTEXTUAL_SIGNALS_REQUIRED",
          `${path}.activation`,
          "Contextual sections need at least one activation signal.",
          "WARNING"
        )
      );
    }
  });

  if (totalBodyCharacters > RULES_CODEX_EDITOR_LIMITS.maxTotalBodyCharacters) {
    issues.push(
      createIssue(
        "RULES_CODEX_TOTAL_BODY_LIMIT_EXCEEDED",
        "sections",
        `Combined section guidance cannot exceed ${RULES_CODEX_EDITOR_LIMITS.maxTotalBodyCharacters.toLocaleString()} characters.`
      )
    );
  }

  return issues;
}

function makeSectionId(existingSections) {
  const existingIds = new Set(existingSections.map((section) => section.id));
  let suffix = 1;
  let candidate = "new-section";

  while (existingIds.has(candidate)) {
    suffix += 1;
    candidate = `new-section-${suffix}`;
  }

  return candidate;
}

function makeEmptySection(existingSections) {
  return {
    id: makeSectionId(existingSections),
    title: "",
    body: "",
    authority: RULES_CODEX_AUTHORITY,
    enabled: true,
    priority: 50,
    order: existingSections.length,
    activation: {
      ...EMPTY_RULES_CODEX_ACTIVATION,
      domains: [],
      commandIds: [],
      trackerIds: [],
      guardIds: [],
      registryRefs: [],
      tags: [],
      actorTypes: [],
      scopeTypes: [],
    },
    metadata: {},
  };
}

function parseActivationInput(value) {
  return uniqueStrings(String(value || "").split(/[\n,]+/), { uppercase: true });
}

function makeDraftValue(codex, updates = {}) {
  return normalizeRulesCodexEditorValue({
    ...codex,
    ...updates,
  });
}

export function useRulesCodexEditorViewModel({ value, onChange } = {}) {
  const normalizedValue = useMemo(() => normalizeRulesCodexEditorValue(value), [value]);
  const [expandedSectionIds, setExpandedSectionIds] = useState(() =>
    new Set(normalizedValue.sections.slice(0, 1).map((section) => section.id))
  );
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);

  function emit(nextValue) {
    onChange?.(normalizeRulesCodexEditorValue(nextValue));
  }

  function applyJsonCodex(nextCodex) {
    const next = normalizeRulesCodexEditorValue(nextCodex);
    setExpandedSectionIds(
      new Set(next.sections.slice(0, 1).map((section) => section.id))
    );
    emit(next);
  }

  function setEnabled(enabled) {
    emit(makeDraftValue(normalizedValue, { enabled }));
  }

  function updateSummary(summary) {
    emit(
      makeDraftValue(normalizedValue, {
        summary: String(summary || "").slice(
          0,
          RULES_CODEX_EDITOR_LIMITS.maxSummaryLength
        ),
      })
    );
  }

  function updateSelectionPolicy(field, value) {
    if (!['maxSelectedSections', 'maxContextCharacters'].includes(field)) {
      return;
    }

    const nextPolicy = {
      ...normalizedValue.selectionPolicy,
      [field]: value,
    };

    emit(
      makeDraftValue(normalizedValue, {
        selectionPolicy: nextPolicy,
      })
    );
  }

  function addSection() {
    if (normalizedValue.sections.length >= RULES_CODEX_EDITOR_LIMITS.maxSections) {
      return;
    }

    const nextSection = makeEmptySection(normalizedValue.sections);
    const nextSections = [...normalizedValue.sections, nextSection];

    setExpandedSectionIds((current) => new Set([...current, nextSection.id]));
    emit(makeDraftValue(normalizedValue, { sections: nextSections }));
  }

  function removeSection(sectionId) {
    const nextSections = normalizedValue.sections
      .filter((section) => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));

    setExpandedSectionIds((current) => {
      const next = new Set(current);
      next.delete(sectionId);
      return next;
    });

    emit(makeDraftValue(normalizedValue, { sections: nextSections }));
  }

  function moveSection(sectionId, direction) {
    const index = normalizedValue.sections.findIndex(
      (section) => section.id === sectionId
    );
    const offset = direction === "UP" ? -1 : direction === "DOWN" ? 1 : 0;
    const targetIndex = index + offset;

    if (
      index < 0 ||
      !offset ||
      targetIndex < 0 ||
      targetIndex >= normalizedValue.sections.length
    ) {
      return;
    }

    const nextSections = [...normalizedValue.sections];
    const [section] = nextSections.splice(index, 1);
    nextSections.splice(targetIndex, 0, section);

    emit(
      makeDraftValue(normalizedValue, {
        sections: nextSections.map((item, order) => ({ ...item, order })),
      })
    );
  }

  function toggleSection(sectionId) {
    setExpandedSectionIds((current) => {
      const next = new Set(current);

      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }

      return next;
    });
  }

  function updateSection(sectionId, field, value) {
    const allowedFields = new Set([
      "id",
      "title",
      "body",
      "enabled",
      "priority",
      "activationMode",
      "matchMode",
    ]);

    if (!allowedFields.has(field)) return;

    const nextSections = normalizedValue.sections.map((section) => {
      if (section.id !== sectionId) return section;

      if (field === "activationMode") {
        return {
          ...section,
          activation: {
            ...section.activation,
            mode: normalizeEnum(
              value,
              RULES_CODEX_ACTIVATION_MODES,
              "CONTEXTUAL"
            ),
          },
        };
      }

      if (field === "matchMode") {
        return {
          ...section,
          activation: {
            ...section.activation,
            matchMode: normalizeEnum(value, RULES_CODEX_MATCH_MODES, "ANY"),
          },
        };
      }

      if (field === "id") {
        const nextId = String(value || "")
          .trim()
          .toLowerCase()
          .slice(0, RULES_CODEX_EDITOR_LIMITS.maxSectionIdLength);

        setExpandedSectionIds((current) => {
          if (!current.has(section.id) || nextId === section.id) return current;
          const next = new Set(current);
          next.delete(section.id);
          if (nextId) next.add(nextId);
          return next;
        });

        return { ...section, id: nextId };
      }

      if (field === "title") {
        return {
          ...section,
          title: String(value || "").slice(
            0,
            RULES_CODEX_EDITOR_LIMITS.maxSectionTitleLength
          ),
        };
      }

      if (field === "body") {
        const currentBodyCharacters = normalizedValue.sections.reduce(
          (total, candidate) =>
            total + (candidate.id === sectionId ? 0 : candidate.body.length),
          0
        );
        const remainingTotal = Math.max(
          0,
          RULES_CODEX_EDITOR_LIMITS.maxTotalBodyCharacters -
            currentBodyCharacters
        );
        const maxLength = Math.min(
          RULES_CODEX_EDITOR_LIMITS.maxSectionBodyLength,
          remainingTotal
        );

        return {
          ...section,
          body: String(value || "").slice(0, maxLength),
        };
      }

      if (field === "priority") {
        return {
          ...section,
          priority: normalizeInteger(value, section.priority, 0, 100),
        };
      }

      return {
        ...section,
        [field]: field === "enabled" ? value === true : value,
      };
    });

    emit(makeDraftValue(normalizedValue, { sections: nextSections }));
  }

  function updateActivationInput(sectionId, field, value) {
    if (!RULES_CODEX_ACTIVATION_SIGNAL_FIELDS.some((item) => item.key === field)) {
      return;
    }

    const nextSections = normalizedValue.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            activation: {
              ...section.activation,
              [field]: parseActivationInput(value),
            },
          }
        : section
    );

    emit(makeDraftValue(normalizedValue, { sections: nextSections }));
  }

  function clearSection(sectionId) {
    const nextSections = normalizedValue.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            title: "",
            body: "",
            activation: normalizeActivation({}),
          }
        : section
    );

    emit(makeDraftValue(normalizedValue, { sections: nextSections }));
  }

  const validationIssues = validateRulesCodexEditorValue(normalizedValue);
  const sectionIssues = new Map();
  const globalIssues = [];

  for (const issue of validationIssues) {
    const sectionMatch = issue.path.match(/^sections\[(\d+)\]/);

    if (!sectionMatch) {
      globalIssues.push(issue);
      continue;
    }

    const sectionIndex = Number(sectionMatch[1]);
    const section = normalizedValue.sections[sectionIndex];

    if (!section) {
      globalIssues.push(issue);
      continue;
    }

    const current = sectionIssues.get(section.id) || [];
    current.push(issue);
    sectionIssues.set(section.id, current);
  }

  const totalBodyCharacters = normalizedValue.sections.reduce(
    (total, section) => total + section.body.length,
    0
  );

  return {
    codex: normalizedValue,
    enabled: normalizedValue.enabled,
    summary: normalizedValue.summary,
    summaryCharacterCount: normalizedValue.summary.length,
    summaryCharacterLimit: RULES_CODEX_EDITOR_LIMITS.maxSummaryLength,
    maxSelectedSections: normalizedValue.selectionPolicy.maxSelectedSections,
    maxContextCharacters: normalizedValue.selectionPolicy.maxContextCharacters,
    maxSelectedSectionsLimit: RULES_CODEX_EDITOR_LIMITS.maxSelectedSections,
    maxContextCharactersLimit: RULES_CODEX_EDITOR_LIMITS.maxContextCharacters,
    sections: normalizedValue.sections.map((section, index) => ({
      id: section.id,
      title: section.title,
      body: section.body,
      enabled: section.enabled,
      priority: section.priority,
      order: section.order,
      authorityLabel: RULES_CODEX_AUTHORITY,
      activationMode: section.activation.mode,
      matchMode: section.activation.matchMode,
      activationInputs: Object.fromEntries(
        RULES_CODEX_ACTIVATION_SIGNAL_FIELDS.map((field) => [
          field.key,
          (section.activation[field.key] || []).join(", "),
        ])
      ),
      bodyCharacterCount: section.body.length,
      bodyCharacterLimit: RULES_CODEX_EDITOR_LIMITS.maxSectionBodyLength,
      expanded: expandedSectionIds.has(section.id) || (index === 0 && !section.id),
      issues: sectionIssues.get(section.id) || [],
    })),
    totalBodyCharacters,
    totalBodyCharacterLimit: RULES_CODEX_EDITOR_LIMITS.maxTotalBodyCharacters,
    sectionCount: normalizedValue.sections.length,
    sectionLimit: RULES_CODEX_EDITOR_LIMITS.maxSections,
    globalIssues,
    knownDomains: RULES_CODEX_KNOWN_DOMAINS,
    knownScopeTypes: RULES_CODEX_KNOWN_SCOPE_TYPES,
    activationSignalFields: RULES_CODEX_ACTIVATION_SIGNAL_FIELDS,
    jsonEditorOpen,
    onOpenJsonEditor: () => setJsonEditorOpen(true),
    onCloseJsonEditor: () => setJsonEditorOpen(false),
    onApplyJsonCodex: applyJsonCodex,
    onSetEnabled: setEnabled,
    onUpdateSummary: updateSummary,
    onUpdateSelectionPolicy: updateSelectionPolicy,
    onAddSection: addSection,
    onRemoveSection: removeSection,
    onMoveSection: moveSection,
    onToggleSection: toggleSection,
    onUpdateSection: updateSection,
    onUpdateActivationInput: updateActivationInput,
    onClearSection: clearSection,
  };
}
