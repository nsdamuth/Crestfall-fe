export const KIT_ART_PLACEHOLDER_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for shared empty-art presentation. The generic
 * empty-slot mode preserves the geometric gold camellia mark used by reference
 * and utility surfaces. v2.0.0 adds an opt-in semantic identity mode for V2
 * browse cards and destination tiles: a restrained atmospheric field plus a
 * type/destination glyph. This makes an unillustrated asset read as deliberately
 * unillustrated rather than implying that Crestfall stock art was selected.
 *
 * Sizing and aspect ratio remain the caller's responsibility; this package
 * renders only the empty-art presentation inside the supplied frame.
 *
 * What it delegates: all data, all layout beyond its own centering,
 * no tap target, no caption. A caller wanting a label under the mark
 * supplies its own text outside this package.
 *
 * @typedef {Object} KitArtPlaceholderViewProps
 * @property {"sm"|"md"|"lg"} [size] Mark size step. Defaults "md".
 * @property {string|null} [identityKey] Optional V2 semantic identity key. When
 *   present, renders the restrained atmospheric glyph treatment used by
 *   unillustrated V2 cards and destinations. Omit to retain the generic
 *   camellia empty-slot mark for legacy/reference surfaces.
 */

export {};
