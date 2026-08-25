import {
  BookOpen,
  Brush,
  Castle,
  MapPin,
  MessageSquare,
  Search,
  Shirt,
  Theater,
  User,
  Eye,
  Users,
  AlertTriangle,
  Image as ImageIcon,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  GitBranch,
  CloudSun,
  Database,
  Route,
  Activity,
} from "lucide-react";

const ITEM_REGISTRY_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "entries", label: "Object Entries", icon: BookOpen },
  { id: "associations", label: "Associations", icon: GitBranch },
  { id: "tracking", label: "Tracking Rules", icon: ShieldCheck },
  { id: "prompt", label: "Prompt Guidance", icon: Sparkles },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const CHARACTER_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "identity", label: "Identity", icon: User },
  { id: "appearance", label: "Appearance", icon: ImageIcon },
  { id: "visualReferences", label: "Visual References", icon: ImageIcon },
  { id: "body", label: "Body", icon: BookOpen },
  { id: "behavior", label: "Behavior", icon: Sparkles },
  { id: "mechanicsProfile", label: "Mechanics Profile", icon: Activity },
  { id: "runtimeModules", label: "Runtime Modules", icon: Activity },
  { id: "advanced", label: "Advanced", icon: BookOpen },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const VISUAL_ASSET_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "prompt", label: "Prompt / Guidance", icon: Sparkles },
  { id: "settings", label: "Asset Settings", icon: Brush },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const VISUAL_INGREDIENT_TYPES = new Set([
  "LOCATION",
  "OUTFIT",
  "POSE",
  "IMAGE_PRESET",
]);

const sections = CHARACTER_EDIT_SECTIONS;

const CHARACTER_TEMPLATE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "template", label: "Template Info", icon: BookOpen },
  { id: "identity", label: "Identity Defaults", icon: User },
  { id: "appearance", label: "Appearance Defaults", icon: ImageIcon },
  { id: "body", label: "Body Defaults", icon: Sparkles },
  { id: "behavior", label: "Behavior Defaults", icon: MessageSquare },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const tabs = [
  { id: "ALL", label: "All" },
  { id: "CHARACTER", label: "Characters" },
  { id: "PLAYER_CHARACTER", label: "Player Characters" },
  { id: "SCENARIO", label: "Scenarios" },
  { id: "LOCATION", label: "Locations" },
  { id: "OUTFIT", label: "Outfits" },
  { id: "WARDROBE", label: "Wardrobes" },
  { id: "POSE", label: "Poses" },
  { id: "NARRATOR", label: "Narrators" },
  { id: "IMAGE_PRESET", label: "Image Presets" },
  { id: "ROOM_TEMPLATE", label: "Stories" },
  { id: "ITEM_REGISTRY", label: "Item Registries" },
  { id: "CHARACTER_TEMPLATE", label: "Character Templates" },
  { id: "NPC_REGISTRY", label: "NPC Registries" },
  { id: "LOCATION_REGISTRY", label: "Location Registries" },
  { id: "EVENT_REGISTRY", label: "Event Registries" },
  { id: "QUEST_REGISTRY", label: "Quest Registries" },
  { id: "STORYLINE", label: "Storylines" },
  { id: "DRAFT", label: "Drafts" },
  { id: "IN_REVIEW", label: "In Review" },
  { id: "MECHANICS_MODULE", label: "Mechanics Modules" },
  { id: "RULES_CODEX", label: "Rules Codices" },
  { id: "LORE", label: "Lore Assets" },
  { id: "ACTOR_MECHANICS_PROFILE", label: "Actor Mechanics Profiles" },
  { id: "STATS_POOLS_PROFILE", label: "Stats & Pools Profiles" },
  { id: "PROGRESSION_PROFILE", label: "Progression Profiles" },
];

