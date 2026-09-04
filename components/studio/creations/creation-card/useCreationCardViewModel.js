import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCreationStatsRowViewModel } from "@/components/studio/creations/creation-stats-row/useCreationStatsRowViewModel";
import { useCreationStatusBadgesViewModel } from "@/components/studio/creations/creation-status-badges/useCreationStatusBadgesViewModel";
import buildModalCreationFromPreviewGraph from "@/components/studio/creations/buildModalCreationFromPreviewGraph";
import { fetchCreationPreview } from "@/lib/client/studio/creations/creationClient";
import { setDefaultPlayerCharacter } from "@/lib/client/studio/profile/defaultPlayerCharacterClient";
import { startStoryFromCreation } from "@/lib/client/studio/story-rooms/storyRoomClient";
import { getCreationCreator } from "@/lib/shared/creations/creationAttribution";
import { getFirstCreationMediaUrl } from "@/lib/shared/creations/creationMedia";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";
import { buildStoryChatHref } from "@/lib/shared/story-rooms/storyRoomRouteAuthority";

export function useCreationCardViewModel({
  creation = {},
  context = "owner",
  mobileCompact = false,
  priority = false,
  liked = false,
  bookmarked = false,
  onToggleLike,
  onToggleBookmark,
  onStartStory,
  storyLaunchError = "",
} = {}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCreation, setPreviewCreation] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [chatError, setChatError] = useState("");
  const [settingDefaultPc, setSettingDefaultPc] = useState(false);
  const [defaultPcStatus, setDefaultPcStatus] = useState("");
  const [defaultPcError, setDefaultPcError] = useState("");
  const router = useRouter();

  const creationId = creation?.id || "";
  const encodedId = creationId ? encodeURIComponent(creationId) : "";
  const title = creation?.title || "Untitled Creation";
  const creator = getCreationCreator(creation);
  const supportsChat = isChatCapableCreationType(creation?.type);
  const isPlayerCharacter =
    String(creation?.type || "").toUpperCase() === "PLAYER_CHARACTER";
  const canSetDefaultPc = Boolean(
    context === "owner" && isPlayerCharacter && creationId
  );

  const editHref =
    creation?.editHref ||
    (context === "owner" && encodedId
      ? `/studio/my-creations/${encodedId}/edit`
      : null);
  const chatHref =
    creation?.chatHref ||
    `/studio/play${encodedId ? `?creation=${encodedId}` : ""}`;
  const catalogueHref =
    context === "owner" && encodedId
      ? `/studio/my-creations/${encodedId}/image-library`
      : creation?.catalogueHref ||
        creation?.imageLibraryHref ||
        (encodedId
          ? `/studio/creations/${encodedId}`
          : "/studio/community");
  const imageHref =
    creation?.imageHref ||
    `/studio/image-studio${encodedId ? `?creation=${encodedId}` : ""}`;

  const fallbackModalCreation = {
    ...creation,
    liked,
    bookmarked,
    editHref,
    chatHref,
    imageHref,
    catalogueHref,
    imageLibraryHref: catalogueHref,
  };

  async function openPreview() {
    if (!encodedId) {
      setPreviewCreation(fallbackModalCreation);
      setIsPreviewOpen(true);
      return;
    }

    if (loadingPreview) {
      return;
    }

    setPreviewError("");
    setLoadingPreview(true);

    try {
      const previewGraph = await fetchCreationPreview(creationId);

      setPreviewCreation(
        buildModalCreationFromPreviewGraph({
          previewGraph,
          fallbackCreation: creation,
          editHref,
          chatHref,
          imageHref,
          catalogueHref,
        })
      );
      setIsPreviewOpen(true);
    } catch (error) {
      if (context === "community") {
        setPreviewError(
          error?.message || "Creation preview could not be loaded."
        );
        return;
      }

      // Owner/My Creations can include private or draft creations that the
      // public preview endpoint cannot see. Preserve the existing fallback.
      setPreviewCreation(fallbackModalCreation);
      setIsPreviewOpen(true);
    } finally {
      setLoadingPreview(false);
    }
  }

  async function startChat() {
    if (!supportsChat || startingChat) {
      return;
    }

    setChatError("");

    if (typeof onStartStory === "function") {
      await onStartStory(creation);
      return;
    }

    setStartingChat(true);

    try {
      const data = await startStoryFromCreation(creation);
      const roomId = data?.room?.id;

      if (!roomId) {
        throw new Error("Story was created without a room id.");
      }

      router.push(buildStoryChatHref(roomId));
    } catch (error) {
      setChatError(error?.message || "Story could not be started.");
      setStartingChat(false);
    }
  }

  async function setAsDefaultPlayerCharacter() {
    if (!creationId || settingDefaultPc) {
      return;
    }

    setDefaultPcStatus("");
    setDefaultPcError("");
    setSettingDefaultPc(true);

    try {
      await setDefaultPlayerCharacter(creationId);
      setDefaultPcStatus("Default Player Character set.");
    } catch (error) {
      setDefaultPcError(
        error?.message || "Default Player Character could not be saved."
      );
    } finally {
      setSettingDefaultPc(false);
    }
  }

  function toggleLike() {
    onToggleLike?.(creation);
  }

  function toggleBookmark() {
    onToggleBookmark?.(creation);
  }

  const statusBadges = useCreationStatusBadgesViewModel({
    creation,
    compact: true,
  });
  const statsRow = useCreationStatsRowViewModel({
    stats: creation?.stats,
    compact: true,
  });

  return {
    cardViewProps: {
      title,
      fallbackInitial: title.slice(0, 1).toUpperCase(),
      imageUrl:
        getFirstCreationMediaUrl(
          creation?.featuredMedia || creation?.featured_media || [],
          {
            variant: "card",
            fallback:
              creation?.cardUrl ||
              creation?.card_url ||
              creation?.imageUrl ||
              null,
          }
        ) || null,
      priority: Boolean(priority),
      mobileCompact: Boolean(mobileCompact),
      isPreviewLoading: loadingPreview,
      statusBadges,
      statsRow,
      showLikeAction: typeof onToggleLike === "function",
      liked: Boolean(liked),
      onToggleLike: toggleLike,
      showBookmarkAction: typeof onToggleBookmark === "function",
      bookmarked: Boolean(bookmarked),
      onToggleBookmark: toggleBookmark,
      showDefaultPlayerCharacterAction: canSetDefaultPc,
      isSettingDefaultPlayerCharacter: settingDefaultPc,
      onSetDefaultPlayerCharacter: setAsDefaultPlayerCharacter,
      showStartChatAction: supportsChat,
      isStartingChat: startingChat,
      onStartChat: startChat,
      imageHref,
      showEditAction: Boolean(context === "owner" && editHref),
      editHref,
      showCreatorAttribution: context === "community",
      creatorHandle: creator?.handle || "",
      creatorHref: creator?.href || null,
      subtitle: creation?.subtitle || "",
      description: creation?.description || "",
      errorMessage: defaultPcError || storyLaunchError || chatError || previewError,
      statusMessage: defaultPcStatus,
      onOpenPreview: openPreview,
    },
    previewModalProps: isPreviewOpen
      ? {
          creation: previewCreation || fallbackModalCreation,
          context,
          liked,
          bookmarked,
          onToggleLike,
          onToggleBookmark,
          onClose: () => setIsPreviewOpen(false),
        }
      : null,
  };
}
