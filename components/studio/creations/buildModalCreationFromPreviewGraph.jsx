export default function buildModalCreationFromPreviewGraph({
  previewGraph,
  fallbackCreation,
  editHref,
  chatHref,
  imageHref,
  catalogueHref,
}) {
  const graphCreation = previewGraph?.creation || {};
  const graphCreator = previewGraph?.creator || {};

  return {
    ...fallbackCreation,
    ...graphCreation,

    // Preserve card/list media fields until preview API returns media.
    imageUrl: fallbackCreation.imageUrl,
    featuredMedia: fallbackCreation.featuredMedia,
    stats: fallbackCreation.stats,
    tags: fallbackCreation.tags,

    // Let existing CreationPreviewModal helpers read creator attribution.
    creatorUsername: graphCreator.username || fallbackCreation.creatorUsername,
    creatorHandle: graphCreator.handle || fallbackCreation.creatorHandle,
    creatorProfileHref:
      graphCreator.profileHref || fallbackCreation.creatorProfileHref,

    // Let existing CreationPreviewModal helpers read credits.
    connectedAssets:
      previewGraph?.connectedAssets || fallbackCreation.connectedAssets || [],
    credits: previewGraph?.credits || fallbackCreation.credits || [],

    editHref,
    chatHref,
    imageHref,
    catalogueHref,
    imageLibraryHref: catalogueHref,
  };
}
