"use client";

import { createCommandCoreController } from "./mechanicsCommandCoreOperations.js";

export function useMechanicsCommandCoreViewModel(props) {
  return {
    ...createCommandCoreController(props),
    commandIndex: props.commandIndex,
  };
}
