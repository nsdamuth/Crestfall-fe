"use client";

import {
  BookOpen,
  Castle,
  ChevronDown,
  ChevronUp,
  CircleUser,
  Compass,
  ExternalLink,
  Home,
  Image,
  Megaphone,
  Menu,
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
  brandLabel = "Crestfall",
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
  openMenuAriaLabel = "Open menu",
  closeMenuAriaLabel = "Close menu",
  closeOverlayAriaLabel = "Close menu overlay",
  open = false,
  socialOpen = false,
  primaryLinks = [],
  utilityLinks = [],
  socialLinks = [],
  bottomLinks = [],
  InternalLinkComponent = "a",
  headerEconomySlot = null,
  drawerEconomySlot = null,
  onOpenMenu = () => {},
  onCloseMenu = () => {},
  onToggleSocial = () => {},
  onNavigate = () => {},
}) {
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--muted-gold)]/15 bg-black/90 px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="rounded-lg p-2 text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/10"
            aria-label={openMenuAriaLabel}
          >
            <Menu size={21} />
          </button>

          <InternalLinkComponent
            href={brandHref}
            className="font-display text-lg tracking-[0.12em]"
          >
            {brandLabel}
          </InternalLinkComponent>
        </div>

        <div className="flex items-center gap-3">
          {headerEconomySlot}
          <InternalLinkComponent
            href={accountHref}
            className="rounded-full border border-[var(--muted-gold)]/25 p-2 text-[var(--muted-gold)]"
            aria-label={accountAriaLabel}
          >
            <CircleUser size={19} />
          </InternalLinkComponent>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label={closeOverlayAriaLabel}
            onClick={onCloseMenu}
            className="absolute inset-0 bg-[var(--scrim-strong)] backdrop-blur-[var(--blur-panel)]"
          />

          <aside className="relative z-[61] flex h-full w-72 flex-col border-r border-[var(--muted-gold)]/20 bg-black px-5 py-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-[10px] uppercase tracking-[0.35em] text-[var(--muted-gold)]">
                  {drawerEyebrow}
                </p>
                <h2 className="mt-1 font-display text-2xl tracking-[0.08em]">
                  {drawerTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={onCloseMenu}
                className="rounded-lg border border-[var(--muted-gold)]/20 p-2 text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/50 hover:bg-[var(--muted-gold)]/10"
                aria-label={closeMenuAriaLabel}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto pr-1">
              <nav className="space-y-1.5">
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

              <nav className="space-y-1.5">
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
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
                >
                  <span>{communityLinksLabel}</span>
                  {socialOpen ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </button>

                {socialOpen ? (
                  <nav className="mt-1 space-y-1.5">
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
            </div>

            <div className="mt-5 rounded-xl border border-[var(--muted-gold)]/15 bg-black/40 p-3 text-xs text-[var(--muted)]">
              <p className="text-[var(--muted-gold)]">{signedInLabel}</p>
              <p className="mt-1 break-all">{signedInEmail}</p>

              <a
                href={logoutHref}
                className="mt-4 inline-block text-[var(--muted-gold)] transition hover:text-[var(--foreground)]"
              >
                {logoutLabel}
              </a>
            </div>
          </aside>
        </div>
      ) : null}

      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-[var(--muted-gold)]/15 bg-black/90 px-2 py-2 lg:hidden">
        {bottomLinks.map((link) => {
          const Icon = resolveIcon(link.iconKey);

          return (
            <InternalLinkComponent
              key={link.href}
              href={link.href}
              className={`
                flex flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] transition
                ${
                  link.isActive
                    ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
                }
              `}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </InternalLinkComponent>
          );
        })}
      </nav>
    </>
  );
}

function MobileDivider() {
  return <div className="my-4 border-t border-[var(--muted-gold)]/15" />;
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
      onClick={onNavigate}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-3 text-xs uppercase tracking-[0.16em] transition
        ${
          link.isActive
            ? "border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
            : "text-[var(--muted)] hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
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
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
    >
      <Icon size={16} className="shrink-0" />
      <span>{link.label}</span>
      <ExternalLink size={12} className="ml-auto shrink-0" />
    </a>
  );
}
