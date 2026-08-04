# Crestfall design context

## What Crestfall is

Crestfall is a storytelling and character-creation platform by Anthology
Interactive. This repository, Crestfall-fe, is its front end — an
independent repo from the Crestfall services API and from the original
Crestfall FE.

## The product model

**Assets.** Everything a creator builds is a creation asset: Character,
Player Character, Location, Outfit, Wardrobe, Pose, Scenario, Narrator,
Image Preset, Character Template, and the registry types (NPC, Location,
Faction, Organization, Event, Quest, Item). These are cataloged as the
Studio's creation-asset list and are what "Create" in the Studio means.

**Story.** Story is its own creation asset — a Room Template, the
chat-capable session shape a creator builds and others play inside.
Storylines connect Stories together.

**Adventure.** Adventure is a Scenario framing — one of the categories a
Scenario can carry, alongside genres like Fantasy or Mystery. A Scenario
supplies the premise a Story runs on.

**The four visibility states.** Every creation carries one of four
visibility states: Private, Unlisted, Internal, and Public. Creations
start Private by default and can later be shared, published, or
submitted for canon review.

## Typography and design language

Two type families carry the whole system. Body and UI copy is set in
Inter (the sans token). Titles, page heads, and display moments are set
in Cormorant Garamond (the display token) — reserved for that role, not
used for body copy.

The accent color is gold, expressed through several tokens depending on
role (ornament, bright, action) rather than one flat value, so gold can
sit correctly on canvas, on artwork, or as an interactive accent without
losing contrast.

Three status colors exist for state only — success (warm sage), warning
(burnt amber), and danger (brick red) — never for decoration, charts, or
hover effects, and every use ships with a word beside it. There is no
fourth "info" color; informational copy reads through the neutral ink
scale like any other text.

Every value in the system is a token defined once and reused, not a
literal color or size repeated at each call site. RESTYLE-RULES.md is
the canonical source for what each token is and where it applies.

## The LOOM file shape

Most converted UI packages follow one shape, with responsibilities kept
deliberately separate:

- **Binding Shell** (e.g. `StudioTopBar.jsx`) — owns Crestfall-specific
  integration: Next.js navigation, application state, host adapters,
  route behavior, ViewModel wiring.
- **ViewModel** (e.g. `useStudioTopBarViewModel.js`) — normalizes input
  and prepares props for the View.
- **Portable View** (e.g. `StudioTopBar.view.jsx`) — owns presentation
  only. A View does not touch database access, Supabase product data,
  services-api calls, persistence, router behavior, or business rules
  that belong to Crestfall services. It receives data and callbacks
  through props.
- **Contract** — documents the expected shape of props and behavior.
- **Fixtures** — provide local, deterministic states for previews and
  isolated testing, without depending on live APIs.

## The quality floor

A View is presentation-only and stays that way — no direct product-data
access, no bypassing the frontend API and services-api boundaries, no
business logic pulled into page components.

Changes are the smallest edit that satisfies the task. Existing props
and behavior are preserved unless the task requires a contract change;
when the prop surface changes, the contract is updated with it; when a
new visible state is needed, a fixture is added for it.

Every change is checked by the agent on a rendered page, not assumed
from a file read — at 390 width and then at 1440 width. A production
build should finish with exit code 0. The repository may carry inherited
lint findings; a task does not rewrite unrelated areas just to make lint
pass unless lint cleanup is the assigned task.
