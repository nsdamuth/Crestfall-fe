"use client";

import { Bell, Menu, Moon, Sun, X } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

const GROUP_LABELS = Object.freeze({
  today: "Today",
  earlier: "Earlier",
});

export default function StudioTopBarView({
  searchValue = "",
  searchPlaceholder = "Search characters, stories, and adventures",
  searchAutoFocus = false,
  notifications = [],
  notificationsLabel = "Notifications",
  notificationsView = null,
  bellRef = null,
  themeMode = "dark",
  themeToggleAriaLabel = "Switch to Eggshell theme",
  accountHref = "/studio/account",
  accountAriaLabel = "Account",
  accountInitial = "?",
  accountLinkSlot = null,
  openMenuAriaLabel = "Open menu",
  onSearchChange = () => {},
  onOpenNotifications = () => {},
  onOpenNotificationCenter = () => {},
  onToggleTheme = () => {},
  onCloseNotifications = () => {},
  onDismissNotification = () => {},
  onClearAllNotifications = () => {},
  onOpenMenu = () => {},
}) {
  const hasNotifications = notifications.length > 0;
  const isCompactOpen = notificationsView === "compact";
  const isFullOpen = notificationsView === "full";

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center gap-[var(--space-3)] border-b border-[var(--line-whisper)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] backdrop-blur-[var(--blur-chrome)] px-[var(--space-5)] py-[var(--space-3)]">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={openMenuAriaLabel}
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)] lg:hidden"
        >
          <Menu size={20} />
        </button>

        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search"
          autoFocus={searchAutoFocus}
          className="ml-auto h-[var(--control-md)] w-full max-w-[26rem] touch-manipulation rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] font-sans text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[color:var(--ink)] placeholder:text-[length:var(--text-label)] placeholder:font-[var(--weight-regular)] placeholder:text-[color:var(--ink-faint)] focus-visible:border-[var(--gold-action)]"
        />

        <button
          ref={bellRef}
          type="button"
          onClick={onOpenNotifications}
          aria-label={notificationsLabel}
          aria-expanded={isCompactOpen || isFullOpen}
          className={`flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border bg-[var(--surface-2)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] ${
            hasNotifications
              ? "border-[var(--line-strong)] text-[var(--gold-action)] shadow-[var(--glow-hover)]"
              : "border-[var(--line)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
          }`}
        >
          <Bell size={17} />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={themeToggleAriaLabel}
          title={themeToggleAriaLabel}
          className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-[color,border-color,background-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line-strong)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
        >
          {themeMode === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {accountLinkSlot || (
          <a
            href={accountHref}
            aria-label={accountAriaLabel}
            className="hidden h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[color:var(--gold-ornament)] transition-[color,border-color,box-shadow] duration-[var(--dur-hover)] hover:border-[var(--line)] hover:text-[var(--gold-action)] hover:shadow-[var(--glow-hover)] lg:flex"
          >
            {accountInitial}
          </a>
        )}
      </header>

      {isCompactOpen ? (
        <KitModalFrame
          onClose={onCloseNotifications}
          ariaLabelledBy="studio-notif-compact-title"
          panelClassName="w-full max-w-[26rem] p-[var(--space-5)]"
        >
          <NotificationsHeader
            titleId="studio-notif-compact-title"
            title={notificationsLabel}
            subtitle="Recent activity"
          />

          {hasNotifications ? (
            <ul className="divide-y divide-[var(--line-whisper)]">
              {notifications.slice(0, 3).map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onDismiss={onDismissNotification}
                />
              ))}
            </ul>
          ) : (
            <EmptyNotifications />
          )}

          {hasNotifications ? (
            <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-center gap-[var(--space-2)]">
              <button
                type="button"
                onClick={onClearAllNotifications}
                className="cf-btn cf-btn--secondary cf-btn--sm"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onOpenNotificationCenter}
                className="cf-btn cf-btn--primary cf-btn--sm"
              >
                Notification Center
              </button>
            </div>
          ) : null}
        </KitModalFrame>
      ) : null}

      {isFullOpen ? (
        <KitModalFrame
          onClose={onCloseNotifications}
          ariaLabelledBy="studio-notif-full-title"
          panelClassName="w-full max-w-[30rem] p-[var(--space-5)]"
        >
          <NotificationsHeader
            titleId="studio-notif-full-title"
            title="Notification Center"
            subtitle="Everything, organized by day"
          />

          {hasNotifications ? (
            <NotificationGroups
              notifications={notifications}
              onDismiss={onDismissNotification}
            />
          ) : (
            <EmptyNotifications />
          )}
        </KitModalFrame>
      ) : null}
    </>
  );
}

function NotificationsHeader({ titleId, title = "", subtitle = "" }) {
  return (
    <div className="mb-[var(--space-4)] pr-[var(--space-10)]">
      <h2
        id={titleId}
        className="font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] font-[var(--weight-medium)]"
      >
        {title}
      </h2>
      <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-faint)]">
        {subtitle}
      </p>
    </div>
  );
}

function NotificationGroups({ notifications = [], onDismiss = () => {} }) {
  const groups = ["today", "earlier"]
    .map((key) => ({
      key,
      label: GROUP_LABELS[key],
      items: notifications.filter((notification) => notification.group === key),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {groups.map((group) => (
        <div key={group.key}>
          <p className="mt-[var(--space-4)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] uppercase font-[var(--weight-medium)] text-[color:var(--ink-faint)] first:mt-0">
            {group.label}
          </p>
          <ul className="divide-y divide-[var(--line-whisper)]">
            {group.items.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onDismiss={onDismiss}
              />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function NotificationRow({ notification, onDismiss = () => {} }) {
  return (
    <li className="flex items-center gap-[var(--space-1)]">
      <div className="flex flex-1 min-w-0 items-start gap-[var(--space-3)] py-[var(--space-3)]">
        <span
          aria-hidden="true"
          className="mt-[var(--space-2)] h-2 w-2 shrink-0 rounded-[var(--radius-full)] bg-[var(--gold-action)]"
        />
        <div className="min-w-0">
          <h3 className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-medium)] text-pretty">
            {notification.title}
          </h3>
          <p className="mt-0.5 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[color:var(--ink-faint)]">
            {notification.supportingLine}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss?.(notification.id)}
        aria-label={`Dismiss ${notification.title}`}
        className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-faint)] transition-[color,background-color] duration-[var(--dur-hover)] hover:bg-[var(--fill-whisper)] hover:text-[var(--ink)]"
      >
        <X size={14} />
      </button>
    </li>
  );
}

function EmptyNotifications() {
  return (
    <p className="py-[var(--space-4)] text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[color:var(--ink-faint)]">
      No notifications yet.
    </p>
  );
}
