"use client";

import { Save } from "lucide-react";

/**
 * Package MOBILE-SHELLS: the create pages' primary action, docked to the
 * bottom of the viewport below the md breakpoint.
 *
 * Every create shell keeps its existing in-place action exactly where it
 * renders today. On a phone that action can sit a full scroll away from
 * the field the author is filling, so this bar repeats it at the bottom
 * edge. The recipe lives in app/design-system.css (.cf-create-action-bar):
 * full width minus the page gutter, the 44px control floor, --surface-3
 * with a --line-whisper hairline on top, riding above the bottom dock,
 * and display:none at md and up. This component adds no layout of its
 * own, so the desktop render is untouched.
 *
 * The spacer is a sibling, not padding on a parent, so a shell adopts the
 * bar by rendering one element and changes no other rule.
 */
export default function CreateActionBar({
  label = "Save draft",
  onAction = null,
  disabled = false,
}) {
  return (
    <>
      <div className="cf-create-action-bar-spacer" aria-hidden="true" />

      <div className="cf-create-action-bar">
        <button
          type="button"
          onClick={() => onAction?.()}
          disabled={disabled}
          className="cf-btn cf-btn--primary w-full"
        >
          <Save size={15} />
          {label}
        </button>
      </div>
    </>
  );
}
