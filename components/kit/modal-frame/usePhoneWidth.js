"use client";

// Phone-width flag for floating surfaces that must open as the same
// bottom sheet the Media Studio composer uses under 700px
// (KitModalFrame variant="sheet" with the grabber) and as a centered
// modal at 700px and up. Same matchMedia query the dropdown chassis
// select already uses, read at mount and kept current while mounted.
// Presentation-only local state; viewport width is layout, not data.
import { useEffect, useState } from "react";

import { PHONE_WIDTH_QUERY } from "../dropdown/useAnchoredPanel";

export function usePhoneWidth() {
  const [isPhoneWidth, setIsPhoneWidth] = useState(
    () => typeof window !== "undefined" && window.matchMedia(PHONE_WIDTH_QUERY).matches
  );

  // Subscribe only: the initial value is read once at mount above, and
  // the listener carries every later change (no setState in the
  // effect body, per the react-hooks rule the repo lints with).
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const query = window.matchMedia(PHONE_WIDTH_QUERY);

    function onChange(event) {
      setIsPhoneWidth(event.matches);
    }

    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
    };
  }, []);

  return isPhoneWidth;
}
