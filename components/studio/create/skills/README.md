# Skills Profile FE package

Status: **LIVE FUNCTIONAL ABSORPTION — W34**.

W34 follows the explicit protected-lane unlock for the current integration branch.
The accepted Skills semantic contracts and richer FE fixtures remain intact, while
the current Crestfall Skills authoring implementation is mirrored into FE so the
live editor can function before a later visual-normalization pass.

The user explicitly authorized carrying the older working styling on this branch
for now, with normalization where it is low-risk. W34 therefore prioritizes
functional parity over immediate redesign.

## Authority

Crestfall remains authoritative for:

- creation routing and persistence;
- application behavior and save semantics;
- Skills normalization and validation rules;
- rank expansion/contraction and editor mutation semantics;
- actor-owned current ranks and unspent progression state;
- runtime advancement and prerequisite evaluation.

Crestfall-fe owns the presentation copy deployed by the integration branch.
Mirrored application ViewModels in FE are deployment mirrors of Chassis behavior;
they do not transfer product authority out of Crestfall.

## W34 live surface

FE now contains the current:

- Skills Profile Builder shell/View/ViewModel;
- Skills Profile editor shell/View/ViewModel;
- JSON Editor & AI Guide shell/View/ViewModel;
- JSON validation, fixtures, and complete-replacement AI authoring guide;
- local editor diagnostics.

The core Skills Profile editor contract remains byte-compatible with Chassis:

```text
skills_profile_contract_v0
```

The FE builder contract retains its behavior-neutral explicit `.js` import needed
by standalone Node diagnostics. Its public constants and draft/title behavior remain
semantically identical to Chassis.

The accepted FE presentation binding is preserved and now reports the profile and
JSON surfaces as `WIRED_LEGACY_PRESENTATION`. Cross-Skill and typed-unlock
prerequisites remain fully authored through the complete JSON editor in the current
legacy UI and are reported as `WIRED_JSON_EDITOR_ONLY_LEGACY_PRESENTATION`.

## Deferred from W34

W34 deliberately does not modify:

- `components/studio/my-creations/edit/**`;
- the Creation Edit Binding Shell;
- Wallet or Actor Mechanics editor families;
- Creation Studio mechanics-profile catalog exposure;
- Image Studio / Kit;
- chat;
- `/app/studio/v2/**`.

Saved-edit registration remains in the later protected `my-creations/edit`
convergence package, after all editor targets exist in FE.
