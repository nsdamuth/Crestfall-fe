import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  MECHANICS_COMMAND_DOMAIN_QUERY_CONTRACT_VERSION,
} from "./MechanicsCommandDomainQuery.contract.js";
import {
  getMechanicsCommandDomainQueryArgumentOptions,
  normalizeMechanicsCommandDomainQuery,
} from "./mechanicsCommandDomainQueryNormalization.js";
import {
  addMechanicsCommandDomainQueryBinding,
  patchMechanicsCommandDomainQueryBinding,
} from "./mechanicsCommandDomainQueryOperations.js";

test("domain-query authoring contract is generic and versioned", () => {
  assert.equal(
    MECHANICS_COMMAND_DOMAIN_QUERY_CONTRACT_VERSION,
    "mechanics_command_domain_query_v1"
  );
  const normalized = normalizeMechanicsCommandDomainQuery({
    enabled: true,
    domain: "ability spell",
    operation: "query availability",
    argumentBindings: [
      { parameter: "ability", sourceArgumentName: "ability" },
    ],
  });
  assert.equal(normalized.domain, "ABILITY_SPELL");
  assert.equal(normalized.operation, "QUERY_AVAILABILITY");
});


test("visual enablement remains authored while required identifiers are being entered", () => {
  const normalized = normalizeMechanicsCommandDomainQuery({
    enabled: true,
    domain: "",
    operation: "",
  });
  assert.equal(normalized.enabled, true);
});
test("visual authoring preserves an incomplete binding while the creator selects its source argument", () => {
  const added = addMechanicsCommandDomainQueryBinding({
    enabled: true,
    domain: "ABILITY_SPELL",
    operation: "QUERY_AVAILABILITY",
  });
  assert.equal(added.argumentBindings.length, 1);
  assert.equal(added.argumentBindings[0].sourceArgumentName, "");
  const patched = patchMechanicsCommandDomainQueryBinding(added, 0, {
    parameter: "ability",
    sourceArgumentName: "ability_name",
  });
  assert.equal(patched.argumentBindings[0].parameter, "ability");
  assert.equal(patched.argumentBindings[0].sourceArgumentName, "ability_name");
});

test("argument options come only from creator-authored invocation arguments", () => {
  const options = getMechanicsCommandDomainQueryArgumentOptions({
    arguments: [
      { name: "ability", label: "Ability", type: "TEXT" },
      { name: "target", label: "Target", type: "CHARACTER_PRESENT" },
    ],
  });
  assert.deepEqual(
    options.map((option) => option.name),
    ["ability", "target"]
  );
});

test("LOOM parent mounts Domain Query and JSON validation owns domainQuery", () => {
  const assembly = fs.readFileSync(
    new URL("../mechanics-module-assembly/MechanicsModuleAssembly.jsx", import.meta.url),
    "utf8"
  );
  const validation = fs.readFileSync(
    new URL("../mechanics-json-editor/mechanicsJsonEditor.validation.js", import.meta.url),
    "utf8"
  );
  assert.match(assembly, /MechanicsCommandDomainQuery/);
  assert.match(assembly, /domainQuery=\{domainQuery\}/);
  assert.match(validation, /validateDomainQuery/);
  assert.match(validation, /mechanics_command_domain_query_v1/);
  assert.match(validation, /Domain query commands are read-only/);
});
