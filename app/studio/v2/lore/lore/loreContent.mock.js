// Stand-in feed (docs/SPRINT-G-PLAN.md section 4, docs/SPRINT-H-
// PLAN.md section 5.7): the public Lore archive plus one creator's
// own drafts. Content reuses the existing creation-card fixture art
// and copy conventions rather than inventing new draft assets, the
// same precedent Home's homeContent.mock.js and Adventures'
// adventuresContent.mock.js follow.
import { getCreationTypeDisplayName } from "@/lib/shared/presentation/terminology";

const LORE_KIND_LABEL = getCreationTypeDisplayName("LORE");

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

export const LORE_APPROVAL_OPTIONS = [
  { value: "pending", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "canon", label: "Canon" },
];

export const LORE_WORLD_OPTIONS = [
  { value: "eden", label: "Eden" },
  { value: "aethelgard", label: "Aethelgard" },
  { value: "sundered-choir", label: "The Sundered Choir" },
  { value: "blackcrown", label: "Blackcrown Dominion" },
];

export const LORE_RECENCY_OPTIONS = [
  { value: "week", label: "New this week" },
  { value: "month", label: "New this month" },
  { value: "all", label: "All time" },
];

// Community lore: the public, approved archive. Canon badge only
// (tag economy, docs/BUILD-BLUEPRINT.md 2.16(a)): visibility/approval
// badges belong to own-work contexts, never the community list.
export const LORE_COMMUNITY_ITEMS = [
  {
    id: "lore-community-1",
    title: "The Black Crown Accord",
    subtitle: `${LORE_KIND_LABEL} · Aethelgard · by @whiteviolin`,
    imageSrc: canonArt("lilith-lux-eden-confrontation"),
    world: "aethelgard",
    approvalState: "canon",
    daysAgo: 2,
    stats: { plays: null, hearts: 441, saves: 96, followers: null },
  },
  {
    id: "lore-community-2",
    title: "Fragments of the Sundered Choir",
    subtitle: `${LORE_KIND_LABEL} · The Sundered Choir · by @vermillion`,
    imageSrc: creatorArt("vermillion-13"),
    world: "sundered-choir",
    approvalState: "approved",
    daysAgo: 6,
    stats: { plays: null, hearts: 212, saves: 54, followers: null },
  },
  {
    id: "lore-community-3",
    title: "Eden Before the Fall",
    subtitle: `${LORE_KIND_LABEL} · Eden · by @whiteviolin`,
    imageSrc: null,
    world: "eden",
    approvalState: "canon",
    daysAgo: 19,
    stats: { plays: null, hearts: 578, saves: 140, followers: null },
  },
  {
    id: "lore-community-4",
    title: "The Blackcrown Ledger",
    subtitle: `${LORE_KIND_LABEL} · Blackcrown Dominion · by @lux-scribe`,
    imageSrc: creatorArt("whiteviolin"),
    world: "blackcrown",
    approvalState: "approved",
    daysAgo: 34,
    stats: { plays: null, hearts: 167, saves: 41, followers: null },
  },
  {
    id: "lore-community-5",
    title: "Aethelgard at Dusk, an Amphitheater's Archive",
    subtitle: `${LORE_KIND_LABEL} · Aethelgard · by @vermillion`,
    imageSrc: null,
    world: "aethelgard",
    approvalState: "approved",
    daysAgo: 41,
    stats: { plays: null, hearts: 98, saves: 22, followers: null },
  },
  {
    id: "lore-community-6",
    title: "The Choir's Last Verse, an oral history recovered from three sources and reconciled by the archive",
    subtitle: `${LORE_KIND_LABEL} · The Sundered Choir · by @whiteviolin`,
    imageSrc: creatorArt("vermillion-13"),
    world: "sundered-choir",
    approvalState: "canon",
    daysAgo: 58,
    stats: { plays: null, hearts: 305, saves: 77, followers: null },
  },
  {
    id: "lore-community-7",
    title: "Eden's Quiet Districts",
    subtitle: `${LORE_KIND_LABEL} · Eden · by @lux-scribe`,
    imageSrc: canonArt("athelgard-ampitheater-profile"),
    world: "eden",
    approvalState: "approved",
    daysAgo: 70,
    stats: { plays: null, hearts: 133, saves: 29, followers: null },
  },
];

// Your lore: one creator's own drafts and submissions, every
// approval state represented. Approval-state badge here (own-work
// context permits it); no Canon badge unless the item is Canon.
export const LORE_MINE_ITEMS = [
  {
    id: "lore-mine-1",
    title: "The Wandering Court's First Winter",
    subtitle: `${LORE_KIND_LABEL} · Aethelgard`,
    imageSrc: null,
    world: "aethelgard",
    approvalState: "pending",
    daysAgo: 1,
    stats: { plays: null, hearts: 0, saves: 0, followers: null },
  },
  {
    id: "lore-mine-2",
    title: "Notes on the Blackcrown Sky",
    subtitle: `${LORE_KIND_LABEL} · Blackcrown Dominion`,
    imageSrc: creatorArt("whiteviolin"),
    world: "blackcrown",
    approvalState: "approved",
    daysAgo: 12,
    stats: { plays: null, hearts: 18, saves: 5, followers: null },
  },
  {
    id: "lore-mine-3",
    title: "Eden, a Working Draft",
    subtitle: `${LORE_KIND_LABEL} · Eden`,
    imageSrc: null,
    world: "eden",
    approvalState: "pending",
    daysAgo: 3,
    stats: { plays: null, hearts: 0, saves: 0, followers: null },
  },
];
