import { createElement } from "react";

const noop = () => {};

function previewAction(label) {
  return createElement(
    "button",
    {
      type: "button",
      className:
        "rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]",
      onClick: noop,
    },
    label
  );
}

function previewFilters() {
  return createElement(
    "div",
    { className: "space-y-4" },
    createElement("label", { className: "block" },
      createElement(
        "span",
        {
          className:
            "text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]",
        },
        "Search"
      ),
      createElement("input", {
        defaultValue: "",
        placeholder: "Search creations...",
        className:
          "mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]",
      })
    ),
    createElement(
      "div",
      { className: "flex flex-wrap gap-2" },
      ["All", "Characters", "Locations", "Scenarios"].map((label) =>
        createElement(
          "button",
          {
            key: label,
            type: "button",
            className:
              "rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]",
            onClick: noop,
          },
          label
        )
      )
    )
  );
}

const baseFixture = {
  eyebrow: "Creation Library",
  body: "Creations start private by default. Filter the library without changing any saved creation data.",
  actions: previewAction("Create New"),
  children: previewFilters(),
  showMobileBody: false,
  mobileOpen: false,
  desktopOpen: true,
  onToggleMobileFilters: noop,
  onToggleDesktopFilters: noop,
};

export const responsiveFilterPanelDesktopOpenFixture = {
  ...baseFixture,
};

export const responsiveFilterPanelDesktopClosedFixture = {
  ...baseFixture,
  desktopOpen: false,
};

export const responsiveFilterPanelMobileClosedFixture = {
  ...baseFixture,
  mobileOpen: false,
};

export const responsiveFilterPanelMobileOpenFixture = {
  ...baseFixture,
  mobileOpen: true,
};

export const responsiveFilterPanelMobileBodyFixture = {
  ...baseFixture,
  mobileOpen: true,
  showMobileBody: true,
};

export const responsiveFilterPanelNoBodyFixture = {
  ...baseFixture,
  body: "",
};

export const responsiveFilterPanelNoActionsFixture = {
  ...baseFixture,
  actions: null,
};

export const responsiveFilterPanelLongContentFixture = {
  ...baseFixture,
  eyebrow: "Community Creation and Creator Discovery Filters",
  body: "Browse public creations and creator profiles across an unusually descriptive collection heading while preserving the same compact responsive disclosure behavior on narrow and wide screens.",
};
