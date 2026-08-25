// MOCK DATA pending CR-017 (docs/CONTRACT-REQUESTS.md). No real
// notification feed exists anywhere in the app yet; these sample rows
// let the bell has-new state, the compact panel, and the full
// notification center be reviewed and handed off as a finished
// design. This is the ONLY place this content lives. When CR-017's
// feed lands, delete this file and its one import in
// components/studio/StudioTopBar.jsx.

export const STUDIO_TOP_BAR_MOCK_NOTIFICATIONS = Object.freeze([
  Object.freeze({
    id: "n-1",
    title: "Your character \"Lysandra\" passed review and is now public.",
    supportingLine: "12m ago",
    group: "today",
  }),
  Object.freeze({
    id: "n-2",
    title: "New comment on your Story \"The Hollow Court\".",
    supportingLine: "1h ago",
    group: "today",
  }),
  Object.freeze({
    id: "n-3",
    title: "Image Studio finished generating 4 portraits.",
    supportingLine: "3h ago",
    group: "today",
  }),
  Object.freeze({
    id: "n-4",
    title: "Weekly creator digest is ready.",
    supportingLine: "1d ago",
    group: "earlier",
  }),
  Object.freeze({
    id: "n-5",
    title: "\"Morning Star\" reached 100 sessions played.",
    supportingLine: "2d ago",
    group: "earlier",
  }),
  Object.freeze({
    id: "n-6",
    title: "A room you follow, \"Ashfall Tavern\", went live.",
    supportingLine: "3d ago",
    group: "earlier",
  }),
]);
