const baseField = (value, maxLength, placeholder) => ({
  value,
  maxLength,
  count: `${value.length}/${maxLength}`,
  placeholder,
});

export const studioAccountProfileDefaultFixture = {
  isLoading: false,
  isSaving: false,
  loadErrorMessage: "",
  saveErrorMessage: "",
  statusMessage: "",
  profileInitial: "C",
  profileUsername: "crestfall",
  userEmail: "creator@crestfall.example",
  hasPublicProfile: true,
  publicProfileHref: "/studio/profile/crestfall",
  fields: {
    username: baseField("crestfall", 48, "Crestfall"),
    displayName: baseField("Crestfall Creator", 100, "N D"),
    contactEmail: baseField(
      "support@crestfall.example",
      254,
      "creator@example.com"
    ),
    tagline: baseField("Building worlds worth remembering.", 120, "Tagline"),
    description: baseField(
      "Creator of connected characters, locations, and story systems.",
      1000,
      "Profile description"
    ),
    announcement: baseField(
      "Aethelgard stories are now available.",
      500,
      "Announcement"
    ),
    contentPreference: {
      value: "SFW",
      options: [
        { value: "SFW", label: "SFW Only" },
        { value: "MATURE", label: "Mature" },
        { value: "EXPLICIT", label: "Explicit / Web Only" },
      ],
    },
  },
  defaultPlayerCharacter: {
    id: "11111111-2222-4333-8444-555555555555",
    title: "Ari Vale",
    description: "An adaptable traveler prepared for unfamiliar worlds.",
    imageUrl: "",
  },
  hasDefaultPlayerCharacter: true,
  hasDefaultPlayerCharacterSelection: true,
  isContentPreferenceNoticeOpen: false,
  contentPreferenceNoticeLabel: "",
  profileMediaContent: null,
  accountMetricsContent: null,
  onSubmit: null,
  onUsernameChange: null,
  onDisplayNameChange: null,
  onContactEmailChange: null,
  onTaglineChange: null,
  onDescriptionChange: null,
  onAnnouncementChange: null,
  onContentPreferenceChange: null,
  onCloseContentPreferenceNotice: null,
  onOpenDefaultPlayerCharacterPicker: null,
  onClearDefaultPlayerCharacter: null,
};

export const studioAccountProfileLoadingFixture = {
  ...studioAccountProfileDefaultFixture,
  isLoading: true,
};

export const studioAccountProfileLoadErrorFixture = {
  ...studioAccountProfileDefaultFixture,
  loadErrorMessage: "Profile could not be loaded.",
};

export const studioAccountProfileSavingFixture = {
  ...studioAccountProfileDefaultFixture,
  isSaving: true,
};

export const studioAccountProfileSavedFixture = {
  ...studioAccountProfileDefaultFixture,
  statusMessage: "Profile updated.",
};

export const studioAccountProfileNoUsernameFixture = {
  ...studioAccountProfileDefaultFixture,
  profileInitial: "C",
  profileUsername: "unset",
  hasPublicProfile: false,
  publicProfileHref: null,
  fields: {
    ...studioAccountProfileDefaultFixture.fields,
    username: baseField("", 48, "Crestfall"),
  },
};

export const studioAccountProfileNoDefaultPcFixture = {
  ...studioAccountProfileDefaultFixture,
  defaultPlayerCharacter: null,
  hasDefaultPlayerCharacter: false,
  hasDefaultPlayerCharacterSelection: false,
};

export const studioAccountProfileContentNoticeFixture = {
  ...studioAccountProfileDefaultFixture,
  isContentPreferenceNoticeOpen: true,
  contentPreferenceNoticeLabel: "Mature",
};
