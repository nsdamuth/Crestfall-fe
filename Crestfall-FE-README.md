# Crestfall Frontend

This repository contains the Crestfall frontend and its LOOM-based UI packages.

It can be used by a frontend designer or UI developer without cloning the Crestfall backend repository. In that mode, the safest and most useful workflow is to work from the built-in development preview routes and fixture data.

---

## Who this repository is for

This repository is suitable for:

- frontend designers;
- UI developers;
- UX reviewers;
- accessibility reviewers;
- visual QA;
- AI-assisted frontend development;
- work on LOOM Views, fixtures, contracts, and presentation behavior.

You do not need the Crestfall backend repository to work on isolated frontend presentation.

Some live application pages still expect the Crestfall services API. Without the backend, those pages may load partially, show empty states, or fail when they attempt to read or save real data.

---

## Recommended backend-free workflow

For frontend-only work, use the built-in preview routes under:

```text
/dev/ui-preview/
```

These routes render components with local fixture data and are intended for isolated frontend development.

Examples:

```text
http://localhost:3001/dev/ui-preview/studio-top-bar
http://localhost:3001/dev/ui-preview/studio-sidebar
http://localhost:3001/dev/ui-preview/creation-card
http://localhost:3001/dev/ui-preview/community-hub
http://localhost:3001/dev/ui-preview/room-template-builder
http://localhost:3001/dev/ui-preview/story-room-chat-shell
```

There are many additional preview routes. Browse:

```text
app/dev/ui-preview/
```

Each preview folder normally contains a `page.jsx` or `page.js` file and often a small preview client.

---

## Local setup

### 1. Install Node.js

Use the Node.js version expected by the project. When unsure, use the current active LTS release.

Confirm Node and npm are available:

```bash
node --version
npm --version
```

### 2. Clone the repository

```bash
git clone <repository-url>
cd Crestfall-fe
```

### 3. Install dependencies

```bash
npm ci
```

Use `npm ci` rather than `npm install` for the first setup so the checked-in lockfile is respected.

### 4. Create a local environment file

Create:

```text
.env.local
```

For preview-only frontend work, the repository may run without the full backend configuration. Some shared layout or login-related code may still require valid Supabase public values during a production build.

Use only frontend-safe values:

```env
NEXT_PUBLIC_SUPABASE_URL=<public Supabase project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public Supabase anon key>
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Do not place backend credentials, database passwords, R2 secret keys, provider API keys, or production secrets in this repository.

The `.env.local` file is ignored by Git and must never be committed.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3001
```

For backend-free frontend work, go directly to a preview route under:

```text
http://localhost:3001/dev/ui-preview/
```

---

## Working without the Crestfall backend

When the backend is not available:

### Use these

- `app/dev/ui-preview/**`
- component fixtures
- component contracts
- portable `*.view.jsx` files
- local UI state
- presentation-only interaction
- responsive layout work
- visual polish
- accessibility work

### Avoid relying on these

- saving real creations;
- loading a real account;
- authentication-dependent workflows;
- image generation;
- media uploads;
- likes, bookmarks, follows, or donations;
- story-room persistence;
- live services-api requests;
- PostGraphile or database-backed data.

A page that lives under `/studio` may still render, but it should not be treated as a reliable backend-free test unless it is explicitly fixture-driven.

---

## LOOM structure

Most converted UI packages follow this shape:

```text
ComponentShell.jsx
component-package/
  Component.view.jsx
  Component.contract.js
  Component.fixtures.js
  useComponentViewModel.js
  README.md
```

The responsibilities are intentionally separated.

### Binding Shell

The outer component, such as:

```text
StudioTopBar.jsx
```

owns Crestfall-specific integration such as:

- Next.js navigation;
- application state;
- host adapters;
- route behavior;
- ViewModel wiring.

### ViewModel

The ViewModel:

```text
useStudioTopBarViewModel.js
```

normalizes input and prepares props for the View.

### Portable View

The portable View:

```text
StudioTopBar.view.jsx
```

owns presentation only.

A portable View should not directly own:

- database access;
- Supabase product-data access;
- services-api calls;
- persistence;
- Next.js router behavior;
- business rules that belong to Crestfall services.

### Contract

The contract documents the expected shape of props and behavior.

### Fixtures

Fixtures provide local states for previews and isolated testing.

---

## Safe frontend design workflow

For a normal frontend change:

