import Link from "next/link";

import CreateTypeCardView from "./create-type-card/CreateTypeCard.view";

export default function CreateTypeCard(props) {
  return <CreateTypeCardView {...props} LinkComponent={Link} />;
}
