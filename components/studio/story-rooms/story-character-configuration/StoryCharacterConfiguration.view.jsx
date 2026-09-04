"use client";

function StatsPoolsConfiguration({ statsConfiguration }) {
  if (!statsConfiguration) return null;
  const profiles = Array.isArray(statsConfiguration.profiles)
    ? statsConfiguration.profiles
    : [];

  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
        Stats & Pools
      </p>
      {!profiles.length ? (
        <p className="mt-3 text-sm leading-6 text-amber-100">
          This Story requires Stats & Pools, but no usable Stats & Pools profile is available.
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {profiles.map((profile) => {
            const configuration = profile.configuration || {};
            const pointBudget = String(configuration.mode || "").toUpperCase() === "POINT_BUDGET";
            return (
              <div key={profile.bindingId} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{profile.profileTitle || profile.bindingTitle}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{profile.bindingTitle}</p>
                  </div>
                  {pointBudget ? (
                    <div className="text-right text-xs text-[var(--muted)]">
                      <p>Budget: {configuration.budget}</p>
                      <p>Spent: {configuration.spent}</p>
                      <p>Remaining: {configuration.remaining}</p>
                    </div>
                  ) : (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                      Uses authored defaults
                    </span>
                  )}
                </div>

                {pointBudget ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(configuration.statValues || []).map((stat) => (
                      <label key={stat.definitionId} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <span className="text-sm font-medium text-[var(--foreground)]">{stat.title}</span>
                        <span className="mt-1 block text-xs text-[var(--muted)]">
                          Starts at {stat.defaultValue}
                          {stat.maximum !== null && stat.maximum !== undefined
                            ? ` · max ${stat.maximum}`
                            : ""}
                        </span>
                        <input
                          type="number"
                          min={stat.defaultValue}
                          max={stat.maximum ?? undefined}
                          step={stat.valueType === "DECIMAL" ? "any" : 1}
                          value={stat.configuredValue}
                          onChange={(event) =>
                            statsConfiguration.onChangeStat?.(
                              profile.bindingId,
                              stat.definitionId,
                              event.target.value
                            )
                          }
                          className="mt-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--muted-gold)]/50"
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    Crestfall can initialize this Stats & Pools profile from its creator-authored defaults. No player allocation is required.
                  </p>
                )}
              </div>
            );
          })}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => statsConfiguration.onSave?.()}
              disabled={!statsConfiguration.canSave}
              className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-2 text-sm text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statsConfiguration.profiles.some(
                (profile) => String(profile?.configuration?.mode || "").toUpperCase() === "POINT_BUDGET"
              )
                ? "Save Stats Allocation"
                : "Initialize Stats & Pools"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillsConfiguration({ skillsConfiguration }) {
  if (!skillsConfiguration) return null;
  const profiles = Array.isArray(skillsConfiguration.profiles)
    ? skillsConfiguration.profiles
    : [];

  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
        Skills
      </p>
      {!profiles.length ? (
        <p className="mt-3 text-sm leading-6 text-amber-100">
          This Story requires Skills, but no usable Skills profile is available.
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {profiles.map((profile) => {
            const configuration = profile.configuration || {};
            const slotsMode = String(configuration.mode || "").toUpperCase() === "SLOTS";
            return (
              <div key={profile.bindingId} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {profile.profileTitle || profile.bindingTitle}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{profile.bindingTitle}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                    {slotsMode ? `${configuration.requiredSelectionCount || 0} required slot(s)` : "Uses authored starting ranks"}
                  </span>
                </div>

                {slotsMode ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {(configuration.slots || []).map((slot) => (
                      <label key={slot.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {slot.title}
                        </span>
                        <span className="mt-1 block text-xs text-[var(--muted)]">
                          Target rank {slot.targetRank} · {slot.required ? "required" : "optional"}
                        </span>
                        <select
                          value={slot.selectedSkillId || ""}
                          onChange={(event) =>
                            skillsConfiguration.onSelectSkill?.(
                              profile.bindingId,
                              slot.id,
                              event.target.value
                            )
                          }
                          className="mt-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--muted-gold)]/50"
                        >
                          <option value="">
                            {slot.required ? "Choose a Skill" : "No Skill selected"}
                          </option>
                          {(slot.eligibleSkills || []).map((skill) => (
                            <option key={skill.id} value={skill.id}>
                              {skill.title} · max {skill.maximumRank}
                            </option>
                          ))}
                        </select>
                        {slot.source === "EXISTING_PROFICIENCY" && slot.satisfied ? (
                          <span className="mt-2 block text-xs text-emerald-200">
                            Already satisfied by this player actor.
                          </span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    Crestfall can initialize this Skills profile from its creator-authored starting ranks. No starter selection is required.
                  </p>
                )}

                {profile.duplicateSelection ? (
                  <p className="mt-3 text-xs text-amber-100">
                    This profile requires unique Skills across starter slots.
                  </p>
                ) : null}
              </div>
            );
          })}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => skillsConfiguration.onSave?.()}
              disabled={!skillsConfiguration.canSave}
              className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-2 text-sm text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {profiles.some(
                (profile) => String(profile?.configuration?.mode || "").toUpperCase() === "SLOTS"
              )
                ? "Save Starter Skills"
                : "Initialize Skills"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomLocalChoiceField({
  label,
  value = "",
  options = [],
  inputMode = "FREE_ENTRY",
  listId = "",
  onChange = null,
}) {
  const mode = String(inputMode || "FREE_ENTRY").toUpperCase();
  const normalizedOptions = (options || []).map((option) => String(option || "").toUpperCase());
  const normalizedValue = String(value || "").toUpperCase();

  if (mode === "FIXED_LIST") {
    return (
      <label className="text-xs text-[var(--muted)]">
        {label}
        <select
          value={normalizedValue}
          onChange={(event) => onChange?.(event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
        >
          {normalizedOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  if (mode === "LIST_PLUS_CUSTOM") {
    const effectiveListId = listId || `room-local-${String(label || "choice").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return (
      <label className="text-xs text-[var(--muted)]">
        {label}
        <input
          list={effectiveListId}
          value={value || ""}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="Choose or type a custom value"
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
        />
        <datalist id={effectiveListId}>
          {normalizedOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </label>
    );
  }

  return (
    <label className="text-xs text-[var(--muted)]">
      {label}
      <input
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="GENERAL"
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
      />
    </label>
  );
}

function RoomLocalCustomField({ field = {}, value = "", listId = "", onChange = null }) {
  const inputMode = String(field.inputMode || "LONG_TEXT").toUpperCase();
  const options = Array.isArray(field.options) ? field.options : [];
  const label = (
    <>
      {field.title} {field.required ? <span className="text-amber-100">*</span> : null}
      {field.helperText ? (
        <span className="mt-1 block text-[11px] leading-4 text-[var(--muted)]">{field.helperText}</span>
      ) : null}
    </>
  );

  if (inputMode === "TEXT") {
    return (
      <label className="text-xs text-[var(--muted)] md:col-span-2">
        {label}
        <input
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          maxLength={field.maxLength}
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
        />
      </label>
    );
  }

  if (inputMode === "SINGLE_SELECT") {
    return (
      <label className="text-xs text-[var(--muted)] md:col-span-2">
        {label}
        <select
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
        >
          <option value="">Choose…</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  if (inputMode === "SINGLE_SELECT_OR_CUSTOM") {
    const effectiveListId = listId || `room-local-custom-${String(field.id || "field").replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
    return (
      <label className="text-xs text-[var(--muted)] md:col-span-2">
        {label}
        <input
          list={effectiveListId}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          maxLength={field.maxLength}
          placeholder="Choose or type a custom value"
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
        />
        <datalist id={effectiveListId}>
          {options.map((option) => <option key={option} value={option} />)}
        </datalist>
      </label>
    );
  }

  return (
    <label className="text-xs text-[var(--muted)] md:col-span-2">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        maxLength={field.maxLength}
        rows={3}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
      />
    </label>
  );
}

function RoomLocalAbilitySpellAuthoring({
  profile,
  authoring,
  abilitySpellConfiguration,
}) {
  if (!authoring || String(authoring.mode || "").toUpperCase() !== "GROUPS") {
    return null;
  }

  return (
    <div className="mt-5 rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/[0.04] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            Create Story-local abilities & spells
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-[var(--muted)]">
            The Story creator requires you to author definitions for this character.
            These definitions belong to this Story and do not modify a saved Player Character.
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
          {authoring.requiredDefinitionCount || 0} required
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {(authoring.groups || []).map((group) => {
          const definitions = group.authoredDefinitions || [];
          const canAdd = definitions.length < Number(group.maximumDefinitions || 0);
          return (
            <div key={group.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{group.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Create {group.minimumDefinitions}
                    {group.maximumDefinitions !== group.minimumDefinitions
                      ? `–${group.maximumDefinitions}`
                      : ""}
                    {group.requireSameSchool ? " · same school required" : ""}
                    {group.mechanicsMode ? ` · ${String(group.mechanicsMode).replaceAll("_", " ").toLowerCase()}` : ""}
                  </p>
                </div>
                <span className="text-xs text-[var(--muted)]">
                  {definitions.length}/{group.maximumDefinitions}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {definitions.map((definition, definitionIndex) => {
                  const requiredFields = new Set(
                    (group.requiredFields || []).map((value) => String(value || "").toUpperCase())
                  );
                  const canRemove = definitions.length > Number(group.minimumDefinitions || 0);
                  return (
                    <div key={definition.draftId} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]">
                          Definition {definitionIndex + 1}
                        </p>
                        {canRemove ? (
                          <button
                            type="button"
                            onClick={() =>
                              abilitySpellConfiguration.onRemoveAuthoredDefinition?.(
                                profile.profileId,
                                definition.draftId
                              )
                            }
                            className="text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="text-xs text-[var(--muted)] md:col-span-2">
                          Title <span className="text-amber-100">*</span>
                          <input
                            value={definition.title || ""}
                            onChange={(event) =>
                              abilitySpellConfiguration.onChangeAuthoredDefinition?.(
                                profile.profileId,
                                definition.draftId,
                                "title",
                                event.target.value
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
                          />
                        </label>

                        <label className="text-xs text-[var(--muted)]">
                          Type
                          <select
                            value={definition.type || "ABILITY"}
                            onChange={(event) =>
                              abilitySpellConfiguration.onChangeAuthoredDefinition?.(
                                profile.profileId,
                                definition.draftId,
                                "type",
                                event.target.value
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
                          >
                            {(group.typeOptions || []).map((option) => (
                              <option key={option} value={option}>{String(option).replaceAll("_", " ")}</option>
                            ))}
                          </select>
                        </label>

                        {group.showSchool !== false ? (
                          <RoomLocalChoiceField
                            label="School"
                            value={definition.school || ""}
                            options={group.schoolOptions || []}
                            inputMode={group.schoolInputMode || "FREE_ENTRY"}
                            listId={`room-local-${profile.profileId}-${group.id}-${definition.draftId}-school`}
                            onChange={(value) =>
                              abilitySpellConfiguration.onChangeAuthoredDefinition?.(
                                profile.profileId,
                                definition.draftId,
                                "school",
                                value
                              )
                            }
                          />
                        ) : null}

                        {group.showCategory !== false ? (
                          <RoomLocalChoiceField
                            label="Category"
                            value={definition.category || ""}
                            options={group.categoryOptions || []}
                            inputMode={group.categoryInputMode || "FREE_ENTRY"}
                            listId={`room-local-${profile.profileId}-${group.id}-${definition.draftId}-category`}
                            onChange={(value) =>
                              abilitySpellConfiguration.onChangeAuthoredDefinition?.(
                                profile.profileId,
                                definition.draftId,
                                "category",
                                value
                              )
                            }
                          />
                        ) : null}

                        {group.showDescription !== false ? (
                          <label className="text-xs text-[var(--muted)] md:col-span-2">
                            Description {requiredFields.has("DESCRIPTION") ? <span className="text-amber-100">*</span> : null}
                            <textarea
                              value={definition.description || ""}
                              onChange={(event) =>
                                abilitySpellConfiguration.onChangeAuthoredDefinition?.(
                                  profile.profileId,
                                  definition.draftId,
                                  "description",
                                  event.target.value
                                )
                              }
                              rows={3}
                              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
                            />
                          </label>
                        ) : null}

                        {group.showNarrativeDescription !== false ? (
                          <label className="text-xs text-[var(--muted)] md:col-span-2">
                            Narrative description {requiredFields.has("NARRATIVE_DESCRIPTION") ? <span className="text-amber-100">*</span> : null}
                            <textarea
                              value={definition.narrativeDescription || ""}
                              onChange={(event) =>
                                abilitySpellConfiguration.onChangeAuthoredDefinition?.(
                                  profile.profileId,
                                  definition.draftId,
                                  "narrativeDescription",
                                  event.target.value
                                )
                              }
                              rows={3}
                              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-[var(--foreground)]"
                            />
                          </label>
                        ) : null}

                        {(group.customTextFields || []).map((field) => (
                          <RoomLocalCustomField
                            key={field.id}
                            field={field}
                            value={definition.customText?.[field.id] || ""}
                            listId={`room-local-${profile.profileId}-${group.id}-${definition.draftId}-${field.id}`}
                            onChange={(value) =>
                              abilitySpellConfiguration.onChangeAuthoredCustomText?.(
                                profile.profileId,
                                definition.draftId,
                                field.id,
                                value
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {canAdd ? (
                <button
                  type="button"
                  onClick={() =>
                    abilitySpellConfiguration.onAddAuthoredDefinition?.(profile.profileId, group)
                  }
                  className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  + Add definition
                </button>
              ) : null}

              {group.countInvalid || group.incompleteDefinition ? (
                <p className="mt-3 text-xs text-amber-100">
                  Complete the required number of definitions and every required field.
                </p>
              ) : null}
              {group.sameSchoolInvalid ? (
                <p className="mt-2 text-xs text-amber-100">
                  Every authored definition in this group must use the same school.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {authoring.duplicateTitle ? (
        <p className="mt-3 text-xs text-amber-100">
          This profile requires unique titles across player-authored definitions.
        </p>
      ) : null}
    </div>
  );
}

function AbilitySpellConfiguration({ abilitySpellConfiguration }) {
  if (!abilitySpellConfiguration) return null;
  const profiles = Array.isArray(abilitySpellConfiguration.profiles)
    ? abilitySpellConfiguration.profiles
    : [];

  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
        Abilities & Magic
      </p>
      {!profiles.length ? (
        <p className="mt-3 text-sm leading-6 text-amber-100">
          This Story requires Ability/Spell configuration, but no usable Ability & Spell profile is available.
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {profiles.map((profile) => {
            const configuration = profile.configuration || {};
            const groupsMode = String(configuration.mode || "").toUpperCase() === "GROUPS";
            return (
              <div key={profile.profileId} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {profile.profileTitle || "Ability & Spell Profile"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {(profile.domains || []).join(" · ") || "ABILITIES"}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                    {groupsMode
                      ? `${configuration.requiredSelectionCount || 0} required selection(s)`
                      : "Uses existing actor state"}
                  </span>
                </div>

                {groupsMode ? (
                  <div className="mt-4 space-y-4">
                    {(configuration.groups || []).map((group) => (
                      <div key={group.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {group.title}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              Choose {group.minimumSelections}
                              {group.maximumSelections !== group.minimumSelections
                                ? `–${group.maximumSelections}`
                                : ""}
                              {group.requireSameSchool ? " · same school required" : ""}
                            </p>
                          </div>
                          <span className="text-xs text-[var(--muted)]">
                            {(group.selectedDefinitionIds || []).length}/{group.maximumSelections}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          {(group.eligibleDefinitions || []).map((definition) => {
                            const selected = (group.selectedDefinitionIds || []).includes(definition.id);
                            const atMaximum =
                              !selected &&
                              (group.selectedDefinitionIds || []).length >= Number(group.maximumSelections || 0);
                            return (
                              <label
                                key={definition.id}
                                className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-2 text-sm ${
                                  selected
                                    ? "border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10"
                                    : "border-white/10 bg-black/20"
                                } ${atMaximum ? "cursor-not-allowed opacity-50" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  disabled={atMaximum}
                                  onChange={(event) =>
                                    abilitySpellConfiguration.onToggleDefinition?.(
                                      profile.profileId,
                                      group.id,
                                      definition.id,
                                      event.target.checked
                                    )
                                  }
                                  className="mt-1"
                                />
                                <span>
                                  <span className="block font-medium text-[var(--foreground)]">
                                    {definition.title}
                                  </span>
                                  <span className="mt-1 block text-xs text-[var(--muted)]">
                                    {definition.type}
                                    {definition.school ? ` · ${definition.school}` : ""}
                                    {definition.category ? ` · ${definition.category}` : ""}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>

                        {group.countInvalid ? (
                          <p className="mt-3 text-xs text-amber-100">
                            Select between {group.minimumSelections} and {group.maximumSelections} definition(s).
                          </p>
                        ) : null}
                        {group.sameSchoolInvalid ? (
                          <p className="mt-3 text-xs text-amber-100">
                            Every selected definition in this group must use the same authored school.
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    This profile has no explicit starting-definition selection requirement.
                  </p>
                )}

                {profile.duplicateSelection ? (
                  <p className="mt-3 text-xs text-amber-100">
                    This profile requires unique definitions across starting selection groups.
                  </p>
                ) : null}

                <RoomLocalAbilitySpellAuthoring
                  profile={profile}
                  authoring={configuration.roomLocalDefinitionAuthoring}
                  abilitySpellConfiguration={abilitySpellConfiguration}
                />
              </div>
            );
          })}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => abilitySpellConfiguration.onSave?.()}
              disabled={!abilitySpellConfiguration.canSave}
              className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-2 text-sm text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Ability & Spell Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StoryCharacterConfigurationView({
  loading = false,
  error = "",
  saveMessage = "",
  roomTitle = "Story",
  hasPlayerActor = false,
  actorMode = "NONE",
  required = false,
  status = "NOT_APPLICABLE",
  attachmentDomains = [],
  configurationDomains = [],
  statsConfiguration = null,
  skillsConfiguration = null,
  abilitySpellConfiguration = null,
  backHref = "/studio/v2/stories",
  InternalLinkComponent = "a",
} = {}) {
  const LinkComponent = InternalLinkComponent;

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Character Configuration
        </p>
        <h1 className="mt-2 font-display text-3xl text-[var(--foreground)]">
          {roomTitle}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          Required mechanics are configured for this Story player actor through the attached Mechanics Modules. Saved Player Character assets are never modified by this room-local setup.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-[var(--muted)]">
          Loading Character Configuration…
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : !hasPlayerActor ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-[var(--muted)]">
          This Story does not currently have a player actor awaiting Character Configuration.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm font-medium text-[var(--foreground)]">
              Status: {status.replaceAll("_", " ")}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Actor mode: {String(actorMode || "NONE").replaceAll("_", " ")}
            </p>

            {attachmentDomains.length ? (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">Required mechanics attachments</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachmentDomains.map((domain) => (
                    <span key={domain} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--muted)]">{domain}</span>
                  ))}
                </div>
              </div>
            ) : null}

            {configurationDomains.length ? (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">Player configuration required</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {configurationDomains.map((domain) => (
                    <span key={domain} className="rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/5 px-3 py-1 text-xs text-[var(--muted-gold)]">{domain}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <StatsPoolsConfiguration statsConfiguration={statsConfiguration} />

          <SkillsConfiguration skillsConfiguration={skillsConfiguration} />

          <AbilitySpellConfiguration abilitySpellConfiguration={abilitySpellConfiguration} />

          {saveMessage ? (
            <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-100">
              {saveMessage}
            </div>
          ) : null}

          {required ? (
            <p className="rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
              Normal Story turns remain locked until every required Mechanics Module finishes Character Configuration.
            </p>
          ) : (
            <p className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-100">
              This Story player actor is ready for normal play.
            </p>
          )}
        </>
      )}

      <LinkComponent
        href={backHref}
        className="inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        ← Back to Story
      </LinkComponent>
    </section>
  );
}
