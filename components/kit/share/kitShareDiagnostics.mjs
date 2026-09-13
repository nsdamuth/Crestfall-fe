import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  SHARE_COPY,
  SHARE_KINDS,
  SHARE_REVIEW_STATES,
  buildShareIntent,
  getShareKind,
  normalizeShareVisibility,
  selectShareImageSource,
  shareCarriesCard,
} from "./shareTypeRule.js";
import {
  appendShareRef,
  buildCreationSharePath,
  buildImageSharePath,
  buildProfileSharePath,
  buildSignInReturnPath,
  getShareFamilyKind,
  toShareSlug,
} from "./shareUrl.js";
import { buildShareCardModel, toShareCardExcerpt } from "./shareCardModel.js";
import { getShareReviewCopy } from "./useKitShareSheetViewModel.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function read(relativePath) {
  return fs.readFileSync(path.join(currentDir, relativePath), "utf8");
}

const CONTEXT = { sharerUsername: "brian", origin: "https://crestfall-studio.com" };

// Gate G2: the type rule, both branches.
test("an image share carries no card and shares the stored derivative", () => {
  const intent = buildShareIntent(
    {
      mediaType: "IMAGE",
      id: "output-9",
      title: "Kessa at the counter",
      creatorUsername: "crestfall",
      sourceCreationId: "creation-1",
      media: { cardUrl: "/api/media/images/output-9/file?variant=card", originalUrl: "/api/media/images/output-9/file" },
    },
    CONTEXT
  );
  assert.equal(intent.kind, SHARE_KINDS.IMAGE);
  assert.equal(intent.hasCard, false);
  assert.equal(intent.cardImageSrc, null);
  assert.equal(intent.previewImageSrc, "/api/media/images/output-9/file?variant=card");
  assert.equal(shareCarriesCard(SHARE_KINDS.IMAGE), false);
  assert.equal(shareCarriesCard(SHARE_KINDS.VIDEO), false);
});

test("a playable share carries the card built by the share-card route", () => {
  for (const creationType of ["CHARACTER", "PLAYER_CHARACTER", "ROOM_TEMPLATE", "STORYLINE"]) {
    const intent = buildShareIntent(
      { creationType, id: "creation-1", title: "Kessa Cindervell", creatorUsername: "crestfall", visibility: "PUBLIC" },
      CONTEXT
    );
    assert.equal(intent.hasCard, true, creationType);
    assert.equal(intent.cardImageSrc, "/api/share-card/creation-1", creationType);
  }
  assert.equal(getShareKind({ creationType: "CHARACTER" }), SHARE_KINDS.CHARACTER);
  assert.equal(getShareKind({ creationType: "ROOM_TEMPLATE" }), SHARE_KINDS.STORY);
  assert.equal(getShareKind({ creationType: "STORYLINE" }), SHARE_KINDS.ADVENTURE);
});

test("every other creation shares the plain link without a card", () => {
  const intent = buildShareIntent(
    { creationType: "LOCATION", id: "creation-3", title: "Brasswhisker Workshop", visibility: "PUBLIC" },
    CONTEXT
  );
  assert.equal(intent.kind, SHARE_KINDS.LINK);
  assert.equal(intent.hasCard, false);
  assert.equal(intent.cardImageSrc, null);
  assert.equal(intent.url, "https://crestfall-studio.com/studio/creations/creation-3?ref=brian");
});

test("the byline is the creator and the ref is the sharer", () => {
  const intent = buildShareIntent(
    { creationType: "CHARACTER", id: "creation-1", title: "Kessa", creatorUsername: "Crestfall", visibility: "PUBLIC" },
    { sharerUsername: "@Brian", origin: "https://crestfall-studio.com" }
  );
  assert.equal(intent.byline, "by @crestfall");
  assert.equal(intent.sharerUsername, "brian");
  assert.match(intent.url, /\?ref=brian$/);
});

test("ref rides every link when a sharer is known and never otherwise", () => {
  const withSharer = buildShareIntent(
    { creationType: "CHARACTER", id: "creation-1", title: "Kessa", visibility: "PUBLIC" },
    CONTEXT
  );
  assert.equal(withSharer.url, "https://crestfall-studio.com/c/creation-1/kessa?ref=brian");

  const noSharer = buildShareIntent(
    { creationType: "CHARACTER", id: "creation-1", title: "Kessa", visibility: "PUBLIC" },
    { origin: "https://crestfall-studio.com" }
  );
  assert.equal(noSharer.url, "https://crestfall-studio.com/c/creation-1/kessa");
  assert.equal(appendShareRef("/c/x/y?a=1", "brian"), "/c/x/y?a=1&ref=brian");
  assert.equal(appendShareRef("/c/x/y", "not a handle"), "/c/x/y");
});

