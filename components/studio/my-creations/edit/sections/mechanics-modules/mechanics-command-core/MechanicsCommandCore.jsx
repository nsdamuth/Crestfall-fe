"use client";

import { useMechanicsCommandCoreViewModel } from "./useMechanicsCommandCoreViewModel.js";
import {
  MechanicsCommandArgumentsView,
  MechanicsCommandIdentityView,
  MechanicsCommandInvocationView,
  MechanicsCommandTriggersView,
} from "./MechanicsCommandCore.view.jsx";

export function MechanicsCommandIdentitySection(props) {
  return (
    <MechanicsCommandIdentityView
      model={useMechanicsCommandCoreViewModel(props)}
      onRemoveCommand={props.onRemoveCommand}
    />
  );
}

export function MechanicsCommandInvocationSection(props) {
  return <MechanicsCommandInvocationView model={useMechanicsCommandCoreViewModel(props)} />;
}

export function MechanicsCommandArgumentsSection(props) {
  return <MechanicsCommandArgumentsView model={useMechanicsCommandCoreViewModel(props)} />;
}

export function MechanicsCommandTriggersSection(props) {
  return <MechanicsCommandTriggersView model={useMechanicsCommandCoreViewModel(props)} />;
}
