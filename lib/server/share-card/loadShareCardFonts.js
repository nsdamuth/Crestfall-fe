// The share-card image route's font bytes. next/font/google serves the
// app's faces as hashed woff2 files Satori cannot read, so the two
// families the card uses are vendored here as static woff files under
// the SIL Open Font License (fonts/OFL-*.txt). Read once per process.

import fs from "node:fs/promises";
import path from "node:path";

const FONT_DIR = path.join(process.cwd(), "lib", "server", "share-card", "fonts");

export const SHARE_CARD_FONT_FAMILIES = Object.freeze({
  display: "Cormorant Garamond",
  sans: "Inter",
});

const FONT_FILES = Object.freeze([
  { name: SHARE_CARD_FONT_FAMILIES.display, file: "CormorantGaramond-600.woff", weight: 600, style: "normal" },
  { name: SHARE_CARD_FONT_FAMILIES.sans, file: "Inter-400.woff", weight: 400, style: "normal" },
  { name: SHARE_CARD_FONT_FAMILIES.sans, file: "Inter-500.woff", weight: 500, style: "normal" },
]);

let cache = null;

export async function loadShareCardFonts() {
  if (cache) return cache;

  cache = await Promise.all(
    FONT_FILES.map(async ({ file, ...font }) => {
      const buffer = await fs.readFile(path.join(FONT_DIR, file));
      return { ...font, data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) };
    })
  );

  return cache;
}