const STRUCTURED_REGISTRY_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "entries", label: "Entries", icon: BookOpen },
  { id: "relationships", label: "Relationships", icon: GitBranch },
  { id: "rules", label: "Rules", icon: ShieldCheck },
  { id: "prompt", label: "Prompt Guidance", icon: Sparkles },
  { id: "review", label: "Review", icon: Database },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const typeMeta = {
  CHARACTER: {
    label: "Character",
    icon: Users,
  },
  PLAYER_CHARACTER: {
    label: "Player Character",
    icon: User,
  },
  SCENARIO: {
    label: "Scenario",
    icon: BookOpen,
  },
  LOCATION: {
    label: "Location",
    icon: MapPin,
  },
  OUTFIT: {
    label: "Outfit",
    icon: Shirt,
  },
  POSE: {
    label: "Pose",
    icon: Theater,
  },
  NARRATOR: {
    label: "Narrator",
    icon: MessageSquare,
  },
  IMAGE_PRESET: {
    label: "Image Preset",
    icon: Brush,
  },
  ROOM_TEMPLATE: {
    label: "Story",
    icon: Castle,
  },
  CHARACTER_TEMPLATE: {
    label: "Character Template",
    icon: Users,
  },
  NPC_REGISTRY: {
    label: "NPC Registry",
    icon: Users,
  },
  LOCATION_REGISTRY: {
    label: "Location Registry",
    icon: MapPin,
  },
  STORYLINE: {
    label: "Storyline",
    icon: BookOpen,
  },
  ITEM_REGISTRY: {
    label: "Item Registry",
    icon: BookOpen,
  },
  WARDROBE: {
    Label: "Wardrobe",
    icon: Shirt,
  },
  MECHANICS_MODULE: {
    label: "Mechanics Module",
    icon: Activity,
  },
  RULES_CODEX: {
    label: "Rules Codex",
    icon: BookOpen,
  },
  LORE: {
    label: "Lore Asset",
    icon: BookOpen,
  },
  ACTOR_MECHANICS_PROFILE: {
    label: "Actor Mechanics Profile",
    icon: Activity,
  },
  STATS_POOLS_PROFILE: {
    label: "Stats & Pools Profile",
    icon: Activity,
  },
  PROGRESSION_PROFILE: {
    label: "Progression Profile",
    icon: Activity,
  },
};

const OUTFIT_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "outfit", label: "Outfit Identity", icon: Shirt },
  { id: "garment", label: "Garment Design", icon: Sparkles },
  { id: "materials", label: "Materials & Details", icon: BookOpen },
  { id: "prompt", label: "Prompt Guidance", icon: Brush },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const WARDROBE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "entries", label: "Outfit Entries", icon: Shirt },
  { id: "rules", label: "Selection Rules", icon: Sparkles },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const LOCATION_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "location", label: "Location Identity", icon: MapPin },
  { id: "visual", label: "Visual Description", icon: Sparkles },
  { id: "atmosphere", label: "Scene / Atmosphere", icon: BookOpen },
  { id: "runtimeModules", label: "Runtime Modules", icon: CloudSun },
  { id: "prompt", label: "Prompt Guidance", icon: Brush },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];
const POSE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "pose", label: "Pose Identity", icon: Theater },
  { id: "bodyPosition", label: "Body Position", icon: User },
  { id: "staging", label: "Motion / Staging", icon: Sparkles },
  { id: "prompt", label: "Prompt Guidance", icon: Brush },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const IMAGE_PRESET_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "preset", label: "Preset Identity", icon: Brush },
  { id: "style", label: "Style / Medium", icon: Sparkles },
  { id: "rendering", label: "Rendering Notes", icon: BookOpen },
  { id: "prompt", label: "Prompt Stack", icon: ImageIcon },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];
