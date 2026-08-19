# Mechanics Command Domain Query presentation semantics

Status: FE presentation contract and realistic fixtures only.

This package is intentionally **not** a copy of Crestfall's authoritative
Mechanics Command Domain Query authoring implementation.

The FE review explicitly ruled that these remain Chassis-owned:

- `MechanicsCommandDomainQuery.contract.js`
- `mechanicsCommandDomainQueryNormalization.js`
- `mechanicsCommandDomainQueryOperations.js`
- `useMechanicsCommandDomainQueryViewModel.js`

This package therefore consumes already-normalized, display-ready output from
that Chassis application ViewModel and describes how the FE lane can render it.

## Authoritative authored contract

```text
mechanics_command_domain_query_v1
```

Maximum argument bindings:

```text
12
```

## Current creator-facing semantics

A Domain Query routes a creator-authored Mechanics command to a registered,
typed, **read-only** Crestfall domain operation.

Current presentation copy makes four boundaries explicit:

- the creator owns the command name;
- Crestfall owns the typed domain/operation contract;
- unregistered domain/operation pairs are rejected at runtime;
- a query does not mutate state or grant execution authority.

The current fields are:

```text
Enable typed domain query
Domain
Operation
Argument bindings
Query parameter
Command argument
```

Creator-authored invocation arguments are the only source options for a binding.

## Incomplete visual authoring is allowed

The current Chassis normalizer preserves:

```text
enabled: true
```

while the creator is still entering a Domain or Operation.

Likewise, adding a binding initially produces an incomplete row with no source
argument selected.

This FE presentation package therefore renders incomplete authoring rather than
silently disabling or deleting it.

The included hints mirror the current Chassis validation messages, but they are
**presentation hints only**. JSON validation in Crestfall remains authoritative.

## Runtime authority

The current runtime service guarantees Domain Query results remain:

```text
readOnly: true
statePersistenceAllowed: false
mutationAllowed: false
executionAllowed: false
providerInvocationAllowed: false
```

This FE package carries those boundaries as explanatory presentation semantics.
It does not execute or register runtime adapters.

The current source runtime happens to include examples such as:

```text
ABILITY_SPELL / QUERY_AVAILABILITY
STATS_POOLS / QUERY_STATE
```

The fixtures exercise those shapes, but the FE package does not treat them as
the authoritative registry of allowed operations. Runtime adapter registration
remains Chassis/backend authority.

## Permanent boundary

Crestfall owns:

- the canonical authored contract
- identifier normalization
- add/patch/remove operations
- the application ViewModel
- JSON validation
- registered domain-query adapters
- invocation argument values
- runtime execution
- result composition
- persistence

Crestfall-fe owns:

- the eventual ruled View
- display copy
- field/row presentation
- incomplete-authoring presentation
- semantic callbacks into the Chassis ViewModel

## Protected editor family

This patch deliberately does not touch:

```text
components/studio/my-creations/edit/**
```

The FE lane can later consume this contract when its editor design pass unlocks
the Mechanics Modules surface.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
