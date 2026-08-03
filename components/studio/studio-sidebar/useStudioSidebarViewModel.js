"use client";

import { useState } from "react";

export const STUDIO_SIDEBAR_DISCORD_URL =
  "https://discord.com/channels/1482041132874727579/1482041133700878529";

export const STUDIO_SIDEBAR_COPY = Object.freeze({
  brandEyebrow: "Crestfall",
  brandTitle: "Studio",
  communityLinksLabel: "Community Links",
  signedInLabel: "Signed in",
  logoutLabel: "Log out",
});

export const STUDIO_SIDEBAR_PRIMARY_LINKS = Object.freeze([
  Object.freeze({
    label: "Lore Archive",
    href: "/",
    iconKey: "bookOpen",
    variant: "return",
  }),
  Object.freeze({ label: "Studio Home", href: "/studio", iconKey: "home" }),
  Object.freeze({ label: "Create", href: "/studio/create", iconKey: "user" }),
  Object.freeze({ label: "Games", href: "/studio/games", iconKey: "sparkles" }),
  Object.freeze({
    label: "Stories",
    href: "/studio/story-rooms",
    iconKey: "messagesSquare",
  }),
  Object.freeze({
    label: "Image Studio",
    href: "/studio/image-studio",
    iconKey: "image",
  }),
  Object.freeze({
    label: "Official Characters",
    href: "/studio/official-characters",
    iconKey: "users",
  }),
  Object.freeze({
    label: "Storylines",
    href: "/studio/storylines",
    iconKey: "scrollText",
  }),
  Object.freeze({
    label: "My Creations",
    href: "/studio/my-creations",
    iconKey: "user",
  }),
  Object.freeze({
    label: "Community",
    href: "/studio/community",
    iconKey: "compass",
  }),
]);

export const STUDIO_SIDEBAR_UTILITY_LINKS = Object.freeze([
  Object.freeze({
    label: "Feedback & Updates",
    href: "/studio/feedback",
    iconKey: "megaphone",
  }),
  Object.freeze({ label: "Account", href: "/studio/account", iconKey: "castle" }),
  Object.freeze({
    label: "Terms & Policies",
    href: "/terms",
    iconKey: "shieldCheck",
  }),
]);

export const STUDIO_SIDEBAR_SOCIAL_LINKS = Object.freeze([
  Object.freeze({
    label: "Discord",
    href: STUDIO_SIDEBAR_DISCORD_URL,
    iconKey: "messagesSquare",
  }),
]);

export function isStudioSidebarPathActive(pathname = "", href = "") {
  return href === "/studio"
    ? pathname === "/studio"
    : pathname.startsWith(href);
}

export function normalizeStudioSidebarEmail(user = {}) {
  return typeof user?.email === "string" ? user.email : "";
}

function buildNavigationLinks(links, pathname) {
  return links.map((link) => ({
    ...link,
    isActive: isStudioSidebarPathActive(pathname, link.href),
  }));
}

export function useStudioSidebarViewModel({ user, pathname = "" } = {}) {
  const [collapsed, setCollapsed] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  return {
    brandEyebrow: STUDIO_SIDEBAR_COPY.brandEyebrow,
    brandTitle: STUDIO_SIDEBAR_COPY.brandTitle,
    brandHref: "/studio",
    communityLinksLabel: STUDIO_SIDEBAR_COPY.communityLinksLabel,
    signedInLabel: STUDIO_SIDEBAR_COPY.signedInLabel,
    signedInEmail: normalizeStudioSidebarEmail(user),
    logoutLabel: STUDIO_SIDEBAR_COPY.logoutLabel,
    logoutHref: "/logout",
    collapseAriaLabel: collapsed ? "Expand sidebar" : "Collapse sidebar",
    collapsed,
    socialOpen,
    primaryLinks: buildNavigationLinks(STUDIO_SIDEBAR_PRIMARY_LINKS, pathname),
    utilityLinks: buildNavigationLinks(STUDIO_SIDEBAR_UTILITY_LINKS, pathname),
    socialLinks: STUDIO_SIDEBAR_SOCIAL_LINKS,
    onToggleCollapsed: () => setCollapsed((value) => !value),
    onToggleSocial: () => setSocialOpen((value) => !value),
  };
}
