import assert from "node:assert/strict";
import test from "node:test";
import { routeChatComposerSubmission } from "./chatComposerSubmissionRouter.js";

test("/format is consumed by the composer before Story transport", () => {
  let localCalls = 0;
  let sendCalls = 0;

  const result = routeChatComposerSubmission({
    draft: "/format",
    onLocalCommand: (input) => {
      localCalls += 1;
      assert.equal(input.command.name, "format");
      assert.equal(input.command.panel, "FORMAT");
      return true;
    },
    onSend: () => {
      sendCalls += 1;
    },
  });

  assert.equal(result.handledLocally, true);
  assert.equal(result.sent, false);
  assert.equal(localCalls, 1);
  assert.equal(sendCalls, 0);
});

test("format resolution remains case and whitespace tolerant", () => {
  for (const draft of [" /FORMAT ", "/format help"]) {
    let sendCalls = 0;
    const result = routeChatComposerSubmission({
      draft,
      onLocalCommand: (input) => input.command.panel === "FORMAT",
      onSend: () => { sendCalls += 1; },
    });
    assert.equal(result.handledLocally, true, draft);
    assert.equal(sendCalls, 0, draft);
  }
});

test("unhandled local commands and normal prose continue to caller transport", () => {
  for (const draft of ["/help", "Hello there."]) {
    let sendCalls = 0;
    const result = routeChatComposerSubmission({
      draft,
      onLocalCommand: () => false,
      onSend: () => { sendCalls += 1; },
    });
    assert.equal(result.handledLocally, false, draft);
    assert.equal(result.sent, true, draft);
    assert.equal(sendCalls, 1, draft);
  }
});

test("yield actions bypass local command parsing", () => {
  let localCalls = 0;
  let sendCalls = 0;
  const result = routeChatComposerSubmission({
    draft: "/format",
    options: { actionType: "PLAYER_YIELD_TO_AUTO" },
    onLocalCommand: () => { localCalls += 1; return true; },
    onSend: () => { sendCalls += 1; },
  });
  assert.equal(result.handledLocally, false);
  assert.equal(localCalls, 0);
  assert.equal(sendCalls, 1);
});