// Link destinations, RULED at the plan gate (Brian, 13 Sep 2026).
test("an image lands on its source creation with the image named, else on the sharer's profile", () => {
  assert.equal(
    buildImageSharePath({ sourceCreationId: "creation-1", imageOutputId: "output-9", sharerUsername: "brian" }),
    "/studio/creations/creation-1?image=output-9"
  );
  assert.equal(
    buildImageSharePath({ sourceCreationId: "", imageOutputId: "output-9", sharerUsername: "brian" }),
    "/studio/profile/brian"
  );
  const orphan = buildShareIntent({ mediaType: "IMAGE", id: "output-9", title: "Loose image" }, CONTEXT);
  assert.equal(orphan.url, "https://crestfall-studio.com/studio/profile/brian?ref=brian");
  const sourced = buildShareIntent(
    { mediaType: "IMAGE", id: "output-9", title: "Sourced", sourceCreationId: "creation-1" },
    CONTEXT
  );
  assert.equal(sourced.url, "https://crestfall-studio.com/studio/creations/creation-1?image=output-9&ref=brian");
});

test("a playable share lands on its landing family with a slug from the title", () => {
  assert.equal(
    buildCreationSharePath({ kind: "character", id: "creation-1", title: "Kessa Cindervell" }),
    "/c/creation-1/kessa-cindervell"
  );
  assert.equal(buildCreationSharePath({ kind: "story", id: "creation-2", title: "The Workshop" }), "/story/creation-2/the-workshop");
  assert.equal(
    buildCreationSharePath({ kind: "adventure", id: "creation-3", title: "Season One" }),
    "/adventure/creation-3/season-one"
  );
  assert.equal(getShareFamilyKind("c"), "character");
  assert.equal(getShareFamilyKind("story"), "story");
  assert.equal(getShareFamilyKind("adventure"), "adventure");
  assert.equal(getShareFamilyKind("vault"), null);
});

test("the sign-in return link names the exact page and keeps the sharer's handle", () => {
  assert.equal(
    buildSignInReturnPath({ nextPath: "/c/creation-1/kessa?ref=brian", sharerUsername: "brian" }),
    "/login?next=%2Fc%2Fcreation-1%2Fkessa%3Fref%3Dbrian&ref=brian"
  );
  assert.equal(buildSignInReturnPath({}), "/login");
});

test("the slug is lowercase, hyphenated, accent-free, and bounded", () => {
  assert.equal(toShareSlug("Kessa Cindervell: The Brasswhisker!"), "kessa-cindervell-the-brasswhisker");
  assert.equal(toShareSlug("Élodie & Co."), "elodie-co");
  assert.equal(toShareSlug("").length, 0);
  const long = toShareSlug("word ".repeat(40));
  assert.ok(long.length <= 60);
  assert.doesNotMatch(long, /-$/);
});

// Sharing is public only (follow-up 1, RULED 13 Sep 2026): a private
// creation and an Internal one both take the blocked state with no URL.
test("a private creation is blocked with the public-only sentence and no link", () => {
  const intent = buildShareIntent(
    { creationType: "CHARACTER", id: "creation-1", title: "Kessa", visibility: "PRIVATE" },
    CONTEXT
  );
  assert.equal(intent.blockedMessage, SHARE_COPY.blockedNotPublic);
  assert.equal(intent.url, "");
  assert.equal(intent.cardImageSrc, null);
  assert.equal(intent.nativeShare, null);
  assert.equal(intent.reviewState, SHARE_REVIEW_STATES.IDLE);
  assert.equal(normalizeShareVisibility({}), "PRIVATE");
});

test("an Internal creation is blocked the same way, with no note and no link", () => {
  for (const visibility of ["UNLISTED", "INTERNAL", "internal"]) {
    const intent = buildShareIntent(
      { creationType: "ROOM_TEMPLATE", id: "creation-2", title: "The Workshop", visibility },
      CONTEXT
    );
    assert.equal(intent.visibility, "INTERNAL", visibility);
    assert.equal(intent.blockedMessage, SHARE_COPY.blockedNotPublic, visibility);
    assert.equal(intent.url, "", visibility);
    assert.equal(intent.cardImageSrc, null, visibility);
    assert.equal(intent.nativeShare, null, visibility);
    assert.equal("note" in intent, false, visibility);
  }
  assert.equal(SHARE_COPY.internalNote, undefined);
  assert.equal(normalizeShareVisibility({ visibility: "PRIVATE", canonStatus: "OFFICIAL" }), "CANON");
});

test("a blocked share already in review reads as submitted and the button disables", () => {
  const intent = buildShareIntent(
    { creationType: "CHARACTER", id: "creation-1", title: "Kessa", visibility: "PRIVATE", lifecycleStatus: "IN_REVIEW" },
    CONTEXT
  );
  assert.equal(intent.reviewState, SHARE_REVIEW_STATES.SUBMITTED);

  const submitted = getShareReviewCopy(SHARE_REVIEW_STATES.SUBMITTED);
  assert.equal(submitted.reviewButtonLabel, SHARE_COPY.submittedForReview);
  assert.equal(submitted.reviewButtonDisabled, true);

  const idle = getShareReviewCopy(SHARE_REVIEW_STATES.IDLE);
  assert.equal(idle.reviewButtonLabel, SHARE_COPY.submitForReview);
  assert.equal(idle.reviewButtonDisabled, false);
  assert.equal(idle.reviewMessage, "");

  const failed = getShareReviewCopy(SHARE_REVIEW_STATES.ERROR);
  assert.equal(failed.reviewMessage, SHARE_COPY.submitFailed);
  assert.equal(failed.reviewButtonDisabled, false);
});

