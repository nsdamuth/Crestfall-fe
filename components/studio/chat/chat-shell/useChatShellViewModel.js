import { useState } from "react";

/**
 * Defensive pass-through ViewModel, wave C5.
 *
 * Owns exactly the local UI disclosure state needed by the composed shell:
 * desktop rail collapse, coordinated mobile Cast/State sheet disclosure, and
 * the coin chip's two utility-dialog toggles (mirrored from useStudioEconomyWidget
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
} = {}) {
  const [leftRailCollapsed, setLeftRailCollapsed] = useState(initialLeftRailCollapsed);
  const [rightRailCollapsed, setRightRailCollapsed] = useState(initialRightRailCollapsed);
  const [buyInfoOpen, setBuyInfoOpen] = useState(false);
  const [notificationsInfoOpen, setNotificationsInfoOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(null);

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
    composer: {
      ...(composer || {}),
      onOpenCast: () => {
        composer?.onOpenCast?.();
        setMobilePanel("cast");
      },
      onOpenState: () => {
        composer?.onOpenState?.();
        setMobilePanel("state");
      },
    },
    castPanel: {
      ...(castPanel || {}),
      mobileOpen: mobilePanel === "cast",
      onMobileOpenChange: (open) => {
        castPanel?.onMobileOpenChange?.(open);
        setMobilePanel(open ? "cast" : null);
      },
    },
    statePanel: {
      ...(statePanel || {}),
      mobileOpen: mobilePanel === "state",
      onMobileOpenChange: (open) => {
        statePanel?.onMobileOpenChange?.(open);
        setMobilePanel(open ? "state" : null);
      },
    },
    sessionDialogs: sessionDialogs || {},
    libraryPassUpsell: libraryPassUpsell || null,
  };
}
