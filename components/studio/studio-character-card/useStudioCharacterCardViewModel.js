function resolveImageSrc(character) {
  if (!character?.profileImage || !character?.assetBase) {
    return "";
  }

  return `${character.assetBase}/${character.profileImage}`;
}

export function getStudioCharacterCardViewProps({ character = null } = {}) {
  const title = character?.title || "";

  return {
    imageSrc: resolveImageSrc(character),
    imageAlt: title,
    title,
    eyebrow: character?.eyebrow || "",
    description:
      character?.cardText ||
      character?.subtitle ||
      "Official Crestfall character.",
    detailsHref: character?.slug || "#",
  };
}

export function useStudioCharacterCardViewModel(props = {}) {
  return getStudioCharacterCardViewProps(props);
}
