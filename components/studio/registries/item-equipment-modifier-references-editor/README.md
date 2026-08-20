# Item Equipment Modifier References Editor

W27 live FE authoring shell for the accepted
`item_equipment_modifier_reference.presentation.v1` semantic contract.

The shell projects normalized, display-ready reference state through the existing
semantic contract. The portable View renders FE-owned controls and emits only
add/update/remove intent.

The Item Registry stores references only. Stats & Pools owns modifier
definitions; Actor Mechanics Profiles resolve the referenced binding; Item
Runtime owns equip/unequip mutation and authoritative effect application.

This package contains no API, persistence, PostGraphile, Supabase product-data,
or runtime execution logic.
