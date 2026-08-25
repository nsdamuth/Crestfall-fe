export const ACCOUNT_SETTINGS_CONFIG = Object.freeze({
  subscription: {
    eyebrow: "Account",
    title: "Subscription",
    description:
      "See what is live today and what still requires a billing or subscription service before Crestfall can expose it as an account control.",
    summaryTitle: "Billing is not connected yet",
    summaryBody:
      "Crestfall Coins are live account state, but plan billing, renewals, invoices, cancellations, and premium subscription entitlements do not have a current account runtime contract.",
    capabilities: [
      {
        id: "coins",
        label: "Coins",
        title: "Crestfall Coin Balance",
        body: "Your real balance is available on the Account page and is already used by supported paid actions such as image generation and media reassignment.",
        status: "LIVE",
        href: "/studio/v2/account#coins",
        actionLabel: "View coin balance",
      },
      {
        id: "plan",
        label: "Plan",
        title: "Subscription Plan",
        body: "No billing-provider-backed subscription tier, renewal, cancellation, or plan-change contract exists in the current runtime.",
        status: "NOT_CONNECTED",
      },
      {
        id: "billing",
        label: "Billing",
        title: "Payment & Renewal",
        body: "Payment methods, invoices, renewal dates, and cancellation controls will remain unavailable until a real billing provider is connected.",
        status: "NOT_CONNECTED",
      },
      {
        id: "history",
        label: "History",
        title: "Purchase History",
        body: "There is no current account endpoint for invoices, subscription changes, or general purchase-history browsing.",
        status: "NOT_CONNECTED",
      },
    ],
  },
  preferences: {
    eyebrow: "Account",
    title: "Preferences",
    description:
      "Account-backed preferences that exist today stay live; workflow and browser defaults remain visibly unavailable until they have persistence contracts.",
    summaryTitle: "Two account preferences are live",
    summaryBody:
      "Default Player Character and content preference are already saved on your current profile. The broader Community, Vault, Image Studio, and creator-workflow defaults shown in older placeholders are not persisted yet.",
    capabilities: [
      {
        id: "default-pc",
        label: "Stories",
        title: "Default Player Character",
        body: "Choose the Player Character Crestfall should treat as your preferred identity for new story-room flows.",
        status: "LIVE",
        href: "/studio/v2/account#default-player-character",
        actionLabel: "Manage default PC",
      },
      {
        id: "content",
        label: "Content",
        title: "Content Preference",
        body: "The current profile persists SFW/MATURE/EXPLICIT preference values. Higher tiers remain gated by the platform's age/content controls.",
        status: "LIVE",
        href: "/studio/v2/account#content-preference",
        actionLabel: "Manage content preference",
      },
      {
        id: "browsing",
        label: "Browsing",
        title: "Browser & Filter Defaults",
        body: "Grid/list defaults, remembered filter-panel state, and discovery defaults do not have an account persistence contract yet.",
        status: "NOT_CONNECTED",
      },
      {
        id: "creator",
        label: "Creator",
        title: "Creator Workflow Defaults",
        body: "Default visibility, builder mode, draft behavior, and other creator-workflow preferences are not saved account settings today.",
        status: "NOT_CONNECTED",
      },
    ],
  },
  appearance: {
    eyebrow: "Account",
    title: "Appearance",
    description:
      "Theme, density, card layout, and motion controls will only become interactive once Crestfall has a real account-backed appearance preference contract.",
    summaryTitle: "Appearance settings are presentation-only today",
    summaryBody:
      "The application can render its current design system, but there is no user-account persistence for theme mode, density, card sizing, or motion preferences in the supplied runtime.",
    capabilities: [
      {
        id: "theme",
        label: "Theme",
        title: "Theme Mode",
        body: "No saved account preference currently owns dark/light/high-contrast mode or accent selection.",
        status: "NOT_CONNECTED",
      },
      {
        id: "density",
        label: "Density",
        title: "Display Density",
        body: "Comfortable, compact, and spacious layout defaults are not persisted account state yet.",
        status: "NOT_CONNECTED",
      },
      {
        id: "cards",
        label: "Cards",
        title: "Card Display",
        body: "Card size, thumbnail density, and mobile-grid defaults currently belong to individual surfaces rather than account settings.",
        status: "NOT_CONNECTED",
      },
      {
        id: "motion",
        label: "Motion",
        title: "Motion & Effects",
        body: "No account-level reduced-motion, blur, glow, or transition preference is currently persisted by Crestfall.",
        status: "NOT_CONNECTED",
      },
    ],
  },
  notifications: {
    eyebrow: "Account",
    title: "Notifications",
    description:
      "Crestfall can save your contact email today, but notification subscriptions and channel preferences are not connected account settings yet.",
    summaryTitle: "Contact destination is live; notification preferences are not",
    summaryBody:
      "Your profile stores a contact email separately from the login email. There is no current runtime contract for opting into product, room, creator, or moderation notification categories.",
    capabilities: [
      {
        id: "contact",
        label: "Contact",
        title: "Contact Email",
        body: "Crestfall already saves the email address it may use to contact you without changing your authentication/login email.",
        status: "LIVE",
        href: "/studio/v2/account#account-contact",
        actionLabel: "Manage contact email",
      },
      {
        id: "product",
        label: "Product",
        title: "Product Updates",
        body: "There is no persisted opt-in/out preference for roadmap announcements or product-update mail today.",
        status: "NOT_CONNECTED",
      },
      {
        id: "rooms",
        label: "Rooms",
        title: "Room Activity",
        body: "Invitations, replies, turn reminders, and story-activity notification preferences are not account-backed yet.",
        status: "NOT_CONNECTED",
      },
      {
        id: "creator",
        label: "Creator",
        title: "Creator & Review Alerts",
        body: "Review status, creator activity, and moderation-notification preferences do not have a current account settings endpoint.",
        status: "NOT_CONNECTED",
      },
    ],
  },
  privacy: {
    eyebrow: "Account",
    title: "Privacy",
    description:
      "Keep the profile data Crestfall actually owns distinct from privacy controls that do not yet have a supported mutation contract.",
    summaryTitle: "Public profile content is live; privacy toggles are not",
    summaryBody:
      "Username and public profile text are current persisted profile fields. The current account API does not expose a supported mutation for profile discoverability, public activity visibility, blocked users, or similar privacy switches.",
    capabilities: [
      {
        id: "profile",
        label: "Profile",
        title: "Public Profile Identity & Text",
        body: "Your username, display name, tagline, description, and announcement are real profile state and can be managed from the Account page.",
        status: "LIVE",
        href: "/studio/v2/account#public-profile",
        actionLabel: "Manage public profile",
      },
      {
        id: "visibility",
        label: "Visibility",
        title: "Profile Visibility",
        body: "A dedicated account-side visibility/discoverability mutation is not exposed by the current profile update contract.",
        status: "NOT_CONNECTED",
      },
      {
        id: "activity",
        label: "Activity",
        title: "Public Activity",
        body: "Likes, follows, comments, and recent-activity visibility are not configurable through current account settings.",
        status: "NOT_CONNECTED",
      },
      {
        id: "blocking",
        label: "Safety",
        title: "Blocked Users",
        body: "A user-level block/mute settings contract is not present in the supplied account runtime and is not simulated here.",
        status: "NOT_CONNECTED",
      },
    ],
  },
  safety: {
    eyebrow: "Account",
    title: "Safety & Content Settings",
    description:
      "Use the content preference Crestfall actually persists today while keeping future comfort, discovery, and moderation controls visibly separate.",
    summaryTitle: "Content preference is live and age-gated",
    summaryBody:
      "The current profile persists a content-rating preference. Everyone/SFW is available now; higher content tiers remain subject to the existing age/content-control gate rather than being silently enabled from this page.",
    capabilities: [
      {
        id: "rating",
        label: "Content",
        title: "Content Preference",
        body: "Manage your current profile-backed content preference on the Account page. Higher tiers remain gated until the required platform controls are active.",
        status: "LIVE",
        href: "/studio/v2/account#content-preference",
        actionLabel: "Manage content preference",
      },
      {
        id: "comfort",
        label: "Comfort",
        title: "Comfort Settings",
        body: "Blocked themes, warning preferences, sensitive-topic controls, and personal boundaries are not persisted account settings yet.",
        status: "NOT_CONNECTED",
      },
      {
        id: "discovery",
        label: "Discovery",
        title: "Safety Discovery Filters",
        body: "Account-level filtering by tags, themes, creator trust, or moderation state does not have a current persistence contract.",
        status: "NOT_CONNECTED",
      },
      {
        id: "moderation",
        label: "Moderation",
        title: "Reports & Safety Tools",
        body: "Reporting may exist on individual content surfaces, but moderation history, appeals, and account-level safety controls are not implemented as Account settings here.",
        status: "NOT_CONNECTED",
      },
    ],
  },
});

export function getAccountSettingsConfig(id) {
  return ACCOUNT_SETTINGS_CONFIG[id] || null;
}