const SCENARIO_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "scenario", label: "Scenario Identity", icon: BookOpen },
  { id: "storyCircle", label: "Story Circle", icon: Sparkles },
  { id: "cast", label: "Cast & Requirements", icon: Users },
  { id: "middleware", label: "Middleware", icon: ShieldCheck },
  { id: "runtime", label: "Opening & Runtime", icon: MessageSquare },
  { id: "runtimeModules", label: "Runtime Modules", icon: Activity },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const NARRATOR_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "narrator", label: "Narrator Identity", icon: MessageSquare },
  { id: "modules", label: "Modules", icon: Sparkles },
  { id: "runtimeModules", label: "Runtime Modules", icon: Activity },
  { id: "guidance", label: "Guidance", icon: BookOpen },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const ROOM_TEMPLATE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "room", label: "Story Identity", icon: Castle },
  { id: "package", label: "Story Package", icon: Users },
  { id: "multiplayer", label: "Players & Turns", icon: User },
  { id: "opening", label: "Opening", icon: MessageSquare },
  { id: "runtime", label: "Runtime Guidance", icon: BookOpen },
  { id: "narrative", label: "Narrative Runtime", icon: GitBranch },
  { id: "runtimeModules", label: "Runtime Modules", icon: Activity },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const STORYLINE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "sequence", label: "Narrative Sequence", icon: Route },
  { id: "transitions", label: "Transitions & Triggers", icon: GitBranch },
  { id: "openWorld", label: "Open-World Interludes", icon: CloudSun },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const NPC_REGISTRY_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "entries", label: "People Entries", icon: Users },
  { id: "relationships", label: "Relationships", icon: GitBranch },
  { id: "knowledge", label: "Knowledge Rules", icon: ShieldCheck },
  { id: "aliases", label: "Aliases", icon: BookOpen },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const LOCATION_REGISTRY_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "entries", label: "Locations", icon: MapPin },
  { id: "connections", label: "Connections", icon: Route },
  { id: "presence", label: "People & Presence", icon: Users },
  { id: "weather", label: "Weather Scope", icon: CloudSun },
  { id: "runtime", label: "Runtime Rules", icon: ShieldCheck },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];
const MECHANICS_MODULE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "fields", label: "Mechanics Fields", icon: Activity },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const RULES_CODEX_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "codex", label: "Rules & Interpretation", icon: BookOpen },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const LORE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "document", label: "Lore Document", icon: BookOpen },
  { id: "preview", label: "Public Preview", icon: Eye },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const ACTOR_MECHANICS_PROFILE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "profile", label: "Actor Mechanics Profile", icon: Activity },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const STATS_POOLS_PROFILE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "statsPools", label: "Stats & Pools", icon: Activity },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const PROGRESSION_PROFILE_EDIT_SECTIONS = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "progression", label: "Progression", icon: Activity },
  { id: "publishing", label: "Publishing", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];
