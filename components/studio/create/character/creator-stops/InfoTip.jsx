"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

/*
  Small deliberate trigger, never the whole control. Works on hover and on
  tap; dismisses on tap away, Escape, or scroll. Transient and non-blocking:
  no scrim, no focus trap. Flips to stay inside the frame rather than
  clipping at its edge.
*/
export default function InfoTip({ label, text, flip = false }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef(null);

  function findScrollBoundary(node) {
    let current = node?.parentElement;

    while (current) {
      const style = window.getComputedStyle(current);
      if (/(auto|scroll)/.test(style.overflowY)) {
        return current.getBoundingClientRect().bottom;
      }
      current = current.parentElement;
    }

    return window.innerHeight;
  }

  function measureDirection() {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const estimatedTooltipHeight = 96;
    const boundary = Math.min(
      window.innerHeight,
      findScrollBoundary(rootRef.current)
    );
    setOpenUp(rect.bottom + estimatedTooltipHeight > boundary);
  }

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  if (!text) return null;

  return (
    <span
      ref={rootRef}
      className="group relative inline-flex"
      onMouseEnter={measureDirection}
    >
      <button
        type="button"
        aria-label={label || "More info"}
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          measureDirection();
          setOpen((current) => !current);
        }}
        className="flex h-4 w-4 items-center justify-center rounded-[var(--radius-full)] text-[var(--gold-ornament)] outline-none"
      >
        <Info size={13} />
      </button>

      <span
        role="tooltip"
        className={`pointer-events-none absolute z-10 w-56 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-4)] px-[var(--space-2)] py-[var(--space-1)] text-[var(--text-label)] leading-[var(--lh-label)] text-[var(--ink)] opacity-0 shadow-[var(--shadow-modal)] transition-opacity duration-150 group-hover:opacity-100 ${
          open ? "opacity-100" : ""
        } ${flip ? "right-0" : "left-0"} ${
          openUp
            ? "bottom-full mb-[var(--space-1)]"
            : "top-full mt-[var(--space-1)]"
        }`}
      >
        {text}
      </span>
    </span>
  );
}
