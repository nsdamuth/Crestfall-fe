"use client";

import MechanicsCommandDomainActionsView from "./MechanicsCommandDomainActions.view.jsx";
import useMechanicsCommandDomainActionsViewModel from "./useMechanicsCommandDomainActionsViewModel.js";

export default function MechanicsCommandDomainActions(props) {
  return <MechanicsCommandDomainActionsView {...useMechanicsCommandDomainActionsViewModel(props)} />;
}
