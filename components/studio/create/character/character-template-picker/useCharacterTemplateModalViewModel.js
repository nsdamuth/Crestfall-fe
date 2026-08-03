"use client";

import { useMemo, useState } from "react";

const BUILT_IN_TAB_ID = "BUILT_IN";

const TEMPLATE_TABS = [
  { id: BUILT_IN_TAB_ID, label: "Built-In" },
  { id: "MY_TEMPLATES", label: "My Templates" },
  { id: "COMMUNITY", label: "Community" },
];

function normalizeTemplate(template, index) {
  return {
    id: String(template?.id || `template-${index + 1}`),
    sourceLabel: String(template?.source || "Template"),
    categoryLabel: String(template?.category || "Uncategorized"),
    title: String(template?.title || "Untitled Template"),
    description: String(template?.description || ""),
    prefillLabel: "Prefills",
    prefillSummary:
      "Identity, personality, speech style, clothing style, and creator notes.",
    actionLabel: "Apply Template",
  };
}

function getFutureTabCopy(tabId) {
  if (tabId === "MY_TEMPLATES") {
    return {
      title: "My Templates Soon",
      description:
        "This tab will later show saved, shared, and managed character templates.",
    };
  }

  if (tabId === "COMMUNITY") {
    return {
      title: "Community Templates Soon",
      description:
        "This tab will later show saved, shared, and managed character templates.",
    };
  }

  return {
    title: "Templates Soon",
    description:
      "This tab will later show saved, shared, and managed character templates.",
  };
}

export function useCharacterTemplateModalViewModel({
  templates = [],
  onApply = null,
  onClose = null,
} = {}) {
  const [activeTabId, setActiveTabId] = useState(BUILT_IN_TAB_ID);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedTemplates = useMemo(
    () => (templates || []).map(normalizeTemplate),
    [templates]
  );

  const visibleTemplates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return normalizedTemplates;

    return normalizedTemplates.filter(
      (template) =>
        template.title.toLowerCase().includes(normalizedQuery) ||
        template.categoryLabel.toLowerCase().includes(normalizedQuery) ||
        template.description.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedTemplates, searchQuery]);

  const futureTabCopy = getFutureTabCopy(activeTabId);

  function chooseTemplate(templateId) {
    const originalTemplate = (templates || []).find(
      (template) => String(template?.id || "") === String(templateId || "")
    );

    if (!originalTemplate) return;

    onApply?.(originalTemplate);
  }

  return {
    eyebrow: "Character Templates",
    modalTitle: "Use Template",
    modalDescription:
      "Select a template to prefill character creation fields. This does not duplicate an existing character.",
    tabs: TEMPLATE_TABS,
    activeTabId,
    searchQuery,
    searchPlaceholder: "Search templates...",
    showTemplateGrid: activeTabId === BUILT_IN_TAB_ID,
    templates: visibleTemplates,
    emptyStateTitle: futureTabCopy.title,
    emptyStateDescription: futureTabCopy.description,
    onClose,
    onChooseTab: setActiveTabId,
    onChangeSearchQuery: setSearchQuery,
    onChooseTemplate: chooseTemplate,
  };
}
