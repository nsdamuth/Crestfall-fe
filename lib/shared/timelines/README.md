# Timeline v1 shared contract

`TIMELINE` is a lightweight organizational creation. It does not duplicate Lore
content or become chronology authority for a Lore Asset.

Canonical Timeline data lives at `creation.data.timeline` and uses
`timeline_contract_v1`:

- `publicEnabled` — creator intent for future public projection;
- `sortDirection` — `ASC` or `DESC`;
- `groupByEra` — presentation grouping preference;
- `entries[]` — references to Lore creation ids with optional numeric
  `orderOverride` values.

Lore keeps its human-readable `displayDate`. The optional root
`lore_document.timelineOrder` is the machine-sort chronology key. The Timeline
never parses or rewrites `displayDate`.

For ordering, an entry-level `orderOverride` wins over the referenced Lore
Asset's root `timelineOrder`. Lore with neither value is unplaced and sorts at
the end.

Public Timeline projection is intentionally not implemented by TL1A. The public
read boundary must filter entries through Lore publication authority and must
not leak private/unpublished Lore metadata.
