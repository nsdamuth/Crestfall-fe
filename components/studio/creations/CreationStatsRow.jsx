import CreationStatsRowView from "./creation-stats-row/CreationStatsRow.view";
import { useCreationStatsRowViewModel } from "./creation-stats-row/useCreationStatsRowViewModel";

export default function CreationStatsRow(props) {
  const viewProps = useCreationStatsRowViewModel(props);

  return <CreationStatsRowView {...viewProps} />;
}
