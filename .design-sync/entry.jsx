// Bundle entry for the Crestfall Editor DS sync (design/ds1-claude-design-sync).
// Synth-entry mode: this repo ships no dist/, so this barrel is the
// esbuild entry point. Every re-export below is the REAL shipped
// component; the only new code in this file is the barrel itself and
// the shims it pulls from ./shims/ (which replace Next.js-only
// bindings with portable equivalents, documented in each shim file).

// Frame (shims: presentation-only, Next-free replacements for the real
// Binding Shells in components/studio/Studio*.jsx)
export { default as StudioShell } from "./shims/StudioShellShim";
export { default as StudioSidebar } from "./shims/StudioSidebarShim";
export { default as StudioTopBar } from "./shims/StudioTopBarShim";
export { default as StudioMobileNav } from "./shims/StudioMobileNavShim";

// Editor (real, unmodified: Editor.view.jsx imports only react,
// lucide-react, and KitModalFrame)
export { default as Editor } from "@/app/studio/v2/editor/editor/Editor.view";

// Kit (real wrappers, unmodified)
export { default as KitFormField } from "@/components/kit/KitFormField";
export { default as KitDropdown } from "@/components/kit/KitDropdown";
export { default as KitModalFrame } from "@/components/kit/KitModalFrame";
export { default as KitBadge } from "@/components/kit/KitBadge";
export { default as KitFilterChip } from "@/components/kit/KitFilterChip";

// Field grammar primitives (real, unmodified; re-exported individually
// since SharedFields.jsx is a multi-export file, not a LOOM package)
export {
  TextField,
  SelectField,
  NumberField,
  TextAreaField,
  ReadOnlyField,
  SectionTitle,
  ActionPanel,
  EditorSectionChromeContext,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

// Supporting (real, unmodified)
export { default as ModalShell } from "@/components/ui/ModalShell";
