import {
  videoAspectRatioOptions,
  videoDurationOptions,
  videoMotionStyleOptions,
  videoToolCards,
} from "../imageStudioData";

function normalizeOption(option, index, prefix) {
  return {
    value: String(option?.value || `${prefix}-${index + 1}`),
    label: String(option?.label || `Option ${index + 1}`),
  };
}

function normalizeToolCard(tool, index) {
  return {
    id: String(tool?.id || `video-tool-${index + 1}`),
    eyebrow: String(tool?.eyebrow || "Video Tool"),
    title: String(tool?.title || `Video Tool ${index + 1}`),
    body: String(tool?.body || ""),
  };
}

const TOOL_CARDS = videoToolCards.map(normalizeToolCard);
const DURATION_OPTIONS = videoDurationOptions.map((option, index) =>
  normalizeOption(option, index, "duration")
);
const ASPECT_RATIO_OPTIONS = videoAspectRatioOptions.map((option, index) =>
  normalizeOption(option, index, "aspect-ratio")
);
const MOTION_STYLE_OPTIONS = videoMotionStyleOptions.map((option, index) =>
  normalizeOption(option, index, "motion-style")
);

export function getVideoToolsPanelViewProps({
  videoDuration = "",
  setVideoDuration,
  videoAspectRatio = "",
  setVideoAspectRatio,
  videoMotionStyle = "",
  setVideoMotionStyle,
  prompt = "",
  setPrompt,
} = {}) {
  return {
    toolCards: TOOL_CARDS,
    durationValue: String(videoDuration || ""),
    durationOptions: DURATION_OPTIONS,
    aspectRatioValue: String(videoAspectRatio || ""),
    aspectRatioOptions: ASPECT_RATIO_OPTIONS,
    motionStyleValue: String(videoMotionStyle || ""),
    motionStyleOptions: MOTION_STYLE_OPTIONS,
    directionValue: String(prompt || ""),
    onChangeDuration: (nextValue) => setVideoDuration?.(nextValue),
    onChangeAspectRatio: (nextValue) => setVideoAspectRatio?.(nextValue),
    onChangeMotionStyle: (nextValue) => setVideoMotionStyle?.(nextValue),
    onChangeDirection: (nextValue) => setPrompt?.(nextValue),
  };
}

export function useVideoToolsPanelViewModel(props = {}) {
  return getVideoToolsPanelViewProps(props);
}
