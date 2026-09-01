function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function humanizeCreationType(value) {
  const label = normalizeString(value || "Creation")
    .replaceAll("_", " ")
    .toLowerCase();

  return label.replace(/(^|\s)\S/g, (match) => match.toUpperCase());
}

export function formatStudioNotificationRelativeTime(value, now = Date.now()) {
  const date = new Date(value || 0);
  if (Number.isNaN(date.getTime())) return "Recently";

  const deltaMs = Math.max(0, now - date.getTime());
  const minutes = Math.floor(deltaMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function projectStudioNotification(notification = {}, now = Date.now()) {
  const type = normalizeString(notification?.type).toUpperCase();
  const occurredLabel = formatStudioNotificationRelativeTime(
    notification?.occurredAt,
    now
  );

  if (type === "FOLLOWED_CREATOR_PUBLISHED") {
    const actor = notification?.actor || {};
    const creation = notification?.creation || {};
    const username = normalizeString(actor.username);
    const actorLabel = username
      ? `@${username.replace(/^@/, "")}`
      : normalizeString(actor.displayName) || "A creator you follow";
    const title = normalizeString(creation.title) || "Untitled Creation";

    return {
      id: notification?.id || `release:${creation.id || title}`,
      type,
      title: `${actorLabel} published “${title}”.`,
      body: `${humanizeCreationType(creation.type)} is now public.`,
      supportingLine: occurredLabel,
      href: normalizeString(notification?.href) || null,
    };
  }

  if (type === "COINS_RECEIVED") {
    const amount = Math.max(
      0,
      Number.parseInt(String(notification?.coinAmount || 0), 10) || 0
    );
    const senderLabel =
      normalizeString(notification?.senderLabel) || "Mystery Donor";

    return {
      id: notification?.id || `coins:${notification?.occurredAt || amount}`,
      type,
      title: `You received ${amount.toLocaleString()} Coins from ${senderLabel}.`,
      body: normalizeString(notification?.message),
      supportingLine: occurredLabel,
      href: null,
    };
  }

  return null;
}
