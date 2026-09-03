"use client";

import NarratorDirectivesEditor from "@/components/studio/narrators/advanced-prompting/NarratorDirectivesEditor";
import PriorityTriadEditor from "@/components/studio/my-creations/edit/priority-triads/PriorityTriadEditor";

import NarratorGuidanceSectionView from "./narrator-guidance-section/NarratorGuidanceSection.view";
import { useNarratorGuidanceSectionViewModel } from "./narrator-guidance-section/useNarratorGuidanceSectionViewModel";

export default function NarratorGuidanceSection(props) {
  const viewProps = useNarratorGuidanceSectionViewModel(props);

  return (
    <NarratorGuidanceSectionView
      {...viewProps}
      presentationPrioritiesControl={
        <PriorityTriadEditor
          title={viewProps.presentationPrioritiesTitle}
          description={viewProps.presentationPrioritiesDescription}
          authorityNote={viewProps.presentationPrioritiesAuthorityNote}
          options={viewProps.presentationPriorityOptions}
          value={viewProps.presentationPrioritiesValue}
          onChange={viewProps.onChangePresentationPriorities}
        />
      }
      narratorDirectivesControl={
        <NarratorDirectivesEditor
          value={viewProps.narratorDirectivesValue}
          onChange={viewProps.onChangeNarratorDirectives}
        />
      }
    />
  );
}
