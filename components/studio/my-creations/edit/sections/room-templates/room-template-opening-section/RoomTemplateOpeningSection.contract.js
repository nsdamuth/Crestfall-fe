export const ROOM_TEMPLATE_OPENING_SECTION_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the portable Story opening-context View.
 *
 * The View must not inspect a creation form, know Story JSON storage fields,
 * choose the fallback opening message, derive speakers/image sources, fetch
 * creation libraries, generate message IDs, or decide how edits are persisted.
 * It renders display-ready opening content and emits semantic edit intent only.
 *
 * @typedef {Object} RoomTemplateOpeningSpeakerOption
 * @property {*} value
 * @property {*} label
 *
 * @typedef {Object} RoomTemplateOpeningMessageViewModel
 * @property {*} id
 * @property {string} messageLabel
 * @property {*} speakerValue
 * @property {*} bodyValue
 * @property {boolean} canRemove
 *
 * @typedef {Object} RoomTemplateOpeningImageSource
 * @property {string} id
 * @property {"CHARACTER"|"LOCATION"} type
 * @property {string} title
 *
 * @typedef {Object} RoomTemplateOpeningImage
 * @property {*} id
 * @property {string} displayUrl
 * @property {string|null} [thumbnailUrl]
 * @property {number|null} [width]
 * @property {number|null} [height]
 * @property {string} [sourceTitle]
 *
 * @typedef {Object} RoomTemplateOpeningSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} publicOpeningContextLabel
 * @property {*} publicOpeningContextValue
 * @property {string} publicOpeningContextPlaceholder
 * @property {string} openingImageLabel
 * @property {string} openingImageDescription
 * @property {string} chooseOpeningImageLabel
 * @property {string} replaceOpeningImageLabel
 * @property {string} removeOpeningImageLabel
 * @property {string} closePickerLabel
 * @property {RoomTemplateOpeningImageSource[]} openingImageSources
 * @property {RoomTemplateOpeningImage|null} selectedOpeningImage
 * @property {boolean} pickerOpen
 * @property {string} activeSourceId
 * @property {RoomTemplateOpeningImage[]} pickerImages
 * @property {boolean} pickerLoading
 * @property {string} pickerError
 * @property {string} speakerLabel
 * @property {RoomTemplateOpeningSpeakerOption[]} speakerOptions
 * @property {string} messageLabel
 * @property {string} messagePlaceholder
 * @property {RoomTemplateOpeningMessageViewModel[]} openingMessages
 * @property {string} removeMessageLabel
 * @property {string} addMessageLabel
 * @property {((value: string) => void)|null} onChangePublicOpeningContext
 * @property {(() => void)|null} onOpenOpeningImagePicker
 * @property {(() => void)|null} onCloseOpeningImagePicker
 * @property {((sourceId: string) => void)|null} onSelectOpeningImageSource
 * @property {((image: RoomTemplateOpeningImage) => void)|null} onSelectOpeningImage
 * @property {(() => void)|null} onRemoveOpeningImage
 * @property {((id: *, value: *) => void)|null} onChangeOpeningMessageSpeaker
 * @property {((id: *, value: string) => void)|null} onChangeOpeningMessageBody
 * @property {(() => void)|null} onAddOpeningMessage
 * @property {((id: *) => void)|null} onRemoveOpeningMessage
 */

export {};
