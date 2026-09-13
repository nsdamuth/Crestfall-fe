// The one server composition behind the three public share landing
// families (fe/share-og brief 1, D2): /c, /story, /adventure. Loads the
// creation through the existing public loader, checks the family and
// the slug against the card model, reads the session for the action,
// and renders ShareLanding. Metadata for the same request comes from
// buildShareLandingMetadata below; the loader is wrapped in React cache
// so one request reads the creation once.
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";

import { buildShareCardModel } from "@/components/kit/share/shareCardModel";
import {
  appendShareRef,
  buildCreationSharePath,
  buildSignInReturnPath,
  getShareFamilyKind,
  getShareFamilyPath,
  normalizeShareUsername,
} from "@/components/kit/share/shareUrl";
import ShareLandingView from "@/components/share/share-landing/ShareLanding.view";
import { buildShareLandingViewProps } from "@/components/share/share-landing/useShareLandingViewModel";
import { getAuthenticatedUser } from "@/lib/server/auth/getAuthenticatedUser";
import { getPublicCreationProfilePageData } from "@/lib/server/studio/getPublicCreationProfilePageData";
import { createClient } from "@/lib/supabase/server";

const KIND_LABELS = Object.freeze({
  character: "Character",
  story: "Story",
  adventure: "Adventure",
});

const CANON_STATUSES = new Set(["CANON", "OFFICIAL", "ACCEPTED"]);

const loadShareLanding = cache(async (creationId) => getPublicCreationProfilePageData(creationId));

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function firstQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function getOptionalUser() {
  try {
    const supabase = await createClient();
    const { user, error } = await getAuthenticatedUser(supabase);
    return error || !user ? null : user;
  } catch {
    return null;
  }
}

async function resolveShareLanding({ family, params, searchParams }) {
  const familyKind = getShareFamilyKind(family);
  const { id, slug } = await params;
  const query = (await searchParams) || {};
  const creationId = text(id);

  if (!familyKind || !creationId) return { status: "missing" };

  const pageData = await loadShareLanding(creationId);
  if (pageData.loadError) return { status: "error", errorMessage: pageData.loadError };
  if (!pageData.creation) return { status: "missing" };

  const model = buildShareCardModel({ creation: pageData.creation, creator: pageData.creation.creator });
  if (!model.hasCard) return { status: "missing" };

  const ref = normalizeShareUsername(firstQueryValue(query.ref));
  const canonicalPath = buildCreationSharePath({ kind: model.kind, id: model.id, title: model.title });
  const requestedSlug = Array.isArray(slug) ? slug.map(text).filter(Boolean).join("/") : "";
  const requestedPath = `${getShareFamilyPath(familyKind)}/${encodeURIComponent(creationId)}${
    requestedSlug ? `/${requestedSlug}` : ""
  }`;

  return {
    status: "ok",
    model,
    ref,
    canonicalPath,
    redirectTo: requestedPath === canonicalPath ? null : appendShareRef(canonicalPath, ref),
    isCanon: CANON_STATUSES.has(
      text(pageData.creation.canonStatus || pageData.creation.canon_status).toUpperCase()
    ),
  };
}

export async function buildShareLandingMetadata({ family, params, searchParams }) {
  const resolved = await resolveShareLanding({ family, params, searchParams });
  if (resolved.status !== "ok") return { title: "Crestfall" };

  const { model, canonicalPath } = resolved;
  const title = model.byline ? `${model.title} ${model.byline}` : model.title;
  const description = model.excerpt || model.invitation;
  const image = `/api/share-card/${encodeURIComponent(model.id)}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      siteName: "Crestfall",
      title,
      description,
      url: canonicalPath,
      images: [{ url: image, width: 1200, height: 630, alt: model.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ShareLandingPage({ family, params, searchParams }) {
  const resolved = await resolveShareLanding({ family, params, searchParams });

  if (resolved.status === "missing") notFound();
  if (resolved.status === "error") {
    return <ShareLandingView {...buildShareLandingViewProps({ errorMessage: resolved.errorMessage })} />;
  }
  if (resolved.redirectTo) permanentRedirect(resolved.redirectTo);

  const { model, ref, canonicalPath, isCanon } = resolved;
  const user = await getOptionalUser();
  const sharedPath = appendShareRef(canonicalPath, ref);

  const viewProps = buildShareLandingViewProps({
    kindLabel: KIND_LABELS[model.kind] || "",
    isCanon,
    title: model.title,
    byline: model.byline,
    creatorHref: model.creatorUsername ? `/studio/profile/${encodeURIComponent(model.creatorUsername)}` : null,
    excerpt: model.excerpt,
    imageSrc: model.imageSrc,
    actionLabel: user ? "Play" : "Play Free on Crestfall Studio",
    actionHref: user
      ? `/studio/creations/${encodeURIComponent(model.id)}`
      : buildSignInReturnPath({ nextPath: sharedPath, sharerUsername: ref }),
  });

  return <ShareLandingView {...viewProps} />;
}
