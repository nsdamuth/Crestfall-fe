import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  PLAYER_MESSAGE_CONVENTIONS,
  buildPlayerChatMessagePresentation,
  parsePlayerMessageSemantics,
} from "./playerMessageSemantics.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("quoted-dialogue users get unquoted action semantics without adding asterisks", () => {
  const parsed = parsePlayerMessageSemantics(
    '"Do not touch that." She steps closer. "Seriously."'
  );

  assert.equal(parsed.convention, PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE);
  assert.deepEqual(
    parsed.semanticSegments.map((segment) => segment.type),
    ["DIALOGUE", "ACTION", "DIALOGUE"]
  );
});

test("quote-style italics become private thought", () => {
  const parsed = parsePlayerMessageSemantics(
    '"Fine." *This is absolutely not fine.* She smiles.'
  );

  assert.equal(parsed.convention, PLAYER_MESSAGE_CONVENTIONS.QUOTED_DIALOGUE);
  assert.deepEqual(
    parsed.semanticSegments.map((segment) => segment.type),
    ["DIALOGUE", "THOUGHT", "ACTION"]
  );
  assert.equal(parsed.semanticSegments[1]?.visibility, "PLAYER_PRIVATE");
});

test("asterisk-action users keep ordinary unwrapped text as dialogue when no quoted convention is present", () => {
  const parsed = parsePlayerMessageSemantics(
    "*She folds her arms.* I said no. *She looks away.*"
  );

  assert.equal(parsed.convention, PLAYER_MESSAGE_CONVENTIONS.ASTERISK_ACTION);
  assert.deepEqual(
    parsed.semanticSegments.map((segment) => segment.type),
    ["ACTION", "DIALOGUE", "ACTION"]
  );
});

test("greater-than lines render as written or digital messages", () => {
  const presentation = buildPlayerChatMessagePresentation({
    text: "> Meet me behind the station.",
  });

  assert.equal(presentation.semanticSegments[0]?.type, "MESSAGE");
  assert.equal(presentation.semanticSegments[0]?.text, "> Meet me behind the station.");
});

test("backticks render as telepathic transmission and retain targeted visibility", () => {
  const presentation = buildPlayerChatMessagePresentation({
    text: "`Leave now.`",
  });

  assert.equal(presentation.semanticSegments[0]?.type, "TELEPATHY");
  assert.equal(
    presentation.semanticSegments[0]?.visibility,
    "TARGETED_COMMUNICATION"
  );
});

test("Thought mode projects private-thought semantic body", () => {
  const presentation = buildPlayerChatMessagePresentation({
    text: "Please do not notice how nervous I am.",
    inputMode: "THOUGHT",
  });

  assert.equal(presentation.bodyMode, "SEMANTIC");
  assert.equal(presentation.semanticSegments[0]?.type, "THOUGHT");
  assert.equal(presentation.semanticSegments[0]?.visibility, "PLAYER_PRIVATE");
});

test("persisted server semantics override client inference", () => {
  const presentation = buildPlayerChatMessagePresentation({
    text: "ambiguous original",
    metadata: {
      playerInputSemantics: {
        version: "player_input_semantics_v3",
        convention: "QUOTED_DIALOGUE",
        semanticSegments: [
          {
            type: "MESSAGE",
            text: "Meet me there.",
            displayText: "> Meet me there.",
            visibility: "SCENE_VISIBLE",
          },
        ],
      },
    },
  });

  assert.equal(presentation.semanticSegments[0]?.type, "MESSAGE");
  assert.equal(presentation.semanticSegments[0]?.text, "> Meet me there.");
});

test("V2 message View has distinct thought, message, and telepathy rendering", () => {
  const contract = read("components/studio/chat/chat-message/ChatMessage.contract.js");
  const messageView = read("components/studio/chat/chat-message/ChatMessage.view.jsx");
  const composer = read("components/studio/chat/chat-composer/ChatComposer.contract.js");

  assert.match(contract, /MESSAGE:\s*"MESSAGE"/);
  assert.match(contract, /TELEPATHY:\s*"TELEPATHY"/);
  assert.match(messageView, /data-private-thought="true"/);
  assert.match(messageView, /data-written-message="true"/);
  assert.match(messageView, /data-telepathy="true"/);
  assert.match(composer, /THOUGHT:\s*"THOUGHT"/);
});