// Follow-up 1, item 5: the image viewer's share, the image kind.
test("the image kind carries no card, never the original, and rides with ref", () => {
  const base = "/api/studio/image-generation/outputs/output-9/file";
  const intent = buildShareIntent(
    {
      mediaType: "IMAGE",
      id: "output-9",
      title: "Kessa at the counter",
      creatorUsername: "brian",
      sourceCreationId: "creation-1",
      media: { cardUrl: `${base}?variant=card`, displayUrl: `${base}?variant=display`, originalUrl: base, upscaledUrl: `${base}?variant=upscaled` },
    },
    CONTEXT
  );
  assert.equal(intent.hasCard, false);
  assert.equal(intent.cardImageSrc, null);
  assert.equal(intent.previewImageSrc, `${base}?variant=card`);
  assert.equal(intent.previewImageLargeSrc, `${base}?variant=display`);
  assert.notEqual(intent.previewImageSrc, base);
  assert.notEqual(intent.previewImageLargeSrc, base);
  assert.doesNotMatch(intent.previewImageSrc, /upscaled/);
  assert.match(intent.url, /[?&]ref=brian$/);
  assert.equal(intent.blockedMessage, null);

  const originalOnly = buildShareIntent(
    { mediaType: "IMAGE", id: "output-9", title: "Original only", media: { originalUrl: base } },
    CONTEXT
  );
  assert.equal(originalOnly.previewImageSrc, "");
  assert.equal(originalOnly.previewImageLargeSrc, "");
  assert.match(originalOnly.url, /[?&]ref=brian$/);
});

// Follow-up 1, item 6: the creator profile's share, the profile kind.
test("the profile kind carries no card, lands on the public profile route, and rides with ref", () => {
  const intent = buildShareIntent(
    { kind: "profile", id: "profile-1", title: "Crestfall", creatorUsername: "Crestfall", featuredImageSrc: "/avatar.webp" },
    CONTEXT
  );
  assert.equal(intent.kind, SHARE_KINDS.PROFILE);
  assert.equal(intent.hasCard, false);
  assert.equal(intent.cardImageSrc, null);
  assert.equal(intent.blockedMessage, null);
  assert.equal(intent.byline, "@crestfall");
  assert.equal(intent.previewImageSrc, "/avatar.webp");
  assert.equal(intent.url, "https://crestfall-studio.com/studio/profile/crestfall?ref=brian");
  assert.equal(buildProfileSharePath({ username: "@Crestfall" }), "/studio/profile/crestfall");
  assert.equal(buildProfileSharePath({}), "");
});

test("an image source is medium then large, never the original", () => {
  assert.deepEqual(selectShareImageSource({ cardUrl: "/m", displayUrl: "/l", originalUrl: "/o" }), {
    src: "/m",
    variant: "medium",
  });
  assert.deepEqual(selectShareImageSource({ display_url: "/l", originalUrl: "/o" }), { src: "/l", variant: "large" });
  assert.deepEqual(selectShareImageSource({ originalUrl: "/o" }), { src: "", variant: null });
});

test("the card model drops the description sentinel and clips the excerpt", () => {
  const model = buildShareCardModel({
    creation: {
      id: "creation-1",
      type: "CHARACTER",
      title: "Kessa Cindervell",
      description: "No description has been added yet.",
      featuredMedia: [{ isPlaceholder: true }, { cardUrl: "/card.webp", imageOutputId: "output-1" }],
    },
    creator: { username: "crestfall" },
  });
  assert.equal(model.hasCard, true);
  assert.equal(model.excerpt, "");
  assert.equal(model.byline, "by @crestfall");
  assert.equal(model.imageSrc, "/card.webp");
  assert.equal(model.imageOutputId, "output-1");
  assert.equal(model.invitation, SHARE_COPY.invitation);

  const excerpt = toShareCardExcerpt("word ".repeat(60));
  assert.ok(excerpt.length <= 144);
  assert.match(excerpt, /\.\.\.$/);
});

test("the View is stateless presentation and the README names the rule", () => {
  const view = read("KitShareSheet.view.jsx");
  assert.doesNotMatch(view, /useEffect|fetch\(|navigator\.|window\./);
  assert.match(view, /Copy link/);
  assert.match(view, /Close/);
  assert.doesNotMatch(view, /Internal/);

  const readme = read("README.md");
  assert.match(readme, /## The type rule/);
  assert.match(readme, /carries no card/);
  assert.match(readme, /carries the card/);
  assert.match(readme, /public only/);
});
