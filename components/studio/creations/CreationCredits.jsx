import Link from "next/link";

import CreationCreditsView from "./creation-credits/CreationCredits.view";

export default function CreationCredits(props) {
  return <CreationCreditsView {...props} LinkComponent={Link} />;
}
