"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CrestfallSelect({
  label,
  value,
  options,
  onChange,
  description,
  placement = "bottom",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = options.find((option) => option.value === value);
  const opensUp = placement === "top";

  const menuPositionClass = opensUp
    ? "bottom-full mb-2"
    : "top-full mt-2";

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {label ? (
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          {label}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-left text-sm text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 focus:border-[var(--gold-ornament)]/50"
      >
        <span>{selected?.label || "Select…"}</span>
        <ChevronDown
          size={16}
          className={`text-[var(--gold-ornament)] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          className={`absolute left-0 z-50 w-full overflow-hidden rounded-xl border border-[var(--gold-ornament)]/25 bg-black shadow-2xl ${menuPositionClass}`}
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-3 text-left text-sm transition ${
                  active
                    ? "bg-[var(--gold-ornament)]/20 text-[var(--ink)]"
                    : "text-[var(--ink-dim)] hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {description ? (
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}