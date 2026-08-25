"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchCurrentStudioAccount,
  fetchStudioAccountMetrics,
  updateCurrentStudioAccount,
} from "@/lib/client/studio/profile/studioAccountClient";
import {
  ANNOUNCEMENT_MAX,
  DESCRIPTION_MAX,
  DISPLAY_NAME_MAX,
  TAGLINE_MAX,
  USERNAME_MAX,
} from "@/lib/shared/profile/constants";
import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";

const CONTACT_EMAIL_MAX = 254;

const EMPTY_FORM = Object.freeze({
  username: "",
  displayName: "",
  contactEmail: "",
  tagline: "",
  description: "",
  announcement: "",
  contentRatingPreference: "SFW",
  defaultPlayerCharacterId: null,
});

const EMPTY_METRICS = Object.freeze({
  characters: 0,
  interactions: 0,
  messages: 0,
  likes: 0,
  images: 0,
});

const FORM_FIELDS = Object.freeze([
  "username",
  "displayName",
  "contactEmail",
  "tagline",
  "description",
  "announcement",
  "contentRatingPreference",
  "defaultPlayerCharacterId",
]);

function formsMatch(left = EMPTY_FORM, right = EMPTY_FORM) {
  return FORM_FIELDS.every((field) => left?.[field] === right?.[field]);
}

