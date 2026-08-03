import AccountStubPage from "@/components/studio/account/AccountStubPage";

export default function AppearancePage() {
  return (
    <AccountStubPage
      eyebrow="Account"
      title="Appearance"
      description="Theme, density, layout, and Studio display preferences."
      cards={[
        {
          eyebrow: "Theme",
          title: "Theme Mode",
          body: "Future controls for dark mode, high contrast mode, accent color, and seasonal visual treatments.",
        },
        {
          eyebrow: "Density",
          title: "Display Density",
          body: "Choose comfortable, compact, or spacious layout defaults for Studio pages and creation tools.",
        },
        {
          eyebrow: "Cards",
          title: "Card Display",
          body: "Set preferred card sizes, thumbnail behavior, image preview density, and compact mobile grid defaults.",
        },
        {
          eyebrow: "Motion",
          title: "Motion & Effects",
          body: "Future reduced-motion, animation, blur, glow, and transition preferences will live here.",
        },
      ]}
    />
  );
}