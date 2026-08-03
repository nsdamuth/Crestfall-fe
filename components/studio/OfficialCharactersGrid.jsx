"use client";

import Link from "next/link";

import OfficialCharactersGridView from "./official-characters-grid/OfficialCharactersGrid.view";
import { useOfficialCharactersGridViewModel } from "./official-characters-grid/useOfficialCharactersGridViewModel";

export default function OfficialCharactersGrid(props) {
  const viewProps = useOfficialCharactersGridViewModel(props);

  return <OfficialCharactersGridView {...viewProps} LinkComponent={Link} />;
}