function accountToForm(profile = {}, user = {}) {
  return {
    username: profile.username || "",
    displayName: profile.display_name || "",
    contactEmail: profile.contact_email || user.email || "",
    tagline: profile.tagline || "",
    description: profile.description || "",
    announcement: profile.announcement || "",
    contentRatingPreference: profile.content_rating_preference || "SFW",
    defaultPlayerCharacterId: profile.default_player_character_id || null,
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

function normalizeMetric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function buildMetricItems(metrics = {}) {
  return [
    {
      id: "characters",
      label: "Characters",
      value: normalizeMetric(metrics.characters),
    },
    {
      id: "interactions",
      label: "Interactions",
      value: normalizeMetric(metrics.interactions ?? metrics.messages),
    },
    {
      id: "likes",
      label: "Likes",
      value: normalizeMetric(metrics.likes),
    },
    {
      id: "images",
      label: "Images",
      value: normalizeMetric(metrics.images),
    },
  ];
}

function getContentRatingTier(backendValue) {
  return (
    CONTENT_RATING_TIERS.find(
      (tier) => tier.backendValue === backendValue
    ) || CONTENT_RATING_TIERS[0]
  );
}

function normalizeDefaultPlayerCharacter(playerCharacter) {
  if (!playerCharacter || typeof playerCharacter !== "object") return null;

  return {
    id: playerCharacter.id || "",
    title:
      playerCharacter.title ||
      playerCharacter.data?.name ||
      "Untitled Player Character",
    description:
      playerCharacter.description ||
      playerCharacter.data?.personality_summary ||
      "No description.",
    imageUrl:
      playerCharacter.imageUrl ||
      playerCharacter.image_url ||
      playerCharacter.featuredMedia?.[0]?.imageUrl ||
      playerCharacter.featured_media?.[0]?.image_url ||
      null,
  };
}

export function useAccountV2LiveViewModel() {
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [draftDefaultPlayerCharacter, setDraftDefaultPlayerCharacter] =
    useState(null);
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [isLoading, setIsLoading] = useState(true);
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [metricsErrorMessage, setMetricsErrorMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [ageGateLabel, setAgeGateLabel] = useState("");
  const [isBuyCoinsOpen, setIsBuyCoinsOpen] = useState(false);
  const [isDefaultPlayerCharacterPickerOpen, setDefaultPlayerCharacterPickerOpen] =
    useState(false);

  const loadMetrics = useCallback(async () => {
    setIsMetricsLoading(true);
    setMetricsErrorMessage("");

    try {
      const nextMetrics = await fetchStudioAccountMetrics();
      setMetrics({
        ...EMPTY_METRICS,
        ...(nextMetrics || {}),
      });
    } catch (error) {
      setMetrics(EMPTY_METRICS);
      setMetricsErrorMessage(
        error?.message || "Account metrics could not be loaded."
      );
    } finally {
      setIsMetricsLoading(false);
    }
  }, []);

  const loadAccount = useCallback(async () => {
    setIsLoading(true);
    setLoadErrorMessage("");
    setSaveErrorMessage("");
    setStatusMessage("");

    try {
      const nextAccount = await fetchCurrentStudioAccount();
      const nextForm = accountToForm(nextAccount.profile, nextAccount.user);

      setAccount(nextAccount);
      setForm(nextForm);
      setSavedForm(nextForm);
      setDraftDefaultPlayerCharacter(
        nextAccount.profile?.default_player_character || null
      );
      void loadMetrics();
    } catch (error) {
      setAccount(null);
      setLoadErrorMessage(
        error?.message || "Studio account could not be loaded."
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadMetrics]);

  useEffect(() => {
    loadAccount().catch((error) => {
      setLoadErrorMessage(
        error?.message || "Studio account could not be loaded."
      );
      setIsLoading(false);
    });
  }, [loadAccount]);

  const hasUnsavedChanges = useMemo(
    () => !formsMatch(form, savedForm),
    [form, savedForm]
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return undefined;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  function updateField(field, value) {
    setSaveErrorMessage("");
    setStatusMessage("");
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleContentRatingChange(tierValue) {
    const tier = CONTENT_RATING_TIERS.find(
      (entry) => entry.tier === tierValue
    );

    if (!tier) return;

    if (
      tier.backendValue === "SFW" ||
      tier.backendValue === form.contentRatingPreference
    ) {
      updateField("contentRatingPreference", tier.backendValue);
      return;
    }

    setAgeGateLabel(tier.label);
  }

  async function handleSubmit(event) {
    event?.preventDefault?.();

    if (isSaving || !hasUnsavedChanges) return;

    setIsSaving(true);
    setSaveErrorMessage("");
    setStatusMessage("");

    try {
      const nextAccount = await updateCurrentStudioAccount(
        formToUpdatePayload(form)
      );

      const nextForm = accountToForm(nextAccount.profile, nextAccount.user);

      setAccount(nextAccount);
      setForm(nextForm);
      setSavedForm(nextForm);
      setDraftDefaultPlayerCharacter(
        nextAccount.profile?.default_player_character || null
      );
      setStatusMessage("Profile updated.");
    } catch (error) {
      setSaveErrorMessage(error?.message || "Profile could not be updated.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleSelectDefaultPlayerCharacter(playerCharacter) {
    const playerCharacterId = playerCharacter?.id || null;

    updateField("defaultPlayerCharacterId", playerCharacterId);
    setDraftDefaultPlayerCharacter(playerCharacter || null);
    setDefaultPlayerCharacterPickerOpen(false);
  }

  function handleClearDefaultPlayerCharacter() {
    updateField("defaultPlayerCharacterId", null);
    setDraftDefaultPlayerCharacter(null);
  }

  const user = account?.user || {};
  const profile = account?.profile || {};
  const activeRatingTier = getContentRatingTier(form.contentRatingPreference);
  const defaultPlayerCharacter = normalizeDefaultPlayerCharacter(
    draftDefaultPlayerCharacter
  );

  const fields = useMemo(
    () => ({
      contactEmail: {
        value: form.contactEmail,
        maxLength: CONTACT_EMAIL_MAX,
        count: `${form.contactEmail.length} / ${CONTACT_EMAIL_MAX}`,
      },
      username: {
        value: form.username,
        maxLength: USERNAME_MAX,
        count: `${form.username.length} / ${USERNAME_MAX}`,
      },
      displayName: {
        value: form.displayName,
        maxLength: DISPLAY_NAME_MAX,
        count: `${form.displayName.length} / ${DISPLAY_NAME_MAX}`,
      },
      tagline: {
        value: form.tagline,
        maxLength: TAGLINE_MAX,
        count: `${form.tagline.length} / ${TAGLINE_MAX}`,
      },
      description: {
        value: form.description,
        maxLength: DESCRIPTION_MAX,
        count: `${form.description.length} / ${DESCRIPTION_MAX}`,
      },
      announcement: {
        value: form.announcement,
        maxLength: ANNOUNCEMENT_MAX,
        count: `${form.announcement.length} / ${ANNOUNCEMENT_MAX}`,
      },
    }),
    [form]
  );

  return {
    isLoading,
    isMetricsLoading,
    isSaving,
    hasUnsavedChanges,
    loadErrorMessage,
    metricsErrorMessage,
    saveErrorMessage,
    statusMessage,
    userEmail: user.email || "",
    username: form.username,
    displayName: form.displayName,
    hasPublicProfile: Boolean(profile.username),
    publicProfileHref: profile.username
      ? `/studio/profile/${profile.username}`
      : null,
    coinBalance: Number(account?.coinBalance || 0),
    metricItems: buildMetricItems(metrics),
    fields,
    contentRating: {
      selectedTier: activeRatingTier.tier,
      selectedLabel: activeRatingTier.label,
      tiers: CONTENT_RATING_TIERS,
    },
    defaultPlayerCharacter,
    hasDefaultPlayerCharacterSelection: Boolean(
      form.defaultPlayerCharacterId
    ),
    isAgeGateOpen: Boolean(ageGateLabel),
    ageGateLabel,
    isBuyCoinsOpen,
    isDefaultPlayerCharacterPickerOpen,
    defaultPlayerCharacterPickerSelectedId:
      form.defaultPlayerCharacterId || "",
    onRetryLoad: loadAccount,
    onRetryMetrics: loadMetrics,
    onSubmit: handleSubmit,
    onContactEmailChange: (value) => updateField("contactEmail", value),
    onUsernameChange: (value) => updateField("username", value),
    onDisplayNameChange: (value) => updateField("displayName", value),
    onTaglineChange: (value) => updateField("tagline", value),
    onDescriptionChange: (value) => updateField("description", value),
    onAnnouncementChange: (value) => updateField("announcement", value),
    onContentRatingChange: handleContentRatingChange,
    onCloseAgeGate: () => setAgeGateLabel(""),
    onOpenBuyCoins: () => setIsBuyCoinsOpen(true),
    onCloseBuyCoins: () => setIsBuyCoinsOpen(false),
    onOpenDefaultPlayerCharacterPicker: () =>
      setDefaultPlayerCharacterPickerOpen(true),
    onCloseDefaultPlayerCharacterPicker: () =>
      setDefaultPlayerCharacterPickerOpen(false),
    onSelectDefaultPlayerCharacter: handleSelectDefaultPlayerCharacter,
    onClearDefaultPlayerCharacter: handleClearDefaultPlayerCharacter,
  };
}
