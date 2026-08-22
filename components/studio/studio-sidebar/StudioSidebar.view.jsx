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

const PREVIEW_SOON_LABEL = "Soon";

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
  previewEnabled = false,
  previewGroups = [],
  legacyLabel = "Legacy",
  legacyOpen = false,
  onToggleLegacy = () => {},
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

      {previewEnabled ? (
        <>
          {/* Gap opened to the next ladder step up (--space-6 to
              --space-7), RULED 10 Aug 2026 (kit polish 3 pass): the
              logo lockup was crowding the first group header
              (Play) at the prior --space-6. */}
          <div className="mt-[var(--space-7)] space-y-[var(--space-3)]">
            {previewGroups.map((group) => (
              <PreviewGroup
                key={group.label}
                group={group}
                collapsed={collapsed}
                InternalLinkComponent={InternalLinkComponent}
              />
            ))}
          </div>

          <SidebarDivider />

          <section>
            <button
              type="button"
              onClick={onToggleLegacy}
              className={`flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)] transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)] ${collapsed ? "justify-center" : "justify-between"}`}
              aria-expanded={legacyOpen}
            >
              {!collapsed ? <span>{legacyLabel}</span> : null}
              {legacyOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {legacyOpen ? (
              <>
                <nav className="mt-1 space-y-[var(--space-1)]">
                  {primaryLinks.map((link) => (
                    <SidebarInternalLink
                      key={link.href}
                      link={link}
                      collapsed={collapsed}
                      InternalLinkComponent={InternalLinkComponent}
                    />
                  ))}
                </nav>

                <nav className="mt-1 space-y-[var(--space-1)]">
                  {utilityLinks.map((link) => (
                    <SidebarInternalLink
                      key={link.href}
                      link={link}
                      collapsed={collapsed}
                      InternalLinkComponent={InternalLinkComponent}
                    />
                  ))}
                </nav>
              </>
            ) : null}
          </section>

          <SidebarDivider />
        </>
      ) : (
        <>
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
        </>
      )}
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
        <div className="mt-[var(--space-4)] space-y-[var(--space-2)] px-1">
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

          {/* Consolidated with the former duplicate sign-in panel
              below it (RULED 9 Aug 2026, kit polish 2 pass): both
              blocks rendered simultaneously and unconditionally,
              repeating the same email; logout is the only affordance
              the second block carried that this one did not, so it
              folds in here instead, tokenized, word beside the icon
              per the destructive-word law even though logout is not
              itself destructive. */}
          <a
            href={logoutHref}
            className="inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)] transition hover:text-[var(--gold-action)]"
          >
            <LogOut size={14} aria-hidden="true" />
            {logoutLabel}
          </a>
        </div>
      ) : null}
    </aside>
  );
}

function SidebarDivider() {
  return <div className="my-[var(--space-4)] border-t border-[var(--line-strong)]" />;
}

function PreviewGroup({ group, collapsed, InternalLinkComponent = "a" }) {
  return (
    <div>
      {!collapsed ? (
        // Section labels, two scopes, RULED 10 Aug 2026 (kit polish 3
        // pass, docs/BUILD-BLUEPRINT.md 2.16(o)). This is scope 2,
        // sidebar nav group headers: structural, not decorative. The
        // label keeps its gold uppercase treatment with NO ornament
        // rule beside it (the short gold rule this pass removes was
        // scope 1's page-head eyebrow treatment, wrong here); a plain
        // full-width divider (the Legacy divider recipe) renders
        // beneath the label row instead, in both collapsed and
        // expanded states.
        <p className="px-3 pb-[var(--space-2)] text-[length:var(--text-label)] uppercase leading-none tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {group.label}
        </p>
      ) : null}
      <div className="mb-[var(--space-2)] border-t border-[var(--line-strong)]" />
      <nav className="space-y-[var(--space-1)]">
        {group.items.map((item) =>
          item.isBuilt ? (
            <SidebarInternalLink
              key={item.label}
              link={item}
              collapsed={collapsed}
              InternalLinkComponent={InternalLinkComponent}
            />
          ) : (
            <PreviewQuietRow key={item.label} item={item} collapsed={collapsed} />
          )
        )}
      </nav>
    </div>
  );
}

function PreviewQuietRow({ item, collapsed }) {
  const Icon = resolveIcon(item.iconKey);

  return (
    <span
      title={collapsed ? item.label : undefined}
      aria-disabled="true"
      className={`flex min-h-[var(--control-md)] items-center gap-3 rounded-[var(--radius-sm)] border border-transparent px-3 py-2.5 text-[length:var(--text-ui)] leading-[var(--lh-ui)] tracking-[var(--track-normal)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)] ${collapsed ? "justify-center px-2" : ""}`}
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <span className="flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {PREVIEW_SOON_LABEL}
          </span>
        </>
      ) : null}
    </span>
  );
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
