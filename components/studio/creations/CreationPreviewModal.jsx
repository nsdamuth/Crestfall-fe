"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import KitModalFrame from "@/components/kit/KitModalFrame";

import CreationCredits from "./CreationCredits";
import CreationShareButton from "./CreationShareButton";
import CreationStatsRow from "./CreationStatsRow";
import CreationStatusBadges from "./CreationStatusBadges";
import CreationPreviewModalView from "./creation-preview-modal/CreationPreviewModal.view";
import { useCreationPreviewModalViewModel } from "./creation-preview-modal/useCreationPreviewModalViewModel";

export default function CreationPreviewModal(props) {
  const router = useRouter();
  const viewProps = useCreationPreviewModalViewModel({
    ...props,
    navigate: (href) => router.push(href),
  });

  if (!viewProps) return null;

  return (
    <KitModalFrame onClose={props.onClose} ariaLabel="Creation preview" panelClassName="max-w-4xl">
      <CreationPreviewModalView
        {...viewProps}
        LinkComponent={Link}
        StatusBadgesComponent={CreationStatusBadges}
        StatsRowComponent={CreationStatsRow}
        CreditsComponent={CreationCredits}
        ShareButtonComponent={CreationShareButton}
      />
    </KitModalFrame>
  );
}
