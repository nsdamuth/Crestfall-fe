// Share URL builder (fe/share-og brief 1, D2 and D3, RULED 13 Sep
// 2026). Public playable landing paths follow the URL research map
// (../Crestfall-Documentation/research/2026-08-31-url-architecture.md,
// Ruled 5 Sep 2026): /c/:id/:slug, /story/:id/:slug,
// /adventure/:id/:slug. The slug is derived from the title here until
// the Chassis writes one (CR-076); the landing routes key on the id
// and ignore the slug segment. Every share link carries the sharer's
// username as ?ref= for attribution (CR-072).

export const SHARE_REF_PARAM = "ref";
export const SHARE_IMAGE_PARAM = "image";
export const SHARE_SLUG_MAX = 60;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,48}$/;

const FAMILY_PATHS = Object.freeze({
  character: "/c",
  story: "/story",
  adventure: "/adventure",
});

const FAMILY_KINDS = Object.freeze({
  c: "character",
  story: "story",
  adventure: "adventure",
});

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeShareUsername(value) {
  const normalized = text(value).replace(/^@/, "").toLowerCase();
  return USERNAME_PATTERN.test(normalized) ? normalized : "";
}

export function toShareSlug(title) {
  const slug = text(title)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length <= SHARE_SLUG_MAX) return slug;

  const cut = slug.slice(0, SHARE_SLUG_MAX);
  const boundary = cut.lastIndexOf("-");
  return (boundary > 0 ? cut.slice(0, boundary) : cut).replace(/-+$/g, "");
}

export function getShareFamilyPath(kind) {
  return FAMILY_PATHS[text(kind).toLowerCase()] || null;
}

export function getShareFamilyKind(familySegment) {
  return FAMILY_KINDS[text(familySegment).toLowerCase().replace(/^\//, "")] || null;
}

// A playable asset lands on its landing family; every other creation
// lands on the existing public creation page.
export function buildCreationSharePath({ kind = "", id = "", title = "" } = {}) {
  const creationId = text(id);
  if (!creationId) return "";

  const family = getShareFamilyPath(kind);
  if (!family) return `/studio/creations/${encodeURIComponent(creationId)}`;

  const slug = toShareSlug(title);
  return slug
    ? `${family}/${encodeURIComponent(creationId)}/${slug}`
    : `${family}/${encodeURIComponent(creationId)}`;
}

// An image lands on the public page of the creation it was generated
// from with the image named in the URL (selection on that page is
// CR-077), or on the sharer's public profile when it has no source.
export function buildImageSharePath({
  sourceCreationId = "",
  imageOutputId = "",
  sharerUsername = "",
} = {}) {
  const sourceId = text(sourceCreationId);
  const outputId = text(imageOutputId);

  if (sourceId) {
    const base = `/studio/creations/${encodeURIComponent(sourceId)}`;
    return outputId ? `${base}?${SHARE_IMAGE_PARAM}=${encodeURIComponent(outputId)}` : base;
  }

  const sharer = normalizeShareUsername(sharerUsername);
  return sharer ? `/studio/profile/${encodeURIComponent(sharer)}` : "/";
}

export function appendShareRef(path, sharerUsername) {
  const target = text(path);
  const sharer = normalizeShareUsername(sharerUsername);
  if (!target || !sharer) return target;

  const separator = target.includes("?") ? "&" : "?";
  return `${target}${separator}${SHARE_REF_PARAM}=${encodeURIComponent(sharer)}`;
}

export function buildShareUrl({ path = "", origin = "" } = {}) {
  const target = text(path);
  const base = text(origin);
  if (!target) return "";
  if (!base) return target;

  try {
    return new URL(target, base).toString();
  } catch {
    return target;
  }
}

// The landing page's sign-in link: the visitor returns to the exact
// page the link named with the sharer's handle preserved once the
// Chassis honors next and ref on the callback (CR-074).
export function buildSignInReturnPath({ nextPath = "", sharerUsername = "" } = {}) {
  const params = new URLSearchParams();
  const target = text(nextPath);
  const sharer = normalizeShareUsername(sharerUsername);

  if (target) params.set("next", target);
  if (sharer) params.set(SHARE_REF_PARAM, sharer);

  const query = params.toString();
  return query ? `/login?${query}` : "/login";
}