// Editor group grammar, ED1 (docs/plans/FABLE-GATE-2-STUDIO.md,
// ruling N1 option A): each type's flat section list regroups into
// at most five named groups, schema-as-data replacing a hand-built
// layout. Named grammar per the plan: Story / Cast & World / Runtime
// / Publishing (ROOM_TEMPLATE); Identity / Body & Behavior / Systems
// / Publishing (CHARACTER, PLAYER_CHARACTER); Place / Runtime /
// Publishing (LOCATION); Entries / Rules & Prompt / Publishing
// (every *_REGISTRY type). Default rule for every remaining type:
// Content / Systems / Publishing, Systems present only when the type
// carries a mechanics-flavored section.
const CHARACTER_SECTION_GROUPS = [
  { id: "identity", label: "Identity", sectionIds: ["overview", "identity", "appearance", "visualReferences"] },
  { id: "bodyBehavior", label: "Body & Behavior", sectionIds: ["body", "behavior"] },
  { id: "systems", label: "Systems", sectionIds: ["mechanicsProfile", "runtimeModules", "advanced"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const ROOM_TEMPLATE_SECTION_GROUPS = [
  { id: "story", label: "Story", sectionIds: ["overview", "room", "opening"] },
  { id: "castWorld", label: "Cast & World", sectionIds: ["package", "multiplayer"] },
  { id: "runtime", label: "Runtime", sectionIds: ["runtime", "narrative", "runtimeModules"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const LOCATION_SECTION_GROUPS = [
  { id: "place", label: "Place", sectionIds: ["overview", "location", "visual", "atmosphere", "prompt"] },
  { id: "runtime", label: "Runtime", sectionIds: ["runtimeModules"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const NPC_REGISTRY_SECTION_GROUPS = [
  { id: "entries", label: "Entries", sectionIds: ["overview", "entries", "aliases"] },
  { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["relationships", "knowledge"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const ITEM_REGISTRY_SECTION_GROUPS = [
  { id: "entries", label: "Entries", sectionIds: ["overview", "entries", "media"] },
  { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["associations", "tracking", "prompt"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const LOCATION_REGISTRY_SECTION_GROUPS = [
  { id: "entries", label: "Entries", sectionIds: ["overview", "entries", "presence"] },
  { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["connections", "weather", "runtime"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const STRUCTURED_REGISTRY_SECTION_GROUPS = [
  { id: "entries", label: "Entries", sectionIds: ["overview", "entries", "review"] },
  { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["relationships", "rules", "prompt"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const OUTFIT_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "outfit", "garment", "materials", "prompt"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const WARDROBE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "entries", "rules"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const POSE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "pose", "bodyPosition", "staging", "prompt"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const IMAGE_PRESET_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "preset", "style", "rendering", "prompt"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const SCENARIO_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "scenario", "storyCircle", "cast", "middleware", "runtime"] },
  { id: "systems", label: "Systems", sectionIds: ["runtimeModules"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const NARRATOR_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "narrator", "guidance"] },
  { id: "systems", label: "Systems", sectionIds: ["modules", "runtimeModules"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const STORYLINE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "sequence", "transitions", "openWorld"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const CHARACTER_TEMPLATE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "template", "identity", "appearance", "body", "behavior"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const MECHANICS_MODULE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview"] },
  { id: "systems", label: "Systems", sectionIds: ["fields"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const RULES_CODEX_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "codex"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const LORE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview", "document", "preview"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const ACTOR_MECHANICS_PROFILE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview"] },
  { id: "systems", label: "Systems", sectionIds: ["profile"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const STATS_POOLS_PROFILE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview"] },
  { id: "systems", label: "Systems", sectionIds: ["statsPools"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const PROGRESSION_PROFILE_SECTION_GROUPS = [
  { id: "content", label: "Content", sectionIds: ["overview"] },
  { id: "systems", label: "Systems", sectionIds: ["progression"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const CREATION_TYPE_SECTION_GROUPS = {
  CHARACTER: CHARACTER_SECTION_GROUPS,
  PLAYER_CHARACTER: CHARACTER_SECTION_GROUPS,
  ROOM_TEMPLATE: ROOM_TEMPLATE_SECTION_GROUPS,
  LOCATION: LOCATION_SECTION_GROUPS,
  NPC_REGISTRY: NPC_REGISTRY_SECTION_GROUPS,
  ITEM_REGISTRY: ITEM_REGISTRY_SECTION_GROUPS,
  LOCATION_REGISTRY: LOCATION_REGISTRY_SECTION_GROUPS,
  FACTION_REGISTRY: STRUCTURED_REGISTRY_SECTION_GROUPS,
  ORGANIZATION_REGISTRY: STRUCTURED_REGISTRY_SECTION_GROUPS,
  EVENT_REGISTRY: STRUCTURED_REGISTRY_SECTION_GROUPS,
  QUEST_REGISTRY: STRUCTURED_REGISTRY_SECTION_GROUPS,
  OUTFIT: OUTFIT_SECTION_GROUPS,
  WARDROBE: WARDROBE_SECTION_GROUPS,
  POSE: POSE_SECTION_GROUPS,
  IMAGE_PRESET: IMAGE_PRESET_SECTION_GROUPS,
  SCENARIO: SCENARIO_SECTION_GROUPS,
  NARRATOR: NARRATOR_SECTION_GROUPS,
  STORYLINE: STORYLINE_SECTION_GROUPS,
  CHARACTER_TEMPLATE: CHARACTER_TEMPLATE_SECTION_GROUPS,
  MECHANICS_MODULE: MECHANICS_MODULE_SECTION_GROUPS,
  RULES_CODEX: RULES_CODEX_SECTION_GROUPS,
  LORE: LORE_SECTION_GROUPS,
  ACTOR_MECHANICS_PROFILE: ACTOR_MECHANICS_PROFILE_SECTION_GROUPS,
  STATS_POOLS_PROFILE: STATS_POOLS_PROFILE_SECTION_GROUPS,
  PROGRESSION_PROFILE: PROGRESSION_PROFILE_SECTION_GROUPS,
};

// Registry-as-data, ED1: replaces the nested ternary
// (`resolveCreationEditSections`) in creation-edit-shell/
// useCreationEditShellViewModel.js. Every type that had its own arm
// keeps its own array unchanged; PLAYER_CHARACTER and any unlisted
// type still fall through to `sections` (CHARACTER_EDIT_SECTIONS),
// matching the ternary's own final default exactly.
const CREATION_TYPE_SECTIONS = {
  PROGRESSION_PROFILE: PROGRESSION_PROFILE_EDIT_SECTIONS,
  STATS_POOLS_PROFILE: STATS_POOLS_PROFILE_EDIT_SECTIONS,
  ACTOR_MECHANICS_PROFILE: ACTOR_MECHANICS_PROFILE_EDIT_SECTIONS,
  LORE: LORE_EDIT_SECTIONS,
  RULES_CODEX: RULES_CODEX_EDIT_SECTIONS,
  MECHANICS_MODULE: MECHANICS_MODULE_EDIT_SECTIONS,
  LOCATION_REGISTRY: LOCATION_REGISTRY_EDIT_SECTIONS,
  FACTION_REGISTRY: STRUCTURED_REGISTRY_EDIT_SECTIONS,
  ORGANIZATION_REGISTRY: STRUCTURED_REGISTRY_EDIT_SECTIONS,
  EVENT_REGISTRY: STRUCTURED_REGISTRY_EDIT_SECTIONS,
  QUEST_REGISTRY: STRUCTURED_REGISTRY_EDIT_SECTIONS,
  NPC_REGISTRY: NPC_REGISTRY_EDIT_SECTIONS,
  ITEM_REGISTRY: ITEM_REGISTRY_EDIT_SECTIONS,
  CHARACTER_TEMPLATE: CHARACTER_TEMPLATE_EDIT_SECTIONS,
  STORYLINE: STORYLINE_EDIT_SECTIONS,
  ROOM_TEMPLATE: ROOM_TEMPLATE_EDIT_SECTIONS,
  NARRATOR: NARRATOR_EDIT_SECTIONS,
  SCENARIO: SCENARIO_EDIT_SECTIONS,
  OUTFIT: OUTFIT_EDIT_SECTIONS,
  WARDROBE: WARDROBE_EDIT_SECTIONS,
  LOCATION: LOCATION_EDIT_SECTIONS,
  POSE: POSE_EDIT_SECTIONS,
  IMAGE_PRESET: IMAGE_PRESET_EDIT_SECTIONS,
};

// ED1B page grammar (docs/plans/ED1B-EDITOR-PAGE-SPEC.md section 5),
// additive alongside the ED1 tab grammar above (which the legacy
// consumers may still read): one scrolling document per creation.
// The FIRST group of each list is the open essentials group (the
// quick-create fields, rendered without accordion chrome); the rest
// are collapsible in order; Publishing always closes. `hostsMedia`
// marks the group that hosts the media panel and the image-library
// link; per ruling N5 registries, profiles, mechanics modules, and
// the rules codex carry no media group. Every section id of the
// type's own section array appears in exactly one group.
const CHARACTER_EDITOR_PAGE_GROUPS = [
  { id: "identity", label: "Identity", sectionIds: ["overview", "identity", "appearance"] },
  { id: "bodyBehavior", label: "Body & Behavior", sectionIds: ["body", "behavior"] },
  { id: "media", label: "Artwork & Media", sectionIds: ["visualReferences"], hostsMedia: true },
  { id: "systems", label: "Systems", sectionIds: ["mechanicsProfile", "runtimeModules", "advanced"] },
  { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
];

const CREATION_TYPE_EDITOR_PAGE_GROUPS = {
  CHARACTER: CHARACTER_EDITOR_PAGE_GROUPS,
  PLAYER_CHARACTER: CHARACTER_EDITOR_PAGE_GROUPS,
  ROOM_TEMPLATE: [
    { id: "story", label: "Story", sectionIds: ["overview", "room", "opening"] },
    { id: "castWorld", label: "Cast & World", sectionIds: ["package", "multiplayer"] },
    { id: "runtime", label: "Runtime", sectionIds: ["runtime", "narrative", "runtimeModules"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  LOCATION: [
    { id: "place", label: "Place", sectionIds: ["overview", "location", "visual"] },
    { id: "sceneGuidance", label: "Scene & Guidance", sectionIds: ["atmosphere", "prompt"] },
    { id: "runtime", label: "Runtime", sectionIds: ["runtimeModules"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  NPC_REGISTRY: [
    { id: "entries", label: "Entries", sectionIds: ["overview", "entries"] },
    { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["relationships", "knowledge", "aliases"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  ITEM_REGISTRY: [
    { id: "entries", label: "Entries", sectionIds: ["overview", "entries"] },
    { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["associations", "tracking", "prompt", "media"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  LOCATION_REGISTRY: [
    { id: "entries", label: "Entries", sectionIds: ["overview", "entries", "presence"] },
    { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["connections", "weather", "runtime"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  FACTION_REGISTRY: STRUCTURED_REGISTRY_PAGE_GROUPS(),
  ORGANIZATION_REGISTRY: STRUCTURED_REGISTRY_PAGE_GROUPS(),
  EVENT_REGISTRY: STRUCTURED_REGISTRY_PAGE_GROUPS(),
  QUEST_REGISTRY: STRUCTURED_REGISTRY_PAGE_GROUPS(),
  OUTFIT: [
    { id: "look", label: "Look", sectionIds: ["overview", "outfit", "garment"] },
    { id: "materialsGuidance", label: "Materials & Guidance", sectionIds: ["materials", "prompt"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  WARDROBE: [
    { id: "wardrobe", label: "Wardrobe", sectionIds: ["overview", "entries"] },
    { id: "rules", label: "Selection Rules", sectionIds: ["rules"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  POSE: [
    { id: "pose", label: "Pose", sectionIds: ["overview", "pose", "bodyPosition"] },
    { id: "stagingGuidance", label: "Staging & Guidance", sectionIds: ["staging", "prompt"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  IMAGE_PRESET: [
    { id: "preset", label: "Preset", sectionIds: ["overview", "preset", "style"] },
    { id: "renderingPrompt", label: "Rendering & Prompt", sectionIds: ["rendering", "prompt"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  SCENARIO: [
    { id: "scenario", label: "Scenario", sectionIds: ["overview", "scenario", "storyCircle"] },
    { id: "castRuntime", label: "Cast & Runtime", sectionIds: ["cast", "middleware", "runtime", "runtimeModules"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  NARRATOR: [
    { id: "narrator", label: "Narrator", sectionIds: ["overview", "narrator", "guidance"] },
    { id: "systems", label: "Systems", sectionIds: ["modules", "runtimeModules"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  STORYLINE: [
    { id: "storyline", label: "Storyline", sectionIds: ["overview", "sequence"] },
    { id: "flow", label: "Flow", sectionIds: ["transitions", "openWorld"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  CHARACTER_TEMPLATE: [
    { id: "template", label: "Template", sectionIds: ["overview", "template", "identity"] },
    { id: "defaults", label: "Defaults", sectionIds: ["appearance", "body", "behavior"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  MECHANICS_MODULE: [
    { id: "module", label: "Module", sectionIds: ["overview"] },
    { id: "systems", label: "Systems", sectionIds: ["fields"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  RULES_CODEX: [
    { id: "codex", label: "Codex", sectionIds: ["overview", "codex"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  LORE: [
    { id: "lore", label: "Lore", sectionIds: ["overview", "document"] },
    { id: "preview", label: "Public Preview", sectionIds: ["preview"] },
    { id: "media", label: "Artwork & Media", sectionIds: [], hostsMedia: true },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  ACTOR_MECHANICS_PROFILE: [
    { id: "profile", label: "Profile", sectionIds: ["overview"] },
    { id: "systems", label: "Systems", sectionIds: ["profile"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  STATS_POOLS_PROFILE: [
    { id: "profile", label: "Profile", sectionIds: ["overview"] },
    { id: "systems", label: "Systems", sectionIds: ["statsPools"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
  PROGRESSION_PROFILE: [
    { id: "profile", label: "Profile", sectionIds: ["overview"] },
    { id: "systems", label: "Systems", sectionIds: ["progression"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ],
};

// Shared structured-registry page grammar, one instance per type so
// no two types alias the same array object.
function STRUCTURED_REGISTRY_PAGE_GROUPS() {
  return [
    { id: "entries", label: "Entries", sectionIds: ["overview", "entries", "review"] },
    { id: "rulesPrompt", label: "Rules & Prompt", sectionIds: ["relationships", "rules", "prompt"] },
    { id: "publishing", label: "Publishing", sectionIds: ["publishing", "danger"] },
  ];
}

// ED1B resolver: unlisted types fall back to the Character grammar,
// matching resolveCreationEditSections's own default.
function resolveEditorPageGroups(creationType) {
  return (
    CREATION_TYPE_EDITOR_PAGE_GROUPS[creationType] ||
    CREATION_TYPE_EDITOR_PAGE_GROUPS.CHARACTER
  );
}

export {
  CHARACTER_EDIT_SECTIONS,
  OUTFIT_EDIT_SECTIONS,
  VISUAL_ASSET_EDIT_SECTIONS,
  VISUAL_INGREDIENT_TYPES,
  LOCATION_EDIT_SECTIONS,
  POSE_EDIT_SECTIONS,
  IMAGE_PRESET_EDIT_SECTIONS,
  SCENARIO_EDIT_SECTIONS,
  NARRATOR_EDIT_SECTIONS,
  ROOM_TEMPLATE_EDIT_SECTIONS,
  STORYLINE_EDIT_SECTIONS,
  CHARACTER_TEMPLATE_EDIT_SECTIONS,
  NPC_REGISTRY_EDIT_SECTIONS,
  ITEM_REGISTRY_EDIT_SECTIONS,
  STRUCTURED_REGISTRY_EDIT_SECTIONS,
  LOCATION_REGISTRY_EDIT_SECTIONS,
  WARDROBE_EDIT_SECTIONS,
  MECHANICS_MODULE_EDIT_SECTIONS,
  RULES_CODEX_EDIT_SECTIONS,
  LORE_EDIT_SECTIONS,
  ACTOR_MECHANICS_PROFILE_EDIT_SECTIONS,
  STATS_POOLS_PROFILE_EDIT_SECTIONS,
  PROGRESSION_PROFILE_EDIT_SECTIONS,
  sections,
  tabs,
  typeMeta,
  CREATION_TYPE_SECTIONS,
  CREATION_TYPE_SECTION_GROUPS,
  CREATION_TYPE_EDITOR_PAGE_GROUPS,
  resolveEditorPageGroups,
};