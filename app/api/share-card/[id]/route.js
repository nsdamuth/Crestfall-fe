// The share card image (fe/share-og brief 1, D1, RULED 13 Sep 2026):
// a 1200 by 630 image composed with next/og from public creation data
// read through the existing proxy, cached at the edge. 404 for
// anything the public read refuses (private, Internal, missing) and
// for any creation the type rule says carries no card.
import { ImageResponse } from "next/og";
import sharp from "sharp";

import ShareCardImage, { SHARE_CARD_THEME_NAMES } from "@/components/kit/share/ShareCardImage";
import { buildShareCardModel } from "@/components/kit/share/shareCardModel";
import { crestfallApiRequest } from "@/lib/server/api/crestfallApiClient";
import { SHARE_CARD_FONT_FAMILIES, loadShareCardFonts } from "@/lib/server/share-card/loadShareCardFonts";
import { createThemeValueResolver } from "@/lib/server/share-card/readThemeValues";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIZE = { width: 1200, height: 630 };
const ART = { width: 540, height: 630 };
const CACHE_CONTROL = "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

function notFound() {
  return new Response(null, { status: 404, headers: { "cache-control": "public, max-age=0, s-maxage=300" } });
}

// The public read, no user header: PUBLIC_VIEW, the same gate the
// public creation page stands behind.
async function fetchPublicPreview(id) {
  try {
    const payload = await crestfallApiRequest({
      path: `/v1/creations/${encodeURIComponent(id)}/preview`,
      method: "GET",
    });
    if (!payload || payload.ok === false) return null;
    return payload.data || null;
  } catch {
    return null;
  }
}

// The featured image bytes through this repo's own media proxy (the
// served URL is relative), sized for the art column and re-encoded as
// JPEG because the stored derivatives are webp, which the image
// renderer cannot decode.
async function fetchArtDataUrl(src) {
  if (!src) return "";
  const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  if (!siteUrl) return "";

  try {
    const response = await fetch(new URL(src, siteUrl), { cache: "no-store" });
    if (!response.ok) return "";
    const source = Buffer.from(await response.arrayBuffer());
    const jpeg = await sharp(source)
      .resize(ART.width * 2, ART.height * 2, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 84 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return "";
  }
}

export async function GET(request, { params }) {
  const { id } = await params;
  const creationId = typeof id === "string" ? id.trim() : "";
  if (!creationId) return notFound();

  const preview = await fetchPublicPreview(creationId);
  if (!preview?.creation) return notFound();

  const model = buildShareCardModel({ creation: preview.creation, creator: preview.creator });
  if (!model.hasCard) return notFound();

  const [fonts, imageSrc] = await Promise.all([loadShareCardFonts(), fetchArtDataUrl(model.imageSrc)]);
  const resolve = createThemeValueResolver(SHARE_CARD_THEME_NAMES);

  return new ImageResponse(
    <ShareCardImage model={model} resolve={resolve} fonts={SHARE_CARD_FONT_FAMILIES} imageSrc={imageSrc} />,
    {
      ...SIZE,
      fonts,
      headers: { "cache-control": CACHE_CONTROL },
    }
  );
}
