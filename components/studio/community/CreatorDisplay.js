export function getCreatorHandle(creator) {
  return (
    creator?.username ||
    creator?.handle ||
    "crestfallen_creator"
  );
}

export function formatCreatorDisplayName(handle) {
  const text = String(handle || "").trim();

  if (!text) return "Crestfall Creator";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getCreatorName(creator) {
  return formatCreatorDisplayName(getCreatorHandle(creator));
}

export function getCreatorProfileHref(creator) {
  return `/studio/profile/${encodeURIComponent(getCreatorHandle(creator))}`;
}