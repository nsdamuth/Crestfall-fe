const primaryLinks = Object.freeze([
  Object.freeze({ label: "Lore Archive", href: "/", iconKey: "bookOpen", variant: "return", isActive: false }),
  Object.freeze({ label: "Studio Home", href: "/studio", iconKey: "home", isActive: false }),
  Object.freeze({ label: "Create", href: "/studio/create", iconKey: "user", isActive: false }),
  Object.freeze({ label: "Games", href: "/studio/games", iconKey: "sparkles", isActive: false }),
  Object.freeze({ label: "Storys", href: "/studio/story-rooms", iconKey: "messagesSquare", isActive: false }),
  Object.freeze({ label: "Image Studio", href: "/studio/image-studio", iconKey: "image", isActive: false }),
  Object.freeze({ label: "Official Characters", href: "/studio/official-characters", iconKey: "users", isActive: false }),
  Object.freeze({ label: "Storylines", href: "/studio/storylines", iconKey: "scrollText", isActive: false }),
  Object.freeze({ label: "My Creations", href: "/studio/my-creations", iconKey: "user", isActive: true }),
  Object.freeze({ label: "Community", href: "/studio/community", iconKey: "compass", isActive: false }),
]);

const utilityLinks = Object.freeze([
  Object.freeze({ label: "Feedback & Updates", href: "/studio/feedback", iconKey: "megaphone", isActive: false }),
  Object.freeze({ label: "Account", href: "/studio/account", iconKey: "castle", isActive: false }),
  Object.freeze({ label: "Terms & Policies", href: "/terms", iconKey: "shieldCheck", isActive: false }),
]);

const socialLinks = Object.freeze([
  Object.freeze({
    label: "Discord",
    href: "https://discord.com/channels/1482041132874727579/1482041133700878529",
    iconKey: "messagesSquare",
  }),
]);

const bottomLinks = Object.freeze([
  Object.freeze({ label: "Home", href: "/studio", iconKey: "home", isActive: false }),
  Object.freeze({ label: "Games", href: "/studio/games", iconKey: "sparkles", isActive: false }),
  Object.freeze({ label: "Rooms", href: "/studio/story-rooms", iconKey: "messagesSquare", isActive: false }),
  Object.freeze({ label: "Images", href: "/studio/image-studio", iconKey: "image", isActive: false }),
  Object.freeze({ label: "Characters", href: "/studio/official-characters", iconKey: "users", isActive: false }),
]);

const baseFixture = Object.freeze({
  brandLabel: "Crestfall",
  brandHref: "/studio",
  drawerEyebrow: "Crestfall",
  drawerTitle: "Studio",
  communityLinksLabel: "Community Links",
  signedInLabel: "Signed in",
  signedInEmail: "creator@example.com",
  logoutLabel: "Log out",
  logoutHref: "/logout",
  accountHref: "/studio/account",
  accountAriaLabel: "creator@example.com",
  openMenuAriaLabel: "Open menu",
  closeMenuAriaLabel: "Close menu",
  closeOverlayAriaLabel: "Close menu overlay",
  open: false,
  socialOpen: false,
  primaryLinks,
  utilityLinks,
  socialLinks,
  bottomLinks,
});

export const studioMobileNavClosedFixture = baseFixture;

export const studioMobileNavDrawerOpenFixture = Object.freeze({
  ...baseFixture,
  open: true,
});

export const studioMobileNavSocialOpenFixture = Object.freeze({
  ...baseFixture,
  open: true,
  socialOpen: true,
});

export const studioMobileNavActiveDockTileFixture = Object.freeze({
  ...baseFixture,
  bottomLinks: Object.freeze(
    bottomLinks.map((link) =>
      link.href === "/studio/games"
        ? Object.freeze({ ...link, isActive: true })
        : link,
    ),
  ),
});
