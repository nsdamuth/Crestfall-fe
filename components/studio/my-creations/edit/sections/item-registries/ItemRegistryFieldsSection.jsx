"use client";

import ItemStartingAssignmentEditor from "@/components/studio/registries/ItemStartingAssignmentEditor";

import ItemRegistryFieldsSectionView from "./item-registry-fields-section/ItemRegistryFieldsSection.view";
import { useItemRegistryFieldsSectionViewModel } from "./item-registry-fields-section/useItemRegistryFieldsSectionViewModel";

export default function ItemRegistryFieldsSection(props) {
  const { viewProps, applicationContentProps } =
    useItemRegistryFieldsSectionViewModel(props);

  const startingAssignmentContentByEntryId = Object.fromEntries(
    applicationContentProps.registryEntries.map((entry) => [
      entry.id,
      <ItemStartingAssignmentEditor
        key={entry.id}
        entry={entry}
        onChange={(startingAssignment) =>
          applicationContentProps.updateEntryStartingAssignment(
            entry.id,
            startingAssignment
          )
        }
      />,
    ])
  );

  return (
    <ItemRegistryFieldsSectionView
      {...viewProps}
      startingAssignmentContentByEntryId={startingAssignmentContentByEntryId}
    />
  );
}
