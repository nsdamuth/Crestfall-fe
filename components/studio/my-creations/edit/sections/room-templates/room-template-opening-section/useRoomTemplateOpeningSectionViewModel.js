"use client";

import { useState } from "react";

import { fetchCreationImageLibrary } from "@/lib/client/studio/creations/creationClient";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Story Editor",
  sectionTitle: "Opening Context and Messages",
  sectionDescription:
    "Opening messages define how the room begins. These can come from the narrator, a selected character, or a player-facing prompt.",
  publicOpeningContextLabel: "Public Opening Context",
  publicOpeningContextPlaceholder:
    "Visible setup shown at the start of the room.",
  openingImageLabel: "Opening Image",
  openingImageDescription:
    "Choose one eligible image from an attached character or location. New Story rooms display it once above the opening messages.",
  chooseOpeningImageLabel: "Choose Image",
  replaceOpeningImageLabel: "Replace Image",
  removeOpeningImageLabel: "Remove",
  closePickerLabel: "Close",
  speakerLabel: "Speaker",
  messageLabel: "Message",
  messagePlaceholder: "Opening message or prompt.",
  removeMessageLabel: "Remove",
  addMessageLabel: "Add Opening Message",
});

export const DEFAULT_ROOM_TEMPLATE_OPENING_MESSAGE = Object.freeze({
  id: "message-1",
  speaker: "Narrator",
  body: "",
});

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getRoomTemplateOpeningMessages(value) {
  if (Array.isArray(value) && value.length) return value;
  return [{ ...DEFAULT_ROOM_TEMPLATE_OPENING_MESSAGE }];
}

export function getRoomTemplateOpeningSpeakerOptions(data = {}) {
  const selectedCharacters = normalizeArray(data.selected_characters);
  return [
    { value: "Narrator", label: "Narrator" },
    ...selectedCharacters.map((character) => ({
      value: character.title,
      label: character.title,
    })),
    { value: "Player Prompt", label: "Player Prompt" },
  ];
}

export function getRoomTemplateOpeningImageSources(data = {}) {
  const characters = normalizeArray(data.selected_characters)
    .filter((item) => item?.id)
    .map((item) => ({
      id: item.id,
      type: "CHARACTER",
      title: item.title || "Character",
    }));
  const location = data.selected_location?.id
    ? [{
        id: data.selected_location.id,
        type: "LOCATION",
        title: data.selected_location.title || "Location",
      }]
    : [];
  return [...characters, ...location];
}

function toDisplayOpeningMessage(message, index) {
  return {
    id: message.id,
    messageLabel: `Opening Message ${index + 1}`,
    speakerValue: message.speaker,
    bodyValue: message.body,
    canRemove: index !== 0,
  };
}

export function useRoomTemplateOpeningSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};
  const openingMessages = getRoomTemplateOpeningMessages(data.opening_messages);
  const openingImageSources = getRoomTemplateOpeningImageSources(data);
  const selectedOpeningImage = data.opening_hero_image || null;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState("");
  const [pickerImages, setPickerImages] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState("");

  function updateOpeningMessages(nextMessages) {
    updateDataField?.("opening_messages", nextMessages);
  }

  function updateOpeningMessage(id, field, value) {
    updateOpeningMessages(
      openingMessages.map((message) =>
        message.id === id ? { ...message, [field]: value } : message
      )
    );
  }

  async function loadSourceImages(sourceId) {
    const source = openingImageSources.find((item) => item.id === sourceId);
    if (!source) return;
    setActiveSourceId(sourceId);
    setPickerLoading(true);
    setPickerError("");
    setPickerImages([]);
    try {
      const payload = await fetchCreationImageLibrary(sourceId);
      const images = normalizeArray(payload?.data?.imageLibrary?.images)
        .filter((image) => image?.canUseAsFeatured && image?.displayUrl)
        .map((image) => ({ ...image, source }));
      setPickerImages(images);
    } catch (error) {
      setPickerError(error?.message || "Image library could not be loaded.");
    } finally {
      setPickerLoading(false);
    }
  }

  function openPicker() {
    setPickerOpen(true);
    const initialId = selectedOpeningImage?.sourceCreationId || openingImageSources[0]?.id || "";
    if (initialId) void loadSourceImages(initialId);
  }

  function selectOpeningImage(image) {
    const source = image?.source;
    if (!source) return;
    updateDataField?.("opening_hero_image", {
      sourceEntityType: source.type,
      sourceCreationId: source.id,
      sourceTitle: source.title,
      libraryEntryId: image.id,
      imageOutputId: image.imageOutputId,
      displayUrl: image.displayUrl,
      thumbnailUrl: image.thumbnailUrl || null,
      width: image.width || null,
      height: image.height || null,
      contentRating: image.contentRating || "SFW",
    });
    setPickerOpen(false);
  }

  return {
    ...DEFAULT_COPY,
    publicOpeningContextValue: data.public_opening_context || "",
    openingImageSources,
    selectedOpeningImage,
    pickerOpen,
    activeSourceId,
    pickerImages,
    pickerLoading,
    pickerError,
    speakerOptions: getRoomTemplateOpeningSpeakerOptions(data),
    openingMessages: openingMessages.map(toDisplayOpeningMessage),
    onChangePublicOpeningContext: (value) =>
      updateDataField?.("public_opening_context", value),
    onOpenOpeningImagePicker: openPicker,
    onCloseOpeningImagePicker: () => setPickerOpen(false),
    onSelectOpeningImageSource: (sourceId) => void loadSourceImages(sourceId),
    onSelectOpeningImage: selectOpeningImage,
    onRemoveOpeningImage: () => updateDataField?.("opening_hero_image", null),
    onChangeOpeningMessageSpeaker: (id, value) =>
      updateOpeningMessage(id, "speaker", value),
    onChangeOpeningMessageBody: (id, value) =>
      updateOpeningMessage(id, "body", value),
    onAddOpeningMessage: () =>
      updateOpeningMessages([
        ...openingMessages,
        {
          id: `message-${openingMessages.length + 1}`,
          speaker: "Narrator",
          body: "",
        },
      ]),
    onRemoveOpeningMessage: (id) => {
      if (openingMessages.length === 1) return;
      updateOpeningMessages(openingMessages.filter((message) => message.id !== id));
    },
  };
}
