import { projectCommunityCreation } from "./communityPresentation.js";
import { projectCreationToVaultItem } from "./vaultPresentation.js";

function normalizeText(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeUpper(value, fallback = "") {
  return normalizeText(value, fallback).toUpperCase();
}

function daysAgoFrom(value) {
  const timestamp = value ? new Date(value).getTime() : NaN;
  if (!Number.isFinite(timestamp)) return 3650;

  return Math.max(
    0,
    Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000))
  );
}

function getOwnedApprovalState(creation = {}, projected = {}) {
  if (projected.isCanon) return "canon";

  const status = normalizeUpper(
    creation.status || projected.status,
    "DRAFT"
  );

  if (status === "IN_REVIEW") return "pending";
  if (status === "APPROVED") return "approved";
  if (status === "ARCHIVED") return "archived";
  return "draft";
}

export function projectPublicLoreCreation(creation = {}, index = 0) {
  const projected = projectCommunityCreation(creation, index);

  return {
    ...projected,
    assetKind: "lore",
    approvalState: projected.isCanon ? "canon" : "approved",
    daysAgo: daysAgoFrom(
      creation.updatedAt || creation.updated_at || creation.createdAt || creation.created_at
    ),
    stats: {
      plays: null,
      hearts: projected.hearts || 0,
      saves: projected.saves || 0,
      followers: null,
    },
  };
}

export function projectOwnedLoreCreation(creation = {}, index = 0) {
  const projected = projectCreationToVaultItem(creation, index, { isOwn: true });

  return {
    ...projected,
    assetKind: "lore",
    approvalState: getOwnedApprovalState(creation, projected),
    daysAgo: daysAgoFrom(
      creation.updatedAt || creation.updated_at || creation.createdAt || creation.created_at
    ),
    stats: {
      plays: null,
      hearts: projected.hearts || 0,
      saves: projected.saves || 0,
      followers: null,
    },
  };
}

export function projectPublicLoreCreations(creations = []) {
  return Array.isArray(creations)
    ? creations
        .filter((creation) => normalizeUpper(creation?.type) === "LORE")
        .map(projectPublicLoreCreation)
    : [];
}

export function projectOwnedLoreCreations(creations = []) {
  return Array.isArray(creations)
    ? creations
        .filter((creation) => normalizeUpper(creation?.type) === "LORE")
        .map(projectOwnedLoreCreation)
    : [];
}
