export const EYEBROW_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the studio-wide eyebrow label: small gold
 * uppercase text at the ruled eyebrow type scale, with a trailing
 * --grad-rule mark. Ruled 6 Aug 2026, first shipped in
 * components/studio/create/character/creator-stops/shared/Controls.jsx
 * (commit 11c0779), promoted to a global 7 Aug 2026.
 *
 * The View owns only presentation: the label text and the optional
 * trailing rule mark. It owns no page-level meaning, no navigation,
 * and no data.
 *
 * @typedef {Object} EyebrowViewProps
 * @property {import("react").ReactNode} children
 * @property {boolean} [showRuleMark] - defaults true, matching the
 *   original creator-stops treatment. Optional so a caller with no
 *   trailing content can omit the mark without a new component.
 */

export {};
