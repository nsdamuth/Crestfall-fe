import AccountStubPage from "@/components/studio/account/AccountStubPage";

export default function NotificationsPage() {
  return (
    <AccountStubPage
      eyebrow="Account"
      title="Notifications"
      description="Email, product updates, room activity, creator activity, and review status notifications."
      cards={[
        {
          eyebrow: "Email",
          title: "Email Preferences",
          body: "Control transactional emails, product updates, roadmap announcements, and account notices.",
        },
        {
          eyebrow: "Rooms",
          title: "Room Activity",
          body: "Future notifications for room invitations, replies, turn reminders, and story activity.",
        },
        {
          eyebrow: "Creator",
          title: "Creator Alerts",
          body: "Updates for creation reviews, public approvals, comments, favorites, remixes, and community activity.",
        },
        {
          eyebrow: "Moderation",
          title: "Review & Safety",
          body: "Future notifications for content review, canon submission status, policy flags, and moderation actions.",
        },
      ]}
    />
  );
}