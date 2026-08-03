"use client";

import Link from "next/link";

import MediaLightboxView from "./media-lightbox/MediaLightbox.view";
import { useMediaLightboxViewModel } from "./media-lightbox/useMediaLightboxViewModel";

export default function MediaLightbox(props) {
  const viewProps = useMediaLightboxViewModel(props);

  if (!viewProps.activeMedia) return null;

  return <MediaLightboxView {...viewProps} LinkComponent={Link} />;
}
