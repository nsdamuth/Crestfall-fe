# RELEASE: <id or date>

Purpose: the public and internal release notes for one release,
generated from bible/FEATURES.csv rows and then human curated before
publishing. Filled by: drafted from FEATURES.csv, edited by Brian
before it ships.

Date: ... Tagged by: ... Deployed to: ...

Generated drafts are raw material only; every line ships only after
a human pass. No file names, no internal terms, plain language
throughout.

## Added

FEATURES.csv rows with type = new. One line each, citing the row id.

## Changed

FEATURES.csv rows with type = improved. One line each, citing the
row id.

## Fixed

FEATURES.csv rows with type = fixed. One line each, citing the row
id.

## Removed

FEATURES.csv rows with type = removed. One line each, citing the row
id.

## Optional (carried from v1, not part of the v2 field list)

- Channels: per-release channel record (notifications panel posted
  date; whether a login modal ran this release; which monthly email
  digest it rides; whether it appears in the public changelog).
  Per-feature channel routing now lives on the FEATURES.csv row
  itself (audience, public, channels columns); this block is for the
  release-level facts the row schema does not carry, especially the
  login-modal monthly cap ruled in bible/COLLAB-WORKFLOW-PRD.md.
- Known gaps shipped honestly: stubs and hidden affordances in this
  release, each with its CR number.
