"use client";

import { useState } from "react";

import KitFormFieldView from "@/components/kit/form-field/KitFormField.view";
import {
  kitFormFieldCounterAtLimitFixture,
  kitFormFieldCounterFixture,
  kitFormFieldDefaultFixture,
  kitFormFieldDisabledFixture,
  kitFormFieldErrorFixture,
  kitFormFieldFilledFixture,
  kitFormFieldFoldedFixture,
  kitFormFieldFoldedOpenChildrenFixture,
  kitFormFieldLongestContentFixture,
  kitFormFieldLongestLabelFixture,
  kitFormFieldMonoFixture,
  kitFormFieldNumberFixture,
  kitFormFieldSelectFixture,
  kitFormFieldSuccessFixture,
  kitFormFieldTextareaCollapsedEmptyFixture,
  kitFormFieldTextareaCollapsedFilledFixture,
  kitFormFieldTextareaExpandedFixture,
} from "@/components/kit/form-field/KitFormField.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitFormFieldDefaultFixture },
  filled: { label: "Filled", props: kitFormFieldFilledFixture },
  error: { label: "Error", props: kitFormFieldErrorFixture },
  success: { label: "Success", props: kitFormFieldSuccessFixture },
  counter: { label: "Counter", props: kitFormFieldCounterFixture },
  counterLimit: { label: "Counter at limit", props: kitFormFieldCounterAtLimitFixture },
  folded: { label: "Folded (closed)", props: kitFormFieldFoldedFixture },
  foldedOpen: { label: "Folded (open)", props: kitFormFieldFoldedOpenChildrenFixture },
  disabled: { label: "Disabled", props: kitFormFieldDisabledFixture },
  longest: { label: "Longest label", props: kitFormFieldLongestLabelFixture },
  textareaCollapsedEmpty: {
    label: "Collapsed, empty (O1)",
    props: kitFormFieldTextareaCollapsedEmptyFixture,
  },
  textareaCollapsedFilled: {
    label: "Collapsed, filled preview (O1)",
    props: kitFormFieldTextareaCollapsedFilledFixture,
  },
  textareaExpanded: { label: "Expanded (O1)", props: kitFormFieldTextareaExpandedFixture },
  selectOpen: { label: "Select, open (desktop popover)", props: kitFormFieldSelectFixture },
  selectSheet: { label: "Select, open (phone sheet)", props: kitFormFieldSelectFixture },
  number: { label: "Number", props: kitFormFieldNumberFixture },
  mono: { label: "Mono", props: kitFormFieldMonoFixture },
  longestContent: { label: "Longest content", props: kitFormFieldLongestContentFixture },
};

export default function KitFormFieldPreviewClient() {
  const [activeKey, setActiveKey] = useState("default");
  const [value, setValue] = useState(STATES.default.props.value ?? "");

  const active = STATES[activeKey];

  function openState(key) {
    setActiveKey(key);
    setValue(STATES[key].props.value ?? "");
  }

  const isFoldable =
    active.props.isFolded !== null && active.props.isFolded !== undefined;
  const isSelect = active.props.variant === "select";

  return (
    <KitPreviewShell
      title="Kit Form Field"
      description="The shared field anatomy: label, input bed, helper/error/success line, optional counter, optional folding disclosure. Value and count live in preview state only."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={openState}
      note="Fixture-only. Error and success are mutually exclusive; error wins when both are present. The folded states show the disclosure header with a nested field group as its content. Textarea states demonstrate O1's collapsed-preview resting state; click or tab into a collapsed field to expand it. Select states demonstrate KitDropdown's composed grammar, open the trigger and check it once at 1440 (popover below the trigger) and once at 390 (bottom-docked sheet)."
    >
      <div className="mx-auto flex max-w-md flex-col gap-[var(--space-5)]">
        {isFoldable ? (
          <KitFormFieldView key={activeKey} {...active.props}>
            <KitFormFieldView
              {...kitFormFieldDefaultFixture}
              label="Nested field, folded content"
              value={value}
              onChange={setValue}
            />
          </KitFormFieldView>
        ) : isSelect ? (
          <KitFormFieldView key={activeKey} {...active.props} value={value} onSelect={setValue} />
        ) : (
          <KitFormFieldView key={activeKey} {...active.props} value={value} onChange={setValue} />
        )}
      </div>
    </KitPreviewShell>
  );
}
