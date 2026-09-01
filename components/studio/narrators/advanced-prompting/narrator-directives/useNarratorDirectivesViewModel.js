"use client";

import { useMemo, useState } from "react";
import {
  EMPTY_NARRATOR_DIRECTIVE_SOURCE,
  getNarratorDirectiveCharacterCount,
  NARRATOR_DIRECTIVE_SECTIONS,
  NARRATOR_DIRECTIVES_CONTRACT_VERSION,
  NARRATOR_DIRECTIVES_TOTAL_LIMIT,
} from "./NarratorDirectivesEditor.contract";

const VIEW_SECURITY_STATUSES = new Set([
  "APPROVED",
  "APPROVED_WITH_SANITIZATION",
  "NEEDS_RESCAN",
  "REVIEW_REQUIRED",
  "BLOCKED",
  "INACTIVE",
]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeSource(value) {
  const source = normalizeObject(normalizeObject(value).source);

  return Object.fromEntries(
    NARRATOR_DIRECTIVE_SECTIONS.map((section) => [
      section.id,
      typeof source[section.id] === "string" ? source[section.id] : "",
    ])
  );
}

function normalizeSecurityStatus(security) {
  const status = String(
    normalizeObject(security).status || "INACTIVE"
  ).toUpperCase();

  return VIEW_SECURITY_STATUSES.has(status) ? status : "NEEDS_RESCAN";
}

function normalizeSanitizedFragmentCount(security) {
  const count = Number.parseInt(
    normalizeObject(security).sanitized_fragment_count,
    10
  );

  return Number.isFinite(count) && count > 0 ? count : 0;
}

function makeDraftValue(value, updates = {}) {
  const current = normalizeObject(value);

  return {
    contract_version: NARRATOR_DIRECTIVES_CONTRACT_VERSION,
    enabled: current.enabled === true,
    source: normalizeSource(current),
    compiled: current.compiled || null,
    security: normalizeObject(current.security),
    ...updates,
  };
}

function getDirtySecurityStatus({ enabled, source }) {
  const totalCharacters = getNarratorDirectiveCharacterCount(source);

  if (!enabled || !totalCharacters) {
    return {
      status: "INACTIVE",
      source_hash: null,
      scanned_at: null,
    };
  }

  return {
    status: "NEEDS_RESCAN",
    source_hash: null,
    scanned_at: null,
  };
}

export function useNarratorDirectivesViewModel({ value, onChange } = {}) {
  const normalizedValue = useMemo(() => makeDraftValue(value), [value]);
  const source = normalizedValue.source || EMPTY_NARRATOR_DIRECTIVE_SOURCE;
  const totalCharacters = getNarratorDirectiveCharacterCount(source);
  const [expandedSectionIds, setExpandedSectionIds] = useState(() =>
    new Set(
      NARRATOR_DIRECTIVE_SECTIONS.filter((section) => source[section.id]).map(
        (section) => section.id
      )
    )
  );

  function emit(nextValue) {
    onChange?.(nextValue);
  }

  function setEnabled(enabled) {
    const nextSource = normalizeSource(normalizedValue);

    emit(
      makeDraftValue(normalizedValue, {
        enabled,
        source: nextSource,
        compiled: null,
        security: getDirtySecurityStatus({ enabled, source: nextSource }),
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

  function updateSection(sectionId, nextText) {
    const section = NARRATOR_DIRECTIVE_SECTIONS.find(
      (candidate) => candidate.id === sectionId
    );

    if (!section) return;

    const currentText = source[sectionId] || "";
    const otherCharacters = totalCharacters - currentText.length;
    const allowedByTotal = Math.max(
      0,
      NARRATOR_DIRECTIVES_TOTAL_LIMIT - otherCharacters
    );
    const allowedLength = Math.min(section.maxLength, allowedByTotal);
    const safeText = String(nextText || "").slice(0, allowedLength);
    const nextSource = {
      ...source,
      [sectionId]: safeText,
    };

    emit(
      makeDraftValue(normalizedValue, {
        enabled: true,
        source: nextSource,
        compiled: null,
        security: getDirtySecurityStatus({ enabled: true, source: nextSource }),
      })
    );
  }

  function clearSection(sectionId) {
    updateSection(sectionId, "");
  }

  return {
    enabled: normalizedValue.enabled,
    sections: NARRATOR_DIRECTIVE_SECTIONS.map((section) => ({
      ...section,
      value: source[section.id] || "",
      characterCount: (source[section.id] || "").length,
      expanded: expandedSectionIds.has(section.id),
    })),
    totalCharacters,
    totalLimit: NARRATOR_DIRECTIVES_TOTAL_LIMIT,
    securityStatus: normalizeSecurityStatus(normalizedValue.security),
    sanitizedFragmentCount: normalizeSanitizedFragmentCount(
      normalizedValue.security
    ),
    onSetEnabled: setEnabled,
    onToggleSection: toggleSection,
    onUpdateSection: updateSection,
    onClearSection: clearSection,
  };
}
