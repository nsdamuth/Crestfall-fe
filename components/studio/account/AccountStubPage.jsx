import Link from "next/link";

import AccountStubPageView from "./account-stub-page/AccountStubPage.view";

const ACCOUNT_STUB_NOTICE =
  "These controls are frontend placeholders. They do not connect to billing, subscriptions, saved preferences, moderation settings, or notification services yet.";

export default function AccountStubPage(props) {
  return (
    <AccountStubPageView
      backHref="/studio/account"
      backLabel="Back to Account"
      returnHref="/studio/account"
      returnLabel="Return to Account"
      notice={ACCOUNT_STUB_NOTICE}
      {...props}
      LinkComponent={Link}
    />
  );
}
