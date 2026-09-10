"use client";

// Camera framing on the shared asset picker (FE/MEDIA-STUDIO session
// 2, plan gate option A, 10 Sep 2026): the same component every asset
// tile opens, in its rows layout. Every catalog entry is a row with
// its description and its group as a quiet label; the groups are the
// one filter dropdown, resting on All; search is local and client
// side. Choosing a row reports the preset value to setCameraPreset
// and closes, exactly as the former standalone modal did. Opened from
// the Camera framing control in Image settings (round 3 ruling,
// unchanged).
import { useMemo, useState } from "react";

import KitIngredientPicker from "@/components/kit/KitIngredientPicker";

const ALL_GROUPS = "ALL";

export default function ImagesV2CameraPresetPicker({
  items = [],
  groups = [],
  onSelect = null,
  onClose = null,
}) {
  const [query, setQuery] = useState("");
  const [groupId, setGroupId] = useState(ALL_GROUPS);
  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        if (groupId !== ALL_GROUPS && item.groupId !== groupId) return false;
        if (!normalizedQuery) return true;
        return `${item.title} ${item.description} ${item.subtitle}`
          .toLowerCase()
          .includes(normalizedQuery);
      }),
    [items, groupId, normalizedQuery]
  );

  const filter = {
    label: "Filter",
    options: [
      { value: ALL_GROUPS, label: "All" },
      ...groups.map((group) => ({ value: group.id, label: group.label })),
    ],
    value: groupId,
    restingValue: ALL_GROUPS,
    onChange: setGroupId,
  };

  return (
    <KitIngredientPicker
      slotLabel="Camera framing"
      description="Choose one camera treatment. Auto leaves the camera to the image model."
      searchValue={query}
      searchPlaceholder="Search camera presets..."
      onSearchChange={setQuery}
      filter={filter}
      items={visibleItems}
      itemLayout="rows"
      emptyMessage="No camera presets match this search."
      onChooseIngredient={(value) => {
        onSelect?.(value);
        onClose?.();
      }}
      showUseCustomAction={false}
      onClose={onClose}
    />
  );
}
