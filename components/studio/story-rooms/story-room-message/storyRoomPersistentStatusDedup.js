function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getStatusBlockIdentity(block = {}) {
  return [block?.id, block?.slot]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
}

function statusBlockTextMatchesDomain(block = {}, domain = "") {
  const text = String(block?.renderedText || "").trim();
  if (!text) return false;

  const firstLine = text.split(/\r?\n/, 1)[0].trim();
  if (domain === "PROGRESSION") {
    return /\s—\sProgression$/i.test(firstLine);
  }
  if (domain === "STATS_POOLS") {
    return /\s—\sStats\s*&\s*Pools$/i.test(firstLine);
  }
  return false;
}

export function shouldSuppressPersistentSnapshotBlock(
  block,
  persistentDomains = []
) {
  const identities = getStatusBlockIdentity(block);
  const domains = new Set(
    normalizeArray(persistentDomains).map((domain) =>
      String(domain || "").trim().toUpperCase()
    )
  );

  if (
    domains.has("PROGRESSION") &&
    (identities.some((id) => /^progression_actor_\d+$/.test(id)) ||
      statusBlockTextMatchesDomain(block, "PROGRESSION"))
  ) {
    return true;
  }

  if (
    domains.has("STATS_POOLS") &&
    (identities.some((id) => /^stats_pools_actor_\d+$/.test(id)) ||
      statusBlockTextMatchesDomain(block, "STATS_POOLS"))
  ) {
    return true;
  }

  return false;
}

export function getPersistentSnapshotBlocks(
  presentation = {},
  persistentDomains = []
) {
  return normalizeArray(presentation?.statusBlocks).filter((block) =>
    shouldSuppressPersistentSnapshotBlock(block, persistentDomains)
  );
}

function stripExactStatusBlockFromBody(body, block = {}) {
  const renderedText = String(block?.renderedText || "").trim();
  if (!renderedText) return String(body || "");

  const text = String(body || "").replace(/\r\n/g, "\n").trim();
  const placement = String(block?.placement || "response_end")
    .trim()
    .toLowerCase();

  if (placement === "response_start" && text.startsWith(renderedText)) {
    return text.slice(renderedText.length).trim();
  }

  if (text.endsWith(renderedText)) {
    return text.slice(0, text.length - renderedText.length).trim();
  }

  // Older persisted messages can have the same deterministic block in the
  // body while semantic presentation segments are unavailable. Only remove an
  // exact block copy at a paragraph boundary; never pattern-strip prose.
  const paragraphNeedle = `\n\n${renderedText}`;
  const index = text.lastIndexOf(paragraphNeedle);
  if (index >= 0) {
    return `${text.slice(0, index)}${text.slice(index + paragraphNeedle.length)}`.trim();
  }

  return text;
}

export function stripPersistentSnapshotBlocksFromBody(
  body,
  presentation = {},
  persistentDomains = []
) {
  return getPersistentSnapshotBlocks(presentation, persistentDomains).reduce(
    (text, block) => stripExactStatusBlockFromBody(text, block),
    String(body || "")
  );
}
