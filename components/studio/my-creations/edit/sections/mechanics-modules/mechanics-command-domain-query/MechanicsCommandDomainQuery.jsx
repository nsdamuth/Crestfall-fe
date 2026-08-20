"use client";

import MechanicsCommandDomainQueryView from "./MechanicsCommandDomainQuery.view.jsx";
import useMechanicsCommandDomainQueryViewModel from "./useMechanicsCommandDomainQueryViewModel.js";

export default function MechanicsCommandDomainQuery(props) {
  return (
    <MechanicsCommandDomainQueryView
      {...useMechanicsCommandDomainQueryViewModel(props)}
    />
  );
}
