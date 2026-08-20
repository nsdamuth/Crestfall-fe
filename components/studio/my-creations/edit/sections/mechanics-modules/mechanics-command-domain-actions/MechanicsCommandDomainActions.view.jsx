import {
  ABILITY_SPELL_KNOWLEDGE_STATES,
  ABILITY_SPELL_UNLOCK_STATES,
  COMMAND_DOMAIN_ACTION_OUTCOMES,
  COMMAND_DOMAIN_ACTION_TYPES,
  LOCATION_TRAVEL_OPERATIONS,
} from "./MechanicsCommandDomainActions.contract.js";

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
    <label className={`grid gap-2 text-sm text-[var(--muted)] ${className}`}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
      >
        <option value="">{placeholder}</option>
        {options.map((argument) => (
          <option key={argument.name} value={argument.name}>
            {argument.label}
          </option>
        ))}
      </select>
      {help ? (
        <span className="text-[11px] leading-5 text-[var(--muted)]">{help}</span>
      ) : null}
    </label>
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
    <div className="rounded-xl border border-[var(--muted-gold)]/20 bg-black/20 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Domain Adapter
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
          Route an authorized Mechanics outcome into an authoritative Crestfall domain service.
          Domain adapters update real registry/runtime state instead of simulating custody with
          generic flags, counters, or meters.
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Domain Action</span>
          <select
            value={domainAction.type}
            onChange={(event) => changeType(event.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          >
            {COMMAND_DOMAIN_ACTION_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        {domainAction.type !== "NONE" ? (
          <>
            {!flags.usesLocation &&
            !flags.usesParticipantCondition &&
            !flags.usesAbilitySpellKnowledge &&
            !flags.usesAbilitySpellUse ? (
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
                <span className="text-[11px] leading-5 text-[var(--muted)] md:col-span-2">
                  Requires a currently present Character. The adapter revalidates the participant,
                  current condition state, and condition label, then delegates apply/remove mutation
                  to the existing sensory condition effect applicator and sensory runtime merger.
                </span>
              </>
            ) : flags.usesAbilitySpellUse ? (
              <>
                <ArgumentSelect
                  label="Actor Argument"
                  value={domainAction.actorArgumentName}
                  options={options.abilityUseActors}
                  placeholder="Select a PLAYER_CHARACTER argument"
                  onChange={(actorArgumentName) =>
                    patchDomainAction({
                      enabled: true,
                      type: "ABILITY_SPELL_USE_REQUEST",
                      actorArgumentName,
                    })
                  }
                  help="Use Transaction v0 is intentionally scoped to the active Player Character. Broader multi-actor execution remains a later package."
                />
                <ArgumentSelect
                  label="Ability / Spell Argument"
                  value={domainAction.abilityArgumentName}
                  options={options.text}
                  placeholder="Select a TEXT argument"
                  onChange={(abilityArgumentName) =>
                    patchDomainAction({
                      enabled: true,
                      type: "ABILITY_SPELL_USE_REQUEST",
                      abilityArgumentName,
                    })
                  }
                  help="The runtime resolves this value through the actor's graph-bound Ability & Spell Profile and re-runs the full authoritative use-authorization envelope."
                />
                <ArgumentSelect
                  label="Optional Target Argument"
                  value={domainAction.targetArgumentName || ""}
                  options={options.presentCharacters}
                  placeholder="No explicit target argument"
                  onChange={(targetArgumentName) =>
                    patchDomainAction({
                      enabled: true,
                      type: "ABILITY_SPELL_USE_REQUEST",
                      targetArgumentName,
                    })
                  }
                  help="Optional CHARACTER_PRESENT target evidence. Leave blank for NONE/SELF abilities. External-target abilities fail closed when required target/range/line-of-sight authority is unavailable."
                  className="md:col-span-2"
                />
                <span className="text-[11px] leading-5 text-[var(--muted)] md:col-span-2">
                  This action creates an EXECUTION_AUTHORIZED pre-commit transaction only when every current Ability/Spell use gate is satisfied. It does not commit execution, spend resources, consume charges, start cooldowns, or execute operation references.
                </span>
              </>
            ) : flags.usesAbilitySpellKnowledge ? (
              <>
                <ArgumentSelect
                  label="Actor Argument"
                  value={domainAction.actorArgumentName}
                  options={options.abilityActors}
                  placeholder="Select a PLAYER_CHARACTER or CHARACTER_PRESENT argument"
                  onChange={(actorArgumentName) =>
                    patchDomainAction({
                      enabled: true,
                      type: "ABILITY_SPELL_KNOWLEDGE_SET",
                      actorArgumentName,
                    })
                  }
                  help="PLAYER_CHARACTER is implicit and works well for self-targeted grant/revoke commands. CHARACTER_PRESENT supports a resolved present Character with authoritative Actor Mechanics bindings."
                />
                <ArgumentSelect
                  label="Ability / Spell Argument"
                  value={domainAction.abilityArgumentName}
                  options={options.text}
                  placeholder="Select a TEXT argument"
                  onChange={(abilityArgumentName) =>
                    patchDomainAction({
                      enabled: true,
                      type: "ABILITY_SPELL_KNOWLEDGE_SET",
                      abilityArgumentName,
                    })
                  }
                  help="The runtime resolves the authored Ability/Spell ID, title, or alias through the target actor's graph-bound Ability & Spell Profile."
                />
                <label className="grid gap-2 text-sm text-[var(--muted)]">
                  <span>Known State</span>
                  <select
                    value={domainAction.knowledgeState || "KEEP"}
                    onChange={(event) =>
                      patchDomainAction({
                        enabled: true,
                        type: "ABILITY_SPELL_KNOWLEDGE_SET",
                        knowledgeState: event.target.value,
                      })
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                  >
                    {ABILITY_SPELL_KNOWLEDGE_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-[var(--muted)]">
                  <span>Unlock State</span>
                  <select
                    value={domainAction.unlockState || "KEEP"}
                    onChange={(event) =>
                      patchDomainAction({
                        enabled: true,
                        type: "ABILITY_SPELL_KNOWLEDGE_SET",
                        unlockState: event.target.value,
                      })
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                  >
                    {ABILITY_SPELL_UNLOCK_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="text-[11px] leading-5 text-[var(--muted)] md:col-span-2">
                  This action changes actor-owned known/unlocked state only. It does not cast the ability, authorize use, spend resources, start cooldowns, consume charges, or execute operation references.
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
              <label className="grid gap-2 text-sm text-[var(--muted)] md:col-span-2">
                <span>Active Journey Operation</span>
                <select
                  value={domainAction.travelOperation || "CONTINUE"}
                  onChange={(event) =>
                    patchDomainAction({
                      enabled: true,
                      type: "LOCATION_TRAVEL_OPERATION",
                      travelOperation: event.target.value,
                    })
                  }
                  className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
                >
                  {LOCATION_TRAVEL_OPERATIONS.map((operation) => (
                    <option key={operation} value={operation}>
                      {operation.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] leading-5 text-[var(--muted)]">
                  Requires an active journey. The command is converted into canonical travel wording
                  and passed through the existing active-travel resolver and Location applicator. It
                  never assigns a phase or activates a destination directly.
                </span>
              </label>
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

            <div className="rounded-xl border border-white/10 bg-black/25 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                Apply On Outcomes
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {COMMAND_DOMAIN_ACTION_OUTCOMES.map((outcome) => (
                  <label
                    key={outcome}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-xs text-[var(--muted)]"
                  >
                    <input
                      type="checkbox"
                      checked={domainAction.applyOnOutcomes.includes(outcome)}
                      onChange={(event) => toggleOutcome(outcome, event.target.checked)}
                      className="h-4 w-4 accent-[var(--muted-gold)]"
                    />
                    {outcome.replaceAll("_", " ")}
                  </label>
                ))}
              </div>
            </div>

            {missingBindingMessage ? (
              <p className="rounded-xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-100 md:col-span-2">
                {missingBindingMessage} Crestfall validates every binding before any roll occurs.
              </p>
            ) : null}

            <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--muted)] md:col-span-2">
              {description}
            </p>
          </>
        ) : (
          <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--muted)] md:col-span-2">
            No cross-domain state mutation is configured. The command may still use ordinary
            Mechanics effects.
          </p>
        )}
      </div>
    </div>
  );
}
