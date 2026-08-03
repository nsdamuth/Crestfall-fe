import ProfileMediaManagerView from "./profile-media-manager/ProfileMediaManager.view";
import { useProfileMediaManagerViewModel } from "./profile-media-manager/useProfileMediaManagerViewModel";

export default function ProfileMediaManager(props) {
  const viewProps = useProfileMediaManagerViewModel(props);

  return <ProfileMediaManagerView {...viewProps} />;
}
