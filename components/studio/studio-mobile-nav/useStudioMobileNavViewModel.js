"use client";

import { useState } from "react";

export const STUDIO_MOBILE_NAV_DISCORD_URL =
  "https://discord.com/channels/1482041132874727579/1482041133700878529";

export const STUDIO_MOBILE_NAV_COPY = Object.freeze({
  drawerEyebrow: "Crestfall",
  drawerTitle: "Studio",
  communityLinksLabel: "Community Links",
  signedInLabel: "Signed in",
  logoutLabel: "Log out",
  closeMenuAriaLabel: "Close menu",
  closeOverlayAriaLabel: "Close menu overlay",
  accountFallbackAriaLabel: "Account",
});

export const STUDIO_MOBILE_NAV_PRIMARY_LINKS = Object.freeze([
  Object.freeze({ label: "Lore Archive", href: "/", iconKey: "bookOpen", variant: "return" }),
  Object.freeze({ label: "Studio Home", href: "/studio", iconKey: "home" }),
  Object.freeze({ label: "Create", href: "/studio/create", iconKey: "user" }),
  Object.freeze({ label: "Games", href: "/studio/games", iconKey: "sparkles" }),
  Object.freeze({ label: "Storys", href: "/studio/story-rooms", iconKey: "messagesSquare" }),
  Object.freeze({ label: "Image Studio", href: "/studio/image-studio", iconKey: "image" }),
  Object.freeze({ label: "Official Characters", href: "/studio/official-characters", iconKey: "users" }),
  Object.freeze({ label: "Storylines", href: "/studio/storylines", iconKey: "scrollText" }),
  Object.freeze({ label: "My Creations", href: "/studio/my-creations", iconKey: "user" }),
  Object.freeze({ label: "Community", href: "/studio/community", iconKey: "compass" }),
]);


export const STUDIO_MOBILE_NAV_V2_PRIMARY_LINKS = Object.freeze([
  Object.freeze({ label: "Home", href: "/studio/v2/home", iconKey: "home" }),
  Object.freeze({ label: "Studio", href: "/studio", iconKey: "home" }),
  Object.freeze({ label: "Stories", href: "/studio/v2/stories", iconKey: "messagesSquare" }),
  Object.freeze({ label: "Adventures", href: "/studio/v2/adventures", iconKey: "scrollText" }),
  Object.freeze({ label: "Images", href: "/studio/v2/images", iconKey: "image" }),
  Object.freeze({ label: "Vault", href: "/studio/v2/vault", iconKey: "castle" }),
  Object.freeze({ label: "Community", href: "/studio/v2/community", iconKey: "compass" }),
  Object.freeze({ label: "Creators", href: "/studio/v2/creators", iconKey: "users" }),
  Object.freeze({ label: "Lore", href: "/studio/v2/lore", iconKey: "bookOpen" }),
]);

export const STUDIO_MOBILE_NAV_V2_BOTTOM_LINKS = Object.freeze([
  Object.freeze({ label: "Home", href: "/studio/v2/home", iconKey: "home" }),
  Object.freeze({ label: "Stories", href: "/studio/v2/stories", iconKey: "messagesSquare" }),
  Object.freeze({ label: "Studio", href: "/studio", iconKey: "home" }),
  Object.freeze({ label: "Images", href: "/studio/v2/images", iconKey: "image" }),
  Object.freeze({ label: "Vault", href: "/studio/v2/vault", iconKey: "castle" }),
]);

export const STUDIO_MOBILE_NAV_UTILITY_LINKS = Object.freeze([
  Object.freeze({ label: "Feedback & Updates", href: "/studio/feedback", iconKey: "megaphone" }),
  Object.freeze({ label: "Account", href: "/studio/account", iconKey: "castle" }),
  Object.freeze({ label: "Terms & Policies", href: "/terms", iconKey: "shieldCheck" }),
]);

export const STUDIO_MOBILE_NAV_SOCIAL_LINKS = Object.freeze([
  Object.freeze({
    label: "Discord",
    href: STUDIO_MOBILE_NAV_DISCORD_URL,
    iconKey: "messagesSquare",
  }),
]);

export const STUDIO_MOBILE_NAV_BOTTOM_LINKS = Object.freeze([
  Object.freeze({ label: "Home", href: "/studio", iconKey: "home" }),
  Object.freeze({ label: "Games", href: "/studio/games", iconKey: "sparkles" }),
  Object.freeze({ label: "Rooms", href: "/studio/story-rooms", iconKey: "messagesSquare" }),
  Object.freeze({ label: "Images", href: "/studio/image-studio", iconKey: "image" }),
  Object.freeze({ label: "Characters", href: "/studio/official-characters", iconKey: "users" }),
]);

