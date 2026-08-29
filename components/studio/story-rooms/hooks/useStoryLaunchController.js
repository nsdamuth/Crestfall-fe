"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getStoryImageStyleLaunchStartConfig,
  getStoryOpeningLocationStartConfig,
  getStoryPlayerCharacterDefaultSelection,
  getStoryPlayerCharacterStartConfig,
  prepareStoryCreationForLaunch,
  startStoryFromCreation,
} from "@/lib/client/studio/story-rooms/storyRoomClient";
import { resolveStoryPostCreateNavigationHref } from "@/lib/shared/story-rooms/storyPostCreateNavigation";

export function useStoryLaunchController({
  prepareLaunch = prepareStoryCreationForLaunch,
  startStory = startStoryFromCreation,
  navigate = null,
  resolvePostCreateHref = resolveStoryPostCreateNavigationHref,
} = {}) {
  const router = useRouter();
  const [pendingCreation, setPendingCreation] = useState(null);
  const [preparedCreation, setPreparedCreation] = useState(null);
  const [launchingCreationId, setLaunchingCreationId] = useState(null);
  const [launchError, setLaunchError] = useState("");
  const [openingLocationId, setOpeningLocationId] = useState("");
  const [playerCharacterSelection, setPlayerCharacterSelection] = useState("");
  const [playerCharacterId, setPlayerCharacterId] = useState("");
  const [imageStylePreference, setImageStylePreference] = useState("");

  const push = useCallback(
    (href) => {
      if (!href) return;
      if (typeof navigate === "function") navigate(href);
      else router.push(href);
    },
    [navigate, router]
  );

  const resetPicker = useCallback(() => {
    setPendingCreation(null);
    setPreparedCreation(null);
    setOpeningLocationId("");
    setPlayerCharacterSelection("");
    setPlayerCharacterId("");
    setImageStylePreference("");
  }, []);

  const commitLaunch = useCallback(
    async ({
      creation,
      openingLocation = "",
      playerSelection = "",
      selectedPlayerCharacterId = "",
      selectedImageStyle = "",
    }) => {
      if (!creation?.id) return;

      setLaunchingCreationId(creation.id);
      setLaunchError("");

      try {
        const payload = await startStory(creation, {
          openingLocationId: openingLocation || null,
          playerCharacterSelection: playerSelection || null,
          playerCharacterId: selectedPlayerCharacterId || null,
          imageStylePreference: selectedImageStyle || null,
        });
        const room = payload?.room || null;
        const roomId = room?.id;

        if (!roomId) {
          throw new Error("Story was created without a room id.");
        }

        resetPicker();
        push(resolvePostCreateHref({ room, roomId }));
      } catch (error) {
        setLaunchError(error?.message || "Story could not be started.");
      } finally {
        setLaunchingCreationId(null);
      }
    },
    [push, resetPicker, resolvePostCreateHref, startStory]
  );

  const launch = useCallback(
    async (creation) => {
      if (!creation?.id) return;

      setLaunchError("");
      setLaunchingCreationId(creation.id);

      try {
        const prepared = await prepareLaunch(creation);
        const openingLocation = getStoryOpeningLocationStartConfig(prepared);
        const playerCharacter = getStoryPlayerCharacterStartConfig(prepared);
        const imageStyle = getStoryImageStyleLaunchStartConfig(prepared);
        const defaultPlayerSelection =
          getStoryPlayerCharacterDefaultSelection(playerCharacter);

        setPendingCreation(creation);
        setPreparedCreation(prepared);
        setOpeningLocationId("");
        setPlayerCharacterSelection(defaultPlayerSelection.selection);
        setPlayerCharacterId(defaultPlayerSelection.playerCharacterId || "");
        setImageStylePreference(imageStyle.defaultStyle || "");

        if (
          openingLocation.selectionRequired ||
          playerCharacter.selectionRequired ||
          imageStyle.selectionRequired
        ) {
          setLaunchingCreationId(null);
          return;
        }

        await commitLaunch({ creation: prepared });
      } catch (error) {
        setLaunchError(error?.message || "Story could not be prepared.");
        setLaunchingCreationId(null);
      }
    },
    [commitLaunch, prepareLaunch]
  );

  const openingLocationConfig = useMemo(
    () =>
      preparedCreation
        ? getStoryOpeningLocationStartConfig(preparedCreation)
        : { selectionRequired: false, allowedLocationIds: [], options: [] },
    [preparedCreation]
  );
  const playerCharacterConfig = useMemo(
    () =>
      preparedCreation
        ? getStoryPlayerCharacterStartConfig(preparedCreation)
        : { selectionRequired: false, allowNone: false, options: [], defaultPlayerCharacterId: "" },
    [preparedCreation]
  );
  const imageStyleConfig = useMemo(
    () =>
      preparedCreation
        ? getStoryImageStyleLaunchStartConfig(preparedCreation)
        : { selectionRequired: false, allowedStyles: [], defaultStyle: "" },
    [preparedCreation]
  );

  const effectiveOpeningLocationId = openingLocationConfig.allowedLocationIds.includes(
    openingLocationId
  )
    ? openingLocationId
    : "";
  const effectivePlayerCharacterId =
    playerCharacterSelection === "DEFAULT"
      ? playerCharacterConfig.defaultPlayerCharacterId || ""
      : playerCharacterSelection === "SELECTED" &&
          playerCharacterConfig.options.some((option) => option?.id === playerCharacterId)
        ? playerCharacterId
        : "";
  const effectiveImageStylePreference = imageStyleConfig.allowedStyles.includes(
    imageStylePreference
  )
    ? imageStylePreference
    : imageStyleConfig.defaultStyle || "";

  const picker =
    pendingCreation &&
    preparedCreation &&
    (openingLocationConfig.selectionRequired ||
      playerCharacterConfig.selectionRequired ||
      imageStyleConfig.selectionRequired)
      ? {
          open: true,
          creationTitle: pendingCreation.title || preparedCreation.title || "Story",
          locationSelectionRequired: openingLocationConfig.selectionRequired,
          locationOptions: openingLocationConfig.options,
          selectedLocationId: effectiveOpeningLocationId,
          playerCharacter: {
            ...playerCharacterConfig,
            selection: playerCharacterSelection,
            selectedPlayerCharacterId: effectivePlayerCharacterId,
          },
          imageStyle: {
            ...imageStyleConfig,
            selectedStyle: effectiveImageStylePreference,
          },
          pending: launchingCreationId === pendingCreation.id,
          onSelectLocation: setOpeningLocationId,
          onSelectPlayerCharacter: ({ selection, playerCharacterId: nextId }) => {
            setPlayerCharacterSelection(selection || "");
            setPlayerCharacterId(nextId || "");
          },
          onSelectImageStyle: (style) =>
            setImageStylePreference(String(style || "").trim().toUpperCase()),
          onCancel: resetPicker,
          onConfirm: () =>
            commitLaunch({
              creation: preparedCreation,
              openingLocation: effectiveOpeningLocationId,
              playerSelection: playerCharacterSelection,
              selectedPlayerCharacterId: effectivePlayerCharacterId,
              selectedImageStyle: effectiveImageStylePreference,
            }),
        }
      : null;

  return {
    launch,
    launchError,
    setLaunchError,
    launchingCreationId,
    picker,
    resetPicker,
  };
}
