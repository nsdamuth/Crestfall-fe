import StudioBackLink from "@/components/studio/StudioBackLink";
import StudioPageHeader from "@/components/studio/StudioPageHeader";
import WalletProfileBuilderShell from "@/components/studio/create/wallet/WalletProfileBuilderShell";

export default function CreateWalletProfilePage() {
  return (
    <div className="space-y-6">
      <StudioBackLink href="/studio?mode=full&section=mechanics" label="Back to Full Studio" />
      <StudioPageHeader
        eyebrow="Gameplay Economy Definitions"
        title="Create Wallet Profile"
      >
        Define reusable gameplay currencies, starting balances, and allowed
        balance bounds for attachment through an Actor Mechanics Profile.
        Crestfall Studio Coins remain separate product currency.
      </StudioPageHeader>
      <WalletProfileBuilderShell />
    </div>
  );
}
