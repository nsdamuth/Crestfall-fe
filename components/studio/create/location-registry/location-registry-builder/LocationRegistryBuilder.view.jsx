"use client";

import {
  BookOpen,
  CloudSun,
  Compass,
  MapPin,
  Network,
  Plus,
  Route,
  Save,
  Settings2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import CreationPickerPanelView from "@/components/studio/creations/pickers/creation-picker-panel/CreationPickerPanel.view";
import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

const TAB_ICON_BY_KEY = Object.freeze({
  overview: BookOpen,
  entries: MapPin,
  connections: Route,
  presence: Users,
  weather: CloudSun,
  runtime: Settings2,
});

function findLocationName(entries = [], entryId = "") {
  return entries.find((entry) => entry.id === entryId)?.name || "Unknown Location";
}

function findWeatherScopeName(scopes = [], scopeId = "") {
  return scopes.find((scope) => scope.id === scopeId)?.name || "Unknown Weather Scope";
}

function findPresencePersonName(binding) {
  return binding?.person?.displayName || "Unknown Person";
}

function formatRegistryOption(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function LocationRegistryBuilderView({
  contractVersion = "location-registry-builder.view.v1",
  mode = "create",
  currentTab = "overview",
  hideTabs = false,
  tabs = [],
  registry,
  saveStatus = "idle",
  saveMessage = "",
  entryDraft = null,
  connectionDraft = null,
  presenceBindingDraft = null,
  weatherScopeDraft = null,
  locationOptions = [],
  locationLoadError = "",
  npcEntryOptions = [],
  npcEntryLoadError = "",
  optionSets = {},
  onSelectTab = () => {},
  onUpdateField = () => {},
  onUpdatePromptGuidance = () => {},
  onUpdateRuntimeGuidance = () => {},
  onSave = () => {},
  onOpenNewEntry = () => {},
  onOpenEditEntry = () => {},
  onCloseEntry = () => {},
  onUpdateEntryField = () => {},
  onUpdateEntryListText = () => {},
  onSetEntryKind = () => {},
  onApplyLocation = () => {},
  onSaveEntry = () => {},
  onDeleteEntry = () => {},
  onOpenNewConnection = () => {},
  onOpenEditConnection = () => {},
  onCloseConnection = () => {},
  onUpdateConnectionField = () => {},
  onSaveConnection = () => {},
  onDeleteConnection = () => {},
  onOpenNewPresenceBinding = () => {},
  onOpenEditPresenceBinding = () => {},
  onClosePresenceBinding = () => {},
  onUpdatePresenceBindingField = () => {},
  onUpdatePresenceConditionListText = () => {},
  onApplyNpcEntry = () => {},
  onSavePresenceBinding = () => {},
  onDeletePresenceBinding = () => {},
  onOpenNewWeatherScope = () => {},
  onOpenEditWeatherScope = () => {},
  onCloseWeatherScope = () => {},
  onUpdateWeatherScopeField = () => {},
  onSaveWeatherScope = () => {},
  onDeleteWeatherScope = () => {},
} = {}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        {hideTabs ? null : (
          <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = TAB_ICON_BY_KEY[tab.iconKey] || BookOpen;
                const active = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelectTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                      active
                        ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                        : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
          {currentTab === "overview" ? (
            <OverviewTab
              registry={registry}
              onUpdateField={onUpdateField}
              onUpdatePromptGuidance={onUpdatePromptGuidance}
            />
          ) : null}

          {currentTab === "entries" ? (
          <EntriesTab
            entries={registry.entries}
            presenceBindings={registry.presenceBindings}
            weatherScopes={registry.weatherScopes}
            locationLoadError={locationLoadError}
            onAdd={onOpenNewEntry}
            onEdit={onOpenEditEntry}
            onDelete={onDeleteEntry}
          />
          ) : null}

          {currentTab === "connections" ? (
            <ConnectionsTab
              entries={registry.entries}
              connections={registry.connections}
              onAdd={onOpenNewConnection}
              onEdit={onOpenEditConnection}
              onDelete={onDeleteConnection}
            />
          ) : null}

          {currentTab === "presence" ? (
            <PresenceTab
              entries={registry.entries}
              bindings={registry.presenceBindings}
              npcEntryLoadError={npcEntryLoadError}
              onAdd={onOpenNewPresenceBinding}
              onEdit={onOpenEditPresenceBinding}
              onDelete={onDeletePresenceBinding}
            />
          ) : null}

          {currentTab === "weather" ? (
            <WeatherTab
              weatherScopes={registry.weatherScopes}
              onAdd={onOpenNewWeatherScope}
              onEdit={onOpenEditWeatherScope}
              onDelete={onDeleteWeatherScope}
            />
          ) : null}

          {currentTab === "runtime" ? (
            <RuntimeTab
              registry={registry}
              onUpdateRuntimeGuidance={onUpdateRuntimeGuidance}
            />
          ) : null}
        </div>
      </div>

      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
          Registry Summary
        </p>

        <h2 className="mt-2 font-display text-3xl">{registry.title}</h2>

        <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
          {registry.description || "No description has been added yet."}
        </p>

        <div className="mt-5 grid gap-3">
          <SummaryPill label="Scope" value={registry.scope || "Unset"} />
          <SummaryPill label="Locations" value={registry.entries.length} />
          <SummaryPill
            label="Connections"
            value={registry.connections.length}
          />
          <SummaryPill
            label="People & Presence"
            value={registry.presenceBindings.length}
          />
          <SummaryPill
            label="Weather Scopes"
            value={registry.weatherScopes.length}
          />
          <SummaryPill
            label="Mutation"
            value={
              registry.middlewareHints?.allowRuntimeMutation
                ? "Runtime overlay allowed"
                : "Locked"
            }
          />
        </div>

        {mode === "edit" ? (
          <p className="mt-5 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
            Use the page Save button to persist changes.
          </p>
        ) : (
          <button
            type="button"
            onClick={onSave}
            disabled={saveStatus === "saving"}
            className="cf-btn cf-btn--primary mt-5 w-full"
          >
            <Save size={15} />
            {saveStatus === "saving" ? "Saving..." : "Save registry"}
          </button>
        )}

        {saveMessage ? (
          <span
            role={saveStatus === "error" ? "alert" : undefined}
            aria-live="polite"
            className={`mt-3 inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] ${
              saveStatus === "error"
                ? "text-[var(--status-danger)]"
                : "text-[var(--status-success)]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 flex-none rounded-full ${
                saveStatus === "error"
                  ? "bg-[var(--status-danger)]"
                  : "bg-[var(--status-success)]"
              }`}
            />
            <span className="inline">{saveMessage}</span>
          </span>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-[var(--ink-dim)]">
          Location Registries are reusable authored graphs. Runtime chat
          instances may later hydrate temporary basic locations, but those should
          not be written back into this registry unless explicitly promoted.
        </p>
      </aside>

      {entryDraft ? (
        <LocationEntryModal
          draft={entryDraft}
          entries={registry.entries}
          weatherScopes={registry.weatherScopes}
          presenceBindings={registry.presenceBindings}
          locationOptions={locationOptions}
          linkedCreationIds={registry.entries
            .filter((entry) => entry.kind === "CREATION_REF" && entry.creationId)
            .map((entry) => entry.creationId)}
          onClose={onCloseEntry}
          onChange={onUpdateEntryField}
          onListTextChange={onUpdateEntryListText}
          optionSets={optionSets}
          onSetKind={onSetEntryKind}
          onApplyLocation={onApplyLocation}
          onSave={onSaveEntry}
        />
              ) : null}

      {connectionDraft ? (
        <LocationConnectionModal
          draft={connectionDraft}
          entries={registry.entries}
          optionSets={optionSets}
          onClose={onCloseConnection}
          onChange={onUpdateConnectionField}
          onSave={onSaveConnection}
        />
      ) : null}

      {presenceBindingDraft ? (
        <PresenceBindingModal
          draft={presenceBindingDraft}
          entries={registry.entries}
          bindings={registry.presenceBindings}
          npcEntryOptions={npcEntryOptions}
          npcEntryLoadError={npcEntryLoadError}
          onClose={onClosePresenceBinding}
          onChange={onUpdatePresenceBindingField}
          onConditionListTextChange={onUpdatePresenceConditionListText}
          optionSets={optionSets}
          onApplyNpcEntry={onApplyNpcEntry}
          onSave={onSavePresenceBinding}
        />
      ) : null}

      {weatherScopeDraft ? (
        <WeatherScopeModal
          draft={weatherScopeDraft}
          onClose={onCloseWeatherScope}
          onChange={onUpdateWeatherScopeField}
          onSave={onSaveWeatherScope}
        />
      ) : null}
    </section>
  );
}

function OverviewTab({ registry, onUpdateField, onUpdatePromptGuidance }) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Registry Overview"
        body="Define the registry’s purpose and scope. This becomes the reusable place-continuity spine for attached rooms."
      />

      <TextInput
        label="Registry Title"
        value={registry.title}
        onChange={(value) => onUpdateField("title", value)}
        placeholder="Name this location registry..."
      />

      <TextInput
        label="Scope"
        value={registry.scope}
        onChange={(value) => onUpdateField("scope", value)}
        placeholder="World, city, district, story room, campaign..."
      />

      <TextAreaField
        label="Description"
        value={registry.description}
        onChange={(value) => onUpdateField("description", value)}
        maxLength={SHORT_LONGFORM_MAX_LENGTH}
      />

      <TextAreaField
        label="Runtime Summary"
        value={registry.promptGuidance?.summary || ""}
        onChange={(value) => onUpdatePromptGuidance("summary", value)}
        placeholder="Compact summary for middleware and prompt context."
        maxLength={SHORT_LONGFORM_MAX_LENGTH}
      />

      <TextAreaField
        label="Usage Notes"
        value={registry.promptGuidance?.usageNotes || ""}
        onChange={(value) => onUpdatePromptGuidance("usageNotes", value)}
        placeholder="How should attached rooms use this registry?"
        maxLength={SHORT_LONGFORM_MAX_LENGTH}
      />
    </div>
  );
}

function EntriesTab({
  entries,
  presenceBindings,
  weatherScopes,
  locationLoadError,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Locations"
        body="Add tracked places. Sub-locations are locations with parent locations, so neighborhoods, buildings, rooms, streets, and landmarks can all share one graph."
      />

      <button
        type="button"
        onClick={onAdd}
        className="cf-btn cf-btn--primary w-fit"
      >
        <Plus size={14} />
        Add location
      </button>
      {locationLoadError ? (
        <p className="text-sm text-red-200">{locationLoadError}</p>
      ) : null}
      <div className="grid gap-4">
        {entries.length ? (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                    {entry.kind === "CREATION_REF" ? "Linked Location" : "Basic Location"} ·{" "}
                    {entry.category || "Location"} · {entry.locationScale}
                  </p>
                  <h3 className="mt-2 font-display text-3xl">
                    {entry.name || "Untitled Location"}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(entry)}>Edit</SmallAction>
                  <SmallDangerAction onClick={() => onDelete(entry.id)} />
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--ink-dim)]">
                {entry.parentLocationId ? (
                  <p>Parent: {findLocationName(entries, entry.parentLocationId)}</p>
                ) : null}

                {entry.weatherScopeId ? (
                  <p>
                    Weather Scope:{" "}
                    {findWeatherScopeName(weatherScopes, entry.weatherScopeId)}
                  </p>
                ) : null}

                {entry.region ? <p>Region: {entry.region}</p> : null}
                {entry.mood ? <p>Mood: {entry.mood}</p> : null}
                {presenceBindings.filter(
                  (binding) => binding.locationEntryId === entry.id
                ).length ? (
                  <p>
                    Structured People: {presenceBindings.filter(
                      (binding) => binding.locationEntryId === entry.id
                    ).length}
                  </p>
                ) : null}

                <p>
                  {entry.summary ||
                    entry.publicDescription ||
                    entry.placeFunction ||
                    "No location summary yet."}
                </p>
              </div>
            </article>
          ))
        ) : (
          <EmptyPanel message="No locations yet. Add a tracked location, building, room, street, district, or landmark to begin." />
        )}
      </div>
    </div>
  );
}

