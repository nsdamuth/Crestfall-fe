import { ExternalLink, MapPin, X } from "lucide-react";

import {
  ReadOnlyField,
  SectionTitle,
  SelectField as SharedSelectField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";
import KitBadge from "@/components/kit/KitBadge";
import LocationsCheckboxField from "../LocationsCheckboxField";

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
  selectParentLabel = "Select parent",
  changeParentLabel = "Change parent",
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

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)] md:grid-cols-2">
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

        {/* 4.5 picker field: label row, standard bed, a right-edge
            "opens a dialog" affordance glyph, no bordered panel box. */}
        <div className="md:col-span-2 block">
          <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {parentLocationLabel}
          </span>

          <div className="relative mt-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
            <ExternalLink
              size={14}
              aria-hidden="true"
              className="absolute right-[var(--space-4)] top-[var(--space-4)] text-[var(--ink-faint)]"
            />

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

      {/* Section 5 de-nesting: inset hairline, tier 4 label, no
          bordered/backgrounded panel. */}
      <div className="mt-[var(--space-6)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
        <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
          {inheritanceEyebrow}
        </p>

        {inheritanceDescription ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {inheritanceDescription}
          </p>
        ) : null}

        <div className="mt-[var(--space-4)] grid gap-[var(--space-3)] md:grid-cols-2">
          {inheritanceItems.map((item) => (
            <LocationsCheckboxField
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

// ED1C dropdown law: the local native-select helper delegates to the
// SharedFields SelectField (branded kit dropdown grammar). Same
// props, same onChange(value) intent.
function SelectField({
  label,
  value = "",
  options = [],
  onChange = null,
}) {
  return (
    <SharedSelectField
      label={label}
      value={value}
      options={options}
      onChange={(nextValue) => onChange?.(nextValue)}
    />
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
    <div className="flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-center">
      <div
        className="h-20 w-20 shrink-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            parentLocation.imageUrl || parentImageFallbackUrl
          })`,
        }}
      />

      <div className="min-w-0 flex-1">
        <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
          {parentLocation.title || selectedParentFallbackTitle}
        </p>

        <div className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
          {parentLocation.scale ? (
            <KitBadge label={parentLocation.scale} variant="meta" surface="canvas" />
          ) : null}
          {parentLocation.spaceType ? (
            <KitBadge label={parentLocation.spaceType} variant="meta" surface="canvas" />
          ) : null}
        </div>

        <p className="mt-[var(--space-2)] break-all text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-faint)]">
          {parentLocation.id}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-[var(--space-2)]">
        <button
          type="button"
          onClick={() => onOpenParentPicker?.()}
          className="cf-btn cf-btn--secondary"
        >
          <MapPin size={14} />
          {changeParentLabel}
        </button>

        <button
          type="button"
          onClick={() => onClearParentLocation?.()}
          className="cf-btn cf-btn--danger"
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
    <div className="flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-faint)]">
          {title}
        </p>
        {description ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {description}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onOpenParentPicker?.()}
        className="cf-btn cf-btn--primary shrink-0"
      >
        <MapPin size={14} />
        {selectParentLabel}
      </button>
    </div>
  );
}
