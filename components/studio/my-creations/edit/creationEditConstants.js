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
};