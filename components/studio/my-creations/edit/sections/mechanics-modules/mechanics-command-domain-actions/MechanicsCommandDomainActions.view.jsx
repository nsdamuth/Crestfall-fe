import {
  COMMAND_DOMAIN_ACTION_OUTCOMES,
  COMMAND_DOMAIN_ACTION_TYPES,
  LOCATION_TRAVEL_OPERATIONS,
} from "./MechanicsCommandDomainActions.contract.js";
import { CheckboxField, SelectField } from "../../SharedFields";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

function ArgumentSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
  help,
  className = "",
}) {
  return (
    <div className={className}>
      <SelectField
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={(nextValue) => onChange(nextValue)}
        options={options.map((argument) => ({
          value: argument.name,
          label: argument.label,
        }))}
        helperText={help}
      />
    </div>
  );
}

export default function MechanicsCommandDomainActionsView({
  domainAction,
  options,
  flags,
  activeItemOptions,
  activeItemType,
  activeItemLabel,
  missingBindingMessage,
  description,
  changeType,
  patchDomainAction,
  toggleOutcome,
}) {
  return (
    <div>
      <div>
        <p className={EYEBROW_CLASS}>
          Domain Adapter
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
          Route an authorized Mechanics outcome into an authoritative Crestfall domain service.
          Domain adapters update real registry/runtime state instead of simulating custody with
          generic flags, counters, or meters.
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SelectField
          label="Domain Action"
          value={domainAction.type}
          options={COMMAND_DOMAIN_ACTION_TYPES}
          onChange={(value) => changeType(value)}
        />

        {domainAction.type !== "NONE" ? (
          <>
            {!flags.usesLocation && !flags.usesParticipantCondition ? (
              <ArgumentSelect
                label={activeItemLabel}
                value={domainAction.itemArgumentName}
                options={activeItemOptions}
                placeholder={`Select an ${activeItemType} argument`}
                onChange={(itemArgumentName) =>
                  patchDomainAction({
                    enabled: true,
                    type: domainAction.type,
                    itemArgumentName,
                  })
                }
              />
            ) : flags.usesParticipantCondition ? (
              <>
                <ArgumentSelect
                  label="Present Character Argument"
                  value={domainAction.targetArgumentName}
                  options={options.presentCharacters}
                  placeholder="Select a CHARACTER_PRESENT argument"
                  onChange={(targetArgumentName) =>
                    patchDomainAction({
                      enabled: true,
                      type: domainAction.type,
                      targetArgumentName,
                    })
                  }
                />
                <ArgumentSelect
                  label="Condition Text Argument"
                  value={domainAction.conditionArgumentName}
                  options={options.text}
                  placeholder="Select a TEXT argument"
                  onChange={(conditionArgumentName) =>
                    patchDomainAction({
                      enabled: true,
                      type: domainAction.type,
                      conditionArgumentName,
                    })
                  }
                />
                <span className="text-[11px] leading-5 text-[var(--ink-dim)] md:col-span-2">
                  Requires a currently present Character. The adapter revalidates the participant,
                  current condition state, and condition label, then delegates apply/remove mutation
                  to the existing sensory condition effect applicator and sensory runtime merger.
                </span>
              </>
            ) : flags.usesConnectedLocation ? (
              <ArgumentSelect
                label="Connected Destination Argument"
                value={domainAction.destinationArgumentName}
                options={options.connectedLocations}
                placeholder="Select a LOCATION_CONNECTED argument"
                onChange={(destinationArgumentName) =>
                  patchDomainAction({
                    enabled: true,
                    type: "LOCATION_TRANSITION",
                    destinationArgumentName,
                  })
                }
                help="This target is an early parsing hint only. The shared Location planner and applicator revalidate the route, access rules, distance, destination, and active-journey state before mutation."
                className="md:col-span-2"
              />
            ) : (
              <div className="md:col-span-2">
                <SelectField
                  label="Active Journey Operation"
                  value={domainAction.travelOperation || "CONTINUE"}
                  options={LOCATION_TRAVEL_OPERATIONS.map((operation) => ({
                    value: operation,
                    label: operation.replaceAll("_", " "),
                  }))}
                  onChange={(travelOperation) =>
                    patchDomainAction({
                      enabled: true,
                      type: "LOCATION_TRAVEL_OPERATION",
                      travelOperation,
                    })
                  }
                  helperText="Requires an active journey. The command is converted into canonical travel wording and passed through the existing active-travel resolver and Location applicator. It never assigns a phase or activates a destination directly."
                />
              </div>
            )}

            {domainAction.type === "ITEM_GIVE" ? (
              <ArgumentSelect
                label="Recipient Argument"
                value={domainAction.targetArgumentName}
                options={options.presentCharacters}
                placeholder="Select a CHARACTER_PRESENT argument"
                onChange={(targetArgumentName) =>
                  patchDomainAction({
                    enabled: true,
                    type: "ITEM_GIVE",
                    targetArgumentName,
                  })
                }
              />
            ) : null}

            {flags.requiresPlacement ? (
              <ArgumentSelect
                label="Placement Argument"
                value={domainAction.placementArgumentName}
                options={options.text}
                placeholder="Select a TEXT argument"
                onChange={(placementArgumentName) =>
                  patchDomainAction({
                    enabled: true,
                    type: domainAction.type,
                    placementArgumentName,
                  })
                }
                help="Use phrases such as “in pants pocket,” “in the tool chest,” or “on the workbench.”"
              />
            ) : null}

            {flags.supportsQuantity ? (
              <ArgumentSelect
                label="Quantity Argument"
                value={domainAction.quantityArgumentName}
                options={options.numbers}
                placeholder="Default quantity: 1"
                onChange={(quantityArgumentName) =>
                  patchDomainAction({
                    enabled: true,
                    type: "ITEM_CONSUME",
                    quantityArgumentName,
                  })
                }
                help="Optional. Select a NUMBER argument to support commands such as “/consume potion 2.”"
              />
            ) : null}

            {flags.requiresAmount ? (
              <ArgumentSelect
                label="Condition Amount Argument"
                value={domainAction.amountArgumentName}
                options={options.numbers}
                placeholder="Select a NUMBER argument"
                onChange={(amountArgumentName) =>
                  patchDomainAction({
                    enabled: true,
                    type: domainAction.type,
                    amountArgumentName,
                  })
                }
                help="Required. The positive amount is subtracted for damage and added for repair, clamped to 0–100%."
              />
            ) : null}

            <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)] md:col-span-2">
              <p className={EYEBROW_CLASS}>
                Apply On Outcomes
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {COMMAND_DOMAIN_ACTION_OUTCOMES.map((outcome) => (
                  <CheckboxField
                    key={outcome}
                    label={outcome.replaceAll("_", " ")}
                    checked={domainAction.applyOnOutcomes.includes(outcome)}
                    onChange={(checked) => toggleOutcome(outcome, checked)}
                  />
                ))}
              </div>
            </div>

            {missingBindingMessage ? (
              <p className="rounded-xl border border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] px-4 py-3 text-xs leading-5 text-[var(--status-warning-text)] md:col-span-2">
                {missingBindingMessage} Crestfall validates every binding before any roll occurs.
              </p>
            ) : null}

            <p className="text-xs leading-5 text-[var(--ink-faint)] md:col-span-2">
              {description}
            </p>
          </>
        ) : (
          <p className="text-xs leading-5 text-[var(--ink-faint)] md:col-span-2">
            No cross-domain state mutation is configured. The command may still use ordinary
            Mechanics effects.
          </p>
        )}
      </div>
    </div>
  );
}
