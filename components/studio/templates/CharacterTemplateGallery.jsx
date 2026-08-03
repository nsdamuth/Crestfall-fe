import Link from "next/link";

import CharacterTemplateGalleryView from "./character-template-gallery/CharacterTemplateGallery.view";

const BUILT_IN_CHARACTER_TEMPLATES = [
  {
    id: "hero",
    title: "Hero",
    category: "Built-In",
    description:
      "Classic protagonist structure with courage, flaws, and call-to-action hooks.",
  },
  {
    id: "princess",
    title: "Princess",
    category: "Built-In",
    description:
      "Courtly identity, status pressure, elegance, obligations, and relationship hooks.",
  },
  {
    id: "warrior",
    title: "Warrior",
    category: "Built-In",
    description:
      "Combat-capable character with discipline, threat profile, and honor structure.",
  },
  {
    id: "badass-biker",
    title: "Badass Biker",
    category: "Built-In",
    description:
      "Modern rebel archetype with crew ties, attitude, loyalty, and street pressure.",
  },
];

export default function CharacterTemplateGallery() {
  return (
    <CharacterTemplateGalleryView
      templates={BUILT_IN_CHARACTER_TEMPLATES}
      createTemplateHref="/studio/create/character-template"
      createTemplateLabel="Create Template"
      sidebarEyebrow="Template Library"
      sidebarTitle="Reusable Archetypes"
      sidebarBody="Later, templates can be built-in, private, public, duplicated, or generated from existing characters."
      useTemplateLabel="Use Template Soon"
      duplicateLabel="Duplicate Soon"
      LinkComponent={Link}
    />
  );
}
