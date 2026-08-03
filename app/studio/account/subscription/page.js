import AccountStubPage from "@/components/studio/account/AccountStubPage";

export default function SubscriptionPage() {
  return (
    <AccountStubPage
      eyebrow="Account"
      title="Subscription"
      description="Plan, billing, renewal, premium access, and future subscription controls."
      cards={[
        {
          eyebrow: "Plan",
          title: "Current Plan",
          body: "Display the user’s current subscription tier, renewal status, limits, and premium access once billing is connected.",
        },
        {
          eyebrow: "Billing",
          title: "Payment & Renewal",
          body: "Manage payment method, invoices, renewal date, cancellation, and plan changes through the future billing provider.",
        },
        {
          eyebrow: "Premium",
          title: "Premium Features",
          body: "Track access to premium models, advanced image generation, private room limits, and other paid features.",
        },
        {
          eyebrow: "History",
          title: "Purchase History",
          body: "Future invoices, subscription changes, coin purchases, and billing events will be visible here.",
        },
      ]}
    />
  );
}