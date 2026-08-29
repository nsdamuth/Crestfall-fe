# Timeline shared contract

`timeline_contract_v2` keeps Timeline as a lightweight presentation/curation asset over Lore.
Lore continues to own prose, images, publication state, era, display date, and canonical chronology.

Timeline v2 owns:

- `publicEnabled`
- chronology direction
- `groupingMode`: `CHAPTERS`, `ERA`, or `NONE`
- authored `chapters[]` (`id`, `title`, numeric `order`)
- Lore membership
- optional per-entry `orderOverride`
- optional per-entry `chapterId`

`timeline_contract_v1` remains readable. `groupByEra: true` normalizes to `ERA`; false normalizes to `NONE`. A save through the v2 editor upgrades the persisted definition to v2.

Chapters are Timeline presentation metadata only. Removing a chapter unassigns its Lore entries; it never deletes or mutates the referenced Lore assets.
