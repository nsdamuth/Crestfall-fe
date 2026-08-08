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

export default function StudioSidebarView({
  brandEyebrow = "Crestfall",
  brandTitle = "Studio",
  brandHref = "/studio",
  communityLinksLabel = "Community Links",
  signedInLabel = "Signed in",
  signedInEmail = "",
  logoutLabel = "Log out",
  logoutHref = "/logout",
  collapseAriaLabel = "Collapse sidebar",
  collapsed = false,
  socialOpen = false,
  primaryLinks = [],
  utilityLinks = [],
  socialLinks = [],
  InternalLinkComponent = "a",
  economySlot = null,
  onToggleCollapsed = () => {},
  onToggleSocial = () => {},
}) {
  const discordLink =
    socialLinks.find((link) => /discord/i.test(link?.href || "")) ||
    socialLinks[0] ||
    null;
  // Gear icon: the proof opens a settings modal, which has no contract
  // callback yet. Pointed at the existing Account link until that
  // exists. Change this line, not the markup below, to redirect it.
  const accountLink =
    utilityLinks.find((link) => link.iconKey === "castle") || null;

  return (
    <aside
      className={`
        hidden shrink-0 border-r border-[var(--line-whisper)] bg-[var(--surface-1)] px-3 py-5 transition-all duration-300 lg:block
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      <div className="flex items-center justify-between gap-2">
        {!collapsed ? (
          <InternalLinkComponent
            href={brandHref}
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
                {brandEyebrow}
              </h1>

              <p className="mt-[2px] text-[length:var(--text-label)] uppercase leading-none tracking-[var(--track-label)] text-[color:var(--ink-faint)]">
                {brandTitle}
              </p>
            </span>
          </InternalLinkComponent>
        ) : null}

        <button
          type="button"
          onClick={onToggleCollapsed}
          className="grid h-[var(--control-md)] w-[var(--control-md)] shrink-0 place-items-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          aria-label={collapseAriaLabel}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
          </svg>
        </button>
      </div>

      <nav className="mt-6 space-y-[var(--space-1)]">
        {primaryLinks.map((link) => (
          <SidebarInternalLink
            key={link.href}
            link={link}
            collapsed={collapsed}
            InternalLinkComponent={InternalLinkComponent}
          />
        ))}
      </nav>

      <SidebarDivider />

      <nav className="space-y-[var(--space-1)]">
        {utilityLinks.map((link) => (
          <SidebarInternalLink
            key={link.href}
            link={link}
            collapsed={collapsed}
            InternalLinkComponent={InternalLinkComponent}
          />
        ))}
      </nav>

      <SidebarDivider />
      {economySlot}
      <SidebarDivider />

      {!collapsed ? (
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
                <SidebarExternalLink key={link.href} link={link} />
              ))}
            </nav>
          ) : null}
        </section>
      ) : (
        <nav className="space-y-[var(--space-1)]">
          {socialLinks.map((link) => (
            <SidebarExternalLink key={link.href} link={link} collapsed />
          ))}
        </nav>
      )}

      {!collapsed ? (
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
        </div>
      ) : null}

      {!collapsed ? (
        <div className="mt-4 rounded-xl border border-[var(--gold-ornament)]/15 bg-black/40 p-3 text-xs text-[var(--ink-dim)]">
          <p className="text-[var(--gold-ornament)]">{signedInLabel}</p>
          <p className="mt-1 break-all">{signedInEmail}</p>

          <a
            href={logoutHref}
            className="mt-4 flex items-center gap-2 text-[var(--gold-ornament)] transition hover:text-[var(--ink)]"
          >
            <LogOut size={14} />
            {logoutLabel}
          </a>
        </div>
      ) : null}
    </aside>
  );
}

function SidebarDivider() {
  return <div className="my-4 border-t border-[var(--gold-ornament)]/15" />;
}

function SidebarInternalLink({
  link,
  collapsed,
  InternalLinkComponent = "a",
}) {
  const Icon = resolveIcon(link.iconKey);

  return (
    <InternalLinkComponent
      href={link.href}
      title={collapsed ? link.label : undefined}
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
        ${collapsed ? "justify-center px-2" : ""}
      `}
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed ? <span>{link.label}</span> : null}
    </InternalLinkComponent>
  );
}

function SidebarExternalLink({ link, collapsed = false }) {
  const Icon = resolveIcon(link.iconKey);

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      title={collapsed ? link.label : undefined}
      className={
        collapsed
          ? "cf-nav-link flex items-center justify-center rounded-lg px-2 py-2.5 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]"
          : "cf-nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]"
      }
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed ? (
        <>
          <span>{link.label}</span>
          <ExternalLink size={12} className="ml-auto shrink-0" />
        </>
      ) : null}
    </a>
  );
}
