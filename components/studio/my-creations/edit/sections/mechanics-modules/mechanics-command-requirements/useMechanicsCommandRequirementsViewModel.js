"use client";

import { useMemo } from "react";
import { createMechanicsCommandRequirementsController } from "./mechanicsCommandRequirementsOperations.js";

export default function useMechanicsCommandRequirementsViewModel(props) {
  return useMemo(
    () => createMechanicsCommandRequirementsController(props),
    [props.requirements, props.commandIndex, props.onPatchCommand]
  );
}
