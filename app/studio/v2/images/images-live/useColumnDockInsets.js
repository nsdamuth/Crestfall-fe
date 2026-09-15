"use client";

// The page column's distances from the viewport's left and right
// edges (AF5 follow-up 2, item 1): KitSelectionBar is fixed to the
// viewport at md and up and centers between these two insets, so it
// sits on the page column rather than the viewport (the primary
// sidebar and the composer column both shift the column). Measured
// from the column node through a ResizeObserver plus the window
// resize event, every read inside a callback; layout, not data.
import { useEffect, useRef, useState } from "react";

export function useColumnDockInsets() {
  const ref = useRef(null);
  const [insets, setInsets] = useState(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === "undefined" || typeof ResizeObserver === "undefined") return undefined;

    function measure() {
      const rect = node.getBoundingClientRect();
      setInsets({ left: Math.round(rect.left), right: Math.round(window.innerWidth - rect.right) });
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return [ref, insets];
}
