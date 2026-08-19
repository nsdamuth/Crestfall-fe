# Structured Registry Builder ↔ Reference Precision binding

Status: **WIRED**.

W8 closes the precise Structured Registry reference authoring seam.

Structured Registry links now use `registryCreationId + registryEntryId` as stable target identity. Non-Registry targets remain whole-Creation references.

The FE deployment mirrors now match current `Crestfall` authority for `structuredRegistryUtils.js`, `useStructuredRegistryBuilder`, `useStructuredRegistryBuilderViewModel`, and `useRegistryLinkedCreationPickerViewModel`.

The picker expands structured Registry Creations into individual entries so creators choose an exact Organization, Faction, Event, or Quest entry. The current Registry entry cannot directly link to itself; same-Registry sibling references remain valid.

Stored links hydrate against current Creations and Registry entries and expose `CREATION_RESOLVED`, `REGISTRY_ENTRY_RESOLVED`, `LEGACY_REGISTRY_REFERENCE`, `REGISTRY_ENTRY_NOT_FOUND`, and `UNAVAILABLE` states.

The FE Builder shows Registry title for precise references and explicit recovery/status treatment for legacy whole-Registry links, missing Registry entries, and unavailable linked Creations. Canonical persistence stores stable identity plus notes rather than copied display metadata.

`Crestfall` remains authority for loading, mutation, normalization, self-reference enforcement, persistence, and runtime graph resolution. The matching utility/hook/ViewModel files in `Crestfall-fe` are deployment mirrors. FE Builder and picker Views remain presentation authority.
