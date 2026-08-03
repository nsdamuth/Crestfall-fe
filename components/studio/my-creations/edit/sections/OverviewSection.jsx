import CreationOverviewSectionView from "@/components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.view";
import { useCreationOverviewSectionViewModel } from "@/components/studio/my-creations/edit/sections/creation-overview-section/useCreationOverviewSectionViewModel";

export default function OverviewSection(props) {
  const viewProps = useCreationOverviewSectionViewModel(props);
  return <CreationOverviewSectionView {...viewProps} />;
}
