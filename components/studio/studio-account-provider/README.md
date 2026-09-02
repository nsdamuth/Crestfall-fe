# Studio Account Provider LOOM boundary

`StudioAccountProvider.jsx` is the thin application-owned Binding Shell. It owns
only the React context boundary and the existing public exports:

- `StudioAccountProvider`
- `useStudioAccount`

`useStudioAccountProviderViewModel.js` is the ViewModel / Chassis. It owns the
client requests, account/capability normalization, independent loading/error state, profile merges, and
coin-balance synchronization.

The public context remains backward-compatible and now also projects sanitized
`capabilities`, `capabilityStatus`, `capabilityError`, and `refreshCapabilities`. Existing consumers such as
`StudioTopBar`, `StudioEconomyWidget`, Image Studio, and profile donation flows
continue using `useStudioAccount()` without migration work.

## Portable LOOM boundary

```text
Studio consumer
→ useStudioAccount context
→ StudioAccountProvider Binding Shell
→ useStudioAccountProviderViewModel Chassis
→ studioAccountClient
→ Next.js API proxy
→ services-api
→ PostGraphile
→ DB
```

The optional `loadAccount` and `loadCapabilities` props exist only as
dependency-injection seams for development previews and isolated tests.
Production behavior defaults to the real account/capability clients and refreshes
both on mount. Capability metadata is the sanitized effective boolean projection
only; administrative reason/setter/audit data never enters Crestfall-fe.

Preview:

```text
/dev/ui-preview/studio-account-provider
```

Mechanics Module field decomposition remains deferred until the final
cumulative reassessment.
