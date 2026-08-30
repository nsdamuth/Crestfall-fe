"use client";

import {
  Archive,
  BookOpen,
  Castle,
  ChevronDown,
  ChevronUp,
  Compass,
  Home,
  Image,
  LogOut,
  Megaphone,
  MessagesSquare,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";

const PREVIEW_SOON_LABEL = "Soon";

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

function resolveIcon(iconKey) {
  return ICONS[iconKey] || User;
}

export default function StudioSidebarView({
  brandEyebrow = "Crestfall",
  brandTitle = "Studio",
  brandHref = "/studio",
  communityLinksLabel = "Community Links",
  signedInLabel = "Signed in",
  signedInUsername = "Player",
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
  previewSupportGroup = null,
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
        hidden shrink-0 border-r border-[var(--line-whisper)] bg-[var(--surface-1)] px-3 py-5 transition-all duration-300 lg:sticky lg:top-0 lg:block lg:h-dvh lg:self-start lg:overflow-y-auto
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
              (Play) at the prior --space-6. Legacy group REMOVED
              from preview mode, RULED 23 Aug 2026 (build-0823 pass
              4, sidebar refinement): only the nine-page model plus
              lawful supporting entries render here. Flag-off
              (production) rendering, below, is untouched. */}
          <div className="mt-[var(--space-7)] space-y-[var(--space-2)]">
            {previewGroups.map((group) => (
              <PreviewGroup
                key={group.label}
                group={group}
                collapsed={collapsed}
                InternalLinkComponent={InternalLinkComponent}
              />
            ))}
          </div>

          {previewSupportGroup ? (
            <>
              <SidebarDivider dense />
              <PreviewGroup
                group={previewSupportGroup}
                collapsed={collapsed}
                InternalLinkComponent={InternalLinkComponent}
              />
            </>
          ) : null}

          <SidebarDivider dense />
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
        // Signed-in area streamlined, RULED 23 Aug 2026 (build-0823
        // pass 4, sidebar refinement): Discord and Settings sit
        // inline on the signed-in row itself (no separate icon row);
        // Log out is a quiet row directly beneath. No oversized
        // blocks.
        <div className="mt-[var(--space-3)] space-y-[var(--space-1)] px-1">
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
                aria-label="Settings"
                className="grid h-[var(--control-sm)] w-[var(--control-sm)] shrink-0 place-items-center rounded-full border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
              >
                <Settings size={16} aria-hidden="true" />
              </InternalLinkComponent>
            ) : null}
          </div>

          {/* Consolidated with the former duplicate sign-in panel
              below it (RULED 9 Aug 2026, kit polish 2 pass): both
              blocks rendered simultaneously and unconditionally,
              repeating the same account identity; logout is the only affordance
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

function SidebarDivider({ dense = false }) {
  return (
    <div
      className={`${dense ? "my-[var(--space-3)]" : "my-[var(--space-4)]"} border-t border-[var(--line-strong)]`}
    />
  );
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
              dense
            />
          ) : (
            <PreviewQuietRow key={item.label} item={item} collapsed={collapsed} dense />
          )
        )}
      </nav>
    </div>
  );
}

function PreviewQuietRow({ item, collapsed, dense = false }) {
  const Icon = resolveIcon(item.iconKey);

  return (
    <span
      title={collapsed ? item.label : undefined}
      aria-disabled="true"
      className={`flex items-center gap-3 rounded-[var(--radius-sm)] border border-transparent tracking-[var(--track-normal)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)] ${
        dense
          ? "min-h-[var(--control-sm)] px-3 py-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] [@media(pointer:coarse)]:min-h-[var(--control-md)]"
          : "min-h-[var(--control-md)] px-3 py-2.5 text-[length:var(--text-ui)] leading-[var(--lh-ui)]"
      } ${collapsed ? "justify-center px-2" : ""}`}
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
  dense = false,
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
        cf-nav-link flex items-center gap-3 rounded-[var(--radius-sm)] border border-transparent font-[var(--weight-regular)] tracking-[var(--track-normal)]
        ${
          dense
            ? "min-h-[var(--control-sm)] px-3 py-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] [@media(pointer:coarse)]:min-h-[var(--control-md)]"
            : "min-h-[var(--control-md)] px-3 py-2.5 text-[length:var(--text-ui)] leading-[var(--lh-ui)]"
        }
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

