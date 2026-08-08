const primaryLinks = Object.freeze([
  Object.freeze({
    label: "Studio Home",
    href: "/studio",
    iconKey: "home",
    isActive: false,
  }),
  Object.freeze({
    label: "Create",
    href: "/studio/create",
    iconKey: "user",
    isActive: false,
  }),
  Object.freeze({
    label: "Games",
    href: "/studio/games",
    iconKey: "sparkles",
    isActive: false,
  }),
  Object.freeze({
    label: "Stories",
    href: "/studio/story-rooms",
    iconKey: "messagesSquare",
    isActive: false,
  }),
  Object.freeze({
    label: "Image Studio",
    href: "/studio/image-studio",
    iconKey: "image",
    isActive: false,
  }),
  Object.freeze({
    label: "Official Characters",
    href: "/studio/official-characters",
    iconKey: "users",
    isActive: false,
  }),
  Object.freeze({
    label: "Storylines",
    href: "/studio/storylines",
    iconKey: "scrollText",
    isActive: false,
  }),
  Object.freeze({
    label: "My Creations",
    href: "/studio/my-creations",
    iconKey: "user",
    isActive: true,
  }),
  Object.freeze({
    label: "Community",
    href: "/studio/community",
    iconKey: "compass",
    isActive: false,
  }),
  Object.freeze({
    label: "Lore",
    href: "/",
    iconKey: "bookOpen",
    variant: "return",
    isActive: true,
  }),
]);

const utilityLinks = Object.freeze([
  Object.freeze({
    label: "Feedback & Updates",
    href: "/studio/feedback",
    iconKey: "megaphone",
    isActive: false,
  }),
  Object.freeze({
    label: "Account",
    href: "/studio/account",
    iconKey: "castle",
    isActive: false,
  }),
  Object.freeze({
    label: "Terms & Policies",
    href: "/terms",
    iconKey: "shieldCheck",
    isActive: false,
  }),
]);

const socialLinks = Object.freeze([
  Object.freeze({
    label: "Discord",
    href: "https://discord.com/channels/1482041132874727579/1482041133700878529",
    iconKey: "messagesSquare",
  }),
]);

const baseFixture = Object.freeze({
  brandEyebrow: "Crestfall",
  brandTitle: "Studio",
  brandHref: "/studio",
  communityLinksLabel: "Community Links",
  signedInLabel: "Signed in",
  signedInEmail: "creator@example.com",
  logoutLabel: "Log out",
  logoutHref: "/logout",
  collapseAriaLabel: "Collapse sidebar",
  collapsed: false,
  socialOpen: false,
  primaryLinks,
  utilityLinks,
  socialLinks,
});

export const studioSidebarExpandedFixture = baseFixture;

export const studioSidebarSocialOpenFixture = Object.freeze({
  ...baseFixture,
  socialOpen: true,
});

export const studioSidebarCollapsedFixture = Object.freeze({
  ...baseFixture,
  collapseAriaLabel: "Expand sidebar",
  collapsed: true,
  socialOpen: false,
});
