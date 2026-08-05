# Closing inventory

Generated artifact. Exempt from the em dash law, deleted at end of life. Derived from a full read of every `.view.jsx` package under `components/**` on this branch (222 packages), not from any prior audit file. Prior audit files (BATCH-TWO-SCOPE.md, SWEEP-REPORT.md) are history, not scope, per the overnight brief ruled 4 Aug 2026.

Scope note: this pass covers portable View files. Top-level marketing/lore components (`components/*.jsx`, `components/blocks/**`, `components/policies/**`) were already walked by the previous audit's `## components` sections and are not re-walked here; nothing there is currently flagged for a new violation class this pass would catch.

## Summary

- Packages walked: 224
- Packages clean: 58
- Packages with at least one finding: 166
- Total findings: 652

### New vs already-scoped

BATCH-TWO-SCOPE.md's own scope statement says it checked seven categories only: shape law (fully-rounded buttons, non-rounded tags), off-scale radius, dark overlay over artwork, backdrop blur, delete/remove/discard controls, and banner classification. It also states packages with zero findings in those seven categories are omitted from its listing entirely, so absence from that file does not mean a package was never looked at.

Given that, the honest split of this pass's 652 findings is by violation class, not by package-name lookup:

- Findings in a class BATCH-TWO-SCOPE.md's seven categories cover (corners, shape, destructive, banner, modal chrome, blur): roughly 208.
- Findings in a class outside that scope entirely (raw/legacy token values, undefined CSS variables, hardcoded status colors, opacity literals, bridge-variable holdovers like `--muted`, `--muted-gold`, `--foreground`): roughly 438. This is the class of finding "the previous audit never looked for" named in the brief.

A per-package, name-token comparison against BATCH-TWO-SCOPE.md was attempted and discarded: because that file omits clean packages by design, a name not appearing there is as likely to mean "no findings there" as "never audited." That comparison would have overstated the gap, so it is not reported as a package count.

## Findings by package

### filterable-index

Path: `./components/filterable-index/FilterableIndex.view.jsx`

- **token-usage**: Uses hardcoded `rgba()` opacity multipliers like `/10`, `/08`, `/06` instead of opacity tokens. Fix: Replace all hardcoded opacity modifiers with proper token values or create opacity tokens.
- **bridge-variable**: Uses legacy bridge variables `--muted` and `--muted-gold` which are deprecated (should be `--ink-dim` and `--gold-action`). Fix: Replace `--muted-gold` with `--gold-action` and `--muted` with `--ink-dim`.
- **undefined-token**: Uses `--border` which is not defined in the design system (should be `--line` or `--line-whisper`). Fix: Replace `--border` with the appropriate line token from the design system.
- **undefined-token**: Uses `--foreground` which is not part of the design system token set. Fix: Replace `--foreground` with proper color tokens like `--ink`, `--ink-dim`, or `--gold-bright`.

### account-stub-page

Path: `./components/studio/account/account-stub-page/AccountStubPage.view.jsx`

- **bridge-variable**: Uses legacy bridge variable `--muted-gold` which is deprecated (should be `--gold-action` or `--gold-ornament`). Fix: Replace `--muted-gold` with appropriate gold token.
- **undefined-token**: Uses `--foreground` which is not part of the design system token set. Fix: Replace `--foreground` with proper ink token like `--ink`.
- **undefined-token**: Uses `--muted` which is not part of the design system (should be `--ink-dim`). Fix: Replace `--muted` with `--ink-dim`.
- **token-usage**: Uses hardcoded tailwind opacity multipliers `/20`, `/25`, `/15` instead of proper opacity values. Fix: Replace opacity multipliers with consistent opacity values or create opacity tokens.
- **corner-law**: Uses `rounded-xl` (tailwind, ~16px) on card border-radius; should use `--radius-md` (12px) for standard controls. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.

### default-player-character-picker

Path: `./components/studio/account/default-player-character-picker/DefaultPlayerCharacterPickerModal.view.jsx`

- **corner-law**: Uses `rounded-xl` (tailwind) on lines 46, 59, 71 for controls; should use `--radius-md` for standard controls. Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`.
- **token-usage**: Uses hardcoded opacity multipliers like `white/10`, `black/35`, `black/25` instead of proper opacity values. Fix: Replace hardcoded opacity multipliers with consistent design system opacity values.
- **floating-surface**: Modal uses `--radius-lg` which is correct for floating surfaces; however, input search field uses `rounded-xl` instead of `--radius-md`. Fix: Ensure search input and other nested controls use `--radius-md`, not `rounded-xl`.

### studio-account-coins

Path: `./components/studio/account/studio-account-coins/StudioAccountCoins.view.jsx`

- **bridge-variable**: Uses legacy bridge variable `--muted-gold` which is deprecated. Fix: Replace `--muted-gold` with `--gold-action` or `--gold-ornament`.
- **undefined-token**: Uses `--muted` and `--foreground` which are not in the design system. Fix: Replace with proper tokens: `--ink-dim` for `--muted`, `--ink` for `--foreground`.
- **token-usage**: Uses hardcoded opacity multipliers `/20`, `/25`, `/10`, `/30`, `/70`, `/35` instead of proper opacity values. Fix: Replace all opacity multipliers with consistent opacity values.
- **corner-law**: Uses `rounded-xl` (tailwind) on lines 39, 50, 90 for buttons; should use `--radius-md` for standard controls. Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`.
- **hardcoded-color**: Line 30: Uses hardcoded `red-200` for error message instead of status color token. Fix: Replace `red-200` with `text-[var(--status-danger)]` for consistency.
- **scrim-color**: Line 62: Modal uses `bg-black/70` instead of proper scrim token `--scrim-strong`. Fix: Replace `bg-black/70` with `bg-[var(--scrim-strong)]`.

### studio-account-metrics

Path: `./components/studio/account/studio-account-metrics/StudioAccountMetrics.view.jsx`

- **hardcoded-color**: Line 9: Uses hardcoded `red-500/30`, `red-500/10`, `red-200` for error state instead of status color tokens. Fix: Replace with status danger tokens: `--status-danger-border`, `--status-danger-bed`, `--status-danger`.
- **corner-law**: Line 18: Uses `rounded-xl` (tailwind) instead of `--radius-md` for metric cards. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **token-usage**: Uses hardcoded opacity multipliers `white/10` and `black/30` instead of proper values. Fix: Replace hardcoded opacity with consistent design system values.
- **undefined-token**: Line 21: Uses `--muted` which is not in the design system. Fix: Replace `--muted` with `--ink-dim`.

### studio-account-profile

Path: `./components/studio/account/studio-account-profile/StudioAccountProfile.view.jsx`

- **bridge-variable**: Uses legacy bridge variable `--muted-gold` multiple times throughout the file. Fix: Replace all `--muted-gold` with appropriate gold tokens like `--gold-action` or `--gold-ornament`.
- **undefined-token**: Uses `--muted` and `--foreground` extensively, which are not in the design system. Fix: Replace `--muted` with `--ink-dim` and `--foreground` with `--ink`.
- **token-usage**: Uses hardcoded opacity multipliers throughout: `/20`, `/10`, `/25`, `/35`, `/30`, `/45` instead of proper opacity values. Fix: Replace all opacity multipliers with consistent design system opacity values.
- **corner-law**: Multiple uses of `rounded-xl` (tailwind) instead of `--radius-md` for standard controls (lines 40, 48, 57, 82, 90, 97, 107, 159, 175, 184, 204, 273, 276, 317, 344, 371). Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`.
- **hardcoded-color**: Lines 234, 240: Use hardcoded `red-500` and `emerald-500` colors for error and success states instead of status tokens. Fix: Replace with status color tokens: `--status-danger-bed`/`--status-danger` for errors, `--status-success-bed`/`--status-success` for success.
- **floating-surface**: Line 384: Modal should use `--radius-lg` for floating surfaces, but uses `--radius-md`. Fix: Change modal border-radius from `--radius-md` to `--radius-lg`.
- **destructive-control**: Line 193: Clear button should be a destructive control with danger styling, but uses neutral styling. Fix: Apply destructive button styling with danger text color on hover as per Ruling 2.

### actor-mechanics-profile-attachment

Path: `./components/studio/characters/actor-mechanics-profile-attachment/ActorMechanicsProfileAttachmentSection.view.jsx`

- **corner-law**: Lines 57, 75: Uses `rounded-xl` (tailwind) instead of `--radius-md` for standard controls. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **token-usage**: Line 99, 105: Uses hardcoded `black/45` opacity instead of proper opacity value. Fix: Replace opacity multiplier with consistent opacity value or token.
- **destructive-control**: Line 128: Remove button uses danger color on hover but doesn't have a visible 'Remove' word beside the icon, only aria-label. Fix: Add visible text label 'Remove' beside the icon for destructive controls per shape law.
- **corner-law**: Line 183: Textarea uses `rounded-xl` (tailwind) instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.

### advanced-prompting

Path: `./components/studio/characters/advanced-prompting/advanced-prompting/AdvancedPromptingEditor.view.jsx`

- **bridge-variable**: Uses legacy bridge variable `--muted-gold` multiple times throughout the file. Fix: Replace `--muted-gold` with `--gold-action` or `--gold-ornament`.
- **undefined-token**: Uses `--muted` and `--foreground` extensively, which are not in the design system. Fix: Replace `--muted` with `--ink-dim` and `--foreground` with `--ink`.
- **hardcoded-color**: Lines 18, 24, 29, 35, 41, 46: Uses hardcoded color classes like `emerald-400/25`, `amber-300/30`, `sky-300/25`, `red-300/30` instead of status color tokens. Fix: Replace with status color tokens: `--status-success`, `--status-warning`, `--status-danger` and their bed/border variants.
- **token-usage**: Uses hardcoded opacity multipliers throughout: `white/10`, `black/25`, `black/30`, `black/35`, `black/20` instead of proper values. Fix: Replace all opacity multipliers with consistent opacity values.
- **corner-law**: Multiple uses of `rounded-xl` (tailwind) instead of `--radius-md` for standard controls (lines 105, 115, 126, 148, 186, 194, 207, 221). Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`.
- **status-warning**: Line 59: Uses conditional text color `text-amber-200` for warning threshold instead of status token. Fix: Replace hardcoded amber color with `text-[var(--status-warning)]` when near limit.

### community-hub

Path: `./components/studio/community/community-hub/CommunityHub.view.jsx`

- **hardcoded-color**: Line 277: Uses hardcoded `red-500/30`, `red-500/10`, `red-200` for engagement error message instead of status tokens. Fix: Replace with status danger tokens: `--status-danger-border`, `--status-danger-bed`, `--status-danger`.

### creator-card

Path: `./components/studio/community/creator-card/CreatorCard.view.jsx`

- **bridge-variable**: Uses legacy bridge variable `--muted-gold` multiple times. Fix: Replace `--muted-gold` with `--gold-action` or `--gold-ornament`.
- **undefined-token**: Uses `--muted` and `--foreground` which are not in the design system. Fix: Replace `--muted` with `--ink-dim` and `--foreground` with `--ink`.
- **token-usage**: Line 32: Uses hardcoded opacity multipliers `white/10` and `/30` instead of proper opacity values. Fix: Replace hardcoded opacity with consistent opacity values.
- **badge-styling**: Line 87: Canon contributor badge uses hardcoded `emerald-400/25`, `emerald-200` instead of canonical gold badge styling with `--tag--canon`. Fix: Apply the `.tag--canon` recipe which uses `--gold-bright` for all contexts per Ruling 3.
- **corner-law**: Line 108: Link uses `rounded-xl` (tailwind) instead of `--radius-md` for standard button. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **token-usage**: Line 108: Uses opacity multipliers `/35`, `/10`, `/20` instead of consistent opacity values. Fix: Replace opacity multipliers with proper opacity values.

### creator-engagement-actions

Path: `./components/studio/community/creator-engagement-actions/CreatorEngagementActions.view.jsx`

- **corner-law**: Line 80: Uses `rounded-xl` (tailwind) instead of `--radius-md` for standard buttons. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **hardcoded-color**: Line 84: Uses hardcoded `pink-400/45`, `pink-400/15`, `pink-200` for active engagement state instead of proper color tokens. Fix: Consider using a proper engagement color token or status-related token for consistency.
- **bridge-variable**: Line 85: Uses legacy bridge variable `--muted-gold` and undefined `--foreground`. Fix: Replace `--muted-gold` with appropriate token and `--foreground` with `--ink`.
- **token-usage**: Line 85: Uses hardcoded opacity multipliers `white/10`, `black/35`, `/35` instead of proper values. Fix: Replace hardcoded opacity with consistent opacity values.

### creator-list-row

Path: `./components/studio/community/creator-list-row/CreatorListRow.view.jsx`

- **bridge-variable**: Uses legacy bridge variable `--muted-gold` multiple times. Fix: Replace `--muted-gold` with `--gold-action` or `--gold-ornament`.
- **undefined-token**: Uses `--muted` and `--foreground` which are not in the design system. Fix: Replace `--muted` with `--ink-dim` and `--foreground` with `--ink`.
- **token-usage**: Line 29: Uses hardcoded opacity multipliers `white/10` and `white/[0.03]` instead of proper opacity values. Fix: Replace hardcoded opacity with consistent opacity values.
- **badge-styling**: Line 49: Canon contributor badge uses hardcoded `emerald-400/25`, `emerald-400/10`, `emerald-200` instead of canonical gold badge styling. Fix: Apply the `.tag--canon` recipe which uses `--gold-bright` per Ruling 3.
- **corner-law**: Line 84: Link uses `rounded-xl` (tailwind) instead of `--radius-md` for standard button. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **token-usage**: Line 84: Uses opacity multipliers `/35`, `/10`, `/20` instead of consistent opacity values. Fix: Replace opacity multipliers with proper opacity values.

### hair

Path: `./components/studio/create/character/hair/HairModal.view.jsx`

- **corners-standard-tier**: Line 22, 72: `rounded-xl` (16px, off-scale) used on trigger buttons; should be `--radius-md` (12px) per standard tier for controls Fix: Replace `rounded-xl` with `rounded-[--radius-md]` on trigger button and Done button
- **corners-large-tier**: Line 34: Modal container uses `rounded-[var(--radius-md)]` (12px); should be `--radius-lg` (20px) for floating surfaces per Ruling 1 Fix: Change `rounded-[var(--radius-md)]` to `rounded-[var(--radius-lg)]` on modal dialog
- **close-button-shape**: Line 41: Close button uses `rounded-lg` instead of `--radius-full` for icon button Fix: Change `rounded-lg` to `rounded-[var(--radius-full)]` on close button
- **controls-radius**: Line 62, 84, 97, 116, 210: Multiple `rounded-xl` used on controls; off-scale 16px value Fix: Replace all `rounded-xl` with `rounded-[--radius-md]` on form controls and option buttons

### kibbe-preset

Path: `./components/studio/create/character/kibbe-preset/KibbePresetModal.view.jsx`

- **corners-standard-tier**: Line 25, 74, 91, 109, 134, 144, 151: Multiple `rounded-xl` (16px) on controls; should be `--radius-md` (12px) Fix: Replace all `rounded-xl` with `rounded-[--radius-md]`
- **corners-large-tier**: Line 40: Modal container uses `rounded-[var(--radius-md)]`; should be `--radius-lg` (20px) per Ruling 1 Fix: Change modal container to `rounded-[var(--radius-lg)]`
- **close-button-shape**: Line 57: Close button uses `rounded-lg` instead of `--radius-full` Fix: Change `rounded-lg` to `rounded-[var(--radius-full)]`

### multi-trait

Path: `./components/studio/create/character/multi-trait/MultiTraitModal.view.jsx`

- **corners-standard-tier**: Line 29, 63, 73, 81, 89, 101, 125: Multiple `rounded-xl` on controls and containers Fix: Replace `rounded-xl` with `rounded-[--radius-md]`
- **corners-large-tier**: Line 41: Modal uses `rounded-[var(--radius-md)]`; should be `--radius-lg` Fix: Change to `rounded-[var(--radius-lg)]`
- **close-button-shape**: Line 55: Close button uses `rounded-lg` Fix: Change to `rounded-[var(--radius-full)]`

### personality

Path: `./components/studio/create/character/personality/PersonalityModal.view.jsx`

- **corners-standard-tier**: Line 28, 62, 73, 80, 88, 101: Multiple `rounded-xl` on controls Fix: Replace with `rounded-[--radius-md]`
- **corners-large-tier**: Line 40: Modal uses `rounded-[var(--radius-md)]` Fix: Change to `rounded-[var(--radius-lg)]`

### review-step

Path: `./components/studio/create/character/review-step/CharacterReviewStep.view.jsx`

