"use client";

import ItemStartingAssignmentEditor from "@/components/studio/registries/ItemStartingAssignmentEditor";
import ItemRegistryBuilderView from "./item-registry-builder/ItemRegistryBuilder.view";
import { useItemRegistryBuilderViewModel } from "./item-registry-builder/useItemRegistryBuilderViewModel";

export default function ItemRegistryBuilder(props) {
  const { viewProps, applicationContentProps } =
    useItemRegistryBuilderViewModel(props);

  const startingAssignmentContentByEntryId = Object.fromEntries(
    applicationContentProps.registryData.entries.map((entry) => [
      entry.id,
      <ItemStartingAssignmentEditor
        key={entry.id}
        entry={entry}
        onChange={(startingAssignment) =>
          applicationContentProps.updateEntry(entry.id, {
            startingAssignment,
          })
        }
      />,
    ])
  );

  return (
    <ItemRegistryBuilderView
      {...viewProps}
      startingAssignmentContentByEntryId={startingAssignmentContentByEntryId}
    />
  );
}
