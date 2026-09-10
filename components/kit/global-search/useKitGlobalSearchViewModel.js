"use client";

// Chassis for the top bar global search (FE/GLOBAL-SEARCH session 1,
// 10 Sep 2026). Owns the typed value, the open flag, the active row,
// the query grammar (kitGlobalSearchQuery.js), the keyboard (arrows
// move, Enter opens, Escape closes), outside-click dismissal for the
// desktop popover, and the phone-width chassis select read at the
// moment of opening (never at render, so server and first client
// render agree). The panel shows only once the field has text
// (browser review round 2, R2); there is no open shortcut (round 2,
// R1). Data arrives from the caller as two source groups; nothing
// here fetches, and choosing a row only calls back with its href.
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { PHONE_WIDTH_QUERY } from "../dropdown/useAnchoredPanel";
import {
  GLOBAL_SEARCH_SCOPE_COMMUNITY,
  GLOBAL_SEARCH_SCOPE_OWN,
  GLOBAL_SEARCH_TYPES,
  applyGlobalSearchPrefix,
  filterGlobalSearchRows,
  parseGlobalSearchQuery,
  shouldShowGlobalSearchPanel,
} from "./kitGlobalSearchQuery";

export const KIT_GLOBAL_SEARCH_COPY = Object.freeze({
  placeholder: "Search...",
  ariaLabel: "Search",
  ownTitle: "Your items",
  communityTitle: "Community",
  soonSectionTitle: "Not available yet",
  soonTitle: "Not available yet",
  loading: "Loading your items and the community",
  empty: "Nothing matches yet.",
  errorFallback: "Search could not load. Try again in a moment.",
  clearLabel: "Clear search",
  sheetTitle: "Search",
});

const EMPTY_SOURCE = Object.freeze({ items: [], status: "idle", errorMessage: "" });
const ROWS_PER_SECTION = 40;

function readIsPhoneWidth() {
  return typeof window !== "undefined" && window.matchMedia(PHONE_WIDTH_QUERY).matches;
}

