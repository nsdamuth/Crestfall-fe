"use client";

// Which host the Folders panel takes on this page (ASSET-FOLDERS plan,
// package AF5, option 1A RULED 14 Sep 2026): the 18rem column left of
// the grid at 1100 and up, the Kit frame's sheet below. The same
// breakpoint the page's composer aside and Compose bar already switch
// on (min-[1100px]). Same shape as components/kit/modal-frame/
// usePhoneWidth.js: read once at mount, then the listener carries
// every change (no setState in the effect body, per the react-hooks
// rule the repo lints with). Presentation-only local state; viewport
// width is layout, not data.
import { useEffect, useState } from "react";

export const FOLDERS_COLUMN_QUERY = "(min-width: 1100px)";

export function useFoldersPanelHost() {
  const [isColumn, setIsColumn] = useState(
    () => typeof window !== "undefined" && window.matchMedia(FOLDERS_COLUMN_QUERY).matches
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const query = window.matchMedia(FOLDERS_COLUMN_QUERY);

    function onChange(event) {
      setIsColumn(event.matches);
    }

    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
    };
  }, []);

  return isColumn ? "column" : "sheet";
}
