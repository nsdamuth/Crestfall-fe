import { MapPin, X } from "lucide-react";

import {
  ReadOnlyField,
  SectionTitle,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function LocationIdentitySectionView({
  sectionEyebrow = "Location Editor",
  sectionTitle = "Location Identity",
  sectionDescription = "",
  locationNameLabel = "Location Name",
  locationNameValue = "",
  locationCategoryLabel = "Location Type / Category",
  locationCategoryValue = "",
  spaceTypeLabel = "Space Type",
  spaceTypeValue = "",
  spaceTypeOptions = [],
  locationScaleLabel = "Location Scale",
  locationScaleValue = "",
  locationScaleOptions = [],
  parentLocationLabel = "Parent Location",
  parentLocation = {},
  parentImageFallbackUrl = "/images/placeholder-card.jpg",
  selectedParentFallbackTitle = "Selected Parent Location",
  noParentTitle = "No parent location selected",
  noParentDescription = "",
  selectParentLabel = "Select Parent",
  changeParentLabel = "Change Parent",
  clearParentLabel = "Clear",
  intendedUseLabel = "Intended Use",
  intendedUseValue = "",
  tagsLabel = "Tags",
  tagsValue = "",
  creationTypeLabel = "Creation Type",
  creationTypeValue = "",
  inheritanceEyebrow = "Inheritance",
  inheritanceDescription = "",
  inheritanceItems = [],
  onChangeLocationName = null,
  onChangeLocationCategory = null,
  onChangeSpaceType = null,
  onChangeLocationScale = null,
  onOpenParentPicker = null,
  onClearParentLocation = null,
  onChangeIntendedUse = null,
  onChangeTags = null,
  onChangeInheritance = null,
} = {}) {
  const hasParentLocation = Boolean(parentLocation?.id);

  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField
          label={locationNameLabel}
          value={locationNameValue}
          onChange={(value) => onChangeLocationName?.(value)}
        />

        <TextField
          label={locationCategoryLabel}
          value={locationCategoryValue}
          onChange={(value) => onChangeLocationCategory?.(value)}
        />

        <SelectField
          label={spaceTypeLabel}
          value={spaceTypeValue}
          options={spaceTypeOptions}
          onChange={onChangeSpaceType}
        />

        <SelectField
          label={locationScaleLabel}
          value={locationScaleValue}
          options={locationScaleOptions}
          onChange={onChangeLocationScale}
        />

        <div className="md:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {parentLocationLabel}
          </span>

          <div className="mt-2 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
            {hasParentLocation ? (
              <SelectedParentLocation
                parentLocation={parentLocation}
                parentImageFallbackUrl={parentImageFallbackUrl}
                selectedParentFallbackTitle={selectedParentFallbackTitle}
                changeParentLabel={changeParentLabel}
                clearParentLabel={clearParentLabel}
                onOpenParentPicker={onOpenParentPicker}
                onClearParentLocation={onClearParentLocation}
              />
            ) : (
              <EmptyParentLocation
                title={noParentTitle}
                description={noParentDescription}
                selectParentLabel={selectParentLabel}
                onOpenParentPicker={onOpenParentPicker}
              />
            )}
          </div>
        </div>

        <TextField
          label={intendedUseLabel}
          value={intendedUseValue}
          onChange={(value) => onChangeIntendedUse?.(value)}
        />

        <TextField
          label={tagsLabel}
          value={tagsValue}
          onChange={(value) => onChangeTags?.(value)}
        />

        <ReadOnlyField label={creationTypeLabel} value={creationTypeValue} />
      </div>

      <div className="mt-8 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          {inheritanceEyebrow}
        </p>

        {inheritanceDescription ? (
          <p className="mt-2 text-sm leading-7 text-[var(--ink-dim)]">
            {inheritanceDescription}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {inheritanceItems.map((item) => (
            <CheckboxField
              key={item.key}
              label={item.label}
              checked={item.checked}
              onChange={(value) => onChangeInheritance?.(item.key, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value = "",
  options = [],
  onChange = null,
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]/50"
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange?.(event.target.checked)}
        className="h-4 w-4 accent-[var(--gold-ornament)]"
      />
      <span>{label}</span>
    </label>
  );
}

function SelectedParentLocation({
  parentLocation,
  parentImageFallbackUrl,
  selectedParentFallbackTitle,
  changeParentLabel,
  clearParentLabel,
  onOpenParentPicker,
  onClearParentLocation,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div
        className="h-20 w-20 shrink-0 rounded-xl border border-white/10 bg-black/40 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            parentLocation.imageUrl || parentImageFallbackUrl
          })`,
        }}
      />

      <div className="min-w-0 flex-1">
        <p className="font-display text-2xl">
          {parentLocation.title || selectedParentFallbackTitle}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {parentLocation.scale ? (
            <MetadataBadge value={parentLocation.scale} />
          ) : null}

          {parentLocation.spaceType ? (
            <MetadataBadge value={parentLocation.spaceType} />
          ) : null}
        </div>

        <p className="mt-2 break-all text-xs text-[var(--ink-dim)]">
          {parentLocation.id}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpenParentPicker?.()}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
        >
          <MapPin size={14} />
          {changeParentLabel}
        </button>

        <button
          type="button"
          onClick={() => onClearParentLocation?.()}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--status-danger)] transition hover:bg-white/5"
        >
          <X size={14} />
          {clearParentLabel}
        </button>
      </div>
    </div>
  );
}

function EmptyParentLocation({
  title,
  description,
  selectParentLabel,
  onOpenParentPicker,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-2xl">{title}</p>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {description}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onOpenParentPicker?.()}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
      >
        <MapPin size={14} />
        {selectParentLabel}
      </button>
    </div>
  );
}

function MetadataBadge({ value }) {
  return (
    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
      {value}
    </span>
  );
}