export function useKitGlobalSearchViewModel({
  own = EMPTY_SOURCE,
  community = EMPTY_SOURCE,
  placeholder = KIT_GLOBAL_SEARCH_COPY.placeholder,
  ariaLabel = KIT_GLOBAL_SEARCH_COPY.ariaLabel,
  initialValue = "",
  copy: copyOverrides = null,
  onRequestData = null,
  onNavigate = null,
  className = "",
} = {}) {
  const [value, setValue] = useState(String(initialValue ?? ""));
  // The user's own open request: true from the first keystroke or
  // focus, false after Escape, an outside click, or choosing a row.
  // The panel renders only when this is true AND the field has text.
  const [isRequested, setIsRequested] = useState(false);
  const [isPhoneWidth, setIsPhoneWidth] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;

  const copy = useMemo(
    () => ({ ...KIT_GLOBAL_SEARCH_COPY, ...(copyOverrides || {}) }),
    [copyOverrides]
  );

  const parsed = useMemo(() => parseGlobalSearchQuery(value), [value]);
  const isOpen = shouldShowGlobalSearchPanel(value, isRequested);

  const suggestions = useMemo(
    () =>
      parsed.wantsSuggestions
        ? GLOBAL_SEARCH_TYPES.map((type) => ({
            id: `${baseId}-suggest-${type.key}`,
            key: type.key,
            label: type.label,
            description: type.description,
          }))
        : [],
    [parsed.wantsSuggestions, baseId]
  );

  const sections = useMemo(() => {
    const groups = [];
    if (parsed.scope !== GLOBAL_SEARCH_SCOPE_COMMUNITY) {
      groups.push({ id: "own", title: copy.ownTitle, source: own });
    }
    if (parsed.scope !== GLOBAL_SEARCH_SCOPE_OWN) {
      groups.push({ id: "community", title: copy.communityTitle, source: community });
    }

    return groups.map((group) => {
      const status = group.source?.status || "idle";
      const isSoon = status === "soon";
      const rows = isSoon
        ? []
        : filterGlobalSearchRows(group.source?.items, parsed, { limit: ROWS_PER_SECTION }).map(
            (item) => ({
              id: `${baseId}-${group.id}-${item.key}`,
              key: item.key,
              title: item.title || "",
              subtitle: item.subtitle || "",
              typeLabel: item.typeLabel || "",
              pageLabel: item.pageLabel || "",
              iconKey: item.iconKey || item.type || "",
              imageSrc: item.imageSrc || "",
              href: item.href || "",
              isSoon: Boolean(item.isSoon) || !item.href,
            })
          );

      return {
        id: group.id,
        title: isSoon ? copy.soonSectionTitle : group.title,
        status,
        errorMessage:
          status === "error"
            ? group.source?.errorMessage || copy.errorFallback
            : group.source?.errorMessage || "",
        isSoon,
        rows,
      };
    });
  }, [parsed, own, community, baseId, copy]);

  const visibleSections = useMemo(
    () =>
      parsed.hasQuery
        ? sections.filter(
            (section) => section.rows.length > 0 || section.status === "error" || section.isSoon
          )
        : [],
    [parsed.hasQuery, sections]
  );

  const anyLoading = sections.some((section) => section.status === "loading" || section.status === "idle");

  let panelState = "results";
  if (suggestions.length) {
    panelState = "suggestions";
  } else if (!visibleSections.length) {
    panelState = parsed.hasQuery && anyLoading ? "loading" : "empty";
  }

  const navigableIds = useMemo(() => {
    if (suggestions.length) return suggestions.map((suggestion) => suggestion.id);
    return visibleSections.flatMap((section) =>
      section.rows.filter((row) => !row.isSoon).map((row) => row.id)
    );
  }, [suggestions, visibleSections]);

  const activeRowId =
    activeIndex >= 0 && activeIndex < navigableIds.length ? navigableIds[activeIndex] : null;

  const open = useCallback(() => {
    setIsPhoneWidth(readIsPhoneWidth());
    setIsRequested(true);
    onRequestData?.();
  }, [onRequestData]);

  const close = useCallback(() => {
    setIsRequested(false);
    setActiveIndex(-1);
  }, []);

  const chooseSuggestion = useCallback(
    (suggestionId) => {
      const suggestion = suggestions.find((entry) => entry.id === suggestionId);
      if (!suggestion) return;
      setValue((current) => applyGlobalSearchPrefix(current, suggestion.key));
      setActiveIndex(-1);
    },
    [suggestions]
  );

  const chooseRow = useCallback(
    (rowId) => {
      const row = sections.flatMap((section) => section.rows).find((entry) => entry.id === rowId);
      if (!row || row.isSoon || !row.href) return;
      close();
      onNavigate?.(row.href, row);
    },
    [sections, close, onNavigate]
  );

  const activate = useCallback(
    (id) => {
      if (suggestions.some((suggestion) => suggestion.id === id)) {
        chooseSuggestion(id);
      } else {
        chooseRow(id);
      }
    },
    [suggestions, chooseSuggestion, chooseRow]
  );

  function onChange(next) {
    setValue(String(next ?? ""));
    setActiveIndex(-1);
    open();
  }

  function onClear() {
    setValue("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function onHoverRow(rowId) {
    const index = rowId ? navigableIds.indexOf(rowId) : -1;
    setActiveIndex(index);
  }

  function onInputKeyDown(event) {
    const key = event?.key;

    if (key === "ArrowDown") {
      event.preventDefault();
      if (!isRequested) open();
      setActiveIndex((current) =>
        navigableIds.length ? (current + 1) % navigableIds.length : -1
      );
      return;
    }

    if (key === "ArrowUp") {
      event.preventDefault();
      if (!isRequested) open();
      setActiveIndex((current) =>
        navigableIds.length ? (current <= 0 ? navigableIds.length - 1 : current - 1) : -1
      );
      return;
    }

    if (key === "Enter") {
      if (!isOpen) return;
      const id = activeRowId || navigableIds[0] || null;
      if (!id) return;
      event.preventDefault();
      activate(id);
      return;
    }

    if (key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        close();
      }
      return;
    }

    if (key === "Tab" && isOpen) {
      close();
    }
  }

  // Popover dismissal (700px and up only): outside pointerdown and
  // Escape close the panel. The phone sheet is portaled outside
  // rootRef and answers its own backdrop and Escape through
  // KitModalFrame.
  useEffect(() => {
    if (!isOpen || isPhoneWidth) return undefined;

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) close();
    }
    function onKeyDown(event) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isPhoneWidth, close]);

  // Chassis select while open: rotating a phone or resizing a desktop
  // window with the panel open swaps popover and sheet live.
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return undefined;

    const query = window.matchMedia(PHONE_WIDTH_QUERY);
    function onMediaChange(event) {
      setIsPhoneWidth(event.matches);
    }
    query.addEventListener("change", onMediaChange);
    return () => query.removeEventListener("change", onMediaChange);
  }, [isOpen]);

  // Keep the keyboard-active row in view inside the scrolling panel.
  useEffect(() => {
    if (!activeRowId || typeof document === "undefined") return;
    document.getElementById(activeRowId)?.scrollIntoView({ block: "nearest" });
  }, [activeRowId]);

  return {
    value,
    placeholder,
    ariaLabel,
    isOpen,
    isPhoneWidth,
    rootRef,
    inputRef,
    listboxId,
    activeRowId,
    suggestions,
    sections: visibleSections,
    panelState,
    copy,
    className,
    onChange,
    onOpen: open,
    onClose: close,
    onInputKeyDown,
    onChooseRow: chooseRow,
    onChooseSuggestion: chooseSuggestion,
    onHoverRow,
    onClear,
  };
}
