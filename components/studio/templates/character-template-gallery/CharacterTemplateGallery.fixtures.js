const baseSidebar = {
  createTemplateHref: "#create-template",
  createTemplateLabel: "Create Template",
  sidebarEyebrow: "Template Library",
  sidebarTitle: "Reusable Archetypes",
  sidebarBody:
    "Later, templates can be built-in, private, public, duplicated, or generated from existing characters.",
  useTemplateLabel: "Use Template Soon",
  duplicateLabel: "Duplicate Soon",
};

export const characterTemplateGalleryDefaultFixture = {
  ...baseSidebar,
  templates: [
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
  ],
};

export const characterTemplateGallerySingleFixture = {
  ...baseSidebar,
  templates: [
    {
      id: "oracle",
      title: "Oracle",
      category: "Creator Template",
      description:
        "A single reusable archetype for prophecy, uncertainty, symbolic language, and difficult choices.",
    },
  ],
};

export const characterTemplateGalleryMissingOptionalCopyFixture = {
  ...baseSidebar,
  sidebarEyebrow: "",
  sidebarBody: "",
  templates: [
    {
      id: "untitled",
      title: "",
      category: "",
      description: "",
    },
  ],
};

export const characterTemplateGalleryNoCreateRouteFixture = {
  ...baseSidebar,
  createTemplateHref: "",
  templates: characterTemplateGalleryDefaultFixture.templates.slice(0, 2),
};

export const characterTemplateGalleryEmptyFixture = {
  ...baseSidebar,
  templates: [],
};

export const characterTemplateGalleryLongContentFixture = {
  ...baseSidebar,
  sidebarEyebrow: "A Deliberately Long Template Library Classification",
  sidebarTitle:
    "Reusable Character Archetypes for Complicated Multi-Scene Storytelling",
  sidebarBody:
    "This extended sidebar copy verifies that the sticky supporting panel grows naturally and remains readable when future template-library guidance needs more explanation than the current placeholder content.",
  templates: [
    {
      id: "long-template",
      title:
        "A Deliberately Long Character Template Title That Must Wrap Without Breaking the Card",
      category: "Community-Contributed Experimental Archetype",
      description:
        "This long description verifies readable line height, natural card growth, disabled-action alignment, and responsive wrapping across the two-column and single-column gallery layouts.",
    },
    {
      id: "second-long-template",
      title: "The Reluctant Archivist of an Impossible Chronicle",
      category: "Creator Template",
      description:
        "A second long fixture ensures neighboring cards can grow independently without compromising the responsive grid or the sidebar relationship.",
    },
  ],
};
