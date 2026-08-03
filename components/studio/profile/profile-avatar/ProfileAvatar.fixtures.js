const previewAvatarSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#20180f" />
        <stop offset="1" stop-color="#8d6f35" />
      </linearGradient>
    </defs>
    <rect width="240" height="240" fill="url(#g)" />
    <circle cx="120" cy="90" r="44" fill="#d7bd8b" />
    <path d="M42 230c8-58 36-86 78-86s70 28 78 86" fill="#d7bd8b" />
  </svg>
`);

export const profileAvatarImageFixture = {
  displayName: "Aria Vale",
  avatarUrl: `data:image/svg+xml,${previewAvatarSvg}`,
  size: "lg",
};

export const profileAvatarLargeInitialFixture = {
  displayName: "Nicholas",
  avatarUrl: null,
  size: "lg",
};

export const profileAvatarMediumInitialFixture = {
  displayName: "Crestfallen Author",
  avatarUrl: null,
  size: "md",
};

export const profileAvatarSmallInitialFixture = {
  displayName: "Mira",
  avatarUrl: null,
  size: "sm",
};

export const profileAvatarEmptyNameFixture = {
  displayName: "",
  avatarUrl: null,
  size: "md",
};

export const profileAvatarLongNameFixture = {
  displayName:
    "A Deliberately Long Creator Display Name Used for Accessibility Stress Testing",
  avatarUrl: null,
  size: "lg",
};
