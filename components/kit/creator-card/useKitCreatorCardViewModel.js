function toCallback(value) {
  return typeof value === "function" ? value : null;
}

function toStatValue(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toThumbnails(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((thumb) => thumb && typeof thumb.id === "string" && typeof thumb.imageSrc === "string")
    .slice(0, 3)
    .map((thumb) => ({
      id: thumb.id,
      imageSrc: thumb.imageSrc,
      alt: typeof thumb.alt === "string" ? thumb.alt : "",
    }));
}

export function useKitCreatorCardViewModel(props) {
  return {
    handle: typeof props?.handle === "string" ? props.handle : "",
    avatarSrc: typeof props?.avatarSrc === "string" ? props.avatarSrc : null,
    stats: {
      followers: toStatValue(props?.stats?.followers),
      plays: toStatValue(props?.stats?.plays),
      works: toStatValue(props?.stats?.works),
    },
    thumbnails: toThumbnails(props?.thumbnails),
    isFollowing: Boolean(props?.isFollowing),
    onThumbnailOpen: toCallback(props?.onThumbnailOpen),
    onFollow: toCallback(props?.onFollow),
    onViewProfile: toCallback(props?.onViewProfile),
  };
}
