// The three states AF1's brief names: default, long, empty. Default
// and long both carry a dismiss control so the 44px target renders in
// every non-empty state; empty proves the View returns nothing rather
// than an empty shell.

export const kitNoticeFixtures = [
  {
    id: "default",
    label: "A short confirmation, neutral tone",
    props: { message: "Folder created.", tone: "neutral", onDismiss: () => {} },
  },
  {
    id: "long",
    label: "The longest plausible line, wraps rather than clipping",
    props: {
      message:
        "\"Reference sheets, poses, and outfit tests\" was deleted, and its two sub-folders moved up to Folders.",
      tone: "danger",
      onDismiss: () => {},
    },
  },
  {
    id: "empty",
    label: "No message: the View renders nothing",
    props: { message: "", tone: "neutral", onDismiss: () => {} },
  },
];

export default kitNoticeFixtures;