1. Find the relevant preview route in `app/dev/ui-preview/`.
2. Find the related package under `components/`.
3. Update the smallest necessary file.
4. Prefer changing the portable `*.view.jsx` file for presentation-only work.
5. Update fixtures when a new visible state is required.
6. Do not change ViewModels, API clients, or server files unless the task actually requires behavior changes.
7. Test the preview route in the browser.
8. Check desktop and mobile widths.
9. Run the relevant diagnostics when available.
10. Run a production build before submitting larger changes.

---

## Useful commands

Start development:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

The current repository may contain inherited lint findings. Do not automatically rewrite large areas of the application just to make lint pass unless lint cleanup is the assigned task.

Check Git changes:

```bash
git status
git diff
```

---

## Guidance for AI assistants

Before editing this repository, an AI assistant should follow these rules.

### Architecture rules

- Preserve the LOOM separation.
- Treat `*.view.jsx` files as presentation-only.
- Do not introduce direct product-data access into Views.
- Do not add direct Supabase product-data calls.
- Do not bypass the existing frontend API and services-api boundaries.
- Do not move business logic into page components.
- Do not invent new environment variable names.
- Do not reorganize directories unless explicitly requested.
- Do not change unrelated files.
- Do not perform broad cleanup during a focused UI task.

### File-reading rules

Before editing:

1. Read the outer Binding Shell.
2. Read the related ViewModel.
3. Read the portable View.
4. Read the contract.
5. Read the fixtures.
6. Read the package README.
7. Read any package-local diagnostics.

Do not assume the correct edit location from the filename alone.

### Change rules

- Make the smallest change that satisfies the task.
- Preserve existing props and behavior unless the task requires a contract change.
- Update the contract when the public prop surface changes.
- Update fixtures when a new visible state is added.
- Keep navigation injected into portable Views.
- Keep API calls outside portable Views.
- Keep persistence outside portable Views.
- Do not silently replace working patterns with preferred patterns.
- Do not rewrite working code merely to satisfy style preferences.

### Validation rules

For every change, report:

- exact files changed;
- exact preview route tested;
- actions performed;
- expected result;
- whether backend access was required;
- whether a production build was run;
- any known limitations.

---

## Working on a portable View

For visual-only changes, begin with the related file ending in:

```text
.view.jsx
```

Typical safe changes include:

- spacing;
- typography;
- layout;
- responsive behavior;
- labels;
- icons;
- empty-state presentation;
- hover and focus treatment;
- visual hierarchy;
- accessibility attributes.

A View should receive data and callbacks through props rather than fetching or saving data itself.

---

## Working with fixtures

Fixtures are the preferred way to add and test visual states without the backend.

Common fixture states include:

- default;
- empty;
- loading;
- error;
- selected;
- disabled;
- mobile;
- long-content;
- permission-restricted.

When adding a fixture:

- keep it deterministic;
- do not depend on live APIs;
- use realistic but non-sensitive sample data;
- make the state easy to identify in the preview;
- preserve existing fixture names unless a rename is necessary.

---

## Production build notes

A production build may require valid frontend-safe Supabase values because the login route is prerendered during the build.

Run:

```bash
npm run build
```

A successful build should finish with exit code `0`.

Do not add backend secrets merely to make the frontend build pass.

---

## When the backend is available

With the Crestfall services stack running locally, the frontend can use:

```env
CRESTFALL_API_INTERNAL_URL=http://127.0.0.1:4000
CRESTFALL_API_INTERNAL_SECRET=<local development secret>
```

Those values are for local development only.

Railway provides its own deployment environment values. Local `.env.local` values must not be copied into production configuration.

---

## Pull request checklist

Before submitting frontend work:

- [ ] The intended preview route was tested.
- [ ] Desktop layout was checked.
- [ ] Mobile layout was checked.
- [ ] No unrelated files were changed.
- [ ] No secret or `.env.local` file was committed.
- [ ] Portable Views still contain presentation only.
- [ ] Fixtures were updated when needed.
- [ ] Contracts were updated when needed.
- [ ] The production build was run for larger changes.
- [ ] The exact manual test steps are documented.

---

## Important boundary

This repository is the Crestfall frontend.

It may contain frontend server routes and orchestration required by Next.js, but Crestfall product data must continue to follow the established boundary:

```text
View
→ ViewModel/client
→ frontend API route
→ services-api
→ PostGraphile
→ database
```

Supabase access in the frontend is limited to authentication and session handling.

Do not bypass this boundary.