function ConnectionsTab({
  entries,
  connections,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Connections"
        body="Define how Locations relate, how substantial their separation is, and which travel methods can use the route. Qualitative distance drives travel narration; physical distance remains optional descriptive context."
      />

      <button
        type="button"
        onClick={onAdd}
        disabled={entries.length < 2}
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
        Add connection
      </button>

      {entries.length < 2 ? (
        <p className="text-sm text-[var(--ink-dim)]">
          Add at least two locations before creating connections.
        </p>
      ) : null}

      <div className="grid gap-4">
        {connections.length ? (
          connections.map((connection) => (
            <article
              key={connection.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                    {connection.relation} · {connection.defaultRouteType || connection.routeType}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    {findLocationName(entries, connection.fromLocationId)} →{" "}
                    {findLocationName(entries, connection.toLocationId)}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(connection)}>
                    Edit
                  </SmallAction>
                  <SmallDangerAction onClick={() => onDelete(connection.id)} />
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--ink-dim)]">
                <p>
                  Distance Estimate: {connection.distanceModeDisplay || "Unknown / Unset"}
                </p>

                <p>
                  Available Methods: {Array.isArray(connection.availableRouteTypes) &&
                  connection.availableRouteTypes.length
                    ? connection.availableRouteTypes
                        .map(formatRegistryOption)
                        .join(", ")
                    : formatRegistryOption(
                        connection.defaultRouteType ||
                          connection.routeType ||
                          "UNKNOWN"
                      )}
                </p>

                {connection.distanceMeters ? (
                  <p>
                    Physical Distance: {connection.distanceMeters}m
                    {" · informational only"}
                  </p>
                ) : null}

                <p>
                  Bidirectional: {connection.bidirectional ? "yes" : "no"}
                </p>

                <p>{connection.notes || "No connection notes yet."}</p>
              </div>
            </article>
          ))
        ) : (
          <EmptyPanel message="No connections yet." />
        )}
      </div>
    </div>
  );
}

