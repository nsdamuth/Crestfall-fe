const PREVIEW_NOTICE =
  "These controls are frontend placeholders. They do not connect to billing, subscriptions, saved preferences, moderation settings, or notification services yet.";

const PREVIEW_NAVIGATION = {
  backHref: "#account-back",
  backLabel: "Back to Account",
  returnHref: "#account-return",
  returnLabel: "Return to Account",
};

export const accountStubSubscriptionFixture = {
  ...PREVIEW_NAVIGATION,
  eyebrow: "Account",
  title: "Subscription",
  description:
    "Plan, billing, renewal, premium access, and future subscription controls.",
  cards: [
    {
      id: "plan",
      eyebrow: "Plan",
      title: "Current Plan",
      body:
        "Display the user’s current subscription tier, renewal status, limits, and premium access once billing is connected.",
    },
    {
      id: "billing",
      eyebrow: "Billing",
      title: "Payment & Renewal",
      body:
        "Manage payment method, invoices, renewal date, cancellation, and plan changes through the future billing provider.",
    },
    {
      id: "premium",
      eyebrow: "Premium",
      title: "Premium Features",
      body:
        "Track access to premium models, advanced image generation, private room limits, and other paid features.",
    },
    {
      id: "history",
      eyebrow: "History",
      title: "Purchase History",
      body:
        "Future invoices, subscription changes, coin purchases, and billing events will be visible here.",
    },
  ],
  notice: PREVIEW_NOTICE,
};

export const accountStubNoCardsFixture = {
  ...PREVIEW_NAVIGATION,
  eyebrow: "Account",
  title: "Empty Placeholder",
  description:
    "This state verifies the bounded page when no future-setting cards are supplied.",
  cards: [],
  notice: PREVIEW_NOTICE,
};

export const accountStubNoDescriptionFixture = {
  ...PREVIEW_NAVIGATION,
  eyebrow: "Account",
  title: "Title Without Description",
  description: "",
  cards: [
    {
      id: "one-card",
      eyebrow: "Future",
      title: "One Placeholder Card",
      body: "The card grid remains balanced without header supporting copy.",
    },
  ],
  notice: PREVIEW_NOTICE,
};

export const accountStubNoNoticeFixture = {
  ...PREVIEW_NAVIGATION,
  eyebrow: "Preferences",
  title: "Placeholder Without Notice",
  description:
    "The footer link remains available when the optional placeholder notice is omitted.",
  cards: [
    {
      id: "preference",
      eyebrow: "Display",
      title: "Future Preference",
      body: "A display-only card with no connected settings behavior.",
    },
  ],
  notice: "",
};

export const accountStubLongContentFixture = {
  backHref: "#long-account-back",
  backLabel: "Back to a Deliberately Long Account Navigation Destination",
  returnHref: "#long-account-return",
  returnLabel: "Return to the Complete Account Preferences and Settings Area",
  eyebrow: "A Deliberately Long Account Section Label",
  title:
    "A Deliberately Long Placeholder Page Title That Must Wrap Without Breaking the Account Layout",
  description:
    "This extended description verifies line wrapping, spacing, card growth, and responsive behavior when a future account surface needs substantially more explanation than the current placeholder routes.",
  cards: [
    {
      id: "long-card-one",
      eyebrow: "Long Placeholder Category",
      title:
        "A Long Future Setting Title That Must Wrap Naturally Inside the Card",
      body:
        "This extended body verifies readable line height and natural card growth across narrow and desktop layouts without introducing any connected account-setting behavior.",
    },
    {
      id: "long-card-two",
      eyebrow: "Second Long Category",
      title: "Another Long Future Account Capability",
      body:
        "A second long card verifies that the responsive two-column layout supports uneven content heights and still collapses cleanly to one column.",
    },
  ],
  notice:
    "This deliberately long notice verifies wrapping for the existing explanation that these controls remain frontend placeholders and are not connected to any backend account services.",
};
