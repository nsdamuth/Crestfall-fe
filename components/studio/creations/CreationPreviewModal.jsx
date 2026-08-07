"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import ModalShell from "@/components/ui/ModalShell";

import CreationCredits from "./CreationCredits";
import CreationShareButton from "./CreationShareButton";
import CreationStatsRow from "./CreationStatsRow";
import CreationStatusBadges from "./CreationStatusBadges";
import CreationPreviewModalView from "./creation-preview-modal/CreationPreviewModal.view";
import { useCreationPreviewModalViewModel } from "./creation-preview-modal/useCreationPreviewModalViewModel";

const PANEL_CLASS_NAME =
  "relative max-h-[92vh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)] lg:overflow-hidden";

export default function CreationPreviewModal(props) {
  const router = useRouter();
  const viewProps = useCreationPreviewModalViewModel({
    ...props,
    navigate: (href) => router.push(href),
  });

  if (!viewProps) return null;

  return (
    <ModalShell onClose={props.onClose} panelClassName={PANEL_CLASS_NAME}>
      <CreationPreviewModalView
        {...viewProps}
        LinkComponent={Link}
        StatusBadgesComponent={CreationStatusBadges}
        StatsRowComponent={CreationStatsRow}
        CreditsComponent={CreationCredits}
        ShareButtonComponent={CreationShareButton}
      />
    </ModalShell>
  );
}