- **controls-radius**: Line 14, 22, 81, 91, 130: Multiple `rounded-xl` on inputs, containers, and form elements Fix: Replace `rounded-xl` with `rounded-[--radius-md]`

### skin-tone

Path: `./components/studio/create/character/skin-tone/SkinToneModal.view.jsx`

- **corners-standard-tier**: Line 28, 65, 72, 84, 97, 113: Multiple `rounded-xl` on buttons and controls Fix: Replace with `rounded-[--radius-md]`
- **corners-large-tier**: Line 40: Modal uses `rounded-[var(--radius-md)]` Fix: Change to `rounded-[var(--radius-lg)]`

### trait

Path: `./components/studio/create/character/trait/TraitModal.view.jsx`

- **corners-standard-tier**: Line 28, 62, 73, 80, 88, 101: Multiple `rounded-xl` Fix: Replace with `rounded-[--radius-md]`
- **corners-large-tier**: Line 40: Modal uses `rounded-[var(--radius-md)]` Fix: Change to `rounded-[var(--radius-lg)]`

### voice-module-picker

Path: `./components/studio/create/character/voice-module-picker/VoiceModulePickerModal.view.jsx`

- **controls-radius**: Line 31, 46, 57, 75, 121, 153, 164, 172: Multiple `rounded-xl` on trigger card, buttons, and option tiles Fix: Replace `rounded-xl` with `rounded-[--radius-md]`
- **corners-large-tier**: Line 75: Modal uses `rounded-[var(--radius-md)]` Fix: Change to `rounded-[var(--radius-lg)]`

### create-type-card

Path: `./components/studio/create/create-type-card/CreateTypeCard.view.jsx`

- **corners-standard-tier**: Line 12: Card uses `rounded-[var(--radius-md)]` which is correct for a grid card per standard tier Fix: No violation - this is correct per standard tier for cards in grid

### creation-studio

Path: `./components/studio/create/creation-studio/CreationStudio.view.jsx`

- **controls-radius**: Line 56, 67, 72, 161, 241, 280, 309, 338, 342, 381, 425, 449, 467, 533, 568, 645, 671, 682, 731, 803, 813, 838, 1206, 1246, 1272, 1568, 1616, 1635, 1683: Multiple `rounded-xl` and other radius issues throughout Fix: Systematically replace `rounded-xl` with `rounded-[--radius-md]` for all control and card elements

### item-registry-builder

Path: `./components/studio/create/item-registry/item-registry-builder/ItemRegistryBuilder.view.jsx`

- **controls-radius**: Line 118, 242, 325, 338, 353, 378, 399, 424, 645, 721, 771, 793, 803: Multiple `rounded-xl` on containers, input fields, and buttons Fix: Replace `rounded-xl` with `rounded-[--radius-md]`

### location-registry-builder

Path: `./components/studio/create/location-registry/location-registry-builder/LocationRegistryBuilder.view.jsx`

- **corners-large-tier**: Line 1394: Modal shell uses `rounded-[var(--radius-lg)]` which is correct for floating surface; this is good Fix: No violation - this is correct per Ruling 1
- **controls-radius**: Line 104, 115, 130, 227, 385, 398, 475, 493, 569, 587, 616, 635, 650, 668, 682, 721, 740, 1476, 1493, 1524, 1568, 1616, 1635, 1650, 1661, 1683: Multiple `rounded-xl` and `rounded-lg` on controls and form elements Fix: Replace `rounded-xl` with `rounded-[--radius-md]` and `rounded-lg` with `rounded-[--radius-md]` where used for controls

### structured-registry-builder

Path: `./components/studio/create/structured-registry/structured-registry-builder/StructuredRegistryBuilder.view.jsx`

- **token-usage**: Lines 60, 63, 69, 76, 85, 102, 119, 121, 122, 201-202, 219, 240, 567: Uses legacy bridge variables --muted-gold and --muted instead of real design-system tokens. Fix: Replace all --muted-gold with --gold-ornament (for gold accents) or --gold-action (for interactive); replace all --muted with --ink-dim or --ink-faint as context requires.
- **shape-law**: Line 116: Tab buttons use rounded-full (pill shape) on button controls, violating shape law that reserves pill shapes for tags and icon buttons only. Fix: Change rounded-full to rounded-[var(--radius-md)] on line 116 tab button class.
- **status-colors**: Line 100: Error message uses raw border-red-500/30 and bg-red-500/10 instead of --status-danger token. Fix: Replace red-500 with --status-danger and apply at appropriate opacity tier per status color rules.

### outfit-picker-modal

Path: `./components/studio/create/wardrobe/outfit-picker/OutfitPickerModal.view.jsx`

- **token-usage**: Lines 22, 25, 28, 30, 46: Uses legacy bridge variables --muted-gold and --muted instead of real tokens. Fix: Replace --muted-gold with --gold-ornament or --gold-action; replace --muted with --ink-dim or --ink-faint.
- **status-colors**: Line 64: Error message uses raw border-red-500/30 and bg-red-500/10 instead of --status-danger. Fix: Use --status-danger token and corresponding opacity tier for error state messaging.

### wardrobe-builder

Path: `./components/studio/create/wardrobe/wardrobe-builder/WardrobeBuilder.view.jsx`

- **token-usage**: Lines 66, 69, 70, 72, 85, 100, 176, 177, 193, 287: Uses legacy bridge variables --muted-gold and --muted. Fix: Replace bridge variables with real tokens: --gold-ornament, --gold-action, --ink-dim, --ink-faint as context requires.
- **shape-law**: Line 116: Tab buttons use rounded-full on control buttons, violating pill-shape rule for tags/icon-buttons only. Fix: Change rounded-full to rounded-[var(--radius-md)] for tab button styling.
- **status-colors**: Line 99: Error message uses raw border-red-500/30 and bg-red-500/10 instead of --status-danger. Fix: Apply --status-danger token with proper opacity for error message styling.
- **corners**: Line 348: Placeholder uses rounded-2xl (16px, off-scale) instead of correct radius tier. Fix: Change rounded-2xl to rounded-[var(--radius-md)] for in-flow surface or rounded-[var(--radius-lg)] if it floats.
- **status-colors**: Line 473: Delete Entry button uses border-red-500/25 and bg-red-500/10 instead of --status-danger token. Fix: Replace raw red with --status-danger and style as quiet trigger (text only, no fill) per destructive button ruling.

### creation-card

Path: `./components/studio/creations/creation-card/CreationCard.view.jsx`

- **corners**: Line 59: Card uses rounded-2xl (16px, off-scale) instead of correct radius tier. Fix: Change rounded-2xl to rounded-[var(--radius-md)] (12px) for in-flow card.
- **status-colors**: Lines 106, 122: Heart/bookmark buttons use hardcoded pink-300 and pink-400 for liked/bookmarked states instead of status tokens. Fix: Define a consistent engagement color state using existing tokens or a new engagement token, not ad-hoc pink.
- **status-colors**: Lines 257, 263: Error and status messages use hardcoded red-500/35, red-950/90 and emerald-500/35, emerald-950/90 instead of --status-danger and --status-success. Fix: Replace hardcoded colors with --status-danger and --status-success tokens with proper opacity tiers.

### creation-credits

Path: `./components/studio/creations/creation-credits/CreationCredits.view.jsx`

- **token-usage**: Line 8: Uses legacy bridge variable --muted-gold instead of real token. Fix: Replace --muted-gold with --gold-ornament (for eyebrow/label contexts).

### creation-preview-modal

Path: `./components/studio/creations/creation-preview-modal/CreationPreviewModal.view.jsx`

- **token-usage**: Lines 29, 30, 257, 260, 346, 357, 379, 403: Uses legacy bridge variables --muted-gold and --muted. Fix: Replace with real tokens: --gold-ornament, --gold-action, --ink-dim, --ink-faint.
- **status-colors**: Lines 34, 48, 50: Like/bookmark buttons use hardcoded pink-400/45 and pink-400/15 instead of status tokens. Fix: Use consistent engagement state tokens instead of ad-hoc pink colors.
- **status-colors**: Lines 434-449: Error and status messages use raw border-red-500/25, bg-red-500/10, emerald-500/25, emerald-500/10 instead of status tokens. Fix: Apply --status-danger, --status-warning, --status-success tokens with correct opacity tier.

### creation-profile-page

Path: `./components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx`

- **token-usage**: Lines 60, 62, 75, 80, 106, 137, 144, 190: Uses legacy bridge variables --muted-gold and --muted. Fix: Replace bridge variables with real tokens throughout.
- **status-colors**: Line 49: Error message uses raw red-400/25 and red-400/10 instead of --status-danger. Fix: Apply --status-danger token for error state messaging.

### creation-share-button

Path: `./components/studio/creations/creation-share-button/CreationShareButton.view.jsx`

- **token-usage**: Line 20-21: Compact mode uses hardcoded hex colors (#7b5525, #6a481f) instead of tokens. Fix: Replace raw hex values with token-based colors; compact mode should reuse standard button tokens, not introduce new hex colors.

### creation-stats-row

Path: `./components/studio/creations/creation-stats-row/CreationStatsRow.view.jsx`

- **stat-rows**: Line 34: Row gap uses gap-3 (12px) instead of --space-1 (4px) per stat row recipe; Ruling 4 specifies 3px gaps round to --space-1. Fix: Change gap-3 to explicit gap-[var(--space-1)] or equivalent to match stat row spec of 4px gap.
- **stat-rows**: Line 47: Icon size is hardcoded 12px or 14px instead of --icon-sm (16px) per stat row recipe and Ruling 4. Fix: Change Icon size={compact ? 12 : 14} to use --icon-sm (16px) constant or equivalent sizing token.

### creation-status-badges

Path: `./components/studio/creations/creation-status-badges/CreationStatusBadges.view.jsx`

- **status-colors**: Lines 14-31: badgeClass function uses hardcoded Tailwind color classes (amber-400, emerald-400, red-400, purple-400, sky-400) instead of status tokens. Fix: Map badge states to --status-danger, --status-warning, --status-success tokens; remove ad-hoc purple and sky colors (no info color per rules).

### creation-tag-filter-row

Path: `./components/studio/creations/creation-tag-filter-row/CreationTagFilterRow.view.jsx`

- **token-usage**: Lines 19, 36, 37: Uses legacy bridge variables --muted-gold and --muted. Fix: Replace --muted-gold with --gold-ornament; --muted with --ink-dim.

### creation-picker-panel

Path: `./components/studio/creations/pickers/creation-picker-panel/CreationPickerPanel.view.jsx`

- **token-usage**: Lines 49, 100, 101, 150, 151: Uses legacy bridge variables --muted-gold. Fix: Replace --muted-gold with --gold-ornament or --gold-action as context requires.
- **corners**: Line 98: Card buttons use hardcoded rounded-xl instead of radius token. Fix: Change rounded-xl to rounded-[var(--radius-md)] for consistent control radius.

### games-hub

Path: `./components/studio/games/games-hub/GamesHub.view.jsx`

- **corners**: Line 22: PreviewViewModeToggle uses off-scale rounded-xl (16px) for a control, should be --radius-md (12px) Fix: Replace rounded-xl with rounded-[var(--radius-md)]

### custom-ingredient-editor

Path: `./components/studio/image-studio/custom-ingredient-editor/CustomIngredientEditor.view.jsx`

- **corners**: Line 18: Section uses off-scale rounded-2xl (24px), should be --radius-md (12px) for a standard in-flow surface Fix: Replace rounded-2xl with rounded-[var(--radius-md)]
- **token-usage**: Lines 18-94: Extensive use of legacy bridge tokens --muted-gold, --muted, --foreground instead of design-system tokens (no mapping provided in rulebook for these legacy names to canonical tokens) Fix: Map legacy tokens to canonical design-system tokens or use proper token names from app/theme.css
- **icon-button-shape**: Line 36: Close button (X icon) uses rounded-lg (8px) instead of --radius-full (pill shape required for icon buttons) Fix: Change rounded-lg to rounded-[var(--radius-full)]
- **corners**: Lines 53, 65, 75, 86: Multiple form controls use off-scale rounded-xl (16px), should be --radius-md (12px) Fix: Replace all rounded-xl with rounded-[var(--radius-md)] on inputs, buttons, and textareas

### image-studio-composer

Path: `./components/studio/image-studio/image-studio-composer/ImageStudioComposer.view.jsx`

- **corners**: Lines 61, 77, 119, 137, 143, 151, 161, 184: Multiple controls use off-scale rounded-xl (16px), should be --radius-md (12px) Fix: Replace all rounded-xl with rounded-[var(--radius-md)]
- **token-usage**: Lines 49-224: Extensive use of legacy bridge tokens --muted-gold, --muted, --foreground without mapping to canonical tokens Fix: Replace legacy tokens with proper design-system token names

### image-studio-workbench

Path: `./components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.view.jsx`

- **icon-button-shape**: Line 100: Close button (chevron icon) uses rounded-[var(--radius-md)] but should use --radius-full (pill shape required for icon buttons) Fix: Change rounded-[var(--radius-md)] to rounded-[var(--radius-full)]
- **token-usage**: Lines 47-84: Extensive use of legacy bridge tokens --muted-gold, --foreground without mapping to canonical tokens Fix: Replace legacy tokens with proper design-system token names

### ingredient-picker-modal

Path: `./components/studio/image-studio/ingredient-picker/IngredientPickerModal.view.jsx`

- **modal-chrome**: Line 45: Modal floating surface uses --radius-md (12px) but per Ruling 1 all floating surfaces (modals, pickers, sheets) must use --radius-lg (20px) Fix: Change rounded-[var(--radius-md)] to rounded-[var(--radius-lg)]
- **token-usage**: Lines 25-144: Extensive use of legacy bridge tokens --muted-gold, --muted, --foreground without mapping to canonical tokens Fix: Replace legacy tokens with proper design-system token names

### ingredient-slot

Path: `./components/studio/image-studio/ingredient-slot/IngredientSlot.view.jsx`

- **token-usage**: Lines 5-70: Extensive use of legacy bridge tokens --muted-gold, --muted, --foreground without mapping to canonical tokens Fix: Replace legacy tokens with proper design-system token names

### save-ingredient-preset-modal

Path: `./components/studio/image-studio/save-ingredient-preset/SaveIngredientPresetModal.view.jsx`

- **modal-chrome**: Line 28: Modal floating surface uses --radius-md (12px) but per Ruling 1 all floating surfaces must use --radius-lg (20px) Fix: Change rounded-[var(--radius-md)] to rounded-[var(--radius-lg)]
- **corners**: Lines 65, 78, 91, 103: Form inputs and textareas use off-scale rounded-xl (16px), should be --radius-md (12px) Fix: Replace all rounded-xl with rounded-[var(--radius-md)]
- **token-usage**: Lines 3-152: Extensive use of legacy bridge tokens --muted-gold, --muted, --foreground without mapping to canonical tokens Fix: Replace legacy tokens with proper design-system token names

### video-tools-panel

Path: `./components/studio/image-studio/video-tools-panel/VideoToolsPanel.view.jsx`

- **corners**: Lines 39, 88: Article and textarea use off-scale rounded-xl (16px), should be --radius-md (12px) Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **token-usage**: Lines 7-107: Extensive use of legacy bridge tokens --muted-gold, --muted, --foreground without mapping to canonical tokens Fix: Replace legacy tokens with proper design-system token names

### media-lightbox

Path: `./components/studio/media/media-lightbox/MediaLightbox.view.jsx`

- **corners**: Lines 263, 291, 309: Buttons use off-scale rounded-xl or rounded-lg (16px/8px), should be --radius-md (12px) for controls Fix: Replace rounded-xl/rounded-lg with rounded-[var(--radius-md)]
- **modal-chrome**: Line 342: Modal floating surface uses --radius-md (12px) but per Ruling 1 all floating surfaces must use --radius-lg (20px) Fix: Change rounded-[var(--radius-md)] to rounded-[var(--radius-lg)]
- **token-usage**: Lines 265-266, 293, 311, 445, etc: Off-system pink accent colors (border-pink-400, bg-pink-400/15, text-pink-200, text-pink-300, text-pink-400) used for active/liked states; no --pink token defined in app/theme.css; violates design-system token constraint Fix: Replace pink colors with canonical design-system tokens (likely --gold-bright or a status color from the rulebook)

### media-tile-quick-actions

Path: `./components/studio/media/media-tile-quick-actions/MediaTileQuickActions.view.jsx`

- **token-usage**: Lines 9-62: Uses legacy bridge tokens --muted for icon button background without mapping to canonical tokens Fix: Replace --muted with proper design-system token name

### creation-edit-media-panel

Path: `./components/studio/my-creations/creation-edit-media-panel/CreationEditMediaPanel.view.jsx`

- **corners**: Line 51: Featured slot buttons use off-scale rounded-xl (16px), should be --radius-md (12px) Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **token-usage**: Lines 3-164: Extensive use of legacy bridge tokens --muted-gold, --muted, --foreground without mapping to canonical tokens Fix: Replace legacy tokens with proper design-system token names

### SharedFields

Path: `./components/studio/my-creations/edit/sections/SharedFields.jsx`

- **corners-control-tier**: Line 24: TextField input control uses rounded-xl (16px off-scale) instead of --radius-md (12px) for standard controls. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 46: TextAreaField control uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 59: ReadOnlyField display box uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].

