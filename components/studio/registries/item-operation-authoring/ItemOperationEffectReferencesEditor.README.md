# Item Operation Effect References Editor

W29 live FE authoring surface for `item_operation_effect_reference_v0`.

The shell consumes the already accepted `item_operation_authoring.presentation.v1`
contract and its typed-operation catalog. The FE `itemOperationAuthoringCatalog.js`
is only an adapter over that contract; it does not duplicate catalog data.

The View authors reference identity, Item action applicability, target role, and
operation-owned arguments. It never executes an Item action or a Mechanics
operation. Runtime authorization, typed-operation validation, target authorization,
mutation, and persistence remain Crestfall authority.
