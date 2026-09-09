"use client";

import {
  Archive,
  BookOpen,
  Castle,
  ChevronDown,
  ChevronUp,
  Compass,
  ExternalLink,
  Home,
  Image,
  LogOut,
  Megaphone,
  MessagesSquare,
  ScrollText,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";

const ICONS = Object.freeze({
  archive: Archive,
  bookOpen: BookOpen,
  castle: Castle,
  compass: Compass,
  home: Home,
  image: Image,
  megaphone: Megaphone,
  messagesSquare: MessagesSquare,
  scrollText: ScrollText,
  shieldCheck: ShieldCheck,
  sparkles: Sparkles,
  user: User,
  users: Users,
});

// Icons resolve inline (ICONS[key] || User) at each use, not through
// a helper call: the react-hooks/static-components lint rule reads a
// call result used as a JSX tag as a component created during render
// (fixed 6 Sep 2026, sidebar batch 2, item 11).

const V2_DRAWER_GROUP_DEFINITIONS = Object.freeze([
  Object.freeze({ label: "Play", itemLabels: Object.freeze(["Home", "Stories", "Adventures"]) }),
  Object.freeze({ label: "Create", itemLabels: Object.freeze(["Studio", "Media", "Vault"]) }),
  Object.freeze({ label: "Explore", itemLabels: Object.freeze(["Community", "Creators", "Lore"]) }),
]);

function buildV2DrawerGroups(primaryLinks = []) {
  const linkByLabel = new Map(primaryLinks.map((link) => [link.label, link]));
  const requiredLabels = V2_DRAWER_GROUP_DEFINITIONS.flatMap((group) => group.itemLabels);

  if (!requiredLabels.every((label) => linkByLabel.has(label))) {
    return null;
  }

  return V2_DRAWER_GROUP_DEFINITIONS.map((group) => ({
    label: group.label,
    links: group.itemLabels.map((label) => linkByLabel.get(label)),
  }));
}

export default function StudioMobileNavView({
  brandHref = "/studio",
  drawerEyebrow = "Crestfall",
  drawerTitle = "Studio",
  communityLinksLabel = "Community Links",
  signedInLabel = "Signed in",
  signedInUsername = "Player",
  logoutLabel = "Log out",
  logoutHref = "/logout",
  accountHref = "/studio/account",
  accountAriaLabel = "Account",
  closeMenuAriaLabel = "Close menu",
  closeOverlayAriaLabel = "Close menu overlay",
  open = false,
  socialOpen = false,
  primaryLinks = [],
  utilityLinks = [],
  socialLinks = [],
  showBottomDock = true,
  bottomLinks = [],
  InternalLinkComponent = "a",
  drawerEconomySlot = null,
  onCloseMenu = () => {},
  onToggleSocial = () => {},
  onNavigate = () => {},
}) {
  const discordLink =
    socialLinks.find((link) => /discord/i.test(link?.href || "")) ||
    socialLinks[0] ||
    null;
  const accountLink =
    utilityLinks.find((link) => link.iconKey === "castle") || null;
  const v2DrawerGroups = buildV2DrawerGroups(primaryLinks);
  const isV2Drawer = Boolean(v2DrawerGroups);
  const supportLinks = isV2Drawer
    ? utilityLinks.filter((link) => link !== accountLink)
    : utilityLinks;
  // Support heading removed on the v2 drawer, RULED 6 Sep 2026
  // (sidebar batch 1, mobile parity): Terms becomes quiet footer text
  // beneath Log out (no icon); the remaining support rows (Feedback &
  // Updates) sit directly beneath the coins block. Same href split as
  // StudioSidebar.view.jsx. The legacy drawer keeps its own list.
  const termsLink = isV2Drawer
    ? supportLinks.find((link) => /terms/i.test(link?.href || "")) || null
    : null;
  const v2SupportRows = isV2Drawer
    ? supportLinks.filter((link) => link !== termsLink)
    : [];

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label={closeOverlayAriaLabel}
            onClick={onCloseMenu}
            className="absolute inset-0 bg-[var(--scrim-strong)] backdrop-blur-[var(--blur-panel)]"
          />

          <aside className="relative z-[61] flex h-full w-[min(20rem,86vw)] flex-col overflow-y-auto border-r border-[var(--line-whisper)] bg-[var(--surface-1)] px-3 py-5 shadow-[var(--shadow-modal)]">
            <div className="flex items-center justify-between gap-2">
              <InternalLinkComponent
                href={brandHref}
                onClick={onNavigate}
                className="flex items-center gap-[var(--space-2)]"
              >
                <svg
                  viewBox="0 0 64 64"
                  aria-hidden="true"
                  className="h-10 w-10 shrink-0 text-[var(--gold-ornament)]"
                >
                  <use href="/assets/icons/icons-v7.svg#i-59" />
                </svg>

                <span>
                  <h1 className="font-display text-[length:var(--text-ui)] font-[var(--weight-medium)] uppercase leading-none tracking-[.04em] text-[color:var(--ink)] first-letter:text-[1.45em]">
                    {drawerEyebrow}
                  </h1>

                  <p className="mt-[2px] text-[length:var(--text-label)] uppercase leading-none tracking-[var(--track-label)] text-[color:var(--ink-faint)]">
                    {drawerTitle}
                  </p>
                </span>
              </InternalLinkComponent>

              <button
                type="button"
                onClick={onCloseMenu}
                className="grid h-[var(--control-md)] w-[var(--control-md)] shrink-0 place-items-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
                aria-label={closeMenuAriaLabel}
              >
                <X size={20} />
              </button>
            </div>

            {isV2Drawer ? (
              // Group gap opened --space-4 to --space-6, RULED 6 Sep
              // 2026 (sidebar batch 1, mobile parity), matching the
              // desktop sidebar's section spacing.
              <div className="mt-5 space-y-[var(--space-6)]">
                {v2DrawerGroups.map((group) => (
                  <MobileDrawerGroup
                    key={group.label}
                    label={group.label}
                    links={group.links}
                    InternalLinkComponent={InternalLinkComponent}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : (
              <>
                <nav className="mt-6 space-y-[var(--space-1)]">
                  {primaryLinks.map((link) => (
                    <MobileDrawerInternalLink
                      key={link.href}
                      link={link}
                      InternalLinkComponent={InternalLinkComponent}
                      onNavigate={onNavigate}
                    />
                  ))}
                </nav>

                <MobileDivider />

                <nav className="space-y-[var(--space-1)]">
                  {supportLinks.map((link) => (
                    <MobileDrawerInternalLink
                      key={link.href}
                      link={link}
                      InternalLinkComponent={InternalLinkComponent}
                      onNavigate={onNavigate}
                    />
                  ))}
                </nav>

                <MobileDivider />

                <section>
                  <button
                    type="button"
                    onClick={onToggleSocial}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
                  >
                    <span>{communityLinksLabel}</span>
                    {socialOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {socialOpen ? (
                    <nav className="mt-1 space-y-[var(--space-1)]">
                      {socialLinks.map((link) => (
                        <MobileDrawerExternalLink
                          key={link.href}
                          link={link}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </nav>
                  ) : null}
                </section>
              </>
            )}

            <MobileDivider />
            {drawerEconomySlot}

            {v2SupportRows.length ? (
              <nav className="mt-[var(--space-2)] space-y-[var(--space-2)]">
                {v2SupportRows.map((link) => (
                  <MobileDrawerInternalLink
                    key={link.href}
                    link={link}
                    InternalLinkComponent={InternalLinkComponent}
                    onNavigate={onNavigate}
                  />
                ))}
              </nav>
            ) : null}

            {/* Even spacing around the coins section, mirroring
                StudioSidebar.view.jsx (6 Sep 2026): the lower
                divider tightens its top margin when a row sits
                between it and the coins box. */}
            <MobileDivider tightTop={v2SupportRows.length > 0} />

            <MobileAccountSummary
              signedInLabel={signedInLabel}
              signedInUsername={signedInUsername}
              logoutLabel={logoutLabel}
              logoutHref={logoutHref}
              discordLink={discordLink}
              accountLink={accountLink}
              termsLink={termsLink}
              InternalLinkComponent={InternalLinkComponent}
              onNavigate={onNavigate}
            />
          </aside>
        </div>
      ) : null}

      {showBottomDock ? (
        <nav
          aria-label="Primary"
          className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 gap-[var(--space-1)] border-t border-[var(--line-whisper)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-[var(--space-2)] pb-[calc(var(--space-2)+env(safe-area-inset-bottom))] pt-[var(--space-2)] backdrop-blur-[var(--blur-chrome)] lg:hidden"
        >
          {bottomLinks.map((link) => {
            const Icon = ICONS[link.iconKey] || User;

            return (
              <InternalLinkComponent
                key={link.href}
                href={link.href}
                aria-current={link.isActive ? "page" : undefined}
                className="cf-dock-link flex min-h-[var(--control-md)] flex-col items-center justify-center gap-[var(--space-1)] rounded-[var(--radius-sm)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-faint)]"
              >
                <Icon size={20} className="shrink-0" />
                <span>{link.label}</span>
              </InternalLinkComponent>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}

function MobileDrawerGroup({
  label,
  links = [],
  InternalLinkComponent = "a",
  onNavigate = () => {},
}) {
  if (!links.length) return null;

  return (
    <section>
      <div className="flex items-center gap-[var(--space-3)] px-3">
        <p className="shrink-0 text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-action)]">
          {label}
        </p>
        <div
          aria-hidden="true"
          className="h-px flex-1 bg-[var(--gold-ornament)]/20"
        />
      </div>
      {/* Rhythm one step up, RULED 6 Sep 2026 (sidebar batch 2, items
          7 and 9): rows at --control-md (replacing the raw 2.35rem),
          item gap --space-2, mirroring the desktop rail. */}
      <nav className="mt-[var(--space-1)] space-y-[var(--space-2)]">
        {links.map((link) => (
          <MobileDrawerInternalLink
            key={link.href}
            link={link}
            InternalLinkComponent={InternalLinkComponent}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </section>
  );
}

function MobileAccountSummary({
  signedInLabel,
  signedInUsername,
  logoutLabel,
  logoutHref,
  discordLink,
  accountLink,
  termsLink = null,
  InternalLinkComponent = "a",
  onNavigate = () => {},
}) {
  // Gap opened --space-2 to --space-3, RULED 6 Sep 2026 (sidebar
  // batch 1, mobile parity): Log out no longer touches the signed-in
  // row. Terms renders beneath Log out as quiet footer text, no icon.
  return (
    <div className="space-y-[var(--space-3)] px-1">
      <div className="flex items-center gap-[var(--space-2)]">
        <span
          aria-hidden="true"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)]"
        >
          {signedInUsername ? signedInUsername.replace(/^@/, "").charAt(0).toUpperCase() : "P"}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[length:var(--text-ui)] font-[var(--weight-medium)] leading-[var(--lh-ui)] text-[color:var(--ink)]">
            {signedInLabel}
          </h3>
          <p className="truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-faint)]">
            {signedInUsername}
          </p>
        </div>

        {discordLink ? (
          <a
            href={discordLink.href}
            target="_blank"
            rel="noreferrer"
            aria-label={discordLink.label}
            className="grid h-[var(--control-sm)] w-[var(--control-sm)] shrink-0 place-items-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <use href="/assets/icons/icons-v7.svg#i-58" />
            </svg>
          </a>
        ) : null}

        {accountLink ? (
          <InternalLinkComponent
            href={accountLink.href}
            onClick={onNavigate}
            aria-label={accountLink.label}
            className="grid h-[var(--control-sm)] w-[var(--control-sm)] shrink-0 place-items-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <use href="/assets/icons/icons-v7.svg#i-12" />
            </svg>
          </InternalLinkComponent>
        ) : null}
      </div>

      <a
        href={logoutHref}
        className="inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[color:var(--gold-ornament)] transition hover:text-[color:var(--ink)]"
      >
        <LogOut size={13} />
        {logoutLabel}
      </a>

      {termsLink ? (
        <InternalLinkComponent
          href={termsLink.href}
          onClick={onNavigate}
          className="block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)] transition hover:text-[var(--gold-action)] hover:opacity-100"
        >
          {termsLink.label}
        </InternalLinkComponent>
      ) : null}
    </div>
  );
}

function MobileDivider({ tightTop = false }) {
  return (
    <div
      className={`${tightTop ? "mt-[var(--space-1)] mb-[var(--space-4)]" : "my-4"} border-t border-[var(--gold-ornament)]/15`}
    />
  );
}

function MobileDrawerInternalLink({
  link,
  InternalLinkComponent = "a",
  onNavigate = () => {},
}) {
  const Icon = ICONS[link.iconKey] || User;

  return (
    <InternalLinkComponent
      href={link.href}
      title={undefined}
      onClick={onNavigate}
      aria-current={
        link.variant !== "return" && link.isActive ? "page" : undefined
      }
      className={`
        cf-nav-link flex min-h-[var(--control-md)] items-center gap-3 rounded-[var(--radius-sm)] border px-3 py-2 text-[length:var(--text-ui)] font-[var(--weight-regular)] leading-[var(--lh-ui)] tracking-[var(--track-normal)] transition
        ${
          link.variant === "return"
            ? "border-[color:var(--gold-ornament)]/15 bg-black/35 text-[color:var(--gold-ornament)] hover:border-[color:var(--gold-ornament)]/40 hover:bg-[color:var(--gold-ornament)]/10 hover:text-[color:var(--ink)]"
            : link.isActive
              ? "border-[color:var(--gold-ornament)]/25 border-l-2 border-l-[var(--gold-action)] bg-[color-mix(in_srgb,var(--gold-ornament)_8%,transparent)] text-[color:var(--ink)]"
              : "border-transparent text-[color:var(--ink-faint)] hover:bg-[color-mix(in_srgb,var(--gold-ornament)_5%,transparent)] hover:text-[color:var(--ink)]"
        }
      `}
    >
      <Icon size={16} className="shrink-0" />
      <span>{link.label}</span>
    </InternalLinkComponent>
  );
}

function MobileDrawerExternalLink({ link, onNavigate = () => {} }) {
  const Icon = ICONS[link.iconKey] || User;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      onClick={onNavigate}
      className="cf-nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)] transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
    >
      <Icon size={16} className="shrink-0" />
      <span>{link.label}</span>
      <ExternalLink size={12} className="ml-auto shrink-0" />
    </a>
  );
}