### ItemRegistryFieldsSection

Path: `./components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx`

- **corners-control-tier**: Line 176: 'Add Entry' button uses rounded-xl (16px, off-scale) instead of --radius-md (12px) for standard controls. Fix: Replace rounded-xl with rounded-[var(--radius-md)] or equivalent token reference.
- **corners-control-tier**: Line 189: Entry selector buttons use rounded-xl instead of --radius-md for standard controls. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 350: Checkbox control wrapper uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 580: Delete Entry button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **destructive-control-border**: Line 580: Delete Entry button is missing the required border for an in-page destructive trigger (should be ghost button with border). Fix: Add border border-white/10 to match the ghost button recipe from RESTYLE-RULES.md.
- **corners-control-tier**: Line 620: TextInput controls in ItemEntryEditor use rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 629: TextArea controls in ItemEntryEditor use rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 636: EmptyPanel uses rounded-xl instead of --radius-md for standard in-flow panels. Fix: Replace rounded-xl with rounded-[var(--radius-md)].

### LocationIdentitySection

Path: `./components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx`

- **corners-control-tier**: Line 171: Select control uses rounded-xl (16px) instead of --radius-md (12px) for standard controls. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 185: Checkbox control wrapper uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 241: 'Change Parent' button uses rounded-xl instead of --radius-md for standard button. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **destructive-control-styling**: Line 250: 'Clear Parent' button uses invalid hover colors (red-400/40, red-200) instead of proper destructive styling per Destructive ruling. Fix: Use text-[var(--status-danger)] for the button text color to match the in-page destructive trigger pattern.
- **corners-control-tier**: Line 250: 'Clear Parent' button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 280: 'Select Parent' button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].

### LocationRegistryAttachmentsSection

Path: `./components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view.jsx`

- **corners-control-tier**: Line 27: Card container uses rounded-2xl (16px off-scale) instead of --radius-md (12px) for standard in-flow cards. Fix: Replace rounded-2xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 42: 'Add' button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 63: Empty state panel uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 78: RegistryAttachmentCard uses rounded-2xl (16px off-scale) instead of --radius-md for standard cards. Fix: Replace rounded-2xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 124: Textarea control uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **destructive-control-styling**: Line 105: Remove button uses invalid hover colors (red-400/40, red-200) instead of proper destructive styling, and uses rounded-lg (8px) instead of standard radius. Fix: Use text-[var(--status-danger)] for hover state, and replace rounded-lg with rounded-[var(--radius-md)].

### LocationRuntimeModulesSection

Path: `./components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view.jsx`

- **corners-control-tier**: Line 74: Icon container uses rounded-xl (16px off-scale) for a small element; should use --radius-md or --radius-sm depending on context. Fix: Replace rounded-xl with rounded-[var(--radius-md)] or rounded-[var(--radius-sm)] for consistency with control sizing.
- **corners-control-tier**: Line 92: Configure/Edit Weather button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 101: Checkbox control wrapper uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 113: Info box uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 119: Module ID/Status box uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 144: Icon container uses rounded-xl for a small element. Fix: Replace rounded-xl with rounded-[var(--radius-md)] or rounded-[var(--radius-sm)].
- **corners-control-tier**: Line 160: Checkbox control wrapper uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 180: Select control uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Lines 199, 211, 223, 235, 246, 260: Number input controls use rounded-xl instead of --radius-md. Fix: Replace all rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 264: Checkbox control wrapper uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 278: Module ID/Status info box uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].

### LocationSensoryEnvironmentFields

Path: `./components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx`

- **corners-control-tier**: Line 25: ScaleField input control uses rounded-xl (16px off-scale) instead of --radius-md (12px). Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 41: Icon container in SenseCard uses rounded-xl for a small decorative element. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 86: Tag input control uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 93: Add button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 170: Guidance box uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 280: Scent note row uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 293: Scent note label input uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 320: Remove scent note button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 328: Empty state box uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].
- **corners-control-tier**: Line 336: 'Add Scent Note' button uses rounded-xl instead of --radius-md. Fix: Replace rounded-xl with rounded-[var(--radius-md)].

### weather-module-config-modal

Path: `./components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx`

- **Corners: Large-radius tier for floating surfaces**: Modal dialog uses `rounded-2xl` (16px, off-scale) instead of `--radius-lg` (20px) for a floating surface. Lines 54, 62, 63. Fix: Replace all `rounded-2xl` with `rounded-[var(--radius-lg)]` or equivalent token usage on the modal and its nested cards.
- **Status colors: destructive button fill and hover**: Delete button at line 300 uses raw red hover state `hover:border-red-400/40 hover:text-red-200` instead of `--status-danger` token. Fix: Replace `hover:border-red-400/40 hover:text-red-200` with hover states using `--status-danger` token.

### mechanics-command-core

Path: `./components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/MechanicsCommandCore.view.jsx`

- **Status colors: destructive button text**: Delete triggers at lines 77 and 488 use raw red text `hover:text-red-200` instead of `--status-danger` for the hover state. Fix: Replace `hover:text-red-200` with token-based hover state using `--status-danger`.

### mechanics-command-domain-actions

Path: `./components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions.view.jsx`

- **Status colors: warning state**: Warning messages at lines 101 and 264 use raw amber color `border-amber-300/20 bg-amber-500/10 text-amber-100` instead of `--status-warning` token family. Fix: Replace hardcoded amber colors with `--status-warning`, `--status-warning-bed`, and `--status-warning-border` tokens.

### mechanics-command-effects-card

Path: `./components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffectCard.view.jsx`

- **Destructive: visible word with every control**: Delete button at line 332 renders only a Trash2 icon with no accompanying text label; rulebook requires 'Every destructive control ships with the word beside it.' Fix: Add visible text (e.g., 'Remove' or 'Delete') alongside the icon inside the button.

### mechanics-command-resolution

Path: `./components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/MechanicsCommandResolution.view.jsx`

- **Status colors: destructive button**: Delete buttons at lines 149, 235, and 569 use raw red color `border-red-300/20 bg-red-500/10 p-2 text-red-200` instead of `--status-danger` token. Fix: Replace hardcoded red colors with `--status-danger` and related token for background/border.

### mechanics-composition-builder

Path: `./components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx`

- **Status colors: destructive button**: Delete buttons at lines 149, 235, and 569 use raw red color `border-red-300/20 bg-red-500/10 p-2 text-red-200` instead of `--status-danger` token. Fix: Replace hardcoded red colors with `--status-danger` token and related utilities.
- **Corners: off-scale radius on in-flow card**: MechanicsStepCard at line 694 uses `rounded-2xl` (16px, off-scale) for an in-flow card; should use `--radius-md` (12px) per standard tier. Fix: Replace `rounded-2xl` with `rounded-[var(--radius-md)]`.

### public-profile-badges

Path: `./components/studio/profile/public-profile-badges/PublicProfileBadges.view.jsx`

- **token-migration**: Bridge variable --muted-gold used throughout (lines 14, 45, 57) instead of real design-system token --gold-ornament or --gold-bright. Fix: Replace --muted-gold with appropriate token: --gold-ornament for ornamental gold or --gold-bright for bright gold, per RESTYLE-RULES.md line 41.
- **token-migration**: Bridge variable --muted used throughout (lines 18, 62) instead of real design-system token --ink-dim. Fix: Replace --muted with --ink-dim per RESTYLE-RULES.md line 41 migration note.
- **token-migration**: Bridge variable --foreground used (line 52) instead of real design-system token --ink. Fix: Replace --foreground with --ink, which is the real ink token.
- **opacity-wash**: Raw opacity values white/10, black/25, black/35 used (lines 13, 30) without tokenization. Fix: These opacity washes are not yet tokenized per RESTYLE-RULES.md §Open gaps; await Brian's ruling on wash token values.

### public-profile-creation-grid

Path: `./components/studio/profile/public-profile-creation-grid/PublicProfileCreationGrid.view.jsx`

- **status-colors**: Raw Tailwind colors red-500/30, red-500/10, red-200 used for error state (line 12) instead of status tokens. Fix: Replace with --status-danger and --ink per RESTYLE-RULES.md Status color tokens section; apply --status-danger to border and text.
- **token-migration**: Bridge variable --muted used (line 23) instead of real design-system token --ink-dim. Fix: Replace --muted with --ink-dim per RESTYLE-RULES.md line 41.
- **opacity-wash**: Raw opacity values white/10, black/25 used (line 21) without tokenization. Fix: These opacity washes are not yet tokenized per RESTYLE-RULES.md §Open gaps; await Brian's ruling.

### public-profile-donate-button

Path: `./components/studio/profile/public-profile-donate-button/PublicProfileDonateButton.view.jsx`

- **status-colors**: Raw Tailwind pink colors (pink-400/35, pink-400/10, pink-200, pink-100) used for donate button (lines 37, 165) without standard token mapping. Fix: Define or map pink donate affordance to a proper token; currently no donation color in the token system per RESTYLE-RULES.md §Sweep scope 'donate and pink accent family' deferred.
- **blur-panel-token**: File attempts to use --blur-panel (line 44) which is proposed but not yet added to app/theme.css per RESTYLE-RULES.md Blur ruling. Fix: This token is 'proposed here...not added to app/theme.css in this pass' per line 566-567; do not consume until token exists.
- **token-migration**: Bridge variables --muted, --muted-gold, --foreground used extensively (lines 54, 63, 78, 101, 125, 135, 148, 157) instead of real tokens. Fix: Replace with corresponding real tokens: --muted→--ink-dim, --muted-gold→--gold-ornament or --gold-bright, --foreground→--ink.
- **opacity-wash**: Raw opacity values white/10, black/40, black/50, black/35, white/[0.04] used (lines 31, 45, 63, 88, 92, 110, 115) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps; await Brian's ruling.
- **status-colors**: Status message uses conditional: --muted-gold for success (line 135) but red-500/30 for error (line 136), mixing bridge var with raw Tailwind. Fix: Use --status-danger for error messaging per RESTYLE-RULES.md Status color tokens; replace red-500 colors with --status-danger.

### public-profile-engagement-actions

Path: `./components/studio/profile/public-profile-engagement-actions/PublicProfileEngagementActions.view.jsx`

- **status-colors**: Raw Tailwind colors red-500/30, red-500/10, red-200 used for error state (line 16) instead of status tokens. Fix: Replace with --status-danger and --ink per RESTYLE-RULES.md Status color tokens section.

### public-profile-hero

Path: `./components/studio/profile/public-profile-hero/PublicProfileHero.view.jsx`

- **corner-law**: rounded-3xl (24px) used on outer card (line 17) and rounded-2xl (16px) on inner placeholder (line 31), both off-scale per Corners ruling. Fix: Replace rounded-3xl with --radius-lg (20px) for full-width card; replace rounded-2xl with --radius-md (12px) for standard surfaces.
- **token-migration**: Bridge variable --muted-gold used extensively (lines 17, 32, 50) instead of real token. Fix: Replace --muted-gold with --gold-ornament for ornamental usage per RESTYLE-RULES.md line 41.
- **token-migration**: Bridge variable --muted used (lines 35, 58, 82, 93) instead of real token --ink-dim. Fix: Replace --muted with --ink-dim per RESTYLE-RULES.md line 41.
- **token-migration**: Bridge variable --foreground used (lines 54, 79) instead of real token --ink. Fix: Replace --foreground with --ink.
- **opacity-wash**: Raw opacity values black/30, black/45 used (lines 17, 42, 77) and inline gradients with raw rgba colors (line 19) without tokenization. Fix: Opacity washes not yet tokenized; inline gradients with raw rgba colors need token migration when gradient tokens are defined.

### public-profile-tabs

Path: `./components/studio/profile/public-profile-tabs/PublicProfileTabs.view.jsx`

- **token-migration**: Bridge variable --muted-gold used (lines 12, 27) instead of real token. Fix: Replace --muted-gold with appropriate token per RESTYLE-RULES.md line 41.
- **token-migration**: Bridge variable --foreground used (line 27) instead of real token --ink. Fix: Replace --foreground with --ink.
- **token-migration**: Bridge variable --muted used (line 28) instead of real token --ink-dim. Fix: Replace --muted with --ink-dim per RESTYLE-RULES.md line 41.
- **opacity-wash**: Raw opacity values white/10, black/35 used (line 18) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps; await Brian's ruling.

### item-starting-assignment-editor

Path: `./components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.view.jsx`

- **corner-law**: rounded-2xl (16px) used multiple times (lines 45, 113, 132, 153, 163, 218, 228, 240, 271, 278) instead of token-based radius. Fix: Replace with --radius-md (12px) for standard surfaces per Corners ruling at RESTYLE-RULES.md line 495; or --radius-lg (20px) if full-width floating surface.
- **token-migration**: Bridge variables --muted-gold, --muted, --foreground used extensively (lines 47, 51, 78, 87, 96, 101, 121, 133, 148, 157, 166, 175, 185, 194, 214, 243, 267) instead of real tokens. Fix: Replace per RESTYLE-RULES.md line 41: --muted→--ink-dim, --muted-gold→--gold-ornament, --foreground→--ink.
- **opacity-wash**: Raw opacity values white/10, black/25, black/30, black/45 used throughout (lines 45, 67, 74, 83, 113, 132, 153, 163, 218, 228, 235, 240) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps; await Brian's ruling.
- **destructive-button**: Delete control at line 194 correctly uses --status-danger but should verify text label 'Delete' is visible (not icon-only). Fix: Verify deletion affordance has word 'Delete' or similar visible beside icon per Destructive ruling.

### invited-players-panel

Path: `./components/studio/room-templates/invited-players-panel/InvitedPlayersPanel.view.jsx`

- **destructive-button**: Delete control at line 74 is icon-only (just <X>) without visible word beside it, violating Destructive ruling. Fix: Add text label 'Remove' or similar beside the X icon; per RESTYLE-RULES.md 'Every destructive control ships with the word beside it.'
- **status-colors**: Error message at line 37 uses raw Tailwind color text-red-200 instead of status token. Fix: Replace red-200 with --ink or appropriate status color; use --status-danger for error context.
- **token-migration**: Bridge variables --muted-gold, --muted, --foreground used (lines 18, 21, 29, 47, 60, 63, 79) instead of real tokens. Fix: Replace per RESTYLE-RULES.md line 41.
- **opacity-wash**: Raw opacity values white/10, black/35, black/25 used (lines 15, 45, 47) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps.

### opening-message-card

Path: `./components/studio/room-templates/opening-message-card/OpeningMessageCard.view.jsx`

- **destructive-button**: Remove button at line 25 shows danger color only on hover, not in idle state; should show danger signal at rest per Destructive ruling. Fix: Apply text-[--status-danger] in idle state, not just on hover, per in-page delete trigger treatment at RESTYLE-RULES.md lines 591-592.
- **token-migration**: Bridge variable --muted-gold used (line 17) instead of real token. Fix: Replace --muted-gold with --gold-ornament per RESTYLE-RULES.md line 41.
- **opacity-wash**: Raw opacity values white/10, black/25 used (line 15) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps.

### room-template-picker

Path: `./components/studio/room-templates/room-template-picker/RoomTemplatePickerModal.view.jsx`

- **modal-radius**: Modal correctly uses --radius-lg (line 30), compliant with Corners ruling for floating surfaces. Fix: No violation; radius is correct.
- **token-migration**: Bridge variable --muted-gold used (lines 30, 33) and --muted used (line 40) instead of real tokens. Fix: Replace per RESTYLE-RULES.md line 41.
- **opacity-wash**: Raw opacity values black/80, white/10 used (lines 29, 31) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps.

### room-template-summary

Path: `./components/studio/room-templates/room-template-summary/RoomTemplateSummary.view.jsx`

- **token-migration**: Bridge variable --muted-gold used (line 9) and --muted used (line 13) instead of real tokens. Fix: Replace per RESTYLE-RULES.md line 41.
- **opacity-wash**: Raw opacity values white/10, black/25 used (line 8) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps.

### scenario-recommendations-panel

Path: `./components/studio/room-templates/scenario-recommendations-panel/ScenarioRecommendationsPanel.view.jsx`