function PresenceTab({
  entries,
  bindings,
  npcEntryLoadError,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="People & Presence"
        body="Connect Locations to NPC Registry entries. These bindings define ownership, employment, residence, common visits, and future deterministic arrival opportunities without duplicating Character identity."
      />

      <button
        type="button"
        onClick={onAdd}
        disabled={!entries.length}
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} />
        Add presence binding
      </button>

      {!entries.length ? (
        <p className="text-sm text-[var(--ink-dim)]">
          Add at least one Location before assigning people.
        </p>
      ) : null}

      {npcEntryLoadError ? (
        <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {npcEntryLoadError}
        </p>
      ) : null}

      <div className="grid gap-4">
        {bindings.length ? (
          bindings.map((binding) => (
            <article
              key={binding.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                    {formatRegistryOption(binding.relationshipRole)} · {formatRegistryOption(binding.frequency)}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    {findPresencePersonName(binding)}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--ink-dim)]">
                    {findLocationName(entries, binding.locationEntryId)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(binding)}>Edit</SmallAction>
                  <SmallDangerAction onClick={() => onDelete(binding.id)} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <PresenceBadge>
                  {binding.automaticPresence ? "Automatic Enabled" : "Manual Only"}
                </PresenceBadge>
                {(binding.opportunityTriggers || []).map((trigger) => (
                  <PresenceBadge key={trigger}>
                    {formatRegistryOption(trigger)}
                  </PresenceBadge>
                ))}
              </div>

              <div className="mt-3 grid gap-1 text-sm leading-6 text-[var(--ink-dim)]">
                <p>
                  NPC Registry: {binding.person.registryTitle || "Linked Registry"}
                </p>
                <p>
                  Cooldown: {binding.cooldownTurns} turns · Minimum absence: {binding.minimumAbsentTurns} turns
                </p>
                {binding.guidance ? <p>{binding.guidance}</p> : null}
              </div>
            </article>
          ))
        ) : (
          <EmptyPanel message="No structured people or presence rules yet." />
        )}
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)] text-sm leading-6 text-[var(--ink-dim)]">
        Existing Common Occupants and Ownership Notes remain preserved as legacy descriptive data. New runtime work should prefer these structured bindings.
      </div>
    </div>
  );
}

