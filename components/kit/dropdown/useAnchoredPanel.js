"use client";

// Anchored panel mechanics shared by KitDropdown and KitFilterPanel
// (FE/FILTERS, 6 Sep 2026). Extracted verbatim from KitDropdown.view
// so the two never drift: one open flag, the phone-width chassis
// select (sheet under 700px, popover at 700 and up), the measured
// left/right flip (DROPDOWN OVERFLOW, 10 Aug 2026 defect ruling), and
// the popover-only outside-click and Escape dismissal. Presentation-
// only local state; no data access. Selection stays with the caller.
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const PHONE_WIDTH_QUERY = "(max-width: 699.98px)";

// Reserve a same-size guard on the far side so a flip never just
// moves the overflow to the opposite edge on a narrow viewport.
const EDGE_GUARD_PX = 16;

// preferredAlign (10 Sep 2026, FE/MEDIA-STUDIO session 3 review round
// 2): the baseline the popover measures from. "left" is the standing
// default; "right" is for a trigger pinned to the right edge of a
// bounded surface (the asset picker's filter at the modal's edge),
// whose left-anchored menu would otherwise run past the panel. The
// measured flip still applies in both directions.
export function useAnchoredPanel({ preferredAlign = "left" } = {}) {
  const baseline = preferredAlign === "right" ? "right" : "left";
  const [isOpen, setIsOpen] = useState(false);
  const [isPhoneWidth, setIsPhoneWidth] = useState(
    () => typeof window !== "undefined" && window.matchMedia(PHONE_WIDTH_QUERY).matches
  );
  const [panelAlign, setPanelAlign] = useState(baseline);
  const rootRef = useRef(null);
  const panelRef = useRef(null);

  // Measured, not assumed: re-checks on open and on resize while open,
  // so rotating a device or resizing a desktop window with the panel
  // open never leaves it in a stale, now-wrong alignment.
  useLayoutEffect(() => {
    if (!isOpen || isPhoneWidth) return undefined;

    function measure() {
      const panel = panelRef.current;
      if (!panel || typeof window === "undefined") return;
      const rect = panel.getBoundingClientRect();
      setPanelAlign((current) => {
        if (current === "left" && rect.right > window.innerWidth - EDGE_GUARD_PX) return "right";
        if (current === "right" && rect.left < EDGE_GUARD_PX) return "left";
        return current;
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isOpen, isPhoneWidth]);

  // Dismissal wiring for the POPOVER only: outside click and Escape
  // close the panel. Scoped to !isPhoneWidth: the phone sheet
  // (KitModalFrame variant="sheet") is portaled to document.body, so
  // it sits outside rootRef's DOM subtree by design, and the frame
  // already answers its own Escape and backdrop click.
  useEffect(() => {
    if (!isOpen || isPhoneWidth) return undefined;

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isPhoneWidth]);

  // Chassis-select flag: while open, phone width mounts the frame
  // sheet, 700px and up renders the popover. Listened for only while
  // open; toggleOpen refreshes it at the moment of opening.
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return undefined;

    const query = window.matchMedia(PHONE_WIDTH_QUERY);

    function onChange(event) {
      setIsPhoneWidth(event.matches);
    }

    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
  }

  function toggleOpen() {
    const next = !isOpen;
    // Refresh the chassis-select flag at the moment of opening (not
    // just at mount): a viewport resize while closed would otherwise
    // leave it stale until the next matchMedia "change" event.
    if (next && typeof window !== "undefined") {
      setIsPhoneWidth(window.matchMedia(PHONE_WIDTH_QUERY).matches);
      // Always re-measure from the preferred baseline: the trigger
      // may have moved since this panel was last open.
      setPanelAlign(baseline);
    }
    setIsOpen(next);
  }

  return { isOpen, isPhoneWidth, panelAlign, rootRef, panelRef, toggleOpen, close };
}
