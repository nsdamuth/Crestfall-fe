import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  resolveChatComposerCommandInput,
} from "../../../../../components/studio/chat/chat-composer/chatComposerCommandRegistry.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("/format is discoverable as a V2 local UI command", () => {
  const registry = read("components/studio/chat/chat-composer/chatComposerCommandRegistry.js");
  assert.match(registry, /name:\s*"format"/);
  assert.match(registry, /usage:\s*"\/format"/);
  assert.match(registry, /handling:\s*"LOCAL_UI"/);
  assert.match(registry, /panel:\s*"FORMAT"/);
  assert.match(registry, /resolveChatComposerCommandInput/);
});

test("send-time command resolution recognizes /format independently of autocomplete state", () => {
  for (const input of ["/format", "  /format  ", "/FORMAT", "/format help"]) {
    const resolved = resolveChatComposerCommandInput(input);
    assert.equal(resolved?.command?.name, "format", input);
    assert.equal(resolved?.command?.handling, "LOCAL_UI", input);
    assert.equal(resolved?.command?.panel, "FORMAT", input);
  }

  assert.equal(resolveChatComposerCommandInput("/formation"), null);
  assert.equal(resolveChatComposerCommandInput("say /format"), null);
});

test("V2 Story delegates local command handling to the composer before live Story transport", () => {
  const vm = read("app/studio/v2/stories/[id]/useChatV2StoryPageViewModel.js");
  const composerVm = read("components/studio/chat/chat-composer/useChatComposerViewModel.js");
  const router = read("components/studio/chat/chat-composer/chatComposerSubmissionRouter.js");

  assert.match(vm, /onLocalCommand:/);
  assert.match(vm, /commandInput\?\.command\?\.panel !== "FORMAT"/);
  assert.match(vm, /setFormatHelpOpen\(true\)/);
  assert.doesNotMatch(vm, /resolveChatComposerCommandInput\(body\)/);
  assert.match(composerVm, /routeChatComposerSubmission/);
  assert.match(router, /handling === "LOCAL_UI"/);
  assert.match(router, /onLocalCommand\?\.\(commandInput\) === true/);
  assert.match(router, /onSend\?\.\(options\)/);
});

test("V2 shell renders dedicated formatting help without V1 Story Room UI", () => {
  const page = read("app/studio/v2/stories/[id]/StoryChatPage.jsx");
  const shell = read("components/studio/chat/chat-shell/ChatShell.view.jsx");
  const help = read("components/studio/chat/chat-format-help/ChatFormatHelp.view.jsx");

  assert.match(page, /formatHelp=\{viewProps\.formatHelp\}/);
  assert.match(shell, /ChatFormatHelpView/);
  assert.match(help, /Story Chat Formatting/);
  assert.match(help, /Quote-style RP/);
  assert.match(help, /Asterisk-action RP/);
  assert.match(help, /Private thought/);
  assert.match(help, /Written \/ digital message/);
  assert.match(help, /Telepathy/);
  assert.doesNotMatch(help, /story-room-chat-shell|StoryRoomChatShell/);
});

test("format help documents the privacy boundary", () => {
  const help = read("components/studio/chat/chat-format-help/ChatFormatHelp.view.jsx");
  assert.match(help, /Private thoughts are withheld from ordinary characters/);
  assert.match(help, /explicit thought-perception capability/);
  assert.match(help, /Telepathy is a separate targeted communication channel/);
});
