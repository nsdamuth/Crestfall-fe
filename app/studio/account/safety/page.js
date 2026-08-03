import AccountStubPage from "@/components/studio/account/AccountStubPage";

export default function SafetyPage() {
  return (
    <AccountStubPage
      eyebrow="Account"
      title="Safety & Content Settings"
      description="Content boundaries, comfort settings, rating preferences, and future moderation controls."
      cards={[
        {
          eyebrow: "Content Rating",
          title: "Rating Preferences",
          body: "Control SFW, mature, and web-only explicit content visibility once platform-wide content settings are connected.",
        },
        {
          eyebrow: "Comfort",
          title: "Comfort Settings",
          body: "Future controls for blocked themes, warning preferences, sensitive topics, and personal content boundaries.",
        },
        {
          eyebrow: "Discovery",
          title: "Discovery Filters",
          body: "Hide or prioritize content based on rating, tags, themes, creator trust, and moderation status.",
        },
        {
          eyebrow: "Moderation",
          title: "Reports & Safety Tools",
          body: "Future tools for reports, appeals, moderation history, hidden content, and trust/safety actions.",
        },
      ]}
    />
  );
}