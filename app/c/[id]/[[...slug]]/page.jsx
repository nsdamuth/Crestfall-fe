// Public character share landing, /c/:id/:slug (fe/share-og brief 1,
// D2; the URL research map, Ruled 5 Sep 2026). Thin route: the one
// composition in app/share-landing does the work.
import ShareLandingPage, { buildShareLandingMetadata } from "@/app/share-landing/ShareLandingPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(props) {
  return buildShareLandingMetadata({ family: "c", ...props });
}

export default function CharacterShareLandingRoute(props) {
  return <ShareLandingPage family="c" {...props} />;
}
