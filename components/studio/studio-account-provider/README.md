# Studio Account Provider LOOM boundary

`StudioAccountProvider.jsx` is the thin application-owned Binding Shell. It owns
only the React context boundary and the existing public exports:

- `StudioAccountProvider`
- `useStudioAccount`

`useStudioAccountProviderViewModel.js` is the ViewModel / Chassis. It owns the
client request, account normalization, loading/error state, profile merges, and
coin-balance synchronization.

The public context shape is unchanged, so existing consumers such as
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

The optional `loadAccount` prop exists only as a dependency-injection seam for
the development preview and isolated tests. Production behavior still defaults
to `fetchCurrentStudioAccount` and refreshes on mount.

Preview:

```text
/dev/ui-preview/studio-account-provider
```

Mechanics Module field decomposition remains deferred until the final
cumulative reassessment.
