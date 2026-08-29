import { resolveChatComposerCommandInput } from "./chatComposerCommandRegistry.js";

/**
 * Route an explicit composer submission before it can cross into Story transport.
 *
 * LOCAL_UI commands are consumed only when the caller explicitly handles them.
 * This keeps the portable composer API-free while making the composer the one
 * authoritative choke point for slash-command submission.
 */
export function routeChatComposerSubmission({
  draft = "",
  options = {},
  onLocalCommand = null,
  onSend = null,
} = {}) {
  const actionType = String(options?.actionType || "").trim();
  const isYield = ["PLAYER_YIELD_TO_CHARACTER", "PLAYER_YIELD_TO_AUTO"].includes(actionType);
  const commandInput = isYield ? null : resolveChatComposerCommandInput(draft);

  if (commandInput?.command?.handling === "LOCAL_UI") {
    const handled = onLocalCommand?.(commandInput) === true;
    if (handled) {
      return Object.freeze({
        handledLocally: true,
        sent: false,
        commandInput,
      });
    }
  }

  onSend?.(options);
  return Object.freeze({
    handledLocally: false,
    sent: true,
    commandInput,
  });
}
