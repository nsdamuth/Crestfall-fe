import { useState } from "react";
import KitFormField from "@/components/kit/KitFormField";
import { TextField } from "@/components/studio/my-creations/edit/sections/SharedFields";
import {
  kitFormFieldDefaultFixture,
  kitFormFieldFilledFixture,
  kitFormFieldErrorFixture,
  kitFormFieldSuccessFixture,
  kitFormFieldCounterAtLimitFixture,
  kitFormFieldFoldedOpenChildrenFixture,
  kitFormFieldDisabledFixture,
  kitFormFieldTextareaCollapsedFilledFixture,
  kitFormFieldSelectFixture,
  kitFormFieldNumberFixture,
} from "@/components/kit/form-field/KitFormField.fixtures";

// Rest state: empty label + bed + helper.
export function Default() {
  const [value, setValue] = useState(kitFormFieldDefaultFixture.value);
  return <KitFormField {...kitFormFieldDefaultFixture} value={value} onChange={setValue} />;
}

// Filled: an entered value, --ink not --ink-faint.
export function Filled() {
  const [value, setValue] = useState(kitFormFieldFilledFixture.value);
  return <KitFormField {...kitFormFieldFilledFixture} value={value} onChange={setValue} />;
}

// Field-level error: bed border + danger-toned error line.
export function ErrorState() {
  const [value, setValue] = useState(kitFormFieldErrorFixture.value);
  return <KitFormField {...kitFormFieldErrorFixture} value={value} onChange={setValue} />;
}

// Success confirmation line, same triad treatment as error.
export function SuccessState() {
  const [value, setValue] = useState(kitFormFieldSuccessFixture.value);
  return <KitFormField {...kitFormFieldSuccessFixture} value={value} onChange={setValue} />;
}

// O4: counter at limit, danger tone plus the word "limit".
export function CounterAtLimit() {
  const [value, setValue] = useState(kitFormFieldCounterAtLimitFixture.value);
  return <KitFormField {...kitFormFieldCounterAtLimitFixture} value={value} onChange={setValue} />;
}

// Fold open, with a real child field group (not the fixture's null).
export function FoldedOpen() {
  const [open, setOpen] = useState(true);
  const [note, setNote] = useState("Keeps a level head under pressure.");
  return (
    <KitFormField
      {...kitFormFieldFoldedOpenChildrenFixture}
      isFolded={!open}
      onToggleFold={() => setOpen((v) => !v)}
    >
      <TextField
        label="Behavior note"
        value={note}
        onChange={setNote}
        helperText="One more line the fold group carries."
      />
    </KitFormField>
  );
}

// Disabled: 0.5 opacity, no hover, cursor-not-allowed.
export function Disabled() {
  return <KitFormField {...kitFormFieldDisabledFixture} />;
}

// Folding textarea, filled and collapsed to its one-line preview.
export function TextareaCollapsed() {
  const [value, setValue] = useState(kitFormFieldTextareaCollapsedFilledFixture.value);
  return (
    <KitFormField {...kitFormFieldTextareaCollapsedFilledFixture} value={value} onChange={setValue} />
  );
}

// Select variant, composing KitDropdown (popover 700px+, sheet below).
export function Select() {
  const [value, setValue] = useState(kitFormFieldSelectFixture.value);
  return <KitFormField {...kitFormFieldSelectFixture} value={value} onSelect={setValue} />;
}

// Number variant: no counter, numeric value.
export function Number_() {
  const [value, setValue] = useState(kitFormFieldNumberFixture.value);
  return <KitFormField {...kitFormFieldNumberFixture} value={value} onChange={setValue} />;
}