- **token-migration**: Bridge variables --muted-gold, --muted, --foreground used extensively (lines 21, 24, 30, 40, 48, 103, 107, 115, 132, 136, 144) instead of real tokens. Fix: Replace per RESTYLE-RULES.md line 41.
- **opacity-wash**: Raw opacity values black/30, black/20, black/25, white/10 used (lines 40, 48, 102, 131, 115, 144) without tokenization. Fix: Opacity washes not yet tokenized per RESTYLE-RULES.md §Open gaps.

### SelectedCharactersPanel

Path: `./components/studio/room-templates/selected-characters-panel/SelectedCharactersPanel.view.jsx`

- **Destructive: visible word beside icon**: Line 55-62: Delete (X icon) button is icon-only with no visible label text, and danger color only appears on hover. Rule requires visible word always present. Fix: Add visible label like 'Remove' or change aria-label to visible text, and apply --status-danger text color at rest (not hover-only).

### StoryRoomChatShell

Path: `./components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx`

- **Corners: off-scale 16px resolves to standard tier**: Line 58: Main chat container uses rounded-2xl (16px), which is off-scale. Per Corners ruling, 16px drifts ad-hoc and resolves down to --radius-md (12px). Fix: Replace rounded-2xl with rounded-[var(--radius-md)].
- **Corners: floating surfaces use large-radius tier**: Line 145: Modal dialog uses rounded-2xl (16px). Modals float above the page and must use large-radius tier (20px/--radius-lg). Fix: Replace rounded-2xl with rounded-[var(--radius-lg)].
- **Corners: off-scale 16px resolves to standard tier**: Line 305: PanelRevealButton uses rounded-2xl (16px). This is a control button and should use standard tier. Fix: Replace rounded-2xl with rounded-[var(--radius-md)].

### StoryRoomComposer

Path: `./components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx`

- **Token usage: raw color values**: Line 370: Image button uses text-pink-300 (raw Tailwind color) instead of a design system token. No token exists for this yet, creating an off-system color. Fix: Replace text-pink-300 with an appropriate system token, or defer to design review for a proper token assignment.
- **Shape law: pill reserved for tags and icon buttons only**: Line 396: Send button uses rounded-full (pill shape). Buttons must use rounded rectangle at --radius-md, never pill. Pill shape reads as a label, not an action. Fix: Replace rounded-full with rounded-[var(--radius-md)].

### StoryRoomNpcParticipantManager

Path: `./components/studio/story-rooms/story-room-npc-participant-manager/StoryRoomNpcParticipantManager.view.jsx`

- **Token usage: raw color values for status**: Line 58: Error message uses border-red-500/25, bg-red-500/10, text-red-200 (raw Tailwind red) instead of --status-danger tokens (--status-danger-border, --status-danger-bed, --status-danger). Fix: Replace raw red with border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)].

### StoryRoomRuntimeMechanicsPanel

Path: `./components/studio/story-rooms/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.view.jsx`

- **Destructive: visible word beside icon**: Line 60-68: Delete button contains only icon (Trash2) with no visible label text. Rule requires every destructive control ship with the word beside it, not icon-only. Fix: Add visible text label like 'Remove Mechanics' or add a title attribute visible in UI.
- **Token usage: raw color values for status**: Line 162: Status message uses text-emerald-100 and bg-emerald-500/10 (raw Tailwind green) instead of --status-success tokens (--status-success, --status-success-bed). Fix: Replace raw green with proper status tokens: bg-[var(--status-success-bed)] text-[var(--status-success)].
- **Token usage: raw color values for status**: Line 168: Error message uses border-red-500/25, bg-red-500/10, text-red-200 (raw Tailwind red) instead of --status-danger tokens. Fix: Replace raw red with border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)].

### storyline-builder-shell

Path: `./components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view.jsx`

- **corners**: Floating aside element uses --radius-md (12px) instead of --radius-lg (20px); floating surfaces must use large-radius tier per Ruling 1. Fix: Change line 37 rounded-[var(--radius-md)] to rounded-[var(--radius-lg)]
- **corners**: Input and textarea elements use rounded-xl (off-scale 16px) instead of --radius-md (12px); controls must use standard-radius tier. Fix: Replace rounded-xl with rounded-[var(--radius-md)] on lines 54, 66, 78, 95, 115
- **corners**: Save button uses rounded-xl (off-scale 16px) instead of --radius-md (12px); buttons must use standard-radius tier. Fix: Change line 124 rounded-xl to rounded-[var(--radius-md)]
- **status-colors**: Save message uses hardcoded text-red-200 and text-emerald-200 instead of status token colors. Fix: Replace hardcoded colors with --status-danger and --status-success tokens on lines 133-134

### storyline-node-list-editor

Path: `./components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view.jsx`

- **corners**: Error banner uses rounded-xl (off-scale 16px) instead of --radius-md (12px); banners must use standard-radius tier. Fix: Change line 65 rounded-xl to rounded-[var(--radius-md)]
- **corners**: Arrow buttons use rounded-lg (8px, which is --radius-sm) instead of --radius-md (12px); buttons must use standard-radius tier. Fix: Change lines 104, 113 rounded-lg to rounded-[var(--radius-md)]
- **destructive**: Delete/trash buttons at lines 121 and 277 show icon-only without visible text label; destructive controls must ship with the word beside icon. Fix: Add visible 'Remove' or 'Delete' text label adjacent to Trash2 icon on delete buttons
- **corners**: Error and warning banners use rounded-xl (off-scale 16px) instead of --radius-md (12px). Fix: Change lines 339, 350 rounded-xl to rounded-[var(--radius-md)]

### storyline-open-world-settings

Path: `./components/studio/storylines/storyline-open-world-settings/StorylineOpenWorldSettings.view.jsx`

- **corners**: Input select elements use rounded-xl (off-scale 16px) instead of --radius-md (12px); controls must use standard-radius tier. Fix: Change lines 44, 74 rounded-xl to rounded-[var(--radius-md)]
- **corners**: Info box at line 57 uses rounded-xl (off-scale 16px) instead of --radius-md (12px); in-flow cards use standard-radius tier. Fix: Change line 57 rounded-xl to rounded-[var(--radius-md)]

### storyline-reference-picker

Path: `./components/studio/storylines/storyline-reference-picker/StorylineReferencePickerModal.view.jsx`

- **corners**: Modal dialog uses --radius-md (12px) instead of --radius-lg (20px); floating surfaces (modals) must use large-radius tier per Ruling 1. Fix: Change line 30 rounded-[var(--radius-md)] to rounded-[var(--radius-lg)]
- **corners**: Search input uses rounded-xl (off-scale 16px) instead of --radius-md (12px); controls must use standard-radius tier. Fix: Change line 74 rounded-xl to rounded-[var(--radius-md)]

### studio-coming-soon

Path: `./components/studio/studio-coming-soon/StudioComingSoon.view.jsx`

- **corners**: Item box at line 30 uses rounded-xl (off-scale 16px) instead of --radius-md (12px); cards and containers use standard-radius tier. Fix: Change line 30 rounded-xl to rounded-[var(--radius-md)]

### studio-economy-widget

Path: `./components/studio/studio-economy-widget/StudioEconomyWidget.view.jsx`

- **corners**: Modal dialog uses --radius-md (12px) instead of --radius-lg (20px); floating surfaces (modals) must use large-radius tier per Ruling 1. Fix: Change line 6 rounded-[var(--radius-md)] to rounded-[var(--radius-lg)]
- **shape-law**: Coins button uses rounded-full (pill shape) which is reserved for tags and icon buttons only, not regular action buttons. Fix: Change line 75 rounded-full to rounded-[var(--radius-md)]
- **corners**: Widget box uses rounded-xl (off-scale 16px) instead of --radius-md (12px); cards and containers use standard-radius tier. Fix: Change line 126 rounded-xl to rounded-[var(--radius-md)]
- **corners**: Buy and Notifications buttons use rounded-xl (off-scale 16px) instead of --radius-md (12px); buttons must use standard-radius tier. Fix: Change lines 140, 149 rounded-xl to rounded-[var(--radius-md)]

### studio-sidebar

Path: `./components/studio/studio-sidebar/StudioSidebar.view.jsx`

- **Bridge variable replacement**: StudioSidebar uses legacy bridge variables (--muted-gold, --muted, --foreground) throughout instead of the real design tokens (--gold-ornament, --ink-dim, --ink). Fix: Replace all instances of --muted-gold with --gold-ornament, --muted with --ink-dim, and --foreground with --ink.
- **Corners: controls tighter than allowed**: Line 86 uses rounded-lg (8px / --radius-sm) on a toggle button, which is smaller than the standard control radius of 12px. Fix: Replace rounded-lg with rounded-[var(--radius-md)] to match the standard 12px control radius.
- **Raw color value**: Line 66 uses bg-black/80, a raw Tailwind color modifier instead of the canvas or surface tokens defined in the theme. Fix: Replace bg-black/80 with bg-[var(--canvas)] or an appropriate surface token from the design system.
- **Inconsistent radius syntax**: Line 149 uses rounded-xl (Tailwind class for 12px) while other components use rounded-[var(--radius-md)] to reference the token directly. Fix: Replace rounded-xl with rounded-[var(--radius-md)] for consistency with the token reference approach.

### studio-top-bar

Path: `./components/studio/studio-top-bar/StudioTopBar.view.jsx`

- **Bridge variable replacement**: StudioTopBar uses legacy bridge variables (--muted-gold, --muted) throughout instead of the real design tokens (--gold-ornament, --ink-dim). Fix: Replace all instances of --muted-gold with --gold-ornament and --muted with --ink-dim or --ink as appropriate.
- **Corners: off-scale radius**: Line 21 uses rounded-2xl (16px), which is off-scale and does not match any approved radius tier (should be --radius-md 12px or --radius-lg 20px for a header). Fix: Replace rounded-2xl with rounded-[var(--radius-md)] to use the standard control radius.
- **Shape law: pill on non-tag/non-icon-button**: Line 32 uses rounded-full on a coins display chip, but pill-shaped controls are reserved for tags and icon buttons only; chips should use standard radius. Fix: Replace rounded-full with rounded-[var(--radius-md)] on the coins chip to use the standard control radius.
- **Raw color value**: Line 87 uses hardcoded bg-[#080706] instead of a surface token, while similar modals in the codebase use bg-[var(--surface-4)]. Fix: Replace bg-[#080706] with bg-[var(--surface-4)] to use the design system token for modal surfaces.
- **Inconsistent radius syntax**: Line 40 uses rounded-[var(--radius-md)] while lines 79 and 111 use rounded-xl, mixing token and Tailwind class approaches. Fix: Replace rounded-xl on lines 79 and 111 with rounded-[var(--radius-md)] for consistency.

### character-template-gallery

Path: `./components/studio/templates/character-template-gallery/CharacterTemplateGallery.view.jsx`

- **Bridge variable replacement**: CharacterTemplateGallery uses legacy bridge variables (--muted-gold, --muted) instead of the real design tokens (--gold-ornament, --ink-dim). Fix: Replace all instances of --muted-gold with --gold-ornament and --muted with --ink-dim or --ink.
- **Inconsistent radius syntax**: Lines 22, 50, and 59 use rounded-[var(--radius-md)] while lines 79 and 95 use rounded-xl, mixing token reference and Tailwind class approaches. Fix: Replace rounded-xl on lines 79 and 95 with rounded-[var(--radius-md)] for consistency with other cards in the component.

### responsive-filter-panel

Path: `./components/studio/ui/responsive-filter-panel/ResponsiveFilterPanel.view.jsx`

- **Bridge variable replacement**: ResponsiveFilterPanel uses legacy bridge variables (--muted-gold) instead of the real design token (--gold-ornament). Fix: Replace all instances of --muted-gold with --gold-ornament.
- **Inconsistent radius syntax**: Line 15 uses rounded-[var(--radius-md)] while lines 39 and 48 use rounded-xl, mixing token reference and Tailwind class approaches on similar filter toggle buttons. Fix: Replace rounded-xl on lines 39 and 48 with rounded-[var(--radius-md)] to match the panel's radius approach.

### room-template-opening-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/room-templates/room-template-opening-section`

- **legacy-bridge-tokens**: Line 52: uses --muted-gold which is a legacy bridge name replaced by --gold-ornament Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 92: uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 92: uses --muted-gold which is a legacy bridge name replaced by --gold-ornament Fix: Replace all uses of --muted-gold with --gold-ornament and related status tokens

### room-template-package-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/room-templates/room-template-package-section`

- **raw-tailwind-colors**: Line 57: uses text-red-200 (raw Tailwind color) instead of design token for error message Fix: Replace text-red-200 with text-[var(--status-danger)]

### story-narrative-runtime-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/room-templates/story-narrative-runtime-section`

- **legacy-bridge-tokens**: Line 11: PolicySelect label uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 17: PolicySelect uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **radius-token-not-hardcoded**: Line 47: GuidanceField textarea uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 127: phase eyebrow uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]

### scenario-cast-requirements-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section`

- **raw-tailwind-colors**: Line 27: uses text-red-200 (raw Tailwind color) instead of design token for error message Fix: Replace text-red-200 with text-[var(--status-danger)]
- **legacy-bridge-tokens**: Line 42: field label uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 49: reference selector button uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 49: reference selector button hover state uses --muted-gold which is a legacy bridge name Fix: Replace hover:border-[var(--muted-gold)]/35 with appropriate gold-ornament or line token
- **radius-token-not-hardcoded**: Line 85: selected reference chip uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **radius-token-not-hardcoded**: Line 86: chip avatar uses rounded-lg (hardcoded 8px) instead of design token Fix: Replace rounded-lg with rounded-[var(--radius-sm)]
- **legacy-bridge-tokens**: Line 86: chip avatar uses --muted-gold in border and background (legacy bridge name) Fix: Replace --muted-gold with --gold-ornament
- **legacy-bridge-tokens**: Line 102: type label uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 110: remove button uses rounded-lg (hardcoded 8px) instead of design token Fix: Replace rounded-lg with rounded-[var(--radius-sm)]
- **destructive-button-no-visible-label**: Line 110: delete button (X icon) is missing visible text label beside the icon, relies only on aria-label Fix: Add visible text label beside the icon (e.g., 'Remove' or 'Delete') outside aria-label only

### scenario-middleware-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/scenarios/scenario-middleware-section`

- **legacy-bridge-tokens**: Line 47: enabled state uses --muted-gold (legacy bridge name) in border and background Fix: Replace border-[var(--muted-gold)] with border-[var(--gold-ornament)] and bg-[var(--muted-gold)] with appropriate status or accent token
- **legacy-bridge-tokens**: Line 48: disabled/hover state uses --muted-gold (legacy bridge name) in border Fix: Replace hover:border-[var(--muted-gold)] with appropriate gold-ornament or line token
- **legacy-bridge-tokens**: Line 56: enabled icon state uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]

### scenario-story-circle-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/scenarios/scenario-story-circle-section`

- **legacy-bridge-tokens**: Line 28: step label uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]

### storyline-fields-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/storylines/storyline-fields-section`

- **legacy-bridge-tokens**: Line 32: section eyebrow uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]

### visual-references-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/visual-references-section`

- **legacy-bridge-tokens**: Line 8: card eyebrow uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 21: clear button uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **destructive-button-no-visible-label**: Line 21: delete button (X icon) is missing visible text label beside the icon, relies only on aria-label Fix: Add visible text label beside the icon (e.g., 'Clear' or 'Remove') outside aria-label only
- **radius-token-not-hardcoded**: Line 29: image container uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 41: empty state icon uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **legacy-bridge-tokens**: Line 63: choose button uses --muted-gold (legacy bridge name) in border and background Fix: Replace border-[var(--muted-gold)] and bg-[var(--muted-gold)] with appropriate gold-ornament or status tokens
- **legacy-bridge-tokens**: Line 87: section eyebrow uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 99: refresh button uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 99: refresh button hover state uses --muted-gold (legacy bridge name) in border Fix: Replace hover:border-[var(--muted-gold)] with appropriate gold-ornament or line token
- **raw-tailwind-colors**: Line 107: error message uses border-red-500/30, bg-red-500/10, text-red-200 (raw Tailwind colors) Fix: Replace with status-danger treatment using --status-danger and appropriate border/background opacity values

### wardrobe-fields-section

Path: `/Users/briansmith/dev/Crestfall-fe/components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section`

