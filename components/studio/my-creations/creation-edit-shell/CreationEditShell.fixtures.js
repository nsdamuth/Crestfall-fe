import {
  Activity,
  AlertTriangle,
  BookOpen,
  Eye,
  Image as ImageIcon,
  ShieldCheck,
  User,
} from "lucide-react";

export const creationEditShellFixtureSections = {
  playerCharacter: [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "identity", label: "Identity", icon: User },
    { id: "appearance", label: "Appearance", icon: ImageIcon },
    { id: "mechanicsProfile", label: "Mechanics Profile", icon: Activity },
    { id: "publishing", label: "Publishing", icon: ShieldCheck },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ],
  lore: [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "document", label: "Lore Document", icon: BookOpen },
    { id: "preview", label: "Public Preview", icon: Eye },
    { id: "publishing", label: "Publishing", icon: ShieldCheck },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ],
  mechanicsModule: [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "fields", label: "Mechanics Fields", icon: Activity },
    { id: "publishing", label: "Publishing", icon: ShieldCheck },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ],
};

export const creationEditShellFixtureStates = {
  playerCharacter: {
    creationId: "fixture-player-character",
    title: "Avery Vale",
    isTemplate: false,
    canSetDefaultPc: true,
    activeSection: "overview",
    activeSections: creationEditShellFixtureSections.playerCharacter,
    showMechanicsQuickNav: false,
  },
  lore: {
    creationId: "fixture-lore",
    title: "The Lantern Coast",
    isTemplate: false,
    canSetDefaultPc: false,
    activeSection: "document",
    activeSections: creationEditShellFixtureSections.lore,
    showMechanicsQuickNav: false,
  },
  mechanicsModule: {
    creationId: "fixture-mechanics-module",
    title: "Core Adventure Trackers",
    isTemplate: false,
    canSetDefaultPc: false,
    activeSection: "fields",
    activeSections: creationEditShellFixtureSections.mechanicsModule,
    showMechanicsQuickNav: true,
  },
};
