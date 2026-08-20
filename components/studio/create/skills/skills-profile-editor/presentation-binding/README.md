# Skills Profile authoring presentation binding

Status: **WIRED — W34 legacy presentation**.

This binding remains the accepted display/semantic seam for the Skills Profile
editor. W34 does not replace it with a second model; it wires the current working
Crestfall editor and JSON Editor & AI Guide into FE and updates the binding status
to describe the live branch state.

The semantic contract remains:

```text
skills_profile_contract_v0
```

The binding consumes normalized `profile / errors / warnings / metrics` and exposes:

- Skills & Proficiencies header/copy;
- profile title/description/tags/default point cost/enabled;
- VALID / WARNING / ERROR states;
- Skill ID/title/category/tags;
- starting and maximum rank;
- Rank title/description/point cost;
- minimum level and tier prerequisites;
- cross-Skill prerequisites;
- typed unlock prerequisites;
- granted tags and command IDs;
- current limits and unlock-type catalog.

Actor current ranks and unspent points remain runtime Story state.

## Current prerequisite presentation

The current legacy visual editor directly edits level/tier prerequisites and grants.
Cross-Skill and typed unlock identities remain structured objects and are authored
through the now-live complete JSON Editor & AI Guide. They are not flattened or
dropped.

The accepted branch status is therefore:

```text
profileEditor:           WIRED_LEGACY_PRESENTATION
structuredPrerequisites: WIRED_JSON_EDITOR_ONLY_LEGACY_PRESENTATION
jsonEditor:              WIRED_LEGACY_PRESENTATION
```

A future FE restyle may add dedicated visual controls for those structured
prerequisites, but that is no longer a functional synchronization blocker.

## Builder ESM compatibility

The FE Skills builder contract keeps the behavior-neutral explicit `.js` import:

```text
../skills-profile-editor/SkillsProfileEditor.contract.js
```

Its public contract/version/options/draft behavior remain semantically identical to
Chassis while staying directly importable by standalone Node diagnostics.

## Permanent boundary

Crestfall remains authority for normalization, validation, rank expansion/contraction,
editor mutation, JSON validation/application, payload construction, persistence, actor
current ranks, progression state, and runtime advancement.

Crestfall-fe owns editor visual composition and presentation. Mirrored ViewModels in
this branch are deployment mirrors; they do not move product authority out of
Crestfall.

Saved-edit shell registration remains deferred to the dedicated protected edit
convergence package.