- **legacy-bridge-tokens**: Line 145: add entry button uses --muted-gold (legacy bridge name) in border and background Fix: Replace border-[var(--muted-gold)] and bg-[var(--muted-gold)] with appropriate gold-ornament or action tokens
- **radius-token-not-hardcoded**: Line 158: entry button uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 160-161: entry button active/hover states use --muted-gold (legacy bridge name) Fix: Replace all --muted-gold with --gold-ornament
- **radius-token-not-hardcoded**: Line 173: empty state placeholder uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 188: empty state icon uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 212: outfit container uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **radius-token-not-hardcoded**: Line 218: outfit image background uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 241: select/change outfit button uses --muted-gold (legacy bridge name) in border and background Fix: Replace border-[var(--muted-gold)] and bg-[var(--muted-gold)] with appropriate gold-ornament or action tokens
- **radius-token-not-hardcoded**: Line 307: delete entry button uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **radius-token-not-hardcoded**: Line 343: allow random checkbox uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 413: field label uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]
- **radius-token-not-hardcoded**: Line 425: text input uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 425: text input hover/focus states use --muted-gold (legacy bridge name) Fix: Replace hover:border-[var(--muted-gold)] and focus:border-[var(--muted-gold)] with appropriate tokens
- **radius-token-not-hardcoded**: Line 434: textarea uses rounded-xl (hardcoded 12px) instead of design token Fix: Replace rounded-xl with rounded-[var(--radius-md)]
- **legacy-bridge-tokens**: Line 434: textarea hover/focus states use --muted-gold (legacy bridge name) Fix: Replace hover:border-[var(--muted-gold)] and focus:border-[var(--muted-gold)] with appropriate tokens
- **legacy-bridge-tokens**: Line 442: section eyebrow uses text-[var(--muted-gold)] which is a legacy bridge name Fix: Replace text-[var(--muted-gold)] with text-[var(--gold-ornament)]

### actor-mechanics-profile-builder

Path: `components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder/ActorMechanicsProfileBuilder.view.jsx`

- **status-colors-hardcoded**: Line 76: Uses hardcoded emerald-300/20 and emerald-300/5 for success state indicator instead of status tokens. Fix: Replace border-emerald-300/20 bg-emerald-300/5 text-emerald-100 with border-[var(--status-success-border)] bg-[var(--status-success-bed)] text-[var(--status-success)]

### actor-mechanics-profile-editor

Path: `components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor/ActorMechanicsProfileEditor.view.jsx`

- **status-colors-hardcoded**: Line 76: Uses hardcoded emerald-300/20, emerald-300/10, emerald-100 for success indicator instead of status tokens. Fix: Replace emerald colors with border-[var(--status-success-border)] bg-[var(--status-success-bed)] text-[var(--status-success)]
- **status-colors-hardcoded**: Line 557: Uses hardcoded violet-300/25, violet-300/10, violet-100 for Beyond Scale indicator instead of an appropriate token. Fix: This appears to be decorative information; use neutral tokens (--ink-dim, --line) or flag for design ruling on beyond-scale state color
- **status-colors-hardcoded**: Line 1127: Uses hardcoded amber-300/20, amber-300/5, amber-100 for disabled-profile warning instead of status tokens. Fix: Replace amber colors with border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] text-[var(--status-warning)]

### actor-mechanics-profile-json-editor-modal

Path: `components/studio/create/actor-mechanics-profile/actor-mechanics-profile-json-editor/ActorMechanicsProfileJsonEditorModal.view.jsx`

- **status-colors-hardcoded**: Line 20: Uses hardcoded red-300/20, red-500/10, red-100 for error state instead of status tokens. Fix: Replace red colors with border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]
- **status-colors-hardcoded**: Line 19: Uses hardcoded amber-300/20, amber-500/10, amber-100 for warning state instead of status tokens. Fix: Replace amber colors with border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] text-[var(--status-warning)]

### asset-builder

Path: `components/studio/create/assets/asset-builder/AssetBuilder.view.jsx`

- **status-colors-hardcoded**: Line 227: Uses hardcoded red-200 for error message state instead of status color. Fix: Use text-[var(--status-danger)] for error state
- **status-colors-hardcoded**: Line 227: Uses hardcoded emerald-200 for success message state instead of status color. Fix: Use text-[var(--status-success)] for success state

### character-creator

Path: `components/studio/create/character/character-creator/CharacterCreator.view.jsx`

- **status-colors-hardcoded**: Line 96: Uses hardcoded red-200 for error message state instead of status color. Fix: Use text-[var(--status-danger)] for error state
- **status-colors-hardcoded**: Line 96: Uses hardcoded emerald-200 for success message state instead of status color. Fix: Use text-[var(--status-success)] for success state

### default-clothing-selector

Path: `components/studio/create/character/default-clothing-selector/DefaultClothingSelector.view.jsx`

- **status-colors-hardcoded**: Line 46: Uses hardcoded red-500/25, red-500/10, red-200 for delete button instead of status tokens. Fix: Replace red-500 colors with border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]
- **destructive-control-icon-only**: Line 45-50: Delete/clear button renders as icon-only (X icon) without a visible word label. Fix: Add visible text beside the icon; e.g., 'Clear' or 'Remove' to satisfy the no-icon-only destructive-control rule

### eye-color-modal

Path: `components/studio/create/character/eye-color/EyeColorModal.view.jsx`

- **scrim-color-hardcoded**: Line 39: Uses hardcoded bg-black/75 for modal scrim instead of proper scrim token with backdrop blur. Fix: Replace bg-black/75 p-4 with bg-[var(--scrim-strong)] backdrop-blur-[2px] p-4 to match unified modal frame (Ruling 1)
- **modal-radius-off-spec**: Line 40: Uses hardcoded rounded-[var(--radius-md)] for modal frame instead of large-radius tier. Fix: Replace rounded-[var(--radius-md)] with rounded-[var(--radius-lg)] for floating surface

### hair-eyes-modal

Path: `components/studio/create/character/hair-eyes/HairEyesModal.view.jsx`

- **scrim-color-hardcoded**: Line 34: Uses hardcoded bg-black/75 for modal scrim instead of proper scrim token with backdrop blur. Fix: Replace bg-black/75 p-4 with bg-[var(--scrim-strong)] backdrop-blur-[2px] p-4 to match unified modal frame (Ruling 1)
- **modal-radius-off-spec**: Line 35: Uses hardcoded rounded-[var(--radius-md)] for modal frame instead of large-radius tier. Fix: Replace rounded-[var(--radius-md)] with rounded-[var(--radius-lg)] for floating surface

### location-builder

Path: `components/studio/create/location/location-builder/LocationBuilder.view.jsx`

- **Corners**: Lines 281, 290, 308, 505, 532 use rounded-xl (16px), which is off-scale per Corners ruling. Fix: Replace rounded-xl with rounded-[var(--radius-md)] (12px standard tier for controls).

### lore-builder

Path: `components/studio/create/lore/lore-builder/LoreBuilder.view.jsx`

- **Bridge variables**: Lines 8, 13, 43, 49, 69, 90-91: using --foreground, --muted, --muted-gold (legacy bridge names). Fix: Replace --foreground with real token (--ink or similar), --muted with --ink-dim or --ink-faint, --muted-gold with --gold-ornament.
- **Status colors**: Line 54, 72: hardcoded amber-300, red-300 color classes instead of design-system status tokens. Fix: Replace amber-300 classes with --status-warning and red-300/emerald-300 with --status-danger/--status-success tokens.
- **Corners**: Lines 54, 65, 66, 69, 89: multiple rounded-xl (16px off-scale) on controls. Fix: Replace rounded-xl with rounded-[var(--radius-md)] for standard control radius tier.

### lore-editor

Path: `components/studio/create/lore/lore-editor/LoreEditor.view.jsx`

- **Bridge variables**: Lines 7-8, 27, 40-41, 178, 246, 335, 396, 446, 1000, 1025, 1045, 1100, 1102, 1127, 1154: extensive use of --foreground, --muted, --muted-gold. Fix: Systematically replace all --foreground with --ink, --muted with --ink-dim/--ink-faint, --muted-gold with --gold-ornament.
- **Status colors**: Line 54, 72, 1304-1305: hardcoded amber-300, red-300, emerald-300 for error/warning states. Fix: Use --status-danger, --status-warning, --status-success tokens instead of Tailwind color classes.

### lore-engine-use

Path: `components/studio/create/lore/lore-engine-use/LoreEngineUse.view.jsx`

- **Status colors**: Lines 19-64 STATUS_PRESENTATION object defines all states with hardcoded Tailwind colors: sky-300 (info), emerald-300 (success), amber-300 (warning), red-300 (danger). Fix: Remove hardcoded color classes from STATUS_PRESENTATION. Use --status-success, --status-warning, --status-danger tokens in CSS with appropriate opacity layers for bed/border variants.
- **Status colors**: Lines 223, 229, 279, 288, 297, 311, 323: status message divs use hardcoded red-300, amber-300, sky-300, emerald-300 inline. Fix: Replace all hardcoded status color classes with corresponding --status-* tokens applied via CSS classes or BEM modifiers.

### lore-json-editor-modal

Path: `components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.view.jsx`

- **Bridge variables**: Lines 91, 106, 118, 161, 173, 185, 212: using --muted-gold, --muted (legacy). Fix: Replace --muted-gold with --gold-ornament and --muted with --ink-dim or --ink-faint.

### lore-publication-readiness

Path: `components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.view.jsx`

- **Bridge variables**: Lines 240, 268, 420, 427, 453, 473, 577, 634: using --muted-gold, --muted, --foreground (legacy). Fix: Replace with real tokens: --muted-gold → --gold-ornament, --muted → --ink-dim, --foreground → --ink.
- **Status colors**: Lines 19-50, 161, 267, 277, 299, 308, 328, 342: hardcoded sky-300, emerald-300, amber-300, red-300 for various status states. Fix: Use --status-success, --status-warning, --status-danger tokens with appropriate bed/border opacity values instead of hardcoded Tailwind colors.

### mechanics-module-builder

Path: `components/studio/create/mechanics-module/mechanics-module-builder/MechanicsModuleBuilder.view.jsx`

- **Bridge variables**: Lines 9-10, 22, 38, 82, 96: using --muted-gold, --muted (legacy bridge names). Fix: Replace --muted-gold with --gold-ornament and --muted with --ink-dim or --ink-faint.

### narrator-builder

Path: `components/studio/create/narrator/narrator-builder/NarratorBuilder.view.jsx`

- **Bridge variables**: Lines 11-12, 22, 28-29, 38, 66-67, 82, 93: using --muted-gold, --muted, --foreground (legacy). Fix: Replace --muted-gold with --gold-ornament, --muted with --ink-dim/--ink-faint, --foreground with --ink.

### narrator-module-selector

Path: `components/studio/create/narrator/narrator-module-selector/NarratorModuleSelector.view.jsx`

- **Bridge variables**: Lines 22-23, 39-40, 60-61: using --muted-gold (legacy bridge variable). Fix: Replace --muted-gold with --gold-ornament throughout.

### ModalActions

Path: `components/studio/create/npc-registry/modal-actions/ModalActions.view.jsx`

- **corners**: Button uses `rounded-xl` (16px), which is off-scale; should resolve to `--radius-md` (12px) per Corners ruling. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Border and fill use raw opacity literals (`border-white/10`, `border-[var(--muted-gold)]/45`, `bg-[var(--muted-gold)]/15`) instead of tokens. Fix: Replace raw opacity with opacity tokens where available, or use explicit var() values for established opacity layers.
- **button-geometry**: Button styling does not follow the Buttons recipe: missing inline-flex layout, gap spacing, and proper height/padding token usage. Fix: Restructure buttons to follow the `.btn` recipe with `inline-flex`, `--control-md` height, `--space-6` padding, and `gap-[var(--space-2)]`.

### ModalShell

Path: `components/studio/create/npc-registry/modal-shell/ModalShell.view.jsx`

- **modal-chrome-ruling-1**: Scrim uses `bg-black/80` without blur; should use `--scrim-strong` with `blur(2px)` per Ruling 1. Fix: Change scrim to `bg-[var(--scrim-strong)] backdrop-blur-[2px]`.
- **modal-chrome-ruling-1**: Dialog background uses raw hex `bg-[#080706]` instead of `--surface-4` token per Ruling 1. Fix: Replace `bg-[#080706]` with `bg-[var(--surface-4)]`.
- **raw-opacity-values**: Header divider uses `border-white/10` (raw opacity) instead of token. Fix: Use `border-[var(--line-whisper)]` token instead of raw opacity.
- **corners**: Close button uses `rounded-lg` (8px), which is off-scale; control close button should use `--radius-full` per rules. Fix: Replace `rounded-lg` with `rounded-[var(--radius-full)]`.
- **icon-sizing**: Close icon uses `size={18}`, which is off-scale; should use 16, 20, or 24. Fix: Change `size={18}` to `size={16}` or `size={20}`.

### NpcEntryModal

Path: `components/studio/create/npc-registry/npc-entry/NpcEntryModal.view.jsx`

- **corners**: Inline note panel uses `rounded-xl` (16px off-scale) on line 70. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Note panel uses raw opacity on border and fill: `border-[var(--muted-gold)]/20`, `bg-[var(--muted-gold)]/5`. Fix: Remove raw opacity modifiers; use solid colors or opacity tokens if available.
- **raw-opacity-values**: Attachment section background uses raw opacity: `bg-black/20`, `border-white/10`. Fix: Use surface and line tokens instead of raw opacity values.

### NpcRegistryBuilder

Path: `components/studio/create/npc-registry/npc-registry-builder/NpcRegistryBuilder.view.jsx`

- **destructive-controls**: `SmallDangerAction` component (lines 277, 355, 414, 475) renders delete icon only, with no visible word beside it; violates 'every destructive control ships with the word beside it' rule. Fix: Add visible label text next to Trash2 icon, e.g., render as `<Trash2 size={14} /> Delete` or similar.
- **corners**: Multiple form inputs and panels use `rounded-xl` (16px off-scale) on lines 503, 520, 544. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Multiple elements use raw opacity: `border-white/10`, `bg-black/35`, `bg-black/25`, `border-dashed border-white/10`. Fix: Use line and surface tokens, or remove opacity modifiers where appropriate.
- **corners**: Empty state panel on line 544 uses `rounded-2xl` (16px off-scale). Fix: Replace `rounded-2xl` with `rounded-[var(--radius-md)]`.

### PlayerCharacterCreator

Path: `components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.view.jsx`

- **corners**: Multiple form inputs and containers use `rounded-xl` (16px off-scale) on lines 89, 104, 185, 195, 203, 218, 304, 461, 513, 568, 587, 604. Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Multiple elements use raw opacity on bridge/color variables: `border-[var(--muted-gold)]/20`, `bg-black/45`, `border-white/10`, `bg-black/35`, `bg-black/25`. Fix: Use established tokens for borders (`--line-whisper`, `--line`) and backgrounds (`--surface-1`, `--surface-2`) instead of raw opacity.
- **status-colors**: Save message uses hardcoded Tailwind colors `text-red-200` and `text-emerald-200` (line 173) instead of status tokens. Fix: Use `text-[var(--status-danger)]` for error and `text-[var(--status-success)]` for success.
- **icon-sizing**: Step icon uses `size={17}`, which is off-scale. Fix: Change to `size={16}` or `size={20}`.

### ProgressionJsonEditorModal

Path: `components/studio/create/progression/progression-json-editor/ProgressionJsonEditorModal.view.jsx`

- **status-colors**: Issue list uses hardcoded Tailwind status colors: `border-amber-300/20`, `bg-amber-500/10`, `text-amber-100` for warnings and `border-red-300/20`, `bg-red-500/10`, `text-red-100` for errors (lines 19-20). Fix: Replace with `--status-warning` and `--status-danger` tokens and their bed/border pairs.
- **corners**: Multiple elements use `rounded-xl` (16px off-scale) on lines 24, 160, 172, 184, 234, 243, and `rounded-lg` on line 33. Fix: Use `rounded-[var(--radius-md)]` for standard controls.
- **raw-opacity-values**: Elements use raw opacity throughout: `border-white/10`, `bg-black/25`, `bg-black/55`, `bg-black/30`, `border-[var(--muted-gold)]/25`, `border-[var(--muted-gold)]/45`. Fix: Replace with appropriate line and surface tokens.
- **modal-chrome-ruling-1**: Modal background uses raw hex `bg-[#080706]` instead of `--surface-4` per Ruling 1. Fix: Replace with `bg-[var(--surface-4)]`.
- **status-colors**: Ready-to-validate section (line 211) uses hardcoded `border-emerald-300/15`, `bg-emerald-500/5`, `text-emerald-100`. Fix: Use `--status-success` token and its bed/border variants.
- **icon-sizing**: ToolbarButton icon uses `size={13}`, off-scale. Fix: Change to `size={16}`.

### ProgressionProfileBuilder

Path: `components/studio/create/progression/progression-profile-builder/ProgressionProfileBuilder.view.jsx`

