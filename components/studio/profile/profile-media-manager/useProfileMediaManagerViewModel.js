export function useProfileMediaManagerViewModel({ profile = null } = {}) {
  const displayName =
    profile?.display_name || profile?.username || "Crestfall Creator";

  return {
    eyebrow: "Profile Media",
    description:
      "Profile images will later be selected from internally generated media. No external file uploads.",
    avatar: {
      displayName,
      avatarUrl: null,
      size: "md",
      title: "Active Profile Picture",
      description:
        "One active avatar at a time. Later selected from your media library.",
      actionLabel: "Choose Soon",
    },
    banner: {
      bannerUrl: null,
      bannerTitle: "Profile Banner",
      compact: true,
      title: "Active Profile Banner",
      description:
        "One active banner at a time. Best for landscape scenes, creator branding, or profile mood.",
      actionLabel: "Choose Soon",
    },
  };
}
