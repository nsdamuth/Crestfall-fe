import CreationStatusBadgesView from "./creation-status-badges/CreationStatusBadges.view";
import { useCreationStatusBadgesViewModel } from "./creation-status-badges/useCreationStatusBadgesViewModel";

export default function CreationStatusBadges(props) {
  const viewProps = useCreationStatusBadgesViewModel(props);

  return <CreationStatusBadgesView {...viewProps} />;
}
