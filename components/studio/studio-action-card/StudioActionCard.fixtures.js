export const studioActionCardEnabledFixture = {
  eyebrow: "Story Rooms",
  title: "Enter a Story Room",
  children:
    "Resume an existing room or begin a new collaborative storytelling session.",
  href: "#preview-open",
  actionLabel: "Open Rooms",
  disabled: false,
};

export const studioActionCardDisabledFixture = {
  eyebrow: "Canon Session",
  title: "Start Canon Session",
  children:
    "Begin a continuity-aware Chronicle session using official Crestfall characters and story rules.",
  href: "",
  actionLabel: "Open",
  disabled: true,
};

export const studioActionCardNoHrefFixture = {
  eyebrow: "Reference",
  title: "Browse Reference Material",
  children:
    "This fixture preserves the current non-link behavior when no destination is supplied.",
  href: "",
  actionLabel: "Browse",
  disabled: false,
};

export const studioActionCardNoEyebrowFixture = {
  eyebrow: "",
  title: "Action Without an Eyebrow",
  children: "The title and supporting copy remain aligned without a label.",
  href: "#preview-no-eyebrow",
  actionLabel: "Continue",
  disabled: false,
};

export const studioActionCardNoBodyFixture = {
  eyebrow: "Compact",
  title: "Action Without Supporting Copy",
  children: null,
  href: "#preview-no-body",
  actionLabel: "Open",
  disabled: false,
};

export const studioActionCardLongContentFixture = {
  eyebrow: "A Deliberately Long Section Label for Responsive Stress Testing",
  title:
    "A Deliberately Long Studio Action Title That Must Wrap Without Breaking the Card",
  children:
    "This longer supporting description verifies that the portable card preserves readable line height, card growth, responsive wrapping, and action placement when supplied with substantially more content than the normal Play Canon cards.",
  href: "#preview-long-content",
  actionLabel: "Open This Deliberately Long Action",
  disabled: false,
};
