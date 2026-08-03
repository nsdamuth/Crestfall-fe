"use client";

import ActorMechanicsProfileJsonEditorModalView from "./ActorMechanicsProfileJsonEditorModal.view";
import { useActorMechanicsProfileJsonEditorViewModel } from "./useActorMechanicsProfileJsonEditorViewModel";

export default function ActorMechanicsProfileJsonEditorModal(props) {
  const viewProps = useActorMechanicsProfileJsonEditorViewModel(props);
  return <ActorMechanicsProfileJsonEditorModalView {...viewProps} />;
}
