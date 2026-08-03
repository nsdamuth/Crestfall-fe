"use client";

import Link from "next/link";

import CreatorListRowView from "./creator-list-row/CreatorListRow.view";
import { useCreatorListRowViewModel } from "./creator-list-row/useCreatorListRowViewModel";

export default function CreatorListRow(props) {
  const viewProps = useCreatorListRowViewModel(props);

  return <CreatorListRowView {...viewProps} LinkComponent={Link} />;
}