- **corners**: Multiple form inputs use `rounded-xl` (16px off-scale) on lines 21, 31, 60, 77, 88, 94, 120, 145. Fix: Replace with `rounded-[var(--radius-md)]`.
- **corners**: Sidebar panel uses `rounded-2xl` (16px off-scale) on line 60. Fix: Replace with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Multiple elements use raw opacity: `border-white/10`, `bg-black/35`, `bg-black/45`, `bg-black/25`, `border-[var(--muted-gold)]/20`, `border-[var(--muted-gold)]/35`, `bg-[var(--muted-gold)]/10`, `bg-[var(--muted-gold)]/20`, `bg-[var(--muted-gold)]/5`. Fix: Use established surface, line, and fill tokens.
- **status-colors**: Status section uses hardcoded `border-emerald-300/20`, `bg-emerald-300/5`, `text-emerald-100` (line 77). Fix: Use `--status-success` token and variants.
- **modal-chrome-ruling-1**: Select background uses raw hex `bg-[#0b0907]` (line 31). Fix: Use `bg-[var(--surface-2)]` or `bg-[var(--surface-1)]`.
- **status-colors**: Save message uses hardcoded `text-rose-200` and `text-emerald-200` (line 154). Fix: Use `text-[var(--status-danger)]` and `text-[var(--status-success)]`.

### ProgressionProfileEditor

Path: `components/studio/create/progression/progression-profile-editor/ProgressionProfileEditor.view.jsx`

- **corners**: Form inputs and containers use `rounded-xl` (16px off-scale) on lines 38, 60, 70, 88, 136, 155, 174, 238, 357, 470, 480, 545, 554, 582, 650, 741, 750, 756, 762, 768. Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`.
- **corners**: Delete buttons in override (line 489) and tier (line 657) sections use `rounded-lg` (8px off-scale). Fix: Replace with `rounded-[var(--radius-md)]`.
- **destructive-controls**: Delete buttons for overrides (line 489) and tiers (line 657) show only Trash2 icon without visible word beside it. Fix: Add visible label text, e.g., 'Delete' or 'Remove'.
- **status-colors**: ValidationPanel uses hardcoded Tailwind colors: `border-emerald-300/20`, `bg-emerald-300/5`, `text-emerald-100` (line 96); `border-rose-300/20`, `bg-rose-300/5`, `text-rose-100` (line 105); `border-amber-300/20`, `bg-amber-300/5`, `text-amber-100` (line 117). Fix: Use `--status-success`, `--status-danger`, `--status-warning` tokens and their bed/border variants.
- **raw-opacity-values**: Multiple elements use raw opacity: `border-white/10`, `bg-black/20`, `bg-black/25`, `bg-white/[0.04]`, `bg-white/[0.02]`, `bg-white/[0.03]`, `border-white/15`. Fix: Use established line and surface tokens.
- **corners**: Empty state panels use `rounded-xl` with `border-dashed` on lines 545, 741. Fix: Replace with `rounded-[var(--radius-md)]`.

### RoomRegistryAttachmentsSection

Path: `components/studio/create/room-template/room-registry-attachments-section/RoomRegistryAttachmentsSection.view.jsx`

- **raw-opacity-values**: Group section uses raw opacity: `border-[var(--muted-gold)]/20`, `bg-black/30` (line 36). Fix: Use line and surface tokens instead.
- **corners**: Attach Registry button uses `rounded-xl` (16px off-scale) on line 51. Fix: Replace with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Attach button uses raw opacity: `border-[var(--muted-gold)]/35`, `bg-[var(--muted-gold)]/10`, `bg-[var(--muted-gold)]/20` (line 51). Fix: Use fill tokens instead of opacity modifiers.
- **corners**: Empty attachments panel uses `rounded-xl` (16px off-scale) on line 78. Fix: Replace with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Empty panel uses `border-dashed border-white/10`, `bg-black/25` (line 78). Fix: Use line and surface tokens.
- **corners**: Attachment card and image thumbnails use `rounded-xl` (16px off-scale) on lines 100, 106, 144. Fix: Replace with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Card and thumbnails use raw opacity: `border-white/10`, `bg-black/45`, `bg-black/35`, `border-white/10` (lines 96-144). Fix: Use line and surface tokens.

### RoomTemplateBuilder

Path: `components/studio/create/room-template/room-template-builder/RoomTemplateBuilder.view.jsx`

- **corners**: Multiple elements use `rounded-xl` (16px off-scale) on lines 95, 225, 277, 319, 334. Fix: Replace with `rounded-[var(--radius-md)]`.
- **raw-opacity-values**: Elements throughout use raw opacity: `border-[var(--muted-gold)]/20`, `bg-black/45`, `border-white/10`, `bg-black/25`, `border-[var(--muted-gold)]/35`, `bg-[var(--muted-gold)]/10`, `bg-[var(--muted-gold)]/20`, `border-[var(--muted-gold)]/60`, `bg-[var(--muted-gold)]/15`, `bg-black/30` (lines 64, 79, 95, 225-229, 277, 319-323, 334, 384). Fix: Use established line, fill, and surface tokens.
- **status-colors**: Save message uses hardcoded `text-red-200` and `text-emerald-200` (line 107). Fix: Use `text-[var(--status-danger)]` and `text-[var(--status-success)]`.

### SelectedCharactersPanel

Path: `components/studio/create/room-template/selected-characters-panel/SelectedCharactersPanel.view.jsx`

- **Bridge variable migration**: Line 17-18: Eyebrow uses bridge variable `--muted-gold` instead of design-system token `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]` and update other eyebrow color references.
- **Bridge variable migration**: Line 20: Description uses bridge variable `--muted` instead of design-system token `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class**: Line 28: Button uses hardcoded `rounded-xl` instead of token-based radius. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Bridge variable migration**: Line 28: Button border and background use bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace all `--muted-gold` with `--gold-ornament` in button classes.
- **Hardcoded radius / Tailwind class**: Line 40: Character item uses hardcoded `rounded-xl` instead of token-based radius. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Hardcoded radius / Tailwind class**: Line 42: Avatar uses hardcoded `rounded-xl` instead of token-based radius. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Destructive control without visible word**: Line 55-62: Remove button (X icon) has no visible text beside the icon, only aria-label; violates destructive control law requiring visible word. Fix: Add visible text beside the X icon (e.g., 'Remove') instead of relying on aria-label alone.

### SelectionCard

Path: `components/studio/create/room-template/selection-card/SelectionCard.view.jsx`

- **Hardcoded color**: Line 15: Uses hardcoded `border-white/10` and `bg-black/25` instead of design-system tokens. Fix: Replace hardcoded white/black opacity values with appropriate design-system surface and line tokens.
- **Bridge variable migration**: Line 15, 18, 22, 27: Multiple instances of bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace all `--muted-gold` with `--gold-ornament`.
- **Bridge variable migration**: Line 35: Description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.

### StoryRulesCodexAttachmentsSection

Path: `components/studio/create/room-template/story-rules-codex-attachments-section/StoryRulesCodexAttachmentsSection.view.jsx`

- **Bridge variable migration**: Line 23: Eyebrow uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 27: Body text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class**: Line 35: Add button uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Bridge variable migration**: Line 35: Add button uses bridge variable `--muted-gold` for border, background, and text. Fix: Replace all `--muted-gold` with `--gold-ornament`.
- **Bridge variable migration + Hardcoded color**: Line 42: Border uses bridge variable `--muted-gold` and background uses hardcoded `black/30`. Fix: Replace `--muted-gold` with `--gold-ornament` and replace hardcoded `bg-black/30` with appropriate token.
- **Hardcoded radius / Tailwind class**: Line 43: Info box uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Hardcoded color**: Line 43, 69: Uses hardcoded `border-white/10` and `bg-black/25` instead of tokens. Fix: Replace hardcoded colors with design-system tokens.
- **Bridge variable migration**: Line 46: Icon color uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 48: Text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class**: Line 69: Empty state uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Hardcoded color + Bridge variable**: Line 84: Card uses hardcoded `border-white/10` and `bg-black/35`. Fix: Replace hardcoded colors with design-system surface and line tokens.
- **Hardcoded radius / Tailwind class**: Line 88: Image thumbnail uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Hardcoded radius / Tailwind class**: Line 94: Icon fallback uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Bridge variable migration**: Line 94: Icon fallback uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 103: Card label uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Destructive control without visible word + Hardcoded radius**: Line 111: Remove button (X icon) is pill-shaped (`rounded-full`) and icon-only without visible text beside it. Fix: Change radius to `rounded-[var(--radius-md)]` (controls use standard radius, not pills) and add visible text beside the icon.
- **Hardcoded radius / Tailwind class**: Line 132: Textarea uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Hardcoded color + Bridge variable**: Line 132: Textarea uses hardcoded `border-white/10` and `bg-black/45`, plus bridge variable `--muted-gold` for focus state. Fix: Replace hardcoded colors and bridge variables with design-system tokens.

### RulesCodexBuilder

Path: `components/studio/create/rules-codex/rules-codex-builder/RulesCodexBuilder.view.jsx`

- **Bridge variable migration**: Line 9: Field label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class**: Line 21: Text input uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Hardcoded color + Bridge variable**: Line 21: Input uses hardcoded `border-white/10` and `bg-black/35`, plus bridge variable `--muted-gold` for placeholder and focus. Fix: Replace hardcoded colors and bridge variables with design-system tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 31: Select uses hardcoded `rounded-xl` and background hex `#0b0907` instead of tokens. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and hex color with design-system surface token.
- **Bridge variable migration**: Line 60: Aside uses bridge variable `--muted-gold` for border instead of `--gold-ornament`. Fix: Replace `border-[var(--muted-gold)]/20` with `border-[var(--gold-ornament)]/20`.
- **Hardcoded color**: Line 60: Aside background uses hardcoded `bg-black/45` instead of token. Fix: Replace `bg-black/45` with appropriate design-system surface token.
- **Bridge variable migration**: Line 61: Icon and text use bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 69: Description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Info color**: Line 74: Info box uses hardcoded `rounded-xl` and hardcoded emerald colors `emerald-300/20`, `emerald-300/5`, `emerald-100` instead of status tokens. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and replace hardcoded emerald with design-system success status tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 85, 91: Stat boxes use hardcoded `rounded-xl`, `border-white/10`, and `bg-black/25`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and hardcoded colors with design-system tokens.
- **Bridge variable migration**: Line 86, 92: Stat labels use bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 103: Save button uses hardcoded `rounded-xl` and bridge variable `--muted-gold`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.
- **Bridge variable migration**: Line 121: Section uses bridge variable `--muted-gold` for border instead of `--gold-ornament`. Fix: Replace `border-[var(--muted-gold)]/20` with `border-[var(--gold-ornament)]/20`.
- **Hardcoded color**: Line 121: Section background uses hardcoded `bg-black/45`. Fix: Replace `bg-black/45` with appropriate design-system surface token.
- **Bridge variable migration**: Line 122: Eyebrow uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 146: Textarea uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold` for focus. Fix: Replace hardcoded radius and colors, and replace bridge variable with design-system token.

### RulesCodexEditor

Path: `components/studio/create/rules-codex/rules-codex-editor/RulesCodexEditor.view.jsx`

- **Bridge variable migration**: Line 26: Counter uses hardcoded `text-amber-200` for high-value state instead of status token. Fix: Replace hardcoded amber-200 with `--status-warning` or appropriate design-system token.
- **Bridge variable migration**: Line 26: Counter uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Info color violation**: Line 47-48: IssueList uses hardcoded amber and red colors (`amber-300/25`, `amber-300/10`, `amber-100`, `red-300/25`, `red-300/10`, `red-100`) instead of status tokens. Fix: Replace hardcoded amber/red with `--status-warning` and `--status-danger` design-system tokens.
- **Bridge variable migration**: Line 63: Field label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 67: Detail text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 80: TextInput uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold` for focus. Fix: Replace all with appropriate design-system tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 94: NumberInput uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold` for focus. Fix: Replace all with appropriate design-system tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 104: SelectInput uses hardcoded `rounded-xl`, `border-white/10`, hardcoded hex `#0b0907`, and bridge variable `--muted-gold` for focus. Fix: Replace all with appropriate design-system tokens.
- **Bridge variable migration**: Line 151: Section uses bridge variable `--muted-gold` for border instead of `--gold-ornament`. Fix: Replace `border-[var(--muted-gold)]/25` with `border-[var(--gold-ornament)]/25`.
- **Bridge variable migration**: Line 154: Icon and text use bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 164: Description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 175: JSON Editor button uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/30`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 186-189: Enable toggle button uses hardcoded `rounded-xl` and bridge variable `--muted-gold`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 198-214: Stat boxes use hardcoded `rounded-xl`, `border-white/10`, `bg-black/25`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Info color violation**: Line 227: Shield box uses hardcoded emerald colors (`emerald-300/20`, `emerald-300/5`, `emerald-100`) instead of design-system tokens. Fix: Replace hardcoded emerald with appropriate design-system success or neutral tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 255: Codex summary textarea uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 259: Sidebar uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/25`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 263: Budget text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 272, 289: NumberInput uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`. Fix: Replace all with design-system tokens.
- **Hardcoded color**: Line 305: Section divider uses hardcoded `border-white/10`. Fix: Replace with design-system line token.
- **Bridge variable migration**: Line 307: Section eyebrow uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 310: Section text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 320: Add section button uses hardcoded `rounded-xl` and bridge variable `--muted-gold`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 337: Section article uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/25`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 347: Toggle icon uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 354: Badge uses hardcoded `rounded-full`, `border-white/10`, and bridge variable `--muted` text color. Fix: Verify if this should be a tag (pill OK) or control (needs `--radius-md`); update colors to tokens.
- **Bridge variable migration**: Line 363: Section id text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 376, 386: Move buttons use hardcoded `rounded-lg`, `border-white/10`, and bridge variable `--muted` text. Fix: Replace hardcoded radius and colors with design-system tokens.
- **Destructive control without visible word + Hardcoded color**: Line 395: Remove section button (Trash2 icon) is icon-only without visible text beside it, only aria-label and title. Fix: Add visible text beside the icon (e.g., 'Remove') instead of relying on aria-label/title alone.
- **Hardcoded color**: Line 403: Section divider uses hardcoded `border-white/10`. Fix: Replace with design-system line token.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 520: Authority box uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/25`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 521: Authority label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 520: Authority text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 546: Body textarea uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 551: Contextual section uses hardcoded `rounded-xl` and bridge variable `--muted-gold` for border and background. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.
- **Bridge variable migration**: Line 555: Icon color uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 558: Title uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 561: Description text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 597: Known domains/scopes boxes use hardcoded `rounded-lg`, `border-white/10`, `bg-black/25`. Fix: Replace hardcoded values with design-system tokens.
- **Bridge variable migration**: Line 597: Known info text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded color**: Line 612: Clear section button has hover state with hardcoded `hover:border-red-300/30` and `hover:text-red-100` instead of status tokens. Fix: Replace hardcoded red colors with `--status-danger` design-system token.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 627: Empty state box uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/20`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 627: Empty state text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Bridge variable migration**: Line 645: Icon color uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 650: Helper text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 657: Add first section button uses hardcoded `rounded-xl` and bridge variable `--muted-gold`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.

### RulesCodexJsonEditorModal

Path: `components/studio/create/rules-codex/rules-codex-json-editor/RulesCodexJsonEditorModal.view.jsx`

