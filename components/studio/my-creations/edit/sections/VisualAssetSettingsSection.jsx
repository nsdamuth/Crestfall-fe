import {
  ReadOnlyField,
  SectionTitle,
  TextAreaField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

function parseTags(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export default function VisualAssetSettingsSection({ form, updateDataField }) {
  const data = form.data || {};

  return (
    <div>
      <SectionTitle
        eyebrow="Image Ingredient"
        title="Asset Settings"
        body="Edit classification and reuse metadata for this visual asset."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="Asset Type" value={form.type} />

        <TextField
          label="Rendering Style"
          value={data.rendering_style || ""}
          onChange={(value) => updateDataField("rendering_style", value)}
        />

        <TextField
          label="Category"
          value={data.category || data.location_type || data.outfit_type || ""}
          onChange={(value) => updateDataField("category", value)}
        />

        <TextField
          label="Mood / Atmosphere"
          value={data.mood || data.atmosphere || ""}
          onChange={(value) => updateDataField("mood", value)}
        />

        <TextField
          label="Tags"
          value={formatTags(data.tags)}
          onChange={(value) => updateDataField("tags", parseTags(value))}
        />

        <TextField
          label="Selected Cover"
          value={data.selected_cover || ""}
          onChange={(value) => updateDataField("selected_cover", value)}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label="Compatibility Notes"
            value={data.compatibility_notes || ""}
            onChange={(value) => updateDataField("compatibility_notes", value)}
            placeholder="Optional notes about what kinds of characters, styles, rooms, or image workflows this asset works best with."
          />
        </div>
      </div>
    </div>
  );
}