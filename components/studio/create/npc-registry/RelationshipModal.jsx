"use client";

import RelationshipModalView from "./relationship-rule/RelationshipModal.view";
import { useRelationshipModalViewModel } from "./relationship-rule/useRelationshipModalViewModel";

export default function RelationshipModal(props) {
  const viewProps = useRelationshipModalViewModel(props);

  return <RelationshipModalView {...viewProps} />;
}