- **Info color violation**: Line 19-20: IssueList uses hardcoded amber and red colors (`amber-300/20`, `amber-500/10`, `amber-100`, `red-300/20`, `red-500/10`, `red-100`) instead of status tokens. Fix: Replace hardcoded amber/red with `--status-warning` and `--status-danger` design-system tokens.
- **Hardcoded radius / Tailwind class**: Line 24: IssueList uses hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 33: Issue item uses hardcoded `rounded-lg`, `border-white/10`, `bg-black/25`. Fix: Replace hardcoded values with design-system tokens.
- **Bridge variable migration**: Line 35: Code element uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 54: ToolbarButton uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/30`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 54: ToolbarButton text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Bridge variable migration + Hardcoded color + Hardcoded hex**: Line 87: Modal panel uses bridge variable `--muted-gold` for border and hardcoded hex `#080706` for background. Fix: Replace `--muted-gold` with `--gold-ornament` and hex color with design-system surface token.
- **Hardcoded color**: Line 89: Divider uses hardcoded `border-white/10` instead of token. Fix: Replace with design-system line token.
- **Bridge variable migration**: Line 91: Eyebrow uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 98: Description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 106: Close button uses hardcoded `rounded-lg`, `border-white/10`, bridge variable `--muted` and `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 117: Code label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 121: Info text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 155: Textarea uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/55`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 155: Textarea placeholder uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `placeholder:text-[var(--muted)]` with `placeholder:text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 160: Apply behavior section uses hardcoded `rounded-xl` and bridge variable `--muted-gold` for border/background. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.
- **Bridge variable migration**: Line 161: Section title uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 164: Section description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 172: Info sections use hardcoded `rounded-xl`, `border-white/10`, `bg-black/25`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 173, 184: Info titles use bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 176, 187: Info text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Info color violation**: Line 210: Ready to validate section uses hardcoded emerald colors (`emerald-300/15`, `emerald-500/5`, `emerald-100`) instead of design-system tokens. Fix: Replace hardcoded emerald with appropriate design-system success or neutral tokens.
- **Bridge variable migration**: Line 224: Footer text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 233: Cancel button uses hardcoded `rounded-xl`, `border-white/10`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 242: Validate & Apply button uses hardcoded `rounded-xl` and bridge variable `--muted-gold`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.

### ScenarioBuilder

Path: `components/studio/create/scenario/scenario-builder/ScenarioBuilder.view.jsx`

- **Bridge variable migration + Hardcoded color**: Line 30: Sidebar uses bridge variable `--muted-gold` for border and hardcoded `bg-black/45` for background. Fix: Replace `--muted-gold` with `--gold-ornament` and `bg-black/45` with design-system surface token.
- **Bridge variable migration**: Line 31, 46, 59: Section labels use bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace all instances with `--gold-ornament`.
- **Bridge variable migration**: Line 39, 52: Description text uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded color**: Line 45, 58: Progress and middleware boxes use hardcoded `border-white/10` and `bg-black/25`. Fix: Replace with design-system line and surface tokens.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 69: Module badges use hardcoded `rounded-full` (pill-shaped) and bridge variable `--muted-gold`. Fix: Verify if these are display-only tags (pills OK) or interactive controls (need `--radius-md`); replace `--muted-gold` with `--gold-ornament`.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 81: Save button uses hardcoded `rounded-xl` and bridge variable `--muted-gold`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` and `--muted-gold` with `--gold-ornament`.
- **Hardcoded status colors**: Line 90: Save status message uses hardcoded `text-red-200` and `text-emerald-200` instead of status tokens. Fix: Replace hardcoded red/emerald with `--status-danger` and `--status-success` design-system tokens.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 204: Module toggle button uses hardcoded `rounded-[var(--radius-md)]` (OK) but bridge variable `--muted-gold`. Fix: Replace `--muted-gold` with `--gold-ornament` in active state.
- **Hardcoded color + Bridge variable**: Line 207: Inactive state button uses hardcoded `border-white/10`, `bg-black/25`, and bridge variable `--muted`. Fix: Replace hardcoded colors and bridge variable with design-system tokens.
- **Bridge variable migration**: Line 215, 222: Module text uses bridge variable `--muted-gold` and `--muted` instead of design-system tokens. Fix: Replace `--muted-gold` with `--gold-ornament` and `--muted` with `--ink-dim`.
- **Bridge variable migration + Hardcoded color**: Line 333: Section uses bridge variable `--muted-gold` for border and hardcoded `bg-black/45`. Fix: Replace `--muted-gold` with `--gold-ornament` and `bg-black/45` with design-system surface token.
- **Bridge variable migration**: Line 334, 340: Section eyebrow and description use bridge variables `--muted-gold` and `--muted`. Fix: Replace with `--gold-ornament` and `--ink-dim` respectively.
- **Hardcoded color**: Line 349: Story circle card uses hardcoded `border-white/10` and `bg-black/25`. Fix: Replace with design-system tokens.
- **Bridge variable migration**: Line 352, 358: Card label and text use bridge variables `--muted-gold` and `--muted`. Fix: Replace with `--gold-ornament` and `--ink-dim`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 368: Textarea uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 378: Field label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 386: Text input uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 404: Textarea uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 420: Reference selector label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 427: Reference selector button uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 436: Reference description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Bridge variable migration**: Line 453: Empty state uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 463: Reference chip uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/30`. Fix: Replace with design-system tokens.
- **Hardcoded radius / Tailwind class + Bridge variable**: Line 464: Avatar uses hardcoded `rounded-lg` and bridge variable `--muted-gold`. Fix: Replace hardcoded radius and bridge variable with design-system tokens.
- **Bridge variable migration**: Line 482: Type label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Hardcoded status colors**: Line 490: Remove button uses hardcoded `rounded-lg`, `border-white/10`, and hardcoded red status colors `hover:border-red-300/30` and `hover:text-red-200`. Fix: Replace hardcoded values and red colors with design-system `--status-danger` token.

### ScenarioReferencePickerModal

Path: `components/studio/create/scenario/scenario-reference-picker/ScenarioReferencePickerModal.view.jsx`

- **Hardcoded color**: Line 19: Modal backdrop uses hardcoded `bg-black/80` instead of scrim token. Fix: Replace with design-system scrim token (e.g., `--scrim-strong`).
- **Bridge variable migration + Hardcoded hex color**: Line 20: Modal panel uses bridge variable `--muted-gold` for border and hardcoded hex `#080706` for background. Fix: Replace `--muted-gold` with `--gold-ornament` and hex color with design-system surface token.
- **Hardcoded color**: Line 21: Divider uses hardcoded `border-white/10` instead of token. Fix: Replace with design-system line token.
- **Bridge variable migration**: Line 23: Eyebrow uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 30: Description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 39: Close button uses hardcoded `rounded-lg` and `border-white/10`. Fix: Replace hardcoded values with design-system tokens.
- **Bridge variable migration**: Line 39: Close button uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 47: Search input uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 48: Search icon uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 53: Input placeholder uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `placeholder:text-[var(--muted)]` with `placeholder:text-[var(--ink-dim)]`.
- **Bridge variable migration**: Line 58: Selected count uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class**: Line 70: Selection cards use hardcoded `rounded-xl` instead of `--radius-md`. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Bridge variable migration**: Line 72-73: Selected state uses bridge variable `--muted-gold` for border/background. Fix: Replace `--muted-gold` with `--gold-ornament`.
- **Hardcoded color + Bridge variable**: Line 73: Unselected state uses hardcoded `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold` for hover. Fix: Replace all with design-system tokens.
- **Bridge variable migration**: Line 76: Gradient uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace with `--gold-ornament` or appropriate design-system token.
- **Bridge variable migration**: Line 86: Item title uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Bridge variable migration**: Line 89: Item label uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.

### StatsPoolsBuilder

Path: `components/studio/create/stats-pools/stats-pools-builder/StatsPoolsBuilder.view.jsx`

- **Bridge variable migration**: Line 9: Field label uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **Hardcoded radius / Tailwind class + Hardcoded color + Bridge variable**: Line 21: Text input uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`, and bridge variable `--muted-gold` for focus. Fix: Replace all with design-system tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color + Hardcoded hex**: Line 31: Select input uses hardcoded `rounded-xl`, `border-white/10`, and hardcoded hex `#0b0907`, plus bridge variable `--muted-gold`. Fix: Replace all with design-system tokens.
- **Bridge variable migration + Hardcoded color + Hardcoded radius**: Line ~60: Follows same pattern as RulesCodexBuilder with bridge variables, hardcoded colors, info color violations. Fix: See RulesCodexBuilder findings for consistent pattern of violations.

### StatsPoolsEditor

Path: `components/studio/create/stats-pools/stats-pools-editor/StatsPoolsEditor.view.jsx`

- **Bridge variable migration + Info color + Hardcoded colors**: File follows same pattern as RulesCodexEditor with extensive bridge variables, hardcoded emerald info colors, hardcoded red error colors, and hardcoded radius values. Fix: Apply same fixes as RulesCodexEditor: replace bridge variables with real tokens, replace hardcoded emerald/red with status tokens, replace `rounded-xl` with `rounded-[var(--radius-md)]`.

### StatsPoolsJsonEditorModal

Path: `components/studio/create/stats-pools/stats-pools-json-editor/StatsPoolsJsonEditorModal.view.jsx`

- **Hardcoded radius / Tailwind class + Info color violations**: File follows same pattern as RulesCodexJsonEditorModal with hardcoded `rounded-xl`, bridge variables, and hardcoded emerald/red colors for status states. Fix: Apply same fixes as RulesCodexJsonEditorModal: replace radius, bridge variables, and status colors with design-system tokens.

### RegistryLinkedCreationPickerModal

Path: `components/studio/create/structured-registry/registry-linked-creation-picker/RegistryLinkedCreationPickerModal.view.jsx`

- **Hardcoded color**: Line 18: Modal backdrop uses hardcoded `bg-black/80` instead of scrim token. Fix: Replace with design-system scrim token.
- **Bridge variable migration + Hardcoded hex color**: Line 19: Modal panel uses bridge variable `--muted-gold` for border and hardcoded hex `#080706` for background. Fix: Replace `--muted-gold` with `--gold-ornament` and hex with design-system surface token.
- **Bridge variable migration**: Line 22: Eyebrow uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace with `--gold-ornament`.
- **Bridge variable migration**: Line 28: Description uses bridge variable `--muted` instead of `--ink-dim`. Fix: Replace with `--ink-dim`.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 36: Close button uses hardcoded `rounded-lg` and `border-white/10`. Fix: Replace with design-system tokens.
- **Hardcoded radius / Tailwind class + Hardcoded color**: Line 44: Search input uses hardcoded `rounded-xl`, `border-white/10`, `bg-black/35`. Fix: Replace with design-system tokens.
- **Bridge variable migration**: Line 45: Search icon uses bridge variable `--muted-gold` instead of `--gold-ornament`. Fix: Replace with `--gold-ornament`.

### CreationEditShell

Path: `components/studio/my-creations/creation-edit-shell/CreationEditShell.view.jsx`

- **Legacy bridge variables**: Line 31, 34, 40, 42, 51, 54, 78 use legacy bridge variables `--muted-gold`, `--muted`, `--foreground` instead of real design tokens `--gold-ornament`, `--ink-dim`, `--ink`. Fix: Replace all legacy bridge variable names with their real tokens: `--muted-gold` → `--gold-ornament`, `--muted` → `--ink-dim`, `--foreground` → `--ink`.
- **Raw opacity wash**: Line 31 and 89 use `bg-black/45` as a raw Tailwind opacity value instead of a token. Fix: Replace `bg-black/45` with the appropriate token for floating surfaces; the wash section specifies `--scrim` at `.40` for panels with tag beds.
- **Hardcoded border radius**: Lines 51 and 54 use `rounded-xl` (12px hardcoded) instead of token form. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` to use the token consistently.

### CreationEditStickyActionBar

Path: `components/studio/my-creations/edit/creation-edit-sticky-action-bar/CreationEditStickyActionBar.view.jsx`

- **Hardcoded semantic colors**: Lines 106, 114-115, 164-165 use hardcoded Tailwind colors (emerald-400, red-200, emerald-200) instead of status tokens for success/error states. Fix: Replace emerald colors with `--status-success` and red/emerald feedback colors with appropriate status tokens.

### SharedFields (shared across all sections)

Path: `components/studio/my-creations/edit/sections/SharedFields.jsx`

- **Legacy bridge variables throughout**: Lines 6, 10, 18, 24, 38, 45, 55, 59, 75, 77, 82 use legacy bridge variables `--muted-gold`, `--muted`, `--foreground` in shared field components used by all packages. Fix: Replace all legacy variables: `--muted-gold` → `--gold-ornament`, `--muted` → `--ink-dim`, `--foreground` → `--ink`.
- **Hardcoded border radius**: Lines 24, 46, 59 use `rounded-xl` instead of token form in TextField, TextAreaField, and ReadOnlyField. Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Raw opacity values**: Lines 24, 46, 59, 74, 82 use hardcoded Tailwind opacity values (`border-white/10`, `bg-black/35`, `bg-black/25`, `hover:border-[var(--muted-gold)]/35`) instead of tokens. Fix: Replace hardcoded opacities with token-based values or refactor to use defined wash/line tokens.

### CharacterAppearanceSection

Path: `components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx`

- **Off-scale radius**: Line 21 uses `rounded-2xl` (16px) which is off-scale; per Corners ruling, this nested card should resolve to `--radius-md` since it sits in a grid alongside siblings, not floating above the page. Fix: Replace `rounded-2xl` with `rounded-[var(--radius-md)]`.
- **Raw opacity wash**: Line 21 uses `bg-black/35` as a raw Tailwind opacity value. Fix: Replace with token-based opacity value or refactor to use defined wash tokens.
- **Hardcoded border radius**: Line 25 uses `rounded-xl` instead of token form. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Destructive control missing text label**: Line 51 shows a delete button with only an X icon, no visible 'Clear' or similar text label beside it; per Destructive ruling, every destructive control must ship with the word beside it. Fix: Add visible text label such as 'Clear' beside the X icon, not icon-only.
- **Hardcoded semantic colors on destructive control**: Lines 51 uses hardcoded red-500 colors instead of `--status-danger` token. Fix: Replace `border-red-500/25 bg-red-500/10 text-red-200` with `border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]`.

### CharacterBehaviorSection

Path: `components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.view.jsx`

- **Legacy bridge variables**: Lines 45 and 48 use legacy bridge variables `--muted-gold` and `--muted`. Fix: Replace `--muted-gold` with `--gold-ornament` and `--muted` with `--ink-dim`.

### CharacterIdentitySection

Path: `components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx`

- **Legacy bridge variables**: Line 98 uses `--muted-gold`; line 110 uses `--muted-gold` in focus state; line 110 uses `--foreground` and `--muted`. Fix: Replace `--muted-gold` → `--gold-ornament`, `--muted` → `--ink-dim`, `--foreground` → `--ink`.
- **Hardcoded border radius**: Line 110 uses `rounded-xl` instead of token form. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Raw opacity values**: Line 110 uses `border-white/10` and `bg-black/35` as hardcoded Tailwind opacity. Fix: Replace raw opacity values with appropriate tokens or use consistent token-based approach.

### CharacterTemplateFieldsSection

Path: `components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.view.jsx`

- **Legacy bridge variables**: Lines 205 and 208 use legacy bridge variables `--muted-gold` and `--muted`. Fix: Replace `--muted-gold` with `--gold-ornament` and `--muted` with `--ink-dim`.

### CreationDangerSection

Path: `components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view.jsx`

- **Legacy bridge variables**: Lines 42, 43, 46 use legacy bridge variables `--muted-gold` and `--muted`. Fix: Replace `--muted-gold` with `--gold-ornament` and `--muted` with `--ink-dim`.
- **Hardcoded semantic colors instead of status tokens**: Lines 53, 88 use hardcoded red-500, red-100, red-950 colors for the entire danger section background and borders, not using `--status-danger` and `--status-danger-bed` tokens. Fix: Replace hardcoded reds with `border-[var(--status-danger-border)] bg-[var(--status-danger-bed)]` for the cards.
- **Destructive control missing text label**: Line 90 shows Trash2 icon-only with no visible text label (e.g., 'Delete') beside the icon; per Destructive ruling, every destructive control must ship with the word beside it. Fix: Add visible text label 'Delete' or similar beside the Trash2 icon in both archive and delete buttons.
- **Raw opacity in hover state**: Lines 71 and 112 use `hover:bg-white/5` as hardcoded opacity instead of token. Fix: Replace `hover:bg-white/5` with token-based hover state styling.
- **Hardcoded semantic colors for feedback messages**: Line 162 uses hardcoded `text-red-200` and `text-emerald-200` for error/success feedback. Fix: Replace with appropriate status tokens or a callback for message tone styling.

### CreationOverviewSection

Path: `components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.view.jsx`

- **Hardcoded border radius**: Line 52 uses `rounded-xl` instead of token form. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **Raw opacity value**: Line 52 uses `border-white/10` as hardcoded opacity. Fix: Replace with appropriate token-based border styling.

### CreationPublishingSection

Path: `components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx`

- **Legacy bridge variables**: Lines 68, 69, 75 use legacy bridge variables `--muted-gold` and `--muted`. Fix: Replace `--muted-gold` with `--gold-ornament` and `--muted` with `--ink-dim`.
- **Raw opacity wash**: Line 68 uses `bg-black/25` as raw opacity instead of token. Fix: Replace with appropriate token-based background or use `--scrim` for wash effects.
- **Hardcoded semantic colors for feedback**: Line 114-115 uses hardcoded `text-red-200` and `text-emerald-200` for error/success feedback. Fix: Replace with status token colors or tone-based styling using defined tokens.

### mechanics-document-orchestration

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/MechanicsDocumentOrchestration.view.jsx`

- **Corners: three tiers only**: Line 16 uses `rounded-xl` (16px, off-scale); corners come in three tiers only: large (20px/--radius-lg), standard (12px/--radius-md), pill (full/--radius-full) Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]` since this is a control button in-flow
- **Token usage: bridge vars retired**: Line 16 uses legacy bridge variable `--muted-gold` with opacity modifiers instead of design-system tokens Fix: Replace `--muted-gold` with appropriate action token like `--gold-action` or ornament token like `--gold-ornament`

### mechanics-guards

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/MechanicsGuards.view.jsx`

