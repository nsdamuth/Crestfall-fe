"use client";

import NarratorDirectivesEditor from "@/components/studio/narrators/advanced-prompting/NarratorDirectivesEditor";

import NarratorGuidanceSectionView from "./narrator-guidance-section/NarratorGuidanceSection.view";
import { useNarratorGuidanceSectionViewModel } from "./narrator-guidance-section/useNarratorGuidanceSectionViewModel";

export default function NarratorGuidanceSection(props) {
  const viewProps = useNarratorGuidanceSectionViewModel(props);

  return (
    <NarratorGuidanceSectionView
      {...viewProps}
      narratorDirectivesControl={
        <NarratorDirectivesEditor
          value={viewProps.narratorDirectivesValue}
          onChange={viewProps.onChangeNarratorDirectives}
        />
      }
    />
  );
}
