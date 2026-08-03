"use client";

import Link from "next/link";

import CreationPreviewModal from "./CreationPreviewModal";
import CreationCardView from "./creation-card/CreationCard.view";
import { useCreationCardViewModel } from "./creation-card/useCreationCardViewModel";

export default function CreationCard(props) {
  const { cardViewProps, previewModalProps } = useCreationCardViewModel(props);

  return (
    <>
      <CreationCardView {...cardViewProps} LinkComponent={Link} />
      {previewModalProps ? <CreationPreviewModal {...previewModalProps} /> : null}
    </>
  );
}
