export const STORY_ROOM_MOBILE_SWIPE_MIN_DISTANCE = 64;
export const STORY_ROOM_MOBILE_SWIPE_AXIS_RATIO = 1.25;

export function resolveStoryRoomMobileSwipe({
  panel = null,
  deltaX = 0,
  deltaY = 0,
} = {}) {
  const horizontal = Math.abs(Number(deltaX) || 0);
  const vertical = Math.abs(Number(deltaY) || 0);

  if (horizontal < STORY_ROOM_MOBILE_SWIPE_MIN_DISTANCE) return null;
  if (horizontal < vertical * STORY_ROOM_MOBILE_SWIPE_AXIS_RATIO) return null;

  if (panel === "cast") {
    return deltaX < 0 ? "CLOSE" : null;
  }

  if (panel === "state") {
    return deltaX > 0 ? "CLOSE" : null;
  }

  return deltaX > 0 ? "OPEN_CAST" : "OPEN_STATE";
}

export function isStoryRoomSwipeInteractiveTarget(target) {
  return Boolean(
    target?.closest?.(
      "button,a,input,textarea,select,[role='button'],[data-story-room-swipe-ignore='true']"
    )
  );
}
