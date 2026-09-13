"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

import KitImageViewer from "@/components/kit/KitImageViewer";
import StoryRoomCastPanel from "@/components/studio/story-rooms/StoryRoomCastPanel";
import StoryRoomRuntimeMechanicsPanel from "@/components/studio/story-rooms/StoryRoomRuntimeMechanicsPanel";
import StoryRoomStatePanel from "@/components/studio/story-rooms/StoryRoomStatePanel";

import StoryRoomDetailsRailView, {
  ChatColorPreferences,
} from "./story-room-details-rail/StoryRoomDetailsRail.view";
import { useStoryRoomDetailsRailViewModel } from "./story-room-details-rail/useStoryRoomDetailsRailViewModel";

// Binding Shell for the right rail (fe/chat-studio item 6): composes the
// application-owned panels into the rail's slots. Export and Share are
// the state panel's live actions; World state is its sections; Cast is
// the cast panel (roster and Manage Cast); Mechanics is the runtime
// mechanics panel under its existing gate; Preferences is the chat
// color list the shell view model owns.
export default function StoryRoomDetailsRail({
  room,
  cast,
  messages,
  castPanelProps = {},
  statePanelProps = {},
  runtimeMechanicsPanelProps = null,
  chatColorProps = null,
  deleteError = "",
  onRequestDeleteRoom = null,
  isDeletingRoom = false,
  autoOpenViewer = false,
}) {
  const viewProps = useStoryRoomDetailsRailViewModel({
    room,
    cast,
    messages,
    chatColorProps,
    deleteError,
    autoOpenViewer,
  });

  // The gallery's viewer (review round 5 item 1): the community image
  // viewer, the same one a creator card opens for a public image
  // (bottom bar Edit, Remix, Share; Remix and Edit ship "soon" until
  // CR-065). Details opens the creation's page in a new tab so the chat
  // stays open; Share copies that page's link. Save and Report have no
  // story-side handler and the viewer contract has no way to hide them,
  // logged, not faked.
  const [shareMessage, setShareMessage] = useState("");
  const viewerItem = viewProps.gallery?.viewerItem || null;
  const catalogueHref = viewProps.gallery?.catalogueHref || "";
  const closeViewer = viewProps.gallery?.onCloseViewer;

  const onCloseViewer = useCallback(() => {
    setShareMessage("");
    closeViewer?.();
  }, [closeViewer]);

  const onOpenCataloguePage = useCallback(() => {
    if (!catalogueHref || typeof window === "undefined") return;
    window.open(catalogueHref, "_blank", "noopener");
  }, [catalogueHref]);

  const onShareCatalogueLink = useCallback(async () => {
    if (!catalogueHref || typeof window === "undefined") return;
    const link = new URL(catalogueHref, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(link);
      setShareMessage("Link copied");
    } catch {
      setShareMessage("The link could not be copied");
    }
  }, [catalogueHref]);

  const viewerSlot = viewerItem ? (
    <KitImageViewer
      imageSrc={viewerItem.url}
      title={viewerItem.altText}
      pixelSize={null}
      isSaved={false}
      onSave={null}
      onDelete={null}
      onReport={null}
      onDetails={catalogueHref ? onOpenCataloguePage : null}
      onShare={catalogueHref ? onShareCatalogueLink : null}
      shareMessage={shareMessage}
      downloadOptions={[]}
      bottomBarAction="remix"
      remixState="soon"
      onRemix={null}
      assignState="soon"
      onAssign={null}
      upscaleCoinCost={0}
      upscaleState="soon"
      onUpscale={null}
      editRunCoinCost={0}
      editState="soon"
      onSubmitEdit={null}
      overlaySlot={null}
      overlayReplacesBody={false}
      onClose={onCloseViewer}
    />
  ) : null;

  const detailPanels = {
    cast: <StoryRoomCastPanel {...castPanelProps} />,
    narrator: (
      <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
        {viewProps.narratorLabel}
      </p>
    ),
    world: <StoryRoomStatePanel {...statePanelProps} layout="sections" />,
    mechanics: runtimeMechanicsPanelProps ? (
      <StoryRoomRuntimeMechanicsPanel {...runtimeMechanicsPanelProps} />
    ) : (
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        A mechanics module is attached to this story.
      </p>
    ),
    preferences: viewProps.chatColor ? <ChatColorPreferences {...viewProps.chatColor} /> : null,
  };

  return (
    <StoryRoomDetailsRailView
      {...viewProps}
      actionsSlot={<StoryRoomStatePanel {...statePanelProps} layout="actions" />}
      dangerAction={
        onRequestDeleteRoom
          ? {
              label: "Delete story",
              busyLabel: "Deleting",
              busy: Boolean(isDeletingRoom),
              onPress: onRequestDeleteRoom,
            }
          : null
      }
      viewerSlot={viewerSlot}
      detailPanels={detailPanels}
      LinkComponent={Link}
    />
  );
}