function PresenceBadge({ children }) {
  return (
    <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] uppercase [font-weight:var(--weight-medium)] text-[var(--gold-bright)]">
      {children}
    </span>
  );
}

function WeatherTab({ weatherScopes, onAdd, onEdit, onDelete }) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Weather Scopes"
        body="Weather scopes let parent locations control shared conditions. A neighborhood, city, or wilderness region can define weather inherited by child locations."
      />

      <button
        type="button"
        onClick={onAdd}
        className="cf-btn cf-btn--primary w-fit"
      >
        <Plus size={14} />
        Add weather scope
      </button>

      <div className="grid gap-4">
        {weatherScopes.length ? (
          weatherScopes.map((scope) => (
            <article
              key={scope.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                    {scope.scopeType || "Weather Scope"}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    {scope.name || "Untitled Weather Scope"}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <SmallAction onClick={() => onEdit(scope)}>Edit</SmallAction>
                  <SmallDangerAction onClick={() => onDelete(scope.id)} />
                </div>
              </div>

              <p className="mt-3 leading-7 text-[var(--ink-dim)]">
                {scope.defaultWeatherBehavior || scope.notes || "No notes yet."}
              </p>
            </article>
          ))
        ) : (
          <EmptyPanel message="No weather scopes yet." />
        )}
      </div>
    </div>
  );
}