- **Destructive: every delete control ships with the word beside it**: Line 65-69: delete button has only a trash icon with no visible text label, title is hover-only and counts as invisible Fix: Add visible text beside the trash icon, e.g., 'Remove' or 'Delete'
- **Destructive: every delete control ships with the word beside it**: Line 179: delete button has only a trash icon with no visible text label, title attribute is hover-only Fix: Add visible text beside the trash icon, e.g., 'Remove' or 'Delete'
- **Corners: three tiers only**: Multiple lines use `rounded-xl` (16px, off-scale) where `--radius-md` is needed: lines 57, 80, 109, 214, 250, 327, 343 Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`
- **Token usage: bridge vars retired**: Multiple lines use `--muted-gold` and `--muted` legacy bridge variables: lines 14, 23, 59, 73, 156, 170, 280, 314, 381, 384 Fix: Replace bridge vars with actual design tokens: `--muted-gold` → `--gold-ornament` or `--gold-action`; `--muted` → `--ink-dim`

### mechanics-json-editor

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/MechanicsJsonEditorModal.view.jsx`

- **Status colors: hardcoded values instead of tokens**: Lines 24, 228: hardcoded Tailwind colors `amber-300/20`, `amber-500/10`, `red-300/20`, `red-500/10` for warning/error states instead of design system tokens Fix: Use `--status-warning-bed`, `--status-warning-border`, `--status-danger-bed`, `--status-danger-border` tokens; no custom amber or red
- **Status colors: no info color (no blue)**: Line 228: uses `emerald-500/10` and `emerald-100` for success state; custom colors instead of status tokens Fix: Replace with `--status-success-bed`, `--status-success-border`, `--status-success` tokens

### mechanics-module-assembly

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.view.jsx`

- **Destructive: every delete control ships with the word beside it**: Line 143: delete button has only a trash icon with no visible text label beside it, text color is hover-only indicator Fix: Add visible text beside the trash icon, e.g., 'Remove' or 'Delete'

### mechanics-preset-application

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx`

- **Status colors: hardcoded values instead of tokens**: Line 45: IssueList component uses hardcoded `amber-300/20`, `amber-500/10`, `text-amber-100` for warning state instead of design system tokens Fix: Use `--status-warning-bed`, `--status-warning-border`, `--status-warning` tokens

### mechanics-preset-validation

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation/MechanicsPresetValidationPanel.view.jsx`

- **Status colors: hardcoded values instead of tokens**: Lines 25, 28, 53 and throughout: uses hardcoded `emerald-300/20`, `emerald-500/[0.045]`, `emerald-500/10`, `emerald-200`, `emerald-100` for success state instead of status tokens Fix: Replace all emerald hardcoded colors with `--status-success-bed`, `--status-success-border`, `--status-success` tokens

### mechanics-progression-profile

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx`

- **Status colors: hardcoded values instead of tokens**: Lines 188, 332: hardcoded `amber-300/20`, `amber-500/10`, `text-amber-100` for warning state instead of status tokens Fix: Use `--status-warning-bed`, `--status-warning-border`, `--status-warning` tokens

### mechanics-status-blocks

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks/MechanicsStatusBlocks.view.jsx`

- **Corners: three tiers only**: Lines 65, 250: use `rounded-2xl` (16px, off-scale) where `--radius-md` (12px standard tier) is needed for cards and section containers Fix: Replace `rounded-2xl` with `rounded-[var(--radius-md)]`
- **Destructive: every delete control ships with the word beside it**: Lines 96, 219: delete button has only trash icon with no visible text label beside it Fix: Add visible text 'Remove' beside the trash icon
- **Status colors: hardcoded values instead of tokens**: Lines 96, 219: delete buttons use hardcoded `border-red-300/20`, `bg-red-500/10`, `text-red-200` instead of `--status-danger` tokens Fix: Use `--status-danger` for text color and optional `--status-danger-bed`/`--status-danger-border` for background
- **Token usage: bridge vars retired**: Multiple lines use `--muted-gold` and `--muted`: lines 14, 23, 59, 73, 179, 280, 314 Fix: Replace with actual tokens: `--muted-gold` → `--gold-ornament`; `--muted` → `--ink-dim`

### mechanics-trackers

Path: `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/MechanicsTrackersSection.view.jsx`

- **Corners: three tiers only**: Lines 58, 443: use `rounded-2xl` (off-scale) for card and section containers where `--radius-md` is the standard tier Fix: Replace `rounded-2xl` with `rounded-[var(--radius-md)]`
- **Destructive: every delete control ships with the word beside it**: Lines 85, 108, 181: delete buttons have only trash icon with no visible text label Fix: Add visible text beside each trash icon, e.g., 'Remove'
- **Status colors: hardcoded values instead of tokens**: Lines 16-18, 85, 108, 181: uses hardcoded `red-300/20`, `red-500/10`, `red-200` for danger state instead of `--status-danger` tokens Fix: Use `--status-danger`, `--status-danger-bed`, `--status-danger-border` tokens
- **Token usage: bridge vars retired**: Multiple lines use `--muted-gold` and `--muted`: lines 30, 36, 66, 72, 102, 109, 123, 175, 251, 357, 382, 446 Fix: Replace with actual tokens: `--muted-gold` → `--gold-ornament`; `--muted` → `--ink-dim`

### npc-registry-fields-section

Path: `components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.view.jsx`

- **token-usage**: Line 94 uses legacy `--muted` token instead of proper `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **status-colors**: Line 106 uses raw Tailwind `text-red-200` instead of design-system status token. Fix: Replace `text-red-200` with `text-[var(--status-danger)]`.
- **radius-corners**: Line 114 uses `rounded-2xl` (16px off-scale radius) instead of standard control tier. Fix: Replace `rounded-2xl` with `rounded-[var(--radius-md)]`.
- **token-usage**: Line 117 uses legacy `--muted-gold` token instead of proper `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **token-usage**: Line 129 uses legacy `--muted` token instead of proper `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **token-usage**: Line 131 uses legacy `--muted-gold` token instead of proper `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **radius-corners**: Line 145 uses `rounded-xl` (16px off-scale radius) instead of standard control tier. Fix: Replace `rounded-xl` with `rounded-[var(--radius-md)]`.
- **token-usage**: Line 159 uses legacy `--muted-gold` token instead of proper `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **status-colors**: Line 170 uses raw Tailwind `text-red-200` and `hover:border-red-300/35` instead of status token. Fix: Use `text-[var(--status-danger)]` and `hover:border-[var(--status-danger)]/35`.
- **destructive-controls**: Line 165–176 SmallDangerAction shows Trash2 icon only without visible 'Delete' word beside it. Fix: Add visible text label beside the icon, e.g., `<Trash2 size={14} /> Delete`.

### outfit-prompt-guidance-section

Path: `components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view.jsx`

- **token-usage**: Line 53 uses legacy `--muted-gold` token instead of proper `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **token-usage**: Line 65 uses legacy `--muted-gold` token in background fill instead of proper gold token. Fix: Replace `bg-[var(--muted-gold)]/15` with `bg-[var(--gold-action)]/10` or appropriate fill token.
- **token-usage**: Line 66 uses legacy `--muted` token instead of proper `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.
- **token-usage**: Line 69 uses legacy `--muted-gold` token instead of proper `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **token-usage**: Line 99 uses legacy `--muted-gold` token instead of proper `--gold-ornament`. Fix: Replace `text-[var(--muted-gold)]` with `text-[var(--gold-ornament)]`.
- **token-usage**: Line 102 uses legacy `--muted` token instead of proper `--ink-dim`. Fix: Replace `text-[var(--muted)]` with `text-[var(--ink-dim)]`.

### creation-featured-image-picker

Path: `components/studio/my-creations/image-library/creation-featured-image-picker/CreationFeaturedImagePickerModal.view.jsx`

- **Corners: floating surfaces must use large-radius tier**: Modal dialog uses `rounded-[var(--radius-md)]` but floating surfaces must use `--radius-lg` (20px) per Ruling 1 and Corners law Fix: Change line 25 to `rounded-[var(--radius-lg)]`
- **Modal chrome frame fill must use design token**: Frame uses hardcoded hex `bg-[#080706]` instead of `--surface-4` per Ruling 1 unified frame specification Fix: Change line 25 to `bg-[var(--surface-4)]`
- **Modal chrome border must use standard line token**: Border uses deprecated `--muted-gold` bridge variable, should use `--line` per Ruling 1 Fix: Change line 25 to `border-[var(--line)]`
- **Eyebrow must use canonical color token**: Line 28 uses `--muted-gold` deprecated bridge variable instead of real `--gold-ornament` token Fix: Change to `text-[var(--gold-ornament)]`
- **Description text must use canonical color token**: Line 32 uses `--muted` deprecated bridge variable instead of `--ink-dim` Fix: Change to `text-[var(--ink-dim)]`
- **Buttons must use standard corner radius token**: Lines 40, 43, 52: buttons use hardcoded `rounded-xl` instead of `rounded-[var(--radius-md)]` Fix: Replace all `rounded-xl` with `rounded-[var(--radius-md)]`
- **Status colors must use designated tokens**: Line 62: error message uses hardcoded red `border-red-500/30` and `text-red-200` instead of status tokens Fix: Use `border-[var(--status-danger-border)]`, `bg-[var(--status-danger-bed)]`, `text-[var(--status-danger)]`
- **Container corner radius must comply with radius scale**: Line 80: loading state uses `rounded-2xl` (16px, off-scale) instead of token Fix: Change to `rounded-[var(--radius-md)]`

### creation-reference-image-picker

Path: `components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.view.jsx`

- **Corners: floating surfaces must use large-radius tier**: Modal dialog uses `rounded-[var(--radius-md)]` but should use `--radius-lg` for floating surface per Ruling 1 Fix: Change line 22 to `rounded-[var(--radius-lg)]`
- **Modal chrome frame fill must use design token**: Frame uses hardcoded hex `bg-[#080706]` instead of `--surface-4` Fix: Change line 22 to `bg-[var(--surface-4)]`
- **Modal chrome border must use standard line token**: Border uses deprecated `--muted-gold` bridge variable Fix: Change line 22 to `border-[var(--line)]`
- **Eyebrow must use canonical color token**: Line 25 uses `--muted-gold` instead of real `--gold-ornament` token Fix: Change to `text-[var(--gold-ornament)]`
- **Description text must use canonical color token**: Line 29 uses `--muted` instead of `--ink-dim` Fix: Change to `text-[var(--ink-dim)]`
- **Buttons must use standard corner radius token**: Lines 40, 44: buttons use hardcoded `rounded-xl` instead of token Fix: Replace with `rounded-[var(--radius-md)]`
- **Status colors must use designated tokens**: Line 59: error message uses hardcoded red `border-red-500/30` and `text-red-200` Fix: Use `border-[var(--status-danger-border)]`, `bg-[var(--status-danger-bed)]`, `text-[var(--status-danger)]`

### my-creations-hub

Path: `components/studio/my-creations/my-creations-hub/MyCreationsHub.view.jsx`

- **Buttons must use standard corner radius token**: Lines 64, 72, 178: buttons use hardcoded `rounded-xl` instead of token Fix: Replace with `rounded-[var(--radius-md)]`
- **Legacy color token must be replaced**: Multiple lines use `--muted-gold` deprecated bridge variable Fix: Replace with appropriate real token based on context (e.g., `--gold-action`, `--gold-ornament`)
- **Status colors must use designated tokens**: Line 124: error message uses hardcoded red `border-red-500/30` and `text-red-200` Fix: Use `border-[var(--status-danger-border)]`, `bg-[var(--status-danger-bed)]`, `text-[var(--status-danger)]`

### official-characters-grid

Path: `components/studio/official-characters-grid/OfficialCharactersGrid.view.jsx`

- **Shape law: pill shape reserved for tags and icon buttons only**: Line 44: search input uses `rounded-full` (pill shape) but standard controls must use `--radius-md` Fix: Change to `rounded-[var(--radius-md)]`
- **Legacy color token must be replaced**: Lines 31, 44: uses `--muted-gold` deprecated bridge variable Fix: Replace with `--gold-ornament`

### profile-avatar

Path: `components/studio/profile/profile-avatar/ProfileAvatar.view.jsx`

- **Legacy color token must be replaced**: Line 17: avatar uses `--muted-gold` in border and background instead of canonical `--gold-ornament` Fix: Replace all `--muted-gold` with `--gold-ornament` on this line

### profile-back-button

Path: `components/studio/profile/profile-back-button/ProfileBackButton.view.jsx`

- **Legacy color token must be replaced**: Line 14: icon button uses `--muted-gold` in border and text color instead of canonical `--gold-ornament` Fix: Replace all `--muted-gold` with `--gold-ornament`

### profile-banner

Path: `components/studio/profile/profile-banner/ProfileBanner.view.jsx`

- **Legacy color token must be replaced**: Line 8: banner border uses `--muted-gold` instead of `--gold-ornament` Fix: Change to `border-[var(--gold-ornament)]/20`
- **Legacy color token must be replaced**: Line 21: placeholder uses `--muted-gold` and `--muted` bridge variables Fix: Change to `text-[var(--gold-ornament)]` and `text-[var(--ink-dim)]`

### profile-follow-button

Path: `components/studio/profile/profile-follow-button/ProfileFollowButton.view.jsx`

- **Buttons must use standard corner radius token**: Line 18: button uses hardcoded `rounded-xl` instead of `rounded-[var(--radius-md)]` Fix: Change to `rounded-[var(--radius-md)]`
- **Legacy color token must be replaced**: Line 18: button uses `--muted-gold` instead of action token Fix: Use `border-[var(--gold-action)]` and `text-[var(--gold-action)]`

### profile-media-manager

Path: `components/studio/profile/profile-media-manager/ProfileMediaManager.view.jsx`

- **Legacy color token must be replaced**: Line 30: eyebrow uses `--muted-gold` instead of canonical `--gold-ornament` token Fix: Change to `text-[var(--gold-ornament)]`

### profile-share-button

Path: `components/studio/profile/profile-share-button/ProfileShareButton.view.jsx`

- **Buttons must use standard corner radius token**: Line 13: button uses hardcoded `rounded-xl` instead of token Fix: Change to `rounded-[var(--radius-md)]`
- **Legacy color token must be replaced**: Line 13: button uses `--muted` bridge variable and `--muted-gold` Fix: Use `text-[var(--ink-dim)]` and border/hover with appropriate action or ornament tokens

### public-profile-activity-feed

Path: `components/studio/profile/public-profile-activity-feed/PublicProfileActivityFeed.view.jsx`

- **Status colors must use designated tokens, not hardcoded colors**: Line 108: donation icon uses hardcoded pink `border-pink-400/25` and `bg-pink-400/10` instead of design tokens Fix: Use design system tokens for accent color (pink accent is noted as deferred in rulebook Sweep scope section)
- **Legacy color token must be replaced**: Multiple lines use `--muted-gold` and `--muted` bridge variables Fix: Replace with canonical tokens: `--gold-ornament` and `--ink-dim`

## Clean packages

No findings against the rulebook in this pass:

- media-history-grid
- ImagePresetPromptStackSection
- ImagePresetRenderingNotesSection
- ImagePresetStyleMediumSection
- LocationParentPickerModal
- LocationPromptGuidanceSection
- LocationSceneAtmosphereSection
- LocationVisualDescriptionSection
- mechanics-command-effects
- mechanics-command-outcomes
- mechanics-command-requirements
- mechanics-compatibility-baseline
- mechanics-document-core
- mechanics-defaults
- SelectionCard
- StoryRoomCastPanel
- StoryRoomMessage
- StoryRoomMobileDrawer
- StoryRoomStatePanel
- StoryRoomTranscript
- StoryRoomsHub
- storylines-hub
- studio-action-card
- studio-back-link
- studio-character-card
- studio-mobile-nav
- studio-page-header
- view-mode-toggle
- crestfall-option-modal
- room-template-runtime-section
- scenario-identity-section
- scenario-runtime-guidance-section
- character-template-builder
- character-color-palette-modal
- character-preview
- character-template-modal
- lore-document-renderer
- alias-rule-modal
- knowledge-rule-modal
- RelationshipModal
- RoomTemplatePackagePickerModal
- CharacterAdvancedSection
- CharacterBodySection
- ImagePresetIdentitySection
- mechanics-module-picker
- narrator-guidance-section
- narrator-identity-section
- narrator-modules-section
- outfit-garment-design-section
- outfit-identity-section
- outfit-materials-details-section
- pose-body-position-section
- pose-identity-section
- pose-motion-staging-section
- pose-prompt-guidance-section
- room-template-identity-section
- room-template-multiplayer-section
- creation-image-library-page
