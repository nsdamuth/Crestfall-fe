export const STUDIO_ACCOUNT_PROVIDER_CONTRACT_VERSION =
  "studio-account-provider.context.v1";

export const studioAccountProviderContract = Object.freeze({
  version: STUDIO_ACCOUNT_PROVIDER_CONTRACT_VERSION,
  purpose:
    "Provide normalized Studio account state and mutations without making account consumers fetch or interpret profile response envelopes.",
  shellResponsibilities: Object.freeze([
    "Own the React context boundary",
    "Expose the existing StudioAccountProvider and useStudioAccount public API",
    "Inject an optional account loader for isolated previews and diagnostics",
  ]),
  chassisResponsibilities: Object.freeze([
    "Load the current Studio account through the client API",
    "Normalize profile and coin-balance snapshots",
    "Own loading, loaded, and error state",
    "Merge account snapshots without discarding current profile fields",
    "Synchronize server coin balances into both balance aliases",
  ]),
  contextValue: Object.freeze([
    "accountProfile",
    "coinBalance",
    "accountStatus",
    "accountError",
    "refreshAccount",
    "mergeAccountSnapshot",
    "setCoinBalanceFromServer",
  ]),
  behavior: Object.freeze({
    initialAccountProfile: null,
    initialCoinBalance: 0,
    initialStatus: "idle",
    autoRefreshOnMount: true,
    invalidRefreshBalanceFallback: 0,
    invalidServerBalanceRejected: true,
    negativeBalancesClampToZero: true,
    consumerOutsideProviderThrows: true,
  }),
  boundary:
    "Studio consumers → useStudioAccount context → Provider shell → provider ViewModel / Chassis → studioAccountClient → Next.js API proxy",
});
