# Skills Profile authoring presentation binding

Status: additive FE presentation binding only.

This package is the next step after the accepted Skills Profile semantic
migration.

The semantic contract is already present in the FE lane:

```text
skills_profile_contract_v0
```

The binding consumes Chassis-normalized `profile / errors / warnings / metrics`
and defines the display-ready editor model for the eventual FE-owned Skills
Profile editor.

It does not own normalization, validation, mutation, JSON application, save, or
runtime advancement.

## Current presentation model

The binding carries:

- Skills & Proficiencies header/copy
- profile title/description/tags/default point cost/enabled
- VALID / WARNING / ERROR states
- Skill ID/title/category/tags
- starting and maximum rank
- Rank title/description/point cost
- minimum level and tier prerequisites
- cross-Skill prerequisites
- typed unlock prerequisites
- granted tags
- granted command IDs
- current limits and unlock-type catalog

Actor current ranks and unspent points remain runtime Story state.

## Structured prerequisite gap

The current source v0 visual editor only directly edits level/tier prerequisites
and grants.

Cross-Skill and typed unlock identities are preserved in the contract and
available through the complete JSON editor.

This binding therefore marks them:

```text
JSON_EDITOR_ONLY_IN_CURRENT_V0_UI
PENDING_FE_VISUAL_EXTENSION
```

instead of flattening or dropping them.

## Visual work still pending

```text
profileEditor:           PENDING_FE_VISUAL_BUILD
structuredPrerequisites: PENDING_FE_VISUAL_EXTENSION
jsonEditor:              PENDING_FE_VISUAL_EXTENSION
```

The semantic and presentation contracts are now ready for the FE design pass.

## One-line ESM correction

This patch also changes the accepted Skills builder contract import from:

```text
../skills-profile-editor/SkillsProfileEditor.contract
```

to:

```text
../skills-profile-editor/SkillsProfileEditor.contract.js
```

This is behavior-neutral under Next.js and makes the contract directly
importable by the standalone Node diagnostic.

## Permanent boundary

Crestfall owns:

- normalization
- validation
- rank expansion/contraction
- editor mutation
- JSON validation/application
- payload construction
- persistence
- actor current ranks
- actor progression/unspent points
- runtime advancement

Crestfall-fe owns:

- editor visual composition
- Skill/rank layout
- validation presentation
- prerequisite visual treatment
- JSON editor visual treatment
- semantic callbacks

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
