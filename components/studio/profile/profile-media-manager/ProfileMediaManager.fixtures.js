const baseAvatar = {
  displayName: "Aria Vale",
  avatarUrl: null,
  size: "md",
  title: "Active Profile Picture",
  description:
    "One active avatar at a time. Later selected from your media library.",
  actionLabel: "Choose Soon",
};

const baseBanner = {
  bannerUrl: null,
  bannerTitle: "Profile Banner",
  compact: true,
  title: "Active Profile Banner",
  description:
    "One active banner at a time. Best for landscape scenes, creator branding, or profile mood.",
  actionLabel: "Choose Soon",
};

const baseFixture = {
  eyebrow: "Profile Media",
  description:
    "Profile images will later be selected from internally generated media. No external file uploads.",
  avatar: baseAvatar,
  banner: baseBanner,
};

export const profileMediaManagerDefaultFixture = baseFixture;

export const profileMediaManagerUsernameFixture = {
  ...baseFixture,
  avatar: {
    ...baseAvatar,
    displayName: "crestfallen_1b8aa42b",
  },
};

export const profileMediaManagerGenericFallbackFixture = {
  ...baseFixture,
  avatar: {
    ...baseAvatar,
    displayName: "Crestfall Creator",
  },
};

export const profileMediaManagerLongContentFixture = {
  eyebrow: "Creator Profile Media and Internally Generated Visual Identity",
  description:
    "A deliberately long description used to verify that the bounded profile-media panel continues to wrap cleanly without changing its current future-facing media-selection behavior.",
  avatar: {
    ...baseAvatar,
    displayName:
      "A Creator With A Deliberately Long Public Display Name For Responsive Testing",
    title: "Active Profile Picture Selected From the Creator Media Library",
    description:
      "Only one generated image may become the active profile picture at a time once the future selection workflow is available.",
  },
  banner: {
    ...baseBanner,
    title: "Active Profile Banner Selected From Generated Landscape Media",
    description:
      "A longer banner description verifies wrapping beside the disabled future action at narrow and desktop widths.",
  },
};

export const profileMediaManagerMinimalCopyFixture = {
  eyebrow: "Profile Media",
  description: "",
  avatar: {
    ...baseAvatar,
    description: "",
  },
  banner: {
    ...baseBanner,
    description: "",
  },
};