function RuntimeTab({ registry, onUpdateRuntimeGuidance }) {
  return (
    <div className="grid gap-5">
      <SectionHeader
        title="Runtime Rules"
        body="These fields describe future middleware behavior. The saved registry remains reusable; hydrated chat-instance state can later hold active location and ad-hoc basic locations."
      />

      <TextAreaField
        label="Movement Resolver Notes"
        value={registry.runtimeGuidance?.movementResolverNotes || ""}
        onChange={(value) =>
          onUpdateRuntimeGuidance("movementResolverNotes", value)
        }
        placeholder="Notes for later movement resolver behavior."
        maxLength={SHORT_LONGFORM_MAX_LENGTH}
      />

      <TextAreaField
        label="Ad-Hoc Location Policy"
        value={registry.runtimeGuidance?.adHocLocationPolicy || ""}
        onChange={(value) =>
          onUpdateRuntimeGuidance("adHocLocationPolicy", value)
        }
        maxLength={SHORT_LONGFORM_MAX_LENGTH}
      />

      <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
        <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
          Middleware Intent
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--ink-dim)]">
          {(registry.middlewareHints?.intendedUse || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function LocationEntryModal({
  draft,
  entries,
  weatherScopes,
  presenceBindings = [],
  locationOptions = [],
  linkedCreationIds = [],
  onClose,
  onChange,
  onListTextChange,
  optionSets = {},
  onSetKind,
  onApplyLocation,
  onSave,
}) {
  const parentOptions = entries
    .filter((entry) => entry.id !== draft.id)
    .map((entry) => ({
      value: entry.id,
      label: entry.name || "Untitled Location",
    }));

  const weatherOptions = weatherScopes.map((scope) => ({
    value: scope.id,
    label: scope.name || "Untitled Weather Scope",
  }));
  const disabledIds = linkedCreationIds.filter((id) => id !== draft.creationId);
  const selectedIds = draft.creationId ? [draft.creationId] : [];
  const locationPresenceBindings = presenceBindings.filter(
    (binding) => binding.locationEntryId === draft.id
  );
  const ownerCount = locationPresenceBindings.filter(
    (binding) => binding.relationshipRole === "OWNER"
  ).length;

  return (
    <ModalShell title="Location Entry" onClose={onClose}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSetKind("AD_HOC")}
                className={`rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                  draft.kind === "AD_HOC"
                    ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                    : "border-white/10 text-[var(--ink-dim)]"
                }`}
              >
                Basic / Ad-Hoc Location
              </button>

              <button
                type="button"
                onClick={() => onSetKind("CREATION_REF")}
                className={`rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                  draft.kind === "CREATION_REF"
                    ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                    : "border-white/10 text-[var(--ink-dim)]"
                }`}
              >
                Link Existing Location
              </button>
            </div>

            <ModalActions
              onClose={onClose}
              onSave={onSave}
              saveLabel="Save location"
              placement="top"
            />

            {draft.kind === "CREATION_REF" ? (
              <CreationPickerPanelView
                items={locationOptions}
                selectedIds={selectedIds}
                disabledIds={disabledIds}
                searchPlaceholder="Search location assets..."
                emptyMessage="No location assets found yet."
                onSelect={onApplyLocation}
              />
            ) : (
              <TextInput
                label="Name"
                value={draft.name}
                onChange={(value) => onChange("name", value)}
              />
            )}
          </div>

          <SelectInput
            label="Category"
            value={draft.category}
            options={optionSets.locationCategoryOptions || []}
            onChange={(value) => onChange("category", value)}
          />

          <SelectInput
            label="Location Scale"
            value={draft.locationScale}
            options={optionSets.locationScaleOptions || []}
            onChange={(value) => onChange("locationScale", value)}
          />

          <SelectInput
            label="Space Type"
            value={draft.spaceType}
            options={optionSets.spaceTypeOptions || []}
            onChange={(value) => onChange("spaceType", value)}
          />

          <SelectInput
            label="Parent Location"
            value={draft.parentLocationId}
            options={parentOptions}
            includeBlank
            blankLabel="No parent"
            onChange={(value) => onChange("parentLocationId", value)}
          />

          <SelectInput
            label="Weather Scope"
            value={draft.weatherScopeId}
            options={weatherOptions}
            includeBlank
            blankLabel="Use own / inherited weather"
            onChange={(value) => onChange("weatherScopeId", value)}
          />

          <TextInput
            label="Region / Area Label"
            value={draft.region}
            onChange={(value) => onChange("region", value)}
          />

          <TextInput
            label="Mood"
            value={draft.mood}
            onChange={(value) => onChange("mood", value)}
          />
        </div>

        <TextAreaField
          label="Aliases"
          value={draft.aliasesText || ""}
          onChange={(value) => onListTextChange("aliases", value)}
          placeholder="One alias per line."
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Summary"
          value={draft.summary}
          onChange={(value) => onChange("summary", value)}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Public Description"
          value={draft.publicDescription}
          onChange={(value) => onChange("publicDescription", value)}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Hidden Notes"
          value={draft.hiddenNotes}
          onChange={(value) => onChange("hiddenNotes", value)}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField
            label="Atmosphere"
            value={draft.atmosphere}
            onChange={(value) => onChange("atmosphere", value)}
            maxLength={DEEP_LONGFORM_MAX_LENGTH}
          />

          <TextAreaField
            label="Sensory Notes"
            value={draft.sensoryNotes}
            onChange={(value) => onChange("sensoryNotes", value)}
            maxLength={DEEP_LONGFORM_MAX_LENGTH}
          />

          <TextAreaField
            label="Place Function"
            value={draft.placeFunction}
            onChange={(value) => onChange("placeFunction", value)}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />

          <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
            <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
              People & Presence
            </p>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-[var(--ink-dim)]">
              <p>Structured people: {locationPresenceBindings.length}</p>
              <p>Owners: {ownerCount}</p>
              <p>
                Manage owners, occupants, visitors, frequency, and automatic
                arrival guidance from the People & Presence tab.
              </p>
            </div>
          </div>
        </div>

        <TextAreaField
          label="Themes"
          value={draft.themesText || ""}
          onChange={(value) => onListTextChange("themes", value)}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Scene Affordances"
          value={draft.sceneAffordancesText || ""}
          onChange={(value) => onListTextChange("sceneAffordances", value)}
          placeholder="Investigation, chase, social scene, ambush..."
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <TextAreaField
            label="Access Rules"
            value={draft.accessRules}
            onChange={(value) => onChange("accessRules", value)}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />

          <TextAreaField
            label="Knowledge Rules"
            value={draft.knowledgeRules}
            onChange={(value) => onChange("knowledgeRules", value)}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />

          <TextAreaField
            label="Rules Notes"
            value={draft.rulesNotes}
            onChange={(value) => onChange("rulesNotes", value)}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>

        <TextAreaField
          label="Prompt Guidance"
          value={draft.promptGuidance}
          onChange={(value) => onChange("promptGuidance", value)}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          saveLabel="Save location"
        />
      </div>
    </ModalShell>
  );
}

function LocationConnectionModal({
  draft,
  entries,
  optionSets = {},
  onClose,
  onChange,
  onSave,
}) {
  const locationOptions = entries.map((entry) => ({
    value: entry.id,
    label: entry.name || "Untitled Location",
  }));

  const availableRouteTypes = Array.isArray(draft.availableRouteTypes)
    ? draft.availableRouteTypes
    : draft.routeType
      ? [draft.routeType]
      : [];

  const defaultRouteType =
    draft.defaultRouteType || draft.routeType || "UNKNOWN";

  const defaultRouteOptions = (optionSets.routeTypeOptions || [])
    .filter(
      (routeType) =>
        availableRouteTypes.includes(routeType) ||
        routeType === defaultRouteType
    )
    .map((routeType) => ({
      value: routeType,
      label: formatRegistryOption(routeType),
    }));

  const distanceDescription = draft.distanceDescription || "";

  const relationDistanceSuggestion =
    draft.relationDistanceSuggestion || "UNKNOWN";

  const defaultTravelTierText = draft.defaultTravelTierText || "";

  return (
    <ModalShell title="Connection Rule" onClose={onClose}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectInput
            label="From Location"
            value={draft.fromLocationId}
            options={locationOptions}
            includeBlank
            blankLabel="Select source"
            onChange={(value) => onChange("fromLocationId", value)}
          />

          <SelectInput
            label="To Location"
            value={draft.toLocationId}
            options={locationOptions}
            includeBlank
            blankLabel="Select target"
            onChange={(value) => onChange("toLocationId", value)}
          />

          <SelectInput
            label="Relationship"
            value={draft.relation}
            options={optionSets.connectionRelationOptions || []}
            onChange={(value) => onChange("relation", value)}
          />

          <SelectInput
            label="Distance Estimate"
            value={draft.distanceMode}
            options={optionSets.distanceModeOptions || []}
            onChange={(value) => onChange("distanceMode", value)}
          />
        </div>

        <RouteTypeMultiSelect
          label="Available Travel Methods"
          values={availableRouteTypes}
          options={(optionSets.routeTypeOptions || []).filter(
            (routeType) => routeType !== "UNKNOWN"
          )}
          onChange={(value) => onChange("availableRouteTypes", value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectInput
            label="Default Travel Method"
            value={defaultRouteType}
            options={defaultRouteOptions}
            includeBlank={!defaultRouteOptions.length}
            blankLabel="Select an available method"
            onChange={(value) => onChange("defaultRouteType", value)}
          />

          <TextInput
            label="Optional Physical Distance (Meters)"
            value={draft.distanceMeters}
            onChange={(value) => onChange("distanceMeters", value)}
            placeholder="For maps, tactical context, or narration"
          />

          <CheckboxInput
            label="Bidirectional"
            checked={draft.bidirectional}
            onChange={(value) => onChange("bidirectional", value)}
          />
        </div>

        <div className="grid gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)] text-sm leading-6 text-[var(--ink-dim)]">
          <p>
            <span className="text-[var(--gold-ornament)]">Travel authority:</span>{" "}
            the qualitative Distance Estimate and runtime-selected travel
            capability drive travel narration. Physical meters are descriptive
            only.
          </p>

          <p>
            <span className="text-[var(--gold-ornament)]">Relationship suggestion:</span>{" "}
            {draft.relationDistanceSuggestionLabel || formatRegistryOption(relationDistanceSuggestion)}
          </p>

          {distanceDescription ? (
            <p>
              <span className="text-[var(--gold-ornament)]">Selected distance:</span>{" "}
              {distanceDescription}
            </p>
          ) : null}

          {defaultTravelTierText ? (
            <p>
              <span className="text-[var(--gold-ornament)]">Default method fallback:</span>{" "}
              {defaultTravelTierText} A runtime character, vehicle, spell, portal,
              or other travel asset may supply a different effective tier.
            </p>
          ) : null}
        </div>

        <TextAreaField
          label="Access Rules"
          value={draft.accessRules}
          onChange={(value) => onChange("accessRules", value)}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Route Notes"
          value={draft.notes}
          onChange={(value) => onChange("notes", value)}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          saveLabel="Save connection"
        />
      </div>
    </ModalShell>
  );
}

function PresenceBindingModal({
  draft,
  entries,
  bindings,
  npcEntryOptions,
  npcEntryLoadError,
  onClose,
  onChange,
  onConditionListTextChange,
  optionSets = {},
  onApplyNpcEntry,
  onSave,
}) {
  const locationOptions = entries.map((entry) => ({
    value: entry.id,
    label: entry.name || "Untitled Location",
  }));
  const selectedPersonId =
    draft.person?.registryCreationId && draft.person?.registryEntryId
      ? `${draft.person.registryCreationId}:${draft.person.registryEntryId}`
      : "";
  const disabledPersonIds = bindings
    .filter(
      (binding) =>
        binding.id !== draft.id &&
        binding.locationEntryId === draft.locationEntryId
    )
    .map(
      (binding) =>
        `${binding.person.registryCreationId}:${binding.person.registryEntryId}`
    );

  return (
    <ModalShell title="People & Presence Binding" onClose={onClose}>
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectInput
            label="Location"
            value={draft.locationEntryId}
            options={locationOptions}
            includeBlank
            blankLabel="Select Location"
            onChange={(value) => onChange("locationEntryId", value)}
          />

          <SelectInput
            label="Relationship to Location"
            value={draft.relationshipRole}
            options={optionSets.presenceRelationshipRoleOptions || []}
            onChange={(value) => onChange("relationshipRole", value)}
          />

          <SelectInput
            label="Presence Frequency"
            value={draft.frequency}
            options={optionSets.presenceFrequencyOptions || []}
            onChange={(value) => onChange("frequency", value)}
          />

          <CheckboxInput
            label="Automatic Presence Enabled"
            checked={draft.automaticPresence}
            onChange={(value) => onChange("automaticPresence", value)}
          />
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            NPC Registry Person
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            Select a linked Character or custom NPC entry from one of your NPC Registries. Location Registries store only the stable reference and presence rule.
          </p>

          {npcEntryLoadError ? (
            <p className="mt-3 text-sm text-red-200">{npcEntryLoadError}</p>
          ) : null}

          <div className="mt-4">
            <CreationPickerPanelView
              items={npcEntryOptions}
              selectedIds={selectedPersonId ? [selectedPersonId] : []}
              disabledIds={disabledPersonIds}
              searchPlaceholder="Search NPC Registry entries..."
              emptyMessage="No usable NPC Registry entries were found."
              gridClassName="max-h-[38vh] sm:grid-cols-2 lg:grid-cols-3"
              onSelect={onApplyNpcEntry}
            />
          </div>
        </div>

        {draft.person?.displayName ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-4">
            <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">Selected Person</p>
            <p className="mt-2 font-display text-2xl">{draft.person.displayName}</p>
            <p className="mt-1 text-sm text-[var(--ink-dim)]">
              {draft.person.registryTitle || "NPC Registry"} · {formatRegistryOption(draft.person.entryKind || "NPC")}
            </p>
          </div>
        ) : null}

        <OptionMultiSelect
          label="Eligible Arrival Opportunities"
          description="These are opportunities, not guarantees. Frequency, cooldown, conditions, and later narrative-driver evidence determine whether an automatic arrival may occur."
          values={draft.opportunityTriggers}
          options={optionSets.presenceOpportunityTriggerOptions || []}
          onChange={(value) => onChange("opportunityTriggers", value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Cooldown Turns"
            value={draft.cooldownTurns}
            onChange={(value) => onChange("cooldownTurns", value)}
            placeholder="6"
          />
          <TextInput
            label="Minimum Absent Turns"
            value={draft.minimumAbsentTurns}
            onChange={(value) => onChange("minimumAbsentTurns", value)}
            placeholder="2"
          />
        </div>

        <TextAreaField
          label="Presence / Arrival Guidance"
          value={draft.guidance}
          onChange={(value) => onChange("guidance", value)}
          placeholder="Usually behind the counter during business hours; may arrive from the neighboring workshop when technical help is needed."
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField
            label="Allowed Dayparts"
            value={draft.conditionDaypartsText || ""}
            onChange={(value) => onConditionListTextChange("dayparts", value)}
            placeholder="MORNING\nAFTERNOON"
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
          <TextAreaField
            label="Required Scene Tags"
            value={draft.conditionRequiredSceneTagsText || ""}
            onChange={(value) => onConditionListTextChange("requiredSceneTags", value)}
            placeholder="technical_problem\nbusiness_hours"
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
          <TextAreaField
            label="Excluded Scene Tags"
            value={draft.conditionExcludedSceneTagsText || ""}
            onChange={(value) => onConditionListTextChange("excludedSceneTags", value)}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
          <TextAreaField
            label="Required Runtime Flags"
            value={draft.conditionRequiredFlagsText || ""}
            onChange={(value) => onConditionListTextChange("requiredFlags", value)}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          saveLabel="Save presence binding"
        />
      </div>
    </ModalShell>
  );
}

function WeatherScopeModal({ draft, onClose, onChange, onSave }) {
  return (
    <ModalShell title="Weather Scope" onClose={onClose}>
      <div className="grid gap-5">
        <TextInput
          label="Name"
          value={draft.name}
          onChange={(value) => onChange("name", value)}
        />

        <TextInput
          label="Scope Type"
          value={draft.scopeType}
          onChange={(value) => onChange("scopeType", value)}
        />

        <TextAreaField
          label="Default Weather Behavior"
          value={draft.defaultWeatherBehavior}
          onChange={(value) => onChange("defaultWeatherBehavior", value)}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label="Notes"
          value={draft.notes}
          onChange={(value) => onChange("notes", value)}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <ModalActions
          onClose={onClose}
          onSave={onSave}
          saveLabel="Save weather scope"
        />
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-[var(--space-4)] backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-[var(--space-3)] border-b border-[var(--line-whisper)] px-[var(--space-4)] py-[var(--space-3)]">
          <div>
            <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
              Location Registry
            </p>
            <h2 className="mt-2 font-display text-4xl">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-105px)] overflow-y-auto p-[var(--space-5)]">
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalActions({
  onClose,
  onSave,
  saveLabel,
  placement = "bottom",
}) {
  const positionClassName =
    placement === "top"
      ? "border-b border-[var(--line-whisper)] pb-[var(--space-5)]"
      : "border-t border-[var(--line-whisper)] pt-[var(--space-5)]";

  return (
    <div className={`flex flex-wrap justify-end gap-[var(--space-3)] ${positionClassName}`}>
      <button
        type="button"
        onClick={onClose}
        className="cf-btn cf-btn--secondary"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        className="cf-btn cf-btn--primary"
      >
        {saveLabel}
      </button>
    </div>
  );
}

function SectionHeader({ title, body }) {
  return (
    <SectionTitle
      eyebrow={
        <>
          <Compass size={14} />
          Location Registry
        </>
      }
      title={title}
      body={body}
    />
  );
}

function TextInput({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options = [],
  onChange,
  includeBlank = false,
  blankLabel = "None",
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? {
          value: option,
          label: option.replaceAll("_", " "),
        }
      : option
  );

  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
      >
        {includeBlank ? <option value="">{blankLabel}</option> : null}
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function OptionMultiSelect({
  label,
  description = "",
  values = [],
  options = [],
  onChange,
}) {
  const selected = new Set(Array.isArray(values) ? values : []);

  function toggleOption(option) {
    const nextValues = selected.has(option)
      ? [...selected].filter((value) => value !== option)
      : [...selected, option];

    onChange(nextValues);
  }

  return (
    <fieldset className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
      <legend className="px-2 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </legend>
      {description ? (
        <p className="mb-4 text-sm leading-6 text-[var(--ink-dim)]">
          {description}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3"
          >
            <input
              type="checkbox"
              checked={selected.has(option)}
              onChange={() => toggleOption(option)}
            />
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
              {formatRegistryOption(option)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RouteTypeMultiSelect({
  label,
  values = [],
  options = [],
  onChange,
}) {
  const selected = new Set(Array.isArray(values) ? values : []);

  function toggleRouteType(routeType) {
    const nextValues = selected.has(routeType)
      ? [...selected].filter((value) => value !== routeType)
      : [...selected, routeType];

    onChange(nextValues);
  }

  return (
    <fieldset className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
      <legend className="px-2 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </legend>

      <p className="mb-4 text-sm leading-6 text-[var(--ink-dim)]">
        Select every travel method this connection supports. The default method
        is used only when runtime context does not identify another valid method.
      </p>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((routeType) => (
          <label
            key={routeType}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3"
          >
            <input
              type="checkbox"
              checked={selected.has(routeType)}
              onChange={() => toggleRouteType(routeType)}
            />
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
              {formatRegistryOption(routeType)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxInput({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
        {label}
      </span>
    </label>
  );
}

function EmptyPanel({ message }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
      <p className="text-sm leading-6 text-[var(--ink-dim)]">{message}</p>
    </div>
  );
}

function SmallAction({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cf-btn cf-btn--secondary cf-btn--sm"
    >
      {children}
    </button>
  );
}

function SmallDangerAction({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cf-btn cf-btn--danger cf-btn--sm"
      aria-label="Delete"
    >
      <Trash2 size={14} />
      <span className="text-xs">Delete</span>
    </button>
  );
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)] uppercase [font-weight:var(--weight-medium)] text-[var(--gold-bright)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--ink)]">{value}</p>
    </div>
  );
}