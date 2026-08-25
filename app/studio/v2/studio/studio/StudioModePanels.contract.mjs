export const FULL_STUDIO_CATEGORY_PRESENTATION = Object.freeze({
  CHARACTERS_VISUALS: Object.freeze({
    slug: "characters",
    heroImage: "/tmp-mockup-images/canon-character-images/Lux.png",
  }),
  STORIES_SESSIONS: Object.freeze({
    slug: "stories",
    heroImage: "/assets/covers/crestfall-scrolls-cover.png",
  }),
  WORLDS_CONTINUITY: Object.freeze({
    slug: "worlds",
    heroImage: "/assets/covers/crestfall-compass-cover.png",
  }),
  RULES_MECHANICS: Object.freeze({
    slug: "mechanics",
    heroImage: "/assets/covers/crestfall-sundial-cover.png",
  }),
  TEMPLATES_GENERATION: Object.freeze({
    slug: "templates",
    heroImage: "/assets/covers/crestfall-drawings-cover.png",
  }),
});

export function getFullStudioCategoryPresentation(sectionId = "") {
  return FULL_STUDIO_CATEGORY_PRESENTATION[String(sectionId || "").trim()] || null;
}

export function getFullStudioSectionSlug(sectionId = "") {
  return getFullStudioCategoryPresentation(sectionId)?.slug || "";
}

export function findFullStudioSectionBySlug(sections = [], slug = "") {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) return null;

  return (
    sections.find(
      (section) => getFullStudioSectionSlug(section?.id) === normalizedSlug
    ) || null
  );
}
