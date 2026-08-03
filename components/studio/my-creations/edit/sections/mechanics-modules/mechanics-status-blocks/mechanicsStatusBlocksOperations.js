import {
  normalizeMechanicsStatusBlock,
  normalizeMechanicsStatusBlocks,
  normalizeMechanicsStatusBlockString,
  slugifyMechanicsStatusBlockId,
} from "./mechanicsStatusBlocksNormalization.js";

function uniqueStatusBlockId(blocks = []) {
  const existing = new Set(blocks.map((block) => String(block?.id || "")));
  let index = blocks.length + 1;
  let candidate = `status_block_${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `status_block_${index}`;
  }
  return candidate;
}

export function addMechanicsStatusBlock(statusBlocks) {
  const normalized = normalizeMechanicsStatusBlocks(statusBlocks);
  const id = uniqueStatusBlockId(normalized);
  return [
    ...normalized,
    normalizeMechanicsStatusBlock(
      {
        id,
        slot: "main_footer",
        label: `Status Block ${normalized.length + 1}`,
        placement: "response_end",
        required: true,
        visibility: "public",
        lines: [],
      },
      normalized.length
    ),
  ];
}

export function patchMechanicsStatusBlock(statusBlocks, blockIndex, patch) {
  const normalized = normalizeMechanicsStatusBlocks(statusBlocks);
  return normalized.map((block, index) =>
    index === blockIndex
      ? normalizeMechanicsStatusBlock(
          {
            ...block,
            ...patch,
            ...(patch?.id !== undefined
              ? {
                  id: slugifyMechanicsStatusBlockId(
                    patch.id,
                    `status_block_${blockIndex + 1}`
                  ),
                }
              : {}),
            ...(patch?.slot !== undefined
              ? {
                  slot: slugifyMechanicsStatusBlockId(
                    patch.slot,
                    "main_footer"
                  ),
                }
              : {}),
          },
          index
        )
      : block
  );
}

export function removeMechanicsStatusBlock(statusBlocks, blockIndex) {
  return normalizeMechanicsStatusBlocks(statusBlocks).filter(
    (_block, index) => index !== blockIndex
  );
}

export function addMechanicsStatusBlockLine(statusBlocks, blockIndex, line) {
  const normalized = normalizeMechanicsStatusBlocks(statusBlocks);
  const safeLine = normalizeMechanicsStatusBlockString(line);
  if (!safeLine || !normalized[blockIndex]) return normalized;
  return patchMechanicsStatusBlock(normalized, blockIndex, {
    lines: [...normalized[blockIndex].lines, safeLine],
  });
}

export function patchMechanicsStatusBlockLine(
  statusBlocks,
  blockIndex,
  lineIndex,
  line
) {
  const normalized = normalizeMechanicsStatusBlocks(statusBlocks);
  if (!normalized[blockIndex]) return normalized;
  return patchMechanicsStatusBlock(normalized, blockIndex, {
    lines: normalized[blockIndex].lines.map((currentLine, index) =>
      index === lineIndex ? String(line ?? "") : currentLine
    ),
  });
}

export function removeMechanicsStatusBlockLine(
  statusBlocks,
  blockIndex,
  lineIndex
) {
  const normalized = normalizeMechanicsStatusBlocks(statusBlocks);
  if (!normalized[blockIndex]) return normalized;
  return patchMechanicsStatusBlock(normalized, blockIndex, {
    lines: normalized[blockIndex].lines.filter(
      (_line, index) => index !== lineIndex
    ),
  });
}
