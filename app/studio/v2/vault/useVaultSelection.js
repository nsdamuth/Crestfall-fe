"use client";

// Select mode on Vault (ASSET-FOLDERS plan, package AF6, 14 Sep 2026,
// option 3A ruled: selection state stays in each page). The one small
// page hook behind KitCreationCard 3.9.0's isSelectable, isSelected,
// and onToggleSelect and KitSelectionBar's count: which creation ids
// are chosen and whether select mode is on. Presentation-only local
// state, no Vault ViewModel this package; the page reads the ids back
// when a bar handler fires.
import { useCallback, useMemo, useState } from "react";

const EMPTY = new Set();

export function useVaultSelection() {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(EMPTY);

  const enterSelectionMode = useCallback(() => setIsSelectionMode(true), []);
  // Done leaves select mode and clears the selection (the bar's Done
  // and the Select control while it reads Done).
  const leaveSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(EMPTY);
  }, []);
  const toggleSelectionMode = useCallback(() => {
    if (isSelectionMode) leaveSelectionMode();
    else enterSelectionMode();
  }, [enterSelectionMode, isSelectionMode, leaveSelectionMode]);
  // The card's check control fires this alone (3.9.0).
  const toggleItem = useCallback((id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  // The kebab's Add to folder row: the card joins the selection and
  // select mode turns on, so the bar's own folder picker is the next
  // tap (read where the brief was silent; one picker on the page).
  const selectItem = useCallback((id) => {
    setIsSelectionMode(true);
    setSelectedIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }, []);
  const clearSelection = useCallback(() => setSelectedIds(EMPTY), []);
  const isSelected = useCallback((id) => selectedIds.has(id), [selectedIds]);

  return useMemo(
    () => ({
      isSelectionMode,
      selectedIds,
      selectedCount: selectedIds.size,
      isSelected,
      toggleItem,
      selectItem,
      clearSelection,
      enterSelectionMode,
      leaveSelectionMode,
      toggleSelectionMode,
    }),
    [
      clearSelection,
      enterSelectionMode,
      isSelected,
      isSelectionMode,
      leaveSelectionMode,
      selectItem,
      selectedIds,
      toggleItem,
      toggleSelectionMode,
    ]
  );
}
