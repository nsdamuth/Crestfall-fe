"use client";

import Link from "next/link";

import StorylinesHubView from "./storylines-hub/StorylinesHub.view";
import { useStorylinesHubViewModel } from "./storylines-hub/useStorylinesHubViewModel";

export default function StorylinesHub(props) {
  const viewProps = useStorylinesHubViewModel(props);

  return (
    <StorylinesHubView
      {...viewProps}
      InternalLinkComponent={Link}
    />
  );
}
