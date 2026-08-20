# Item Operation Requirement Sets Editor

W28 live FE authoring surface for `item_operation_requirement_set_v0`.

The editor reuses the accepted `item_operation_authoring.presentation.v1` semantic contract and `mechanics_command_requirements_v1` requirement language. It does not import the protected Mechanics Module editor tree.

Item Registry stores the authored requirement sets; runtime Item authorization and requirement evaluation remain authoritative in Crestfall. Unknown requirement-clause fields are preserved when the common fields exposed by this View are edited.
