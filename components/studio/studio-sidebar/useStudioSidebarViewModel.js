"use client";

import { useState } from "react";

import { isSidebarV2PreviewEnabled } from "@/lib/shared/flags/sidebarV2Preview";

// V2 navigation, derived from the journey order in
// docs/CRESTFALL-PRODUCT-MODEL-UXUI.md section 2. During the convergence
// cutover, /studio itself is the canonical Studio landing surface while
// the remaining V2 destinations keep their /studio/v2/* staging addresses.
// The earlier Home door is intentionally absent from primary navigation;
// its useful concepts may be folded into Studio during later convergence.
// Icon keys reuse the existing ICONS set in StudioSidebar.view.jsx.
//
// Vault iconKey reverted castle -> archive, RULED 23 Aug 2026
// (build-0823 pass 4, sidebar refinement): the repo's standing
// archive/vault glyph (witness: KitCreationCard's Archive action).
export const STUDIO_SIDEBAR_PREVIEW_GROUPS = Object.freeze([
  Object.freeze({
    label: "Play",
    items: Object.freeze([
      Object.freeze({ label: "Stories", href: "/studio/v2/stories", iconKey: "messagesSquare", isBuilt: true }),
      Object.freeze({ label: "Adventures", href: "/studio/v2/adventures", iconKey: "scrollText", isBuilt: true }),
    ]),
  }),
  Object.freeze({
    label: "Create",
    items: Object.freeze([
      Object.freeze({ label: "Studio", href: "/studio", iconKey: "home", isBuilt: true }),
      Object.freeze({ label: "Images", href: "/studio/v2/images", iconKey: "image", isBuilt: true }),
      Object.freeze({ label: "Vault", href: "/studio/v2/vault", iconKey: "archive", isBuilt: true }),
    ]),
  }),
  Object.freeze({
    label: "Explore",
    items: Object.freeze([
      Object.freeze({ label: "Community", href: "/studio/v2/community", iconKey: "compass", isBuilt: true }),
      Object.freeze({ label: "Creators", href: "/studio/v2/creators", iconKey: "users", isBuilt: true }),
      Object.freeze({ label: "Lore", href: "/studio/v2/lore", iconKey: "bookOpen", isBuilt: true }),
    ]),
  }),
]);
export const STUDIO_SIDEBAR_PREVIEW_SUPPORT_GROUP = Object.freeze({
  label: "Support",
  items: Object.freeze([
    Object.freeze({
      label: "Feedback & Updates",
      href: "/studio/feedback",
      iconKey: "megaphone",
      isBuilt: true,
    }),
    Object.freeze({
      label: "Terms & Policies",
      href: "/terms",
      iconKey: "shieldCheck",
      isBuilt: true,
    }),
  ]),
});


export const STUDIO_SIDEBAR_LEGACY_LABEL = "Legacy";

function buildPreviewGroups(pathname) {
  return STUDIO_SIDEBAR_PREVIEW_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.isBuilt && isStudioSidebarPathActive(pathname, item.href),
    })),
  }));
}

function buildPreviewSupportGroup(pathname) {
  return {
    ...STUDIO_SIDEBAR_PREVIEW_SUPPORT_GROUP,
    items: STUDIO_SIDEBAR_PREVIEW_SUPPORT_GROUP.items.map((item) => ({
      ...item,
      isActive: item.isBuilt && isStudioSidebarPathActive(pathname, item.href),
    })),
  };
}

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
  Object.freeze({
    label: "Lore",
    href: "/",
    iconKey: "bookOpen",
    variant: "return",
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

// Account destination, RULED (FE polish closeout, item 7): the v2
// surface must never link into the legacy /studio/account shell.
// This sidebar renders on every /studio/** route including v2 pages,
// so the Account item's target depends on which surface is current.
export function getStudioSidebarAccountHref(pathname = "") {
  return pathname === "/studio" || pathname.startsWith("/studio/v2")
    ? "/studio/v2/account"
    : "/studio/account";
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
  const [legacyOpen, setLegacyOpen] = useState(false);
  const v2Surface = pathname === "/studio" || pathname.startsWith("/studio/v2");
  const previewEnabled = v2Surface || isSidebarV2PreviewEnabled();

  return {
    previewEnabled,
    previewGroups: previewEnabled ? buildPreviewGroups(pathname) : [],
    previewSupportGroup: previewEnabled ? buildPreviewSupportGroup(pathname) : null,
    legacyLabel: STUDIO_SIDEBAR_LEGACY_LABEL,
    legacyOpen,
    onToggleLegacy: () => setLegacyOpen((value) => !value),
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
    utilityLinks: buildNavigationLinks(STUDIO_SIDEBAR_UTILITY_LINKS, pathname).map((link) =>
      link.label === "Account"
        ? {
            ...link,
            href: getStudioSidebarAccountHref(pathname),
            isActive: isStudioSidebarPathActive(pathname, getStudioSidebarAccountHref(pathname)),
          }
        : link
    ),
    socialLinks: STUDIO_SIDEBAR_SOCIAL_LINKS,
    onToggleCollapsed: () => setCollapsed((value) => !value),
    onToggleSocial: () => setSocialOpen((value) => !value),
  };
}
