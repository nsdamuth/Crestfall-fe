import assert from "node:assert/strict";
import { createLocationRegistrySaveSession } from "./locationRegistrySaveSession.mjs";

function runDiagnostics() {
  const session = createLocationRegistrySaveSession();

  const firstSave = session.beginSave();

  assert.deepEqual(firstSave, {
    accepted: true,
    method: "POST",
    creationId: null,
  });

  assert.deepEqual(session.beginSave(), {
    accepted: false,
    method: null,
    creationId: null,
  });

  const savedCreationId = session.completeSave(
    "18b76aba-bfdf-4e75-a8d3-9959cd442c2c"
  );

  assert.equal(
    savedCreationId,
    "18b76aba-bfdf-4e75-a8d3-9959cd442c2c"
  );

  const secondSave = session.beginSave();

  assert.deepEqual(secondSave, {
    accepted: true,
    method: "PATCH",
    creationId: "18b76aba-bfdf-4e75-a8d3-9959cd442c2c",
  });

  assert.equal(
    session.completeSave(),
    "18b76aba-bfdf-4e75-a8d3-9959cd442c2c"
  );

  const failedUpdate = session.beginSave();

  assert.equal(failedUpdate.method, "PATCH");
  session.failSave();

  const retriedUpdate = session.beginSave();

  assert.deepEqual(retriedUpdate, {
    accepted: true,
    method: "PATCH",
    creationId: "18b76aba-bfdf-4e75-a8d3-9959cd442c2c",
  });

  session.completeSave();

  return {
    diagnostic: "location_registry_save_idempotency_v0",
    status: "PASSED",
    firstSaveMethod: firstSave.method,
    repeatedSaveMethod: secondSave.method,
    duplicateSubmissionBlocked: true,
    savedCreationIdPreserved: true,
  };
}

console.log(JSON.stringify(runDiagnostics(), null, 2));
