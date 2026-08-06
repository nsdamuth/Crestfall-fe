"use client";

import {
  BookOpen,
  Castle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  return (
    <aside
      className={`
        hidden shrink-0 border-r border-[var(--gold-ornament)]/15 bg-black/80 px-3 py-5 transition-all duration-300 lg:block
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      <div className="flex items-center justify-between gap-2">
        {!collapsed ? (
          <InternalLinkComponent
            href={brandHref}
            className="flex items-center gap-[var(--space-2)]"
          >
            <img
              src="/assets/branding/crestfall-seal.svg"
              alt=""
              className="h-10 w-10 shrink-0 object-contain"
            />

            <span>
              <p className="font-display text-[10px] uppercase tracking-[0.35em] text-[var(--gold-ornament)]">
                {brandEyebrow}
              </p>

              <h1 className="mt-1 font-display text-xl tracking-[0.08em]">
                {brandTitle}
              </h1>
            </span>
          </InternalLinkComponent>
        ) : null}

        <button
          type="button"
          onClick={onToggleCollapsed}
          className="rounded-lg border border-[var(--gold-ornament)]/20 p-2 text-[var(--gold-ornament)] transition hover:border-[var(--gold-ornament)]/60 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
          aria-label={collapseAriaLabel}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      <nav className="mt-6 space-y-1.5">
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

      <nav className="space-y-1.5">
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
            <nav className="mt-1 space-y-1.5">
              {socialLinks.map((link) => (
                <SidebarExternalLink key={link.href} link={link} />
              ))}
            </nav>
          ) : null}
        </section>
      ) : (
        <nav className="space-y-1.5">
          {socialLinks.map((link) => (
            <SidebarExternalLink key={link.href} link={link} collapsed />
          ))}
        </nav>
      )}

      {!collapsed ? (
        <div className="mt-8 rounded-xl border border-[var(--gold-ornament)]/15 bg-black/40 p-3 text-xs text-[var(--ink-dim)]">
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
        cf-nav-link flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-xs uppercase tracking-[0.16em]
        ${
          link.variant === "return"
            ? "border-[var(--gold-ornament)]/15 bg-black/35 text-[var(--gold-ornament)] hover:border-[var(--gold-ornament)]/40 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
            : "text-[var(--ink-dim)]"
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
