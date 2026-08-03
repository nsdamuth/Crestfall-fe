const FEATURED_SLOT_KEYS = ["primary", "alt1", "alt2", "alt3"];

const DEFAULT_NON_CHAT_CONTEXT = Object.freeze({
  title: "Image Studio Ingredient",
  description:
    "This creation is a reusable image-generation ingredient. It can provide prompt guidance, design references, preview media, and future Image Studio selection behavior, but it is not a chat character.",
});

const STORYLINE_NON_CHAT_CONTEXT = Object.freeze({
  title: "Storyline Media",
  description:
    "Featured images represent this Storyline in Studio, profiles, and discovery. They are presentation media only and are not used as Image Studio ingredients.",
});

function getNonChatContext(form = {}) {
  const creationType = String(form?.type || "").trim().toUpperCase();

  return creationType === "STORYLINE"
    ? STORYLINE_NON_CHAT_CONTEXT
    : DEFAULT_NON_CHAT_CONTEXT;
}

function normalizeFeaturedSlot(media, index, activeMediaSlot) {
  return {
    id: String(media?.id || `featured-slot-${index + 1}`),
    label: String(media?.label || `Slot ${index + 1}`),
    imageUrl: media?.imageUrl ? String(media.imageUrl) : null,
    index,
    isActive: index === activeMediaSlot,
  };
}

export function useCreationEditMediaPanelViewModel({
  creationId,
  form = {},
  activeMediaSlot = 0,
  setActiveMediaSlot,
  supportsChatMedia = true,
  onReplaceSlot,
} = {}) {
  const normalizedActiveMediaSlot = Number.isInteger(activeMediaSlot)
    ? activeMediaSlot
    : 0;
  const featuredSlots = Array.isArray(form?.featuredMedia)
    ? form.featuredMedia.map((media, index) =>
        normalizeFeaturedSlot(media, index, normalizedActiveMediaSlot)
      )
    : [];
  const activeMedia = featuredSlots[normalizedActiveMediaSlot] || null;
  const activeSlotKey =
    FEATURED_SLOT_KEYS[normalizedActiveMediaSlot] || "primary";
  const encodedCreationId = creationId ? encodeURIComponent(creationId) : "";
  const imageLibraryHref = encodedCreationId
    ? `/studio/my-creations/${encodedCreationId}/image-library?slot=${activeSlotKey}`
    : "#";
  const creationTitle = form?.title ? String(form.title) : "";
  const nonChatContext = getNonChatContext(form);

  return {
    creationTitle,
    fallbackInitial:
      (creationTitle || "C").slice(0, 1).toUpperCase() || "C",
    activeMedia,
    featuredSlots,
    imageLibraryHref,
    supportsChatMedia: Boolean(supportsChatMedia),
    nonChatContextTitle: nonChatContext.title,
    nonChatContextDescription: nonChatContext.description,
    onSelectFeaturedSlot: (slotIndex) => {
      if (!Number.isInteger(slotIndex)) {
        return;
      }

      setActiveMediaSlot?.(slotIndex);
    },
    onReplaceActiveSlot: () => onReplaceSlot?.(activeSlotKey),
  };
}
