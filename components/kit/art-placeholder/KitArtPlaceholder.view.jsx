"use client";

import { getKitArtPlaceholderIdentity } from "./kitArtPlaceholderIdentity";

const SIZE_CLASSES = {
  sm: "text-[3.4rem]",
  md: "text-[5.25rem]",
  lg: "text-[7rem]",
};

const CAMELLIA_SIZE_CLASSES = {
  sm: "h-[var(--space-6)] w-[var(--space-6)]",
  md: "h-[var(--space-10)] w-[var(--space-10)]",
  lg: "h-[var(--space-12)] w-[var(--space-12)]",
};

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

function CamelliaMark({ size = "md" }) {
  const sizeClass = CAMELLIA_SIZE_CLASSES[size] || CAMELLIA_SIZE_CLASSES.md;

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`${sizeClass} text-[var(--gold-ornament)]`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
    >
      {PETAL_ANGLES.map((angle) => (
        <ellipse
          key={angle}
          cx="32"
          cy="18"
          rx="7"
          ry="12"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5" />
      <circle cx="32" cy="32" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function KitArtPlaceholderView({
  size = "md",
  identityKey = null,
} = {}) {
  if (!identityKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface-2)]">
        <CamelliaMark size={size} />
      </div>
    );
  }

  const identity = getKitArtPlaceholderIdentity(identityKey);
  const glyphSizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--surface-2)]"
      style={{ background: identity.toneStyle.background }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--gold-ornament)_18%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[12%] right-[12%] top-[15%] h-px bg-[image:var(--line-fade)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[15%] left-[12%] right-[12%] h-px bg-[image:var(--line-fade)] opacity-40"
      />
      <span
        aria-hidden="true"
        className={`${glyphSizeClass} relative -translate-y-[4%] select-none font-display leading-none text-[color-mix(in_srgb,var(--gold-ornament)_20%,transparent)]`}
      >
        {identity.glyph}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[15%] h-[5px] w-[5px] -translate-x-1/2 rotate-45 border border-[color-mix(in_srgb,var(--gold-ornament)_45%,transparent)]"
      />
    </div>
  );
}
