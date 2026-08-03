# Studio Account Metrics Loom Feature

**Status:** In-repository Loom implementation

**View contract:** `1.0.0`

## Structure

```text
StudioAccountMetrics.jsx
studio-account-metrics/
  StudioAccountMetrics.view.jsx
  useStudioAccountMetricsViewModel.js
  StudioAccountMetrics.contract.js
  StudioAccountMetrics.fixtures.js
  README.md
```

## Responsibilities

The Binding Shell preserves the existing `StudioAccountMetrics` import path.

The ViewModel owns:

- loading current account metrics through the Crestfall client layer;
- fallback metric values;
- compatibility between `interactions` and the legacy `messages` value;
- display-number formatting;
- load-error decisions;
- construction of display-ready metric cards.

The portable View owns:

- the optional error banner;
- metric-card layout and styling;
- rendering the caller-supplied layout class.

The View does not call APIs or know the account-metrics payload shape.

## Live consumers

```text
app/studio/account/page.js
components/studio/account/StudioAccountProfile.jsx
```

## Preview

```text
http://localhost:3000/dev/ui-preview/studio-account-metrics
```

The preview is development-only and uses fixture data without authenticating or
loading live account metrics.
