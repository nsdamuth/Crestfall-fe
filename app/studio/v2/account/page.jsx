// PRE-PARITY. Fixture-driven mockup only, staging draft OUTSIDE the
// ruled nine-page model (docs/APP-FUNCTION-INVENTORY.md pass C names
// Account unassigned; Brian's 10 Aug 2026 gate manifest orders this
// draft by name). No live data, no API calls, no real navigation, no
// sidebar entry of any kind. Do not link this route from any nav list.
//
// The composition lives in AccountV2Mockup.jsx and is mirrored at
// /dev/ui-preview/account-v2-page for auth-free verification. Per
// docs/SPRINT-D-PLAN.md section 4 (W4), amended by Brian's ratified
// A1 (Canon stat dropped) and informed by the A2 witness search.
//
// Parity echo: run this pass, see the Sprint D session report (Phase
// 8 section) for the full echo against docs/APP-FUNCTION-MAP.csv rows
// for /studio/account and its six subpages (38 rows total).

import AccountV2Mockup from "./AccountV2Mockup";

export default function AccountV2Page() {
  return <AccountV2Mockup />;
}
