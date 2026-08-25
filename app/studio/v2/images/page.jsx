// PRE-PARITY. Fixture-driven mockup only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check in
// section 3.4. No live data, no API calls, no real navigation. Do not
// link this route from any nav list until a parity echo clears it.
//
// Build order row 5 (docs/BUILD-BLUEPRINT.md 3.1): Images, the image
// workshop's library browse hub. The composition lives in
// ImagesV2Mockup.jsx and is mirrored at /dev/ui-preview/images-v2-page
// for auth-free verification. Per docs/SPRINT-D-PLAN.md section 2
// (W2, absorbing and superseding docs/SPRINT-B-PLAN.md).
//
// Parity echo: run this pass, see the Sprint D session report (Phase
// 6 section) for the full echo against docs/APP-FUNCTION-MAP.csv rows
// for /studio/image-studio and /studio/my-creations/[id]/image-library
// (70 rows total).

import ImagesV2Mockup from "./ImagesV2Mockup";

export default function ImagesV2Page() {
  return <ImagesV2Mockup />;
}
