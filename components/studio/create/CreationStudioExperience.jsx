"use client";

import Link from "next/link";

import CreationStudioView from "./creation-studio/CreationStudio.view";
import { useCreationStudioViewModel } from "./creation-studio/useCreationStudioViewModel";

export default function CreationStudioExperience() {
  const viewModel = useCreationStudioViewModel();

  return <CreationStudioView {...viewModel} LinkComponent={Link} />;
}
