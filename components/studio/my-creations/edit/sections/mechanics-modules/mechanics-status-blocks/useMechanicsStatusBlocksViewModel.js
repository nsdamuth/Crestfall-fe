"use client";

import { useMemo } from "react";

import {
  normalizeMechanicsStatusBlocks,
  summarizeMechanicsStatusBlock,
} from "./mechanicsStatusBlocksNormalization.js";
import {
  addMechanicsStatusBlock,
  addMechanicsStatusBlockLine,
  patchMechanicsStatusBlock,
  patchMechanicsStatusBlockLine,
  removeMechanicsStatusBlock,
  removeMechanicsStatusBlockLine,
} from "./mechanicsStatusBlocksOperations.js";

export default function useMechanicsStatusBlocksViewModel({
  statusBlocks,
  onChange,
  foldSignal,
}) {
  const normalized = useMemo(
    () => normalizeMechanicsStatusBlocks(statusBlocks),
    [statusBlocks]
  );

  function commit(nextBlocks) {
    onChange?.(normalizeMechanicsStatusBlocks(nextBlocks));
  }

  return {
    statusBlocks: normalized.map((block, index) => ({
      ...block,
      summary: summarizeMechanicsStatusBlock(block, index),
    })),
    foldSignal,
    addBlock() {
      commit(addMechanicsStatusBlock(normalized));
    },
    patchBlock(blockIndex, patch) {
      commit(patchMechanicsStatusBlock(normalized, blockIndex, patch));
    },
    removeBlock(blockIndex) {
      commit(removeMechanicsStatusBlock(normalized, blockIndex));
    },
    addLine(blockIndex, line) {
      commit(addMechanicsStatusBlockLine(normalized, blockIndex, line));
    },
    patchLine(blockIndex, lineIndex, line) {
      commit(
        patchMechanicsStatusBlockLine(
          normalized,
          blockIndex,
          lineIndex,
          line
        )
      );
    },
    removeLine(blockIndex, lineIndex) {
      commit(
        removeMechanicsStatusBlockLine(normalized, blockIndex, lineIndex)
      );
    },
  };
}
