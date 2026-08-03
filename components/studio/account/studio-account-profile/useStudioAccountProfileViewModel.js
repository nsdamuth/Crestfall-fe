"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ANNOUNCEMENT_MAX,
  DESCRIPTION_MAX,
  DISPLAY_NAME_MAX,
  TAGLINE_MAX,
  USERNAME_MAX,
} from "@/lib/shared/profile/constants";
import {
  fetchCurrentStudioAccount,
  updateCurrentStudioAccount,
} from "@/lib/client/studio/profile/studioAccountClient";

const CONTACT_EMAIL_MAX = 254;

const CONTENT_PREFERENCE_OPTIONS = [
  { value: "SFW", label: "SFW Only" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit / Web Only" },
];

const EMPTY_FORM = {
  username: "",
  displayName: "",
  contactEmail: "",
  tagline: "",
  description: "",
  announcement: "",
  contentRatingPreference: "SFW",
  defaultPlayerCharacterId: null,
};

function accountToForm(profile, user) {
  return {
    username: profile?.username || "",
    displayName: profile?.display_name || "",
    contactEmail: profile?.contact_email || user?.email || "",
    tagline: profile?.tagline || "",
    description: profile?.description || "",
    announcement: profile?.announcement || "",
    contentRatingPreference: profile?.content_rating_preference || "SFW",
    defaultPlayerCharacterId: profile?.default_player_character_id || null,
  };
}

function formToUpdatePayload(form) {
  return {
    username: form.username,
    display_name: form.displayName,
    contact_email: form.contactEmail,
    tagline: form.tagline,
    description: form.description,
    announcement: form.announcement,
    content_rating_preference: form.contentRatingPreference,
    default_player_character_id: form.defaultPlayerCharacterId,
  };
}

function toField(value, maxLength, extra = {}) {
  return {
    value,
    maxLength,
    count: `${value.length}/${maxLength}`,
    ...extra,
  };
}

export function useStudioAccountProfileViewModel() {
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentPreferenceNotice, setContentPreferenceNotice] = useState(null);
  const [isDefaultPlayerCharacterPickerOpen, setDefaultPlayerCharacterPickerOpen] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      setLoadErrorMessage("");
      setStatusMessage("");

      try {
        const nextAccount = await fetchCurrentStudioAccount();

        if (cancelled) return;

        setAccount(nextAccount);
        setForm(accountToForm(nextAccount.profile, nextAccount.user));
      } catch (error) {
        if (cancelled) return;

        setLoadErrorMessage(error?.message || "Failed to load profile.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleContentPreferenceChange(value) {
    if (value === "SFW") {
      updateField("contentRatingPreference", value);
      return;
    }

    setContentPreferenceNotice(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSaving(true);
    setSaveErrorMessage("");
    setStatusMessage("");

    try {
      const nextAccount = await updateCurrentStudioAccount(
        formToUpdatePayload(form)
      );

      setAccount(nextAccount);
      setForm(accountToForm(nextAccount.profile, nextAccount.user));
      setStatusMessage("Profile updated.");
    } catch (error) {
      setSaveErrorMessage(error?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleSelectDefaultPlayerCharacter(playerCharacter) {
    const playerCharacterId = playerCharacter?.id || null;

    updateField("defaultPlayerCharacterId", playerCharacterId);

    setAccount((current) => ({
      ...(current || {}),
      profile: {
        ...(current?.profile || {}),
        default_player_character_id: playerCharacterId,
        default_player_character: playerCharacter || null,
      },
    }));

    setDefaultPlayerCharacterPickerOpen(false);
  }

  function handleClearDefaultPlayerCharacter() {
    updateField("defaultPlayerCharacterId", null);

    setAccount((current) => ({
      ...(current || {}),
      profile: {
        ...(current?.profile || {}),
        default_player_character_id: null,
        default_player_character: null,
      },
    }));
  }

  const user = account?.user || {};
  const profile = account?.profile || {};
  const profileDisplayName =
    profile.display_name || profile.username || user.email || "Crestfall Creator";
  const defaultPlayerCharacter = profile.default_player_character || null;

  const fields = useMemo(
    () => ({
      username: toField(form.username, USERNAME_MAX, {
        placeholder: "Crestfall",
      }),
      displayName: toField(form.displayName, DISPLAY_NAME_MAX, {
        placeholder: "N D",
      }),
      contactEmail: toField(form.contactEmail, CONTACT_EMAIL_MAX, {
        placeholder: user.email || "creator@example.com",
      }),
      tagline: toField(form.tagline, TAGLINE_MAX, {
        placeholder: "Use this for a profile tagline.",
      }),
      description: toField(form.description, DESCRIPTION_MAX, {
        placeholder: "Enter a profile description.",
      }),
      announcement: toField(form.announcement, ANNOUNCEMENT_MAX, {
        placeholder: "Use for announcements to visitors and followers.",
      }),
      contentPreference: {
        value: form.contentRatingPreference,
        options: CONTENT_PREFERENCE_OPTIONS,
      },
    }),
    [form, user.email]
  );

  const publicProfileHref = profile.username
    ? `/studio/profile/${profile.username}`
    : null;

  const contentPreferenceNoticeLabel =
    contentPreferenceNotice === "EXPLICIT"
      ? "Explicit / Web Only"
      : contentPreferenceNotice === "MATURE"
        ? "Mature"
        : contentPreferenceNotice || "";

  return {
    isLoading,
    isSaving,
    loadErrorMessage,
    saveErrorMessage,
    statusMessage,
    profileInitial: profileDisplayName.slice(0, 1).toUpperCase(),
    profileUsername: profile.username || "unset",
    userEmail: user.email || "",
    hasPublicProfile: Boolean(publicProfileHref),
    publicProfileHref,
    fields,
    defaultPlayerCharacter,
    hasDefaultPlayerCharacter: Boolean(defaultPlayerCharacter),
    hasDefaultPlayerCharacterSelection: Boolean(form.defaultPlayerCharacterId),
    isContentPreferenceNoticeOpen: Boolean(contentPreferenceNotice),
    contentPreferenceNoticeLabel,
    profileMediaProfile: profile,
    isDefaultPlayerCharacterPickerOpen,
    defaultPlayerCharacterPickerSelectedId: form.defaultPlayerCharacterId || "",
    onSubmit: handleSubmit,
    onUsernameChange: (value) => updateField("username", value),
    onDisplayNameChange: (value) => updateField("displayName", value),
    onContactEmailChange: (value) => updateField("contactEmail", value),
    onTaglineChange: (value) => updateField("tagline", value),
    onDescriptionChange: (value) => updateField("description", value),
    onAnnouncementChange: (value) => updateField("announcement", value),
    onContentPreferenceChange: handleContentPreferenceChange,
    onCloseContentPreferenceNotice: () => setContentPreferenceNotice(null),
    onOpenDefaultPlayerCharacterPicker: () =>
      setDefaultPlayerCharacterPickerOpen(true),
    onCloseDefaultPlayerCharacterPicker: () =>
      setDefaultPlayerCharacterPickerOpen(false),
    onSelectDefaultPlayerCharacter: handleSelectDefaultPlayerCharacter,
    onClearDefaultPlayerCharacter: handleClearDefaultPlayerCharacter,
  };
}
