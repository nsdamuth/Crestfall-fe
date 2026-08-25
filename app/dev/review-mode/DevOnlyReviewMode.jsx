"use client";

// Code-split gate for ReviewModeOverlay. next/dynamic forces the real
// overlay (all its proof-ported markup, CSS, and interaction logic)
// into its own separate chunk instead of the shared layout entry
// bundle every page loads. Combined with the NODE_ENV check in
// app/layout.js (a server component, so this gate is never even
// mounted in a production render), that chunk is never requested by a
// production browser. This file itself carries none of the overlay's
// behavior, only the split point.

import dynamic from "next/dynamic";

const ReviewModeOverlay = dynamic(() => import("./ReviewModeOverlay"), {
  ssr: false,
});

export default function DevOnlyReviewMode() {
  return <ReviewModeOverlay />;
}
