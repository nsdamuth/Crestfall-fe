# Story Room World State projection semantics

Status: pure runtime-to-presentation projection contract and realistic fixtures
only.

This package brings the current Chronicle State world-state projection rules
into the FE lane without moving Story Room runtime authority, chat orchestration,
or the existing Story Room State Panel.

## Location authority

Room-level World State Location follows this precedence:

```text
locationRuntime.current
→ authored Story starting Location
→ attached Location fallback
→ Unspecified Location
```

When runtime Location exists, the projection accepts its current canonical name
aliases in this order:

```text
canonicalName
title
name
```

The authored starting Location is fallback-only once runtime Location state
exists.

### NPC mobility is not room World State

NPC mobility is participant-scoped physical state.

An individual actor's mobility/scene-focus Location must never be projected
back into the room-level Chronicle `World State → Location` row.

This package therefore has no NPC mobility input or dependency.

## Time authority

The projection looks at the latest message containing engine-module operations
and accepts only a completed:

```text
core.timeDay.v1
```

Engine time may provide:

- day
- minutes
- time label

If no completed Time module result exists, room state is used.

Room-state fallback preserves the current behavior:

- `worldTimeLabel` when present
- otherwise `worldTimeMinutes` rendered as `HH:MM`
- otherwise `Unknown`
- day defaults to `1`

## Weather authority

The same latest engine-operation envelope is checked for a completed:

```text
core.inWorldWeather.v1
```

If unavailable, room/state fallback accepts:

```text
weather.condition
weather.label
weather.current
currentWeather
```

and finally `Unknown`.

## Source labels

The presentation contract exposes the current Chronicle source labels:

```text
Engine Module
Room State
```

and carries the resolved module IDs when engine data wins.

## Objective projection

The current objective summary remains:

```text
Turn <turnCount> · Day <worldDay> · <timeLabel>
```

## Permanent boundary

Crestfall remains authoritative for:

- Story Room snapshot loading
- chat/message orchestration
- Engine module invocation
- time/weather runtime mutation
- Location Runtime mutation
- NPC mobility
- room persistence
- transcript/export/share actions
- API/client behavior

Crestfall-fe owns presentation of the display-ready room World State only.

## Existing FE Story Room packages

This patch deliberately does not modify:

- `story-room-state-panel/**`
- Story Room Chat Shell
- C1-C6 chat packages
- export/share dialogs
- V2 Story page composition

The later FE integration can consume this pure projection without replacing its
current presentation work.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
