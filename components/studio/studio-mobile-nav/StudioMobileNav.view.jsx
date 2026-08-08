"use client";

import {
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

function resolveIcon(iconKey) {
  return ICONS[iconKey] || User;
}

export default function StudioMobileNavView({
  brandHref = "/studio",
  drawerEyebrow = "Crestfall",
  drawerTitle = "Studio",
  communityLinksLabel = "Community Links",
  signedInLabel = "Signed in",
  signedInEmail = "",
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
            {drawerEconomySlot}
            <MobileDivider />

            <nav className="space-y-[var(--space-1)]">
              {utilityLinks.map((link) => (
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

            <div className="mt-4 space-y-[var(--space-2)] px-1">
              <div className="flex items-center gap-[var(--space-3)]">
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)]"
                >
                  {signedInEmail ? signedInEmail.charAt(0).toUpperCase() : "?"}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[length:var(--text-ui)] font-[var(--weight-medium)] leading-[var(--lh-ui)] text-[color:var(--ink)]">
                    {signedInLabel}
                  </h3>
                  <p className="truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-faint)]">
                    {signedInEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-[var(--space-2)]">
                {discordLink ? (
                  <a
                    href={discordLink.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={discordLink.label}
                    className="grid h-[var(--control-sm)] w-[var(--control-sm)] shrink-0 place-items-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
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

                <a
                  href={logoutHref}
                  className="ml-auto flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--gold-ornament)] transition hover:text-[color:var(--ink)]"
                >
                  <LogOut size={14} />
                  {logoutLabel}
                </a>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <nav
        aria-label="Primary"
        className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 gap-[var(--space-1)] border-t border-[var(--line-whisper)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-[var(--space-2)] pb-[calc(var(--space-2)+env(safe-area-inset-bottom))] pt-[var(--space-2)] backdrop-blur-[var(--blur-chrome)] lg:hidden"
      >
        {bottomLinks.map((link) => {
          const Icon = resolveIcon(link.iconKey);

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
    </>
  );
}

function MobileDivider() {
  return <div className="my-4 border-t border-[var(--gold-ornament)]/15" />;
}

function MobileDrawerInternalLink({
  link,
  InternalLinkComponent = "a",
  onNavigate = () => {},
}) {
  const Icon = resolveIcon(link.iconKey);

  return (
    <InternalLinkComponent
      href={link.href}
      title={undefined}
      onClick={onNavigate}
      aria-current={
        link.variant !== "return" && link.isActive ? "page" : undefined
      }
      className={`
        cf-nav-link flex min-h-[var(--control-md)] items-center gap-3 rounded-[var(--radius-sm)] border border-transparent px-3 py-2.5 text-[length:var(--text-ui)] font-[var(--weight-regular)] leading-[var(--lh-ui)] tracking-[var(--track-normal)]
        ${
          link.variant === "return"
            ? "border-[color:var(--gold-ornament)]/15 bg-black/35 text-[color:var(--gold-ornament)] hover:border-[color:var(--gold-ornament)]/40 hover:bg-[color:var(--gold-ornament)]/10 hover:text-[color:var(--ink)]"
            : "text-[color:var(--ink-faint)]"
        }
      `}
    >
      <Icon size={16} className="shrink-0" />
      <span>{link.label}</span>
    </InternalLinkComponent>
  );
}

function MobileDrawerExternalLink({ link, onNavigate = () => {} }) {
  const Icon = resolveIcon(link.iconKey);

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
