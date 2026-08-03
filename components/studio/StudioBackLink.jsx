import Link from "next/link";

import StudioBackLinkView from "./studio-back-link/StudioBackLink.view";

export default function StudioBackLink(props) {
  return <StudioBackLinkView {...props} LinkComponent={Link} />;
}
