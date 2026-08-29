import { useState } from "react";

/**
 * Defensive pass-through ViewModel, wave C5.
 *
 * Owns exactly the local UI disclosure state no sibling package already
 * owns: desktop rail collapse (chat-cast-panel and chat-state-panel each
 * already own their own mobile sheet disclosure internally) and the coin
 * chip's two utility-dialog toggles (mirrored from useStudioEconomyWidget
 * ViewModel's own local state, since this package composes the widget's
 * pure View directly rather than its account-context-reading binding).
 * Every other value is caller-owned and passed through unchanged.
 */
export function useChatShellViewModel({
  backHref = "/studio/v2/stories",
  backLabel = "Stories",
  eyebrow = "",
  title = "",
  scenarioLabel = "",
  modeLabel = "",
  statusPills = [],
  coinBalanceLabel = "0",
  loading = false,
  errorMessage = "",
  initialLeftRailCollapsed = false,
  initialRightRailCollapsed = false,
  transcript = {},
  composer = {},
  castPanel = {},
  statePanel = {},
  sessionDialogs = {},
  libraryPassUpsell = null,
  formatHelp = null,
} = {}) {
  const [leftRailCollapsed, setLeftRailCollapsed] = useState(initialLeftRailCollapsed);
  const [rightRailCollapsed, setRightRailCollapsed] = useState(initialRightRailCollapsed);
  const [buyInfoOpen, setBuyInfoOpen] = useState(false);
  const [notificationsInfoOpen, setNotificationsInfoOpen] = useState(false);

  return {
    backHref,
    backLabel,
    eyebrow,
    title,
    scenarioLabel,
    modeLabel,
    statusPills: Array.isArray(statusPills) ? statusPills : [],
    coinChip: {
      balanceLabel: coinBalanceLabel,
      buyInfoOpen,
      notificationsInfoOpen,
      onOpenBuyInfo: () => setBuyInfoOpen(true),
      onCloseBuyInfo: () => setBuyInfoOpen(false),
      onOpenNotificationsInfo: () => setNotificationsInfoOpen(true),
      onCloseNotificationsInfo: () => setNotificationsInfoOpen(false),
    },
    loading,
    errorMessage,
    leftRailCollapsed,
    rightRailCollapsed,
    onToggleLeftRail: () => setLeftRailCollapsed((current) => !current),
    onToggleRightRail: () => setRightRailCollapsed((current) => !current),
    transcript: transcript || {},
    composer: composer || {},
    castPanel: castPanel || {},
    statePanel: statePanel || {},
    sessionDialogs: sessionDialogs || {},
    libraryPassUpsell: libraryPassUpsell || null,
    formatHelp: formatHelp || null,
  };
}
