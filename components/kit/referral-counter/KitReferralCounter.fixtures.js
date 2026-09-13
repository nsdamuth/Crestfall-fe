// The three states the account snapshot can hand the counter: zero,
// a served count, and the field missing while CR-073 is open. Each is
// the raw referral field the ViewModel folds, so the fixture proves
// the fold and not only the View. Every fixture renders the one line
// (label, number, tip) left-aligned (follow-up 2, item 4); the
// longest case proves the number never pushes the tip off the line.

export const kitReferralCounterFixtures = [
  { id: "zero", label: "Zero referrals credited", props: { referral: { creditedCount: 0 } } },
  { id: "served", label: "Served count", props: { referral: { creditedCount: 12 } } },
  { id: "missing", label: "Field missing (CR-073 open), renders 0", props: { referral: undefined } },
  { id: "longest", label: "Largest plausible count", props: { referral: { creditedCount: 1284 } } },
  {
    id: "long-label",
    label: "Caller label at its longest, still one line at 390",
    props: { label: "Referral bonus", referral: { creditedCount: 1284000 } },
  },
];

export default kitReferralCounterFixtures;