export function isStudioMobileNavPathActive(pathname = "", href = "") {
  return href === "/studio"
    ? pathname === "/studio"
    : pathname.startsWith(href);
}

// Account destination, RULED (FE polish closeout, item 7): the v2
// surface must never link into the legacy /studio/account shell.
// This drawer renders on every /studio/** route including v2 pages,
// so the Account destination depends on which surface is current.
export function getStudioMobileNavAccountHref(pathname = "") {
  return pathname === "/studio" || pathname.startsWith("/studio/v2") ||
    pathname.startsWith("/studio/story-rooms") ||
    pathname.startsWith("/studio/creations") ||
    pathname.startsWith("/studio/create") ||
    pathname.startsWith("/studio/feedback")
    ? "/studio/v2/account"
    : "/studio/account";
}

export function normalizeStudioMobileNavEmail(user = {}) {
  return typeof user?.email === "string" ? user.email : "";
}

function buildNavigationLinks(links, pathname) {
  return links.map((link) => ({
    ...link,
    isActive: isStudioMobileNavPathActive(pathname, link.href),
  }));
}

// Drawer open/closed is owned one level up, by StudioShell.jsx, since
// StudioTopBar's mobile hamburger (a separate LOOM package) must open
// the same drawer this package renders (8 Aug 2026, mobile nav restyle
// brief item 7). This ViewModel receives it as `open` / `onCloseMenu`
// rather than creating its own state.
export function useStudioMobileNavViewModel({
  user,
  pathname = "",
  open = false,
  onCloseMenu = () => {},
} = {}) {
  const [socialOpen, setSocialOpen] = useState(false);
  const signedInEmail = normalizeStudioMobileNavEmail(user);
  const v2Surface = pathname === "/studio" || pathname.startsWith("/studio/v2") ||
    pathname.startsWith("/studio/story-rooms") ||
    pathname.startsWith("/studio/creations") ||
    pathname.startsWith("/studio/create") ||
    pathname.startsWith("/studio/feedback");

  return {
    brandHref: v2Surface ? "/studio/v2/home" : "/studio",
    drawerEyebrow: STUDIO_MOBILE_NAV_COPY.drawerEyebrow,
    drawerTitle: STUDIO_MOBILE_NAV_COPY.drawerTitle,
    communityLinksLabel: STUDIO_MOBILE_NAV_COPY.communityLinksLabel,
    signedInLabel: STUDIO_MOBILE_NAV_COPY.signedInLabel,
    signedInEmail,
    logoutLabel: STUDIO_MOBILE_NAV_COPY.logoutLabel,
    logoutHref: "/logout",
    accountHref: getStudioMobileNavAccountHref(pathname),
    accountAriaLabel:
      signedInEmail || STUDIO_MOBILE_NAV_COPY.accountFallbackAriaLabel,
    closeMenuAriaLabel: STUDIO_MOBILE_NAV_COPY.closeMenuAriaLabel,
    closeOverlayAriaLabel: STUDIO_MOBILE_NAV_COPY.closeOverlayAriaLabel,
    open,
    socialOpen,
    primaryLinks: buildNavigationLinks(
      v2Surface ? STUDIO_MOBILE_NAV_V2_PRIMARY_LINKS : STUDIO_MOBILE_NAV_PRIMARY_LINKS,
      pathname
    ),
    utilityLinks: buildNavigationLinks(STUDIO_MOBILE_NAV_UTILITY_LINKS, pathname).map((link) =>
      link.label === "Account"
        ? {
            ...link,
            href: getStudioMobileNavAccountHref(pathname),
            isActive: isStudioMobileNavPathActive(pathname, getStudioMobileNavAccountHref(pathname)),
          }
        : link
    ),
    socialLinks: STUDIO_MOBILE_NAV_SOCIAL_LINKS,
    bottomLinks: buildNavigationLinks(
      v2Surface ? STUDIO_MOBILE_NAV_V2_BOTTOM_LINKS : STUDIO_MOBILE_NAV_BOTTOM_LINKS,
      pathname
    ),
    onCloseMenu,
    onToggleSocial: () => setSocialOpen((value) => !value),
    onNavigate: () => onCloseMenu(),
  };
}
