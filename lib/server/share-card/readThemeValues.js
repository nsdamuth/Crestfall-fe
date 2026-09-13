// Reads design values for the share-card image route from
// app/theme.css, the only file that declares a token (Ruling 1, 7 Aug
// 2026). Satori cannot resolve var(--name) at render time, so the
// route asks this reader for the handful of names the card renderer
// uses and gets the dark theme values back. No value is written in
// code; a rename in theme.css reaches the card on the next request.

import fs from "node:fs";
import path from "node:path";

const THEME_PATH = path.join(process.cwd(), "app", "theme.css");

let cache = null;

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

// Every ":root { ... }" block holds dark values; the light theme lives
// under [data-theme="light"] and is skipped. Later declarations win,
// matching the cascade.
function collectRootDeclarations(css) {
  const declarations = new Map();
  const blockPattern = /:root\s*\{([^}]*)\}/g;
  let block;

  while ((block = blockPattern.exec(css)) !== null) {
    const declarationPattern = /--([\w-]+)\s*:\s*([^;]+);/g;
    let declaration;
    while ((declaration = declarationPattern.exec(block[1])) !== null) {
      declarations.set(declaration[1], declaration[2].replace(/\s+/g, " ").trim());
    }
  }

  return declarations;
}

function resolveReferences(value, declarations, depth = 0) {
  if (depth > 8) return value;
  return value.replace(/var\(--([\w-]+)(?:\s*,\s*([^)]+))?\)/g, (match, name, fallback) => {
    const referent = declarations.get(name);
    if (referent !== undefined) return resolveReferences(referent, declarations, depth + 1);
    return fallback ? fallback.trim() : match;
  });
}

export function loadThemeDeclarations() {
  if (cache) return cache;
  const css = stripComments(fs.readFileSync(THEME_PATH, "utf8"));
  cache = collectRootDeclarations(css);
  return cache;
}

/**
 * @param {string[]} names token names without the leading dashes
 * @returns {(name: string) => string} resolver returning a concrete
 *   CSS value, or an empty string for a name theme.css does not declare
 */
export function createThemeValueResolver(names = []) {
  const declarations = loadThemeDeclarations();
  const resolved = new Map();

  for (const name of names) {
    const raw = declarations.get(name);
    resolved.set(name, raw === undefined ? "" : resolveReferences(raw, declarations));
  }

  return (name) => {
    if (resolved.has(name)) return resolved.get(name);
    const raw = declarations.get(name);
    const value = raw === undefined ? "" : resolveReferences(raw, declarations);
    resolved.set(name, value);
    return value;
  };
}
