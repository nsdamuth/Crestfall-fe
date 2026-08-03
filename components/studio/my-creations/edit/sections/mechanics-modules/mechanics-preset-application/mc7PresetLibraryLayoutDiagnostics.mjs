import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewPath = path.join(__dirname, "MechanicsPresetApplicationModal.view.jsx");
const view = fs.readFileSync(viewPath, "utf8");

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

check("Preset View remains a client-side portable View", () => {
  assert.match(view, /^"use client";/);
  assert.doesNotMatch(view, /\bfetch\s*\(/);
  assert.doesNotMatch(view, /Supabase|PostGraphile|services-api/);
});

check("Preset View uses presentation-only folder state", () => {
  assert.match(view, /useEffect, useMemo, useState/);
  assert.match(view, /function PresetFolder/);
});

check("Catalog retains four stable folders", () => {
  assert.match(view, /id: "MODULE"/);
  assert.match(view, /id: "COMMAND"/);
  assert.match(view, /id: "COMMAND_RESOLUTION"/);
  assert.match(view, /id: "COMMAND_COMPOSITION"/);
});

check("Folder labels remain stable", () => {
  assert.match(view, /label: "Module Starters"/);
  assert.match(view, /label: "Command Starters"/);
  assert.match(view, /label: "Resolution References"/);
  assert.match(view, /label: "Composition References"/);
});

check("Folder cards remain semantic and compact", () => {
  assert.match(view, /presetCards\.filter\(\(preset\) => preset\.scope === definition\.id\)/);
  assert.match(view, /px-3 py-2\.5 text-left/);
  assert.match(view, /truncate text-sm/);
});

check("Folders retain accessible expanded state", () => {
  assert.match(view, /aria-expanded=\{expanded\}/);
  assert.match(view, /setExpanded\(\(current\) => !current\)/);
});

check("Selected search and scope state still opens folders", () => {
  assert.match(view, /containsSelectedPreset/);
  assert.match(view, /queryActive/);
  assert.match(view, /scopeFocused=\{scopeFilter === folder\.id\}/);
});

check("Unavailable presets retain their warning", () => {
  assert.match(view, /preset\.unavailableReason \|\| preset\.summary/);
  assert.match(view, /AlertTriangle/);
});

check("Preset modal owns a dedicated dialog frame", () => {
  assert.doesNotMatch(view, /import ModalShell/);
  assert.doesNotMatch(view, /<ModalShell/);
  assert.match(view, /function PresetLibraryModalFrame/);
  assert.match(view, /<PresetLibraryModalFrame onClose=\{onClose\}>/);
});

check("Dedicated frame is viewport fixed and capped", () => {
  assert.match(view, /fixed inset-0 z-50/);
  assert.match(view, /height: "min\(88dvh, 48rem\)"/);
  assert.match(view, /maxHeight: "calc\(100dvh - 1rem\)"/);
});

check("Dialog uses explicit three-row layout", () => {
  assert.match(view, /className="grid min-h-0 w-\[min\(96vw,72rem\)\]/);
  assert.match(view, /gridTemplateRows: "auto minmax\(0, 1fr\) auto"/);
});

check("Dialog semantics remain explicit", () => {
  assert.match(view, /role="dialog"/);
  assert.match(view, /aria-modal="true"/);
  assert.match(view, /aria-labelledby="mechanics-preset-library-title"/);
  assert.match(view, /id="mechanics-preset-library-title"/);
});

check("Escape closes and background scrolling is locked", () => {
  assert.match(view, /event\.key === "Escape"/);
  assert.match(view, /document\.body\.style\.overflow = "hidden"/);
  assert.match(view, /document\.removeEventListener\("keydown", handleKeyDown\)/);
});

check("One explicit body scroller owns all long modal content", () => {
  assert.match(view, /crestfall-preset-library-scroll min-h-0 overflow-y-scroll/);
  assert.match(view, /overflowY: "scroll"/);
  assert.match(view, /scrollbarGutter: "stable"/);
  assert.doesNotMatch(view, /md:overflow-y-scroll/);
});

check("Header and footer remain outside the body scroller", () => {
  const bodyIndex = view.indexOf("crestfall-preset-library-scroll");
  const footerIndex = view.indexOf("Applying updates the current builder only");
  assert.ok(bodyIndex > 0);
  assert.ok(footerIndex > bodyIndex);
  assert.match(view, /border-t border-white\/10 p-4/);
});

check("Body keeps a responsive two-column content grid", () => {
  assert.match(view, /md:grid-cols-\[18rem_minmax\(0,1fr\)\]/);
  assert.match(view, /md:items-start/);
  assert.match(view, /<aside className="min-w-0">/);
  assert.match(view, /<main className="min-w-0">/);
});

check("Visible scrollbar styling is authored explicitly", () => {
  assert.match(view, /scrollbar-width: auto !important/);
  assert.match(view, /::-webkit-scrollbar/);
  assert.match(view, /display: block !important/);
  assert.match(view, /width: 12px !important/);
  assert.match(view, /::-webkit-scrollbar-thumb/);
});

check("Search icon is a separate flex child instead of an overlay", () => {
  assert.match(view, /flex min-w-0 items-center gap-2 rounded-xl/);
  assert.match(view, /<Search\s+size=\{15\}\s+aria-hidden="true"/s);
  assert.doesNotMatch(view, /absolute inset-y-0 left-0/);
});

check("Search input resets inherited spacing and chrome", () => {
  assert.match(view, /className="min-w-0 flex-1 !border-0 !bg-transparent !p-0/);
  assert.match(view, /padding: 0/);
  assert.match(view, /border: 0/);
  assert.match(view, /boxShadow: "none"/);
});

check("Detail sidebar remains compact", () => {
  assert.match(view, /xl:grid-cols-\[minmax\(0,1fr\)_18rem\]/);
});

check("Preset selection remains semantic", () => {
  assert.match(view, /onChoosePreset\?\.\(preset\.id\)/);
});

check("Application callbacks remain unchanged", () => {
  assert.match(view, /onChooseApplyMode\?\.\(option\.id\)/);
  assert.match(view, /onToggleReplacementConfirmation/);
  assert.match(view, /onApplyPreset/);
});

check("Backdrop still cannot dismiss the modal", () => {
  assert.match(view, /role="presentation"/);
  assert.doesNotMatch(view, /role="presentation"[^>]*onClick=/s);
});

check("Normal page Save remains persistence boundary", () => {
  assert.match(view, /Use the normal page Save action to persist the result/);
});

check("Live validation evidence remains visible", () => {
  assert.match(view, /selectedPreset\.liveValidation/);
  assert.match(view, /Reference Test Command/);
});

console.log("Crestfall mc7_preset_library_layout_diagnostics_v4");
console.log(`Node ${process.version}`);
console.log("");

let passed = 0;
for (let index = 0; index < checks.length; index += 1) {
  const { name, fn } = checks[index];
  const started = Date.now();
  try {
    await fn();
    passed += 1;
    console.log(`PASS ${String(index + 1).padStart(2, "0")} ${name} (${Date.now() - started} ms)`);
  } catch (error) {
    console.error(`FAIL ${String(index + 1).padStart(2, "0")} ${name}`);
    console.error(error?.stack || error);
  }
}

console.log("");
console.log(`Summary: ${passed} passed, ${checks.length - passed} failed, ${checks.length} total`);
if (passed !== checks.length) process.exitCode = 1;
