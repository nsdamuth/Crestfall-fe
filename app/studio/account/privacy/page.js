import AccountStubPage from "@/components/studio/account/AccountStubPage";

export default function PrivacyPage() {
  return (
    <AccountStubPage
      eyebrow="Account"
      title="Privacy"
      description="Profile visibility, public activity, blocked users, and account discoverability controls."
      cards={[
        {
          eyebrow: "Profile",
          title: "Public Profile Visibility",
          body: "Control whether your creator profile is public, searchable, and visible from community surfaces.",
        },
        {
          eyebrow: "Activity",
          title: "Public Activity",
          body: "Future controls for showing likes, public creations, comments, follows, recent activity, and creator badges.",
        },
        {
          eyebrow: "Discovery",
          title: "Discoverability",
          body: "Manage whether other users can find your profile, creations, rooms, or community contributions.",
        },
        {
          eyebrow: "Blocking",
          title: "Blocked Users",
          body: "Future controls for blocked users, muted creators, hidden content, and community safety preferences.",
        },
      ]}
    />
  );
}