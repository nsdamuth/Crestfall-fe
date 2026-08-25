"use client";

import Link from "next/link";

import KitCreditsView from "./credits/KitCredits.view";
import { useKitCreditsViewModel } from "./credits/useKitCreditsViewModel";

export default function KitCredits(props) {
  const viewProps = useKitCreditsViewModel({ LinkComponent: Link, ...props });

  return <KitCreditsView {...viewProps} />;
}
