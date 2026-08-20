"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Boxes,
  Braces,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  Link2,
  LockKeyhole,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRoundCog,
  WandSparkles,
} from "lucide-react";

import ActorMechanicsProfileJsonEditorModal from "../actor-mechanics-profile-json-editor/ActorMechanicsProfileJsonEditorModal";

function humanize(value) {
  return String(value || "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Counter({ value = 0, limit = 0 }) {
  const nearLimit = limit > 0 && value >= limit * 0.85;
  const overLimit = limit > 0 && value > limit;

  return (
    <span
      className={
        overLimit
          ? "text-red-200"
          : nearLimit
            ? "text-amber-200"
            : "text-[var(--muted)]"
      }
    >
      {Number(value).toLocaleString()} / {Number(limit).toLocaleString()}
    </span>
  );
}

function IssueList({ issues = [] }) {
  if (!issues.length) return null;

  return (
    <div className="space-y-2">
      {issues.map((issue, index) => {
        const warning = issue.severity === "WARNING";
        return (
          <div
            key={`${issue.code || "issue"}-${index}`}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-5 ${
              warning
                ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                : "border-red-300/25 bg-red-300/10 text-red-100"
            }`}
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>{issue.message}</span>
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, detail = "" }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <label className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {children}
      </label>
      {detail ? (
        <span className="text-[11px] text-[var(--muted)]">{detail}</span>
      ) : null}
    </div>
  );
}

function TextInput({ value = "", onChange, placeholder = "", ...props }) {
  return (
    <input
      {...props}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50 disabled:cursor-not-allowed disabled:opacity-55"
    />
  );
}

function SelectInput({ value, onChange, children, disabled = false }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0907] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/50 disabled:cursor-not-allowed disabled:opacity-55"
    >
      {children}
    </select>
  );
}

function CheckboxRow({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--muted-gold)]"
      />
      <span>
        <span className="block text-sm text-[var(--foreground)]">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function StatCard({ label, value, detail = "" }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[var(--foreground)]">{value}</p>
      {detail ? (
        <p className="mt-1 text-[11px] leading-4 text-[var(--muted)]">{detail}</p>
      ) : null}
    </div>
  );
}

export default function ActorMechanicsProfileEditorView({
  profile = {},
  ownerContext = null,
  enabled = true,
  title = "",
  summary = "",
  titleCharacterCount = 0,
  titleCharacterLimit = 0,
  summaryCharacterCount = 0,
  summaryCharacterLimit = 0,
  presetId = "CUSTOM",
  pendingPresetId = "CUSTOM",
  presetOptions = [],
  ownerBindingMode = "UNBOUND_TEMPLATE",
  ownerType = "CHARACTER",
  ownerId = "",
  ownerTitle = "",
  ownerLocked = false,
  ownerTypes = [],
  ownerBindingModes = [],
  statePolicy = {},
  capabilityMode = "STANDARD",
  opposedResolutionPolicy = "DETERMINISTIC",
  workingModeProfile = "",
  capabilityNotes = "",
  capabilityModes = [],
  opposedResolutionPolicies = [],
  capabilityNotesCharacterCount = 0,
  capabilityNotesCharacterLimit = 0,
  workingModeProfileCharacterCount = 0,
  workingModeProfileCharacterLimit = 0,
  bindings = [],
  bindingCount = 0,
  bindingLimit = 0,
  enabledBindingCount = 0,
  referenceCount = 0,
  enabledDomains = [],
  domainOptions = [],
  referenceTypeOptions = [],
  activationModeOptions = [],
  referenceLimitPerBinding = 0,
  globalIssues = [],
  errorCount = 0,
  warningCount = 0,
  jsonEditorOpen = false,
  onOpenJsonEditor = null,
  onCloseJsonEditor = null,
  onApplyJsonProfile = null,
  onSetEnabled = null,
  onUpdateIdentity = null,
  onSelectPreset = null,
  onApplyPreset = null,
  onUpdateOwner = null,
  onUpdateCapabilityPolicy = null,
  onAddBinding = null,
  onRemoveBinding = null,
  onMoveBinding = null,
  onToggleBinding = null,
  onUpdateBinding = null,
  onAddReference = null,
  onRemoveReference = null,
  onUpdateReference = null,
  onOpenStatsPoolsProfilePicker = null,
  onOpenProgressionProfilePicker = null,
  onOpenSkillsProfilePicker = null,
  onOpenAbilitySpellProfilePicker = null,
  onOpenWalletProfilePicker = null,
}) {
  const safePresetOptions = Array.isArray(presetOptions) ? presetOptions : [];
  const safeBindings = Array.isArray(bindings) ? bindings : [];
  const selectedPreset =
    safePresetOptions.find((preset) => preset.presetId === pendingPresetId) ||
    safePresetOptions.at(-1) ||
    null;
  const beyondScale = capabilityMode === "BEYOND_SCALE";

  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/30 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[var(--muted-gold)]">
            <UserRoundCog size={18} />
            <p className="text-xs uppercase tracking-[0.22em]">
              Actor Mechanics Profile · Actor State
            </p>
          </div>

          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Actor Mechanics Profile
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Compose reusable mechanics definitions for one actor while keeping
            every mutable stat, balance, unlock, cooldown, and inventory state
            isolated to that actor.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenJsonEditor?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
          >
            <Braces size={15} />
            JSON Editor
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onSetEnabled?.(!enabled)}
            className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
              enabled
                ? "border-[var(--muted-gold)]/50 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30"
            }`}
          >
            {enabled ? "Profile Enabled" : "Enable Profile"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Owner Scope"
          value={humanize(ownerType)}
          detail={humanize(ownerBindingMode)}
        />
        <StatCard
          label="Bindings"
          value={`${enabledBindingCount.toLocaleString()} enabled`}
          detail={`${bindingCount.toLocaleString()} / ${bindingLimit.toLocaleString()} configured`}
        />
        <StatCard
          label="References"
          value={referenceCount.toLocaleString()}
          detail="Shared definitions; isolated actor state"
        />
        <StatCard
          label="Validation"
          value={errorCount ? `${errorCount} error${errorCount === 1 ? "" : "s"}` : "Ready"}
          detail={warningCount ? `${warningCount} warning${warningCount === 1 ? "" : "s"}` : "No warnings"}
        />
      </div>

      <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-3 text-sm text-emerald-100">
        <div className="flex items-start gap-3">
          <ShieldCheck size={17} className="mt-0.5 shrink-0" />
          <p className="leading-6">
            Definitions may be reused across actors. Mutable state may never be
            shared: isolation is fixed to <strong>OWNER_SCOPED</strong> with an
            <strong> OWNER_AND_BINDING</strong> namespace.
          </p>
        </div>
      </div>

      {globalIssues.length ? (
        <div className="mt-4">
          <IssueList issues={globalIssues} />
        </div>
      ) : null}

      <div className="mt-7 rounded-xl border border-white/10 bg-black/25 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <RefreshCcw size={17} className="mt-0.5 shrink-0 text-[var(--muted-gold)]" />
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Profile Preset
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              Applying a preset replaces the current domain-binding structure.
              Actor identity is preserved when compatible or externally locked.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <SelectInput
              value={pendingPresetId}
              onChange={(event) => onSelectPreset?.(event.target.value)}
            >
              {safePresetOptions.map((preset) => (
                <option key={preset.presetId} value={preset.presetId}>
                  {preset.title}
                </option>
              ))}
            </SelectInput>
            {selectedPreset ? (
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                {selectedPreset.summary}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onApplyPreset?.()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-5 py-3 text-xs uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/15"
          >
            <Sparkles size={15} />
            Apply Preset
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <div>
          <FieldLabel
            detail={`${titleCharacterCount.toLocaleString()} / ${titleCharacterLimit.toLocaleString()}`}
          >
            Profile Title
          </FieldLabel>
          <TextInput
            value={title}
            onChange={(event) => onUpdateIdentity?.("title", event.target.value)}
            placeholder="Name this actor mechanics profile..."
          />
        </div>

        <div>
          <FieldLabel detail={`Current preset: ${humanize(presetId)}`}>
            Structural Origin
          </FieldLabel>
          <div className="mt-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--foreground)]">
            {safePresetOptions.find((preset) => preset.presetId === presetId)
              ?.title || humanize(presetId)}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <FieldLabel
          detail={`${summaryCharacterCount.toLocaleString()} / ${summaryCharacterLimit.toLocaleString()}`}
        >
          Profile Summary
        </FieldLabel>
        <textarea
          value={summary}
          onChange={(event) => onUpdateIdentity?.("summary", event.target.value)}
          rows={4}
          placeholder="Explain what this actor's actor mechanics profile contains and when it should be used..."
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
        />
      </div>

      <div className="mt-8 border-t border-white/10 pt-7">
        <div className="flex items-start gap-3">
          {ownerLocked ? (
            <LockKeyhole size={17} className="mt-0.5 shrink-0 text-[var(--muted-gold)]" />
          ) : (
            <UserRoundCog size={17} className="mt-0.5 shrink-0 text-[var(--muted-gold)]" />
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Actor Owner
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              An unbound template can be reused. A bound actor profile requires
              one Player Character, Character, or important NPC Registry entry.
              {ownerLocked ? " This owner is supplied by the parent feature." : ""}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Binding Mode</FieldLabel>
            <SelectInput
              value={ownerBindingMode}
              disabled={ownerLocked}
              onChange={(event) =>
                onUpdateOwner?.("bindingMode", event.target.value)
              }
            >
              {ownerBindingModes.map((mode) => (
                <option key={mode} value={mode}>
                  {humanize(mode)}
                </option>
              ))}
            </SelectInput>
          </div>

          <div>
            <FieldLabel>Owner Type</FieldLabel>
            <SelectInput
              value={ownerType}
              disabled={ownerLocked}
              onChange={(event) => onUpdateOwner?.("ownerType", event.target.value)}
            >
              {ownerTypes.map((type) => (
                <option key={type} value={type}>
                  {humanize(type)}
                </option>
              ))}
            </SelectInput>
          </div>

          <div>
            <FieldLabel>Owner Display Name</FieldLabel>
            <TextInput
              value={ownerTitle}
              disabled={ownerLocked}
              onChange={(event) =>
                onUpdateOwner?.("ownerTitle", event.target.value)
              }
              placeholder="The actor this profile belongs to..."
            />
          </div>

          <div>
            <FieldLabel
              detail={ownerBindingMode === "BOUND_ACTOR" ? "Required" : "Optional"}
            >
              Owner Reference
            </FieldLabel>
            <TextInput
              value={ownerId}
              disabled={ownerLocked}
              onChange={(event) => onUpdateOwner?.("ownerId", event.target.value)}
              placeholder="Actor creation or registry-entry ID..."
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-7">
        <div className="flex items-start gap-3">
          <LockKeyhole size={17} className="mt-0.5 shrink-0 text-[var(--muted-gold)]" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Fixed State Policy
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              These safeguards are contract-owned and are not creator-overridable.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Isolation" value={statePolicy.isolation || "OWNER_SCOPED"} />
          <StatCard
            label="Namespace"
            value={statePolicy.namespaceStrategy || "OWNER_AND_BINDING"}
          />
          <StatCard
            label="Shared Definitions"
            value={statePolicy.sharedDefinitionsAllowed ? "Allowed" : "Blocked"}
          />
          <StatCard
            label="Shared Mutable State"
            value={statePolicy.sharedMutableStateAllowed ? "Allowed" : "Forbidden"}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-7">
        <div className="flex items-start gap-3">
          <CircleGauge size={17} className="mt-0.5 shrink-0 text-[var(--muted-gold)]" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Capability Policy
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Standard actors use ordinary mechanics. Beyond Scale actors require
              narrative-only resolution or an explicitly restricted working mode.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel>Capability Mode</FieldLabel>
            <SelectInput
              value={capabilityMode}
              onChange={(event) =>
                onUpdateCapabilityPolicy?.("mode", event.target.value)
              }
            >
              {capabilityModes.map((mode) => (
                <option key={mode} value={mode}>
                  {humanize(mode)}
                </option>
              ))}
            </SelectInput>
          </div>

          <div>
            <FieldLabel>Opposed Resolution</FieldLabel>
            <SelectInput
              value={opposedResolutionPolicy}
              onChange={(event) =>
                onUpdateCapabilityPolicy?.(
                  "opposedResolutionPolicy",
                  event.target.value
                )
              }
            >
              {opposedResolutionPolicies.map((policy) => (
                <option key={policy} value={policy}>
                  {humanize(policy)}
                </option>
              ))}
            </SelectInput>
          </div>
        </div>

        {beyondScale ? (
          <div className="mt-4 rounded-xl border border-violet-300/25 bg-violet-300/10 px-4 py-3 text-sm text-violet-100">
            <div className="flex items-start gap-3">
              <WandSparkles size={17} className="mt-0.5 shrink-0" />
              <p className="leading-6">
                Unrestricted capability is outside ordinary opposed checks. Only
                the named working-mode profile may use deterministic mechanics.
              </p>
            </div>
          </div>
        ) : null}

        {beyondScale || opposedResolutionPolicy === "WORKING_MODE_ONLY" ? (
          <div className="mt-5">
            <FieldLabel
              detail={`${workingModeProfileCharacterCount.toLocaleString()} / ${workingModeProfileCharacterLimit.toLocaleString()}`}
            >
              Working-Mode Profile
            </FieldLabel>
            <TextInput
              value={workingModeProfile}
              onChange={(event) =>
                onUpdateCapabilityPolicy?.(
                  "workingModeProfile",
                  event.target.value
                )
              }
              placeholder="LEVEL_100_EQUIVALENT or another restricted manifestation..."
            />
          </div>
        ) : null}

        <div className="mt-5">
          <FieldLabel
            detail={`${capabilityNotesCharacterCount.toLocaleString()} / ${capabilityNotesCharacterLimit.toLocaleString()}`}
          >
            Capability Notes
          </FieldLabel>
          <textarea
            value={capabilityNotes}
            onChange={(event) =>
              onUpdateCapabilityPolicy?.("notes", event.target.value)
            }
            rows={4}
            placeholder="Explain capability restrictions and the boundary between ordinary mechanics and narrative-only resolution..."
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">
        <div>
          <div className="flex items-center gap-2 text-[var(--muted-gold)]">
            <Boxes size={17} />
            <p className="text-xs uppercase tracking-[0.2em]">Domain Bindings</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Bind shared definitions by domain. Activation controls when the
            router may hydrate the binding; it does not execute mechanics here.
          </p>
          {enabledDomains.length ? (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Enabled domains: {enabledDomains.map(humanize).join(", ")}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onAddBinding?.()}
          disabled={bindingCount >= bindingLimit}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={15} />
          Add Binding
        </button>
      </div>

      {safeBindings.length ? (
        <div className="mt-5 space-y-4">
          {safeBindings.map((binding, index) => {
            const ToggleIcon = binding.expanded ? ChevronDown : ChevronRight;
            const managedDefinition =
              binding.definitionReferenceMode === "STATS_POOLS_PROFILE"
                ? {
                    label: "Stats & Pools Profile",
                    fallbackTitle: "Selected Stats & Pools Profile",
                    fallbackVersion: "stats_pools_profile_contract_v0",
                    hasReference: binding.hasStatsPoolsProfileReference,
                    selectLabel: "Select Stats & Pools Profile",
                    replaceLabel: "Replace Stats & Pools Profile",
                    description:
                      "Choose one owned Stats & Pools Profile. Only its reusable definition reference is saved; actor values are not copied or initialized.",
                    onOpen: onOpenStatsPoolsProfilePicker,
                  }
                : binding.definitionReferenceMode === "PROGRESSION_PROFILE"
                  ? {
                      label: "Progression Profile",
                      fallbackTitle: "Selected Progression Profile",
                      fallbackVersion: "progression_profile_contract_v0",
                      hasReference: binding.hasProgressionProfileReference,
                      selectLabel: "Select Progression Profile",
                      replaceLabel: "Replace Progression Profile",
                      description:
                        "Choose one owned Progression Profile. Only its reusable curve and tier definition reference is saved; actor experience and level state are not copied or initialized.",
                      onOpen: onOpenProgressionProfilePicker,
                    }
                  : binding.definitionReferenceMode === "SKILLS_PROFILE"
                    ? {
                        label: "Skills Profile",
                        fallbackTitle: "Selected Skills Profile",
                        fallbackVersion: "skills_profile_contract_v0",
                        hasReference: binding.hasSkillsProfileReference,
                        selectLabel: "Select Skills Profile",
                        replaceLabel: "Replace Skills Profile",
                        description:
                          "Choose one owned Skills Profile. Only reusable proficiency and rank definitions are saved; actor ranks and unspent points are not copied or initialized.",
                        onOpen: onOpenSkillsProfilePicker,
                      }
                    : binding.definitionReferenceMode === "ABILITY_SPELL_PROFILE"
                      ? {
                          label: "Ability & Spell Profile",
                          fallbackTitle: "Selected Ability & Spell Profile",
                          fallbackVersion: "ability_spell_profile_contract_v0",
                          hasReference: binding.hasAbilitySpellProfileReference,
                          selectLabel: "Select Ability & Spell Profile",
                          replaceLabel: "Replace Ability & Spell Profile",
                          description:
                            binding.domain === "MAGIC"
                              ? "Choose one owned Ability & Spell Profile for reusable spell and magic definitions. Actor-known state, mastery, cooldowns, charges, and resource state remain owner-scoped and are not initialized by attachment."
                              : "Choose one owned Ability & Spell Profile for reusable abilities, techniques, special attacks, passives, and spells. Actor-known state, mastery, cooldowns, charges, and resource state remain owner-scoped and are not initialized by attachment.",
                          onOpen: onOpenAbilitySpellProfilePicker,
                        }
                      : binding.definitionReferenceMode === "WALLET_PROFILE"
                        ? {
                            label: "Wallet Profile",
                            fallbackTitle: "Selected Wallet Profile",
                            fallbackVersion: "wallet_profile_contract_v0",
                            hasReference: binding.hasWalletProfileReference,
                            selectLabel: "Select Wallet Profile",
                            replaceLabel: "Replace Wallet Profile",
                            description:
                              "Choose one owned Wallet Profile for reusable gameplay currency definitions. Live balances, revisions, and transaction history remain owner-scoped and are not initialized by attachment.",
                            onOpen: onOpenWalletProfilePicker,
                          }
                        : null;

            return (
              <article
                key={`${binding.id}-${binding.order}-${index}`}
                className="overflow-hidden rounded-xl border border-white/10 bg-black/25"
              >
                <div className="flex items-start gap-2 px-3 py-3 sm:px-4">
                  <button
                    type="button"
                    onClick={() => onToggleBinding?.(binding.id)}
                    aria-label={`${binding.expanded ? "Collapse" : "Expand"} ${binding.domainLabel}`}
                    className="mt-0.5 rounded-lg p-2 text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--foreground)]"
                  >
                    <ToggleIcon size={16} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                        {binding.domainLabel}
                      </span>
                      {binding.required ? (
                        <span className="rounded-full border border-red-300/20 bg-red-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-red-100">
                          Required
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        {humanize(binding.activationMode)}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm text-[var(--foreground)]">
                      {binding.title || binding.id || "Untitled binding"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                      {binding.domainDescription}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={binding.enabled}
                    onClick={() =>
                      onUpdateBinding?.(binding.id, "enabled", !binding.enabled)
                    }
                    className={`rounded-lg border px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition ${
                      binding.enabled
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                        : "border-white/10 bg-black/25 text-[var(--muted)]"
                    }`}
                  >
                    {binding.enabled ? "Enabled" : "Disabled"}
                  </button>

                  <div className="hidden items-center gap-1 sm:flex">
                    <button
                      type="button"
                      onClick={() => onMoveBinding?.(binding.id, "UP")}
                      disabled={index === 0}
                      aria-label={`Move ${binding.domainLabel} up`}
                      className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--foreground)] disabled:opacity-30"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveBinding?.(binding.id, "DOWN")}
                      disabled={index === safeBindings.length - 1}
                      aria-label={`Move ${binding.domainLabel} down`}
                      className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--foreground)] disabled:opacity-30"
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveBinding?.(binding.id)}
                      aria-label={`Remove ${binding.domainLabel}`}
                      className="rounded-lg p-2 text-red-200/75 transition hover:bg-red-300/10 hover:text-red-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {binding.expanded ? (
                  <div className="border-t border-white/10 px-4 py-5 sm:px-5">
                    {binding.issues.length ? (
                      <div className="mb-4">
                        <IssueList issues={binding.issues} />
                      </div>
                    ) : null}

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <FieldLabel>Binding ID</FieldLabel>
                        <TextInput
                          value={binding.id}
                          onChange={(event) =>
                            onUpdateBinding?.(binding.id, "id", event.target.value)
                          }
                          placeholder="core.stats"
                        />
                      </div>

                      <div>
                        <FieldLabel>Domain</FieldLabel>
                        <SelectInput
                          value={binding.domain}
                          onChange={(event) =>
                            onUpdateBinding?.(
                              binding.id,
                              "domain",
                              event.target.value
                            )
                          }
                        >
                          {domainOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </SelectInput>
                      </div>

                      <div>
                        <FieldLabel>Display Title</FieldLabel>
                        <TextInput
                          value={binding.title}
                          onChange={(event) =>
                            onUpdateBinding?.(
                              binding.id,
                              "title",
                              event.target.value
                            )
                          }
                          placeholder="Core Stats and Pools"
                        />
                      </div>

                      <div>
                        <FieldLabel>Activation Mode</FieldLabel>
                        <SelectInput
                          value={binding.activationMode}
                          onChange={(event) =>
                            onUpdateBinding?.(
                              binding.id,
                              "activationMode",
                              event.target.value
                            )
                          }
                        >
                          {activationModeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </SelectInput>
                      </div>
                    </div>

                    <div className="mt-5">
                      <FieldLabel detail="Comma-separated uppercase routing signals">
                        Activation Domains
                      </FieldLabel>
                      <TextInput
                        value={binding.activationDomainsInput}
                        onChange={(event) =>
                          onUpdateBinding?.(
                            binding.id,
                            "activationDomainsInput",
                            event.target.value
                          )
                        }
                        placeholder={`${binding.domain}, COMBAT, ECONOMY`}
                      />
                    </div>

                    <div className="mt-5">
                      <CheckboxRow
                        checked={binding.required}
                        onChange={(checked) =>
                          onUpdateBinding?.(binding.id, "required", checked)
                        }
                        label="Required binding"
                        description="The parent integration should block completion when this domain is required but unavailable."
                      />
                    </div>

                    <div className="mt-5">
                      <FieldLabel>Binding Notes</FieldLabel>
                      <textarea
                        value={binding.notes}
                        onChange={(event) =>
                          onUpdateBinding?.(
                            binding.id,
                            "notes",
                            event.target.value
                          )
                        }
                        rows={3}
                        placeholder="Explain actor-specific restrictions or how shared definitions should be interpreted..."
                        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
                      />
                    </div>

                    <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-[var(--muted-gold)]">
                            <Link2 size={15} />
                            <p className="text-xs uppercase tracking-[0.18em]">
                              Reusable Definitions
                            </p>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                            {managedDefinition?.description ||
                              "References identify shared definitions. Mutable values remain isolated to the bound actor."}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            managedDefinition
                              ? managedDefinition.onOpen?.(binding.id)
                              : onAddReference?.(binding.id)
                          }
                          disabled={
                            !managedDefinition &&
                            binding.references.length >= referenceLimitPerBinding
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--foreground)] transition hover:border-[var(--muted-gold)]/30 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={13} />
                          {managedDefinition
                            ? managedDefinition.hasReference
                              ? managedDefinition.replaceLabel
                              : managedDefinition.selectLabel
                            : "Add Reference"}
                        </button>
                      </div>

                      {binding.references.length ? (
                        <div className="mt-4 space-y-3">
                          {binding.references.map((reference) =>
                            managedDefinition &&
                            reference.referenceType === "CREATION" ? (
                              <div
                                key={`${binding.id}-reference-${reference.index}`}
                                className="rounded-xl border border-[var(--muted-gold)]/20 bg-black/25 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                                      {managedDefinition.label}
                                    </p>
                                    <p className="mt-2 truncate text-sm text-[var(--foreground)]">
                                      {reference.title ||
                                        managedDefinition.fallbackTitle}
                                    </p>
                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                      {reference.version ||
                                        managedDefinition.fallbackVersion}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onRemoveReference?.(
                                        binding.id,
                                        reference.index
                                      )
                                    }
                                    aria-label={`Remove ${
                                      reference.title ||
                                      managedDefinition.fallbackTitle
                                    }`}
                                    className="rounded-lg p-2 text-red-200/75 transition hover:bg-red-300/10 hover:text-red-100"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                {reference.issues.length ? (
                                  <div className="mt-3">
                                    <IssueList issues={reference.issues} />
                                  </div>
                                ) : null}

                                <div className="mt-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                                  <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
                                    Creation Reference
                                  </p>
                                  <p className="mt-1 break-all font-mono text-[11px] text-[var(--foreground)]/75">
                                    {reference.sourceId}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={`${binding.id}-reference-${reference.index}`}
                                className="rounded-xl border border-white/10 bg-black/25 p-4"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                                    Reference {reference.index + 1}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onRemoveReference?.(
                                        binding.id,
                                        reference.index
                                      )
                                    }
                                    aria-label={`Remove reference ${
                                      reference.index + 1
                                    }`}
                                    className="rounded-lg p-2 text-red-200/75 transition hover:bg-red-300/10 hover:text-red-100"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                {reference.issues.length ? (
                                  <div className="mt-3">
                                    <IssueList issues={reference.issues} />
                                  </div>
                                ) : null}

                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                  <div>
                                    <FieldLabel>Reference Type</FieldLabel>
                                    <SelectInput
                                      value={reference.referenceType}
                                      onChange={(event) =>
                                        onUpdateReference?.(
                                          binding.id,
                                          reference.index,
                                          "referenceType",
                                          event.target.value
                                        )
                                      }
                                    >
                                      {referenceTypeOptions.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </SelectInput>
                                  </div>

                                  <div>
                                    <FieldLabel>Source ID</FieldLabel>
                                    <TextInput
                                      value={reference.sourceId}
                                      onChange={(event) =>
                                        onUpdateReference?.(
                                          binding.id,
                                          reference.index,
                                          "sourceId",
                                          event.target.value
                                        )
                                      }
                                      placeholder="Creation, module, or registry ID..."
                                    />
                                  </div>

                                  <div>
                                    <FieldLabel>Display Title</FieldLabel>
                                    <TextInput
                                      value={reference.title}
                                      onChange={(event) =>
                                        onUpdateReference?.(
                                          binding.id,
                                          reference.index,
                                          "title",
                                          event.target.value
                                        )
                                      }
                                      placeholder="Shared definition"
                                    />
                                  </div>

                                  <div>
                                    <FieldLabel>Definition Version</FieldLabel>
                                    <TextInput
                                      value={reference.version}
                                      onChange={(event) =>
                                        onUpdateReference?.(
                                          binding.id,
                                          reference.index,
                                          "version",
                                          event.target.value
                                        )
                                      }
                                      placeholder="definition_contract_v0"
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-xs leading-5 text-[var(--muted)]">
                          {binding.definitionReferenceMode === "STATS_POOLS_PROFILE"
                            ? "No Stats & Pools Profile selected. Choose an owned profile to provide the reusable stat and pool definitions for this binding."
                            : binding.definitionReferenceMode === "PROGRESSION_PROFILE"
                              ? "No Progression Profile selected. Choose an owned profile to provide reusable curve and tier definitions for this binding."
                              : binding.definitionReferenceMode === "SKILLS_PROFILE"
                                ? "No Skills Profile selected. Choose an owned profile to provide reusable skill and rank definitions for this binding."
                                : binding.definitionReferenceMode === "ABILITY_SPELL_PROFILE"
                                  ? `No Ability & Spell Profile selected. Choose an owned profile to provide reusable ${binding.domain === "MAGIC" ? "spell and magic" : "ability and spell"} definitions for this binding.`
                                  : binding.definitionReferenceMode === "WALLET_PROFILE"
                                    ? "No Wallet Profile selected. Choose an owned profile to provide reusable gameplay currency definitions for this binding."
                                    : "No reusable definition is attached. This is acceptable for an unbound template; bound enabled domains should normally identify a definition source."}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 sm:hidden">
                      <button
                        type="button"
                        onClick={() => onMoveBinding?.(binding.id, "UP")}
                        disabled={index === 0}
                        className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveBinding?.(binding.id, "DOWN")}
                        disabled={index === safeBindings.length - 1}
                        className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveBinding?.(binding.id)}
                        className="rounded-lg border border-red-300/20 p-2 text-red-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 px-5 py-10 text-center">
          <Boxes size={24} className="mx-auto text-[var(--muted-gold)]" />
          <p className="mt-3 text-sm text-[var(--foreground)]">
            No mechanics bindings yet
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-[var(--muted)]">
            Apply a preset or add a domain binding. This editor only composes the
            profile contract; it does not create definitions or activate runtime
            mechanics.
          </p>
        </div>
      )}

      {!enabled ? (
        <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm text-amber-100">
          This profile is disabled. Its authored structure remains available but
          future runtime integration must not activate its bindings.
        </div>
      ) : null}

      {jsonEditorOpen ? (
        <ActorMechanicsProfileJsonEditorModal
          actorMechanicsProfile={profile}
          ownerContext={ownerContext}
          onApply={onApplyJsonProfile}
          onClose={onCloseJsonEditor}
        />
      ) : null}
    </section>
  );
}
