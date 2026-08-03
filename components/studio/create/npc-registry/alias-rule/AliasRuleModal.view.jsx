import ModalActions from "../ModalActions";
import ModalShell from "../ModalShell";
import { SelectInput, TextArea, TextInput } from "../RegistryUtils";

export default function AliasRuleModalView({
  modalTitle = "Alias Rule",
  trueIdentityLabel = "True Identity",
  selectedIdentityId = "",
  identityOptions = [],
  publicIdentityLabel = "Public Identity / Alias",
  publicIdentityValue = "",
  ruleLabel = "Alias Rule",
  ruleValue = "",
  rulePlaceholder = "",
  ruleRows = 5,
  saveLabel = "Save Alias Rule",
  onClose = null,
  onChooseTrueIdentity = null,
  onChangePublicIdentity = null,
  onChangeRule = null,
  onSave = null,
}) {
  return (
    <ModalShell title={modalTitle} onClose={onClose}>
      <div className="grid gap-5">
        <SelectInput
          label={trueIdentityLabel}
          value={selectedIdentityId}
          onChange={(value) => onChooseTrueIdentity?.(value)}
          options={identityOptions.map((option) => ({
            value: option?.id || "",
            label: option?.label || "Unnamed NPC",
          }))}
        />

        <TextInput
          label={publicIdentityLabel}
          value={publicIdentityValue}
          onChange={(value) => onChangePublicIdentity?.(value)}
        />

        <TextArea
          label={ruleLabel}
          value={ruleValue}
          onChange={(value) => onChangeRule?.(value)}
          rows={ruleRows}
          placeholder={rulePlaceholder}
        />

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          saveLabel={saveLabel}
        />
      </div>
    </ModalShell>
  );
}
