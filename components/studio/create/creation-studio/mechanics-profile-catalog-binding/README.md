# Creation Studio ↔ Mechanics Profile Catalog binding

Status: **LIVE — W37**.

W37 activates the accepted Creation Studio catalog expansion for the reusable
profile types added after Progression:

```text
Skills Profile
Ability & Spell Profile
Wallet Profile
```

The three Chassis creator routes are now confirmed and the corresponding FE
editors/builders are present from W33–W35. The previous dead-link guard is no
longer the active condition on this integration branch.

## Live route targets

The live Creation Studio ViewModel supplies the confirmed Chassis-owned routes
to this binding:

```text
/studio/create/skills-profile
/studio/create/ability-spell-profile
/studio/create/wallet-profile
```

Crestfall remains routing authority. Crestfall-fe only consumes these confirmed
navigation targets for catalog presentation.

## Guided Build

Rules & Mechanics now follows:

```text
20 Stats & Pools Profile
21 Progression Profile
22 Skills Profile
23 Ability & Spell Profile
24 Wallet Profile
25 Mechanics Module
26 Actor Mechanics Profile
27 Rules Codex
```

`Character Template` remains milestone 28 and total Guided Build remains 28.

## Full Studio

The Rules & Mechanics section now includes all five reusable profile-definition
families before Mechanics Modules and Actor Mechanics Profiles:

```text
Stats & Pools Profile
Progression Profile
Skills Profile
Ability & Spell Profile
Wallet Profile
Mechanics Module
Actor Mechanics Profile
Rules Codex
```

## Presentation boundary

The current FE `CreationStudio.view.jsx` is preserved. W37 does not replace the
newer FE visual treatment with the older Chassis View.

The binding is idempotent against both the old 25-step FE baseline and the live
28-step contract. Once the live contract already contains the three profile
steps it does not insert or renumber them again.

## Authority

Crestfall owns route definitions, route mounting, account/creation loading,
builder startup, persistence, and runtime behavior.

Crestfall-fe owns catalog information architecture and presentation. The
application ViewModel in FE is a deployment mirror and consumes the confirmed
Chassis route targets; it does not create route handlers.

## Deferred

W37 does not modify:

- `components/studio/my-creations/edit/**`;
- Location saved-edit `currentCreationId` convergence;
- Image Studio / Kit;
- chat;
- `/app/studio/v2/**`.
