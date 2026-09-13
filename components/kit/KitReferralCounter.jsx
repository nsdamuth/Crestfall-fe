"use client";

// Binding shell for the referral bonus counter (fe/share-og follow-up
// 1, item 7). Hands the account snapshot's referral field to the
// ViewModel and renders the View. Mounted once, on the signed-in
// account page under the coins block.
import KitReferralCounterView from "./referral-counter/KitReferralCounter.view";
import { useKitReferralCounterViewModel } from "./referral-counter/useKitReferralCounterViewModel";

export default function KitReferralCounter(props) {
  const viewProps = useKitReferralCounterViewModel(props);

  return <KitReferralCounterView {...viewProps} />;
}
