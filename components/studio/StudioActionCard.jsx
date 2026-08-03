import Link from "next/link";

import StudioActionCardView from "./studio-action-card/StudioActionCard.view";

export default function StudioActionCard(props) {
  return <StudioActionCardView {...props} LinkComponent={Link} />;
}
