import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const files = {
  builderShell: "components/studio/create/lore/LoreBuilderShell.jsx",
  builderView: "components/studio/create/lore/lore-builder/LoreBuilder.view.jsx",
  builderVm: "components/studio/create/lore/lore-builder/useLoreBuilderViewModel.js",
  editorShell: "components/studio/create/lore/LoreEditor.jsx",
  editorView: "components/studio/create/lore/lore-editor/LoreEditor.view.jsx",
  editorVm:
    "components/studio/create/lore/lore-editor/useLoreEditorViewModel.js",
  editorContract:
    "components/studio/create/lore/lore-editor/LoreEditor.contract.js",
  jsonEditorShell:
    "components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.jsx",
  jsonEditorView:
    "components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.view.jsx",
  jsonEditorVm:
    "components/studio/create/lore/lore-json-editor/useLoreJsonEditorViewModel.js",
  jsonEditorValidation:
    "components/studio/create/lore/lore-json-editor/loreJsonEditor.validation.js",
  jsonEditorGuide:
    "components/studio/create/lore/lore-json-editor/loreJsonAiAuthoringGuide.js",
  jsonEditorContract:
    "components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.contract.js",
  rendererView:
    "components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx",
  rendererVm:
    "components/studio/create/lore/lore-document-renderer/useLoreDocumentRendererViewModel.js",
  blockRenderer: "components/LoreBlockRenderer.jsx",
  twoColumnBlock: "components/blocks/TwoColumnBlock.jsx",
  statBlock: "components/blocks/StatBlock.jsx",
  constants: "lib/server/creations/constants.js",
  policy: "lib/shared/creations/creationTypePolicy.js",
  editShell: "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx",
  publicPage: "components/studio/creations/lore/LorePublicCreationPage.jsx",
  ownerPreviewPage: "app/studio/my-creations/[id]/preview/page.js",
  readinessShell: "components/studio/create/lore/LorePublicationReadiness.jsx",
  readinessView: "components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.view.jsx",
  readinessVm: "components/studio/create/lore/lore-publication-readiness/useLorePublicationReadinessViewModel.js",
  readinessContract: "components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.contract.js",
  validationClient: "lib/client/studio/creations/loreValidationClient.js",
  validationApi: "app/api/creations/[id]/lore-validation/route.js",
  validationCancelApi: "app/api/creations/[id]/lore-validation/[submissionId]/cancel/route.js",
  publicationApi: "app/api/creations/[id]/lore-validation/[submissionId]/publish/route.js",
  publicPublicationApi: "app/api/lore/[id]/publication/route.js",
  publicCreationPage: "app/studio/creations/[id]/page.js",
  validationRoute: "services/api/src/routes/loreValidationRoute.js",
  publicationRoute: "services/api/src/routes/lorePublicationRoute.js",
  validationService: "services/api/src/services/creations/lore/loreValidationService.js",
  validationRepository: "services/api/src/services/creations/lore/loreValidationRepository.js",
  validationWorker: "services/api/src/services/creations/lore/loreValidationWorker.js",
  validationSnapshot: "services/api/src/services/creations/lore/loreValidationSnapshotService.js",
  publicationRepository: "services/api/src/services/creations/lore/lorePublicationRepository.js",
  publicationService: "services/api/src/services/creations/lore/lorePublicationService.js",
  engineUseShell: "components/studio/create/lore/LoreEngineUse.jsx",
  engineUseView: "components/studio/create/lore/lore-engine-use/LoreEngineUse.view.jsx",
  engineUseVm: "components/studio/create/lore/lore-engine-use/useLoreEngineUseViewModel.js",
  engineUseClient: "lib/client/studio/creations/loreEngineUseClient.js",
  engineUseApi: "app/api/creations/[id]/lore-engine-use/route.js",
  engineUseRoute: "services/api/src/routes/loreEngineUseRoute.js",
  engineUseService: "services/api/src/services/creations/lore/loreEngineUseService.js",
  engineUseRepository: "services/api/src/services/creations/lore/loreEngineUseRepository.js",
  publicPublicationPageService: "lib/server/studio/getPublicLorePublicationPageData.js",
  communityRoute: "services/api/src/routes/communityRoute.js",
  publicPreview: "services/api/src/services/creations/creationPreviewGraph.js",
  publicRender: "services/api/src/services/creations/lore/lorePublicRenderService.js",
  persistence:
    "services/api/src/services/creations/lore/lorePersistenceService.js",
};

const entries = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, path]) => [key, await readFile(path, "utf8")])
  )
);

assert.match(entries.builderShell, /useLoreBuilderViewModel/);
assert.match(entries.builderShell, /LoreBuilderView/);
assert.doesNotMatch(entries.builderView, /LoreEditor\.jsx/);
assert.doesNotMatch(entries.builderView, /LoreDocumentRenderer\.jsx/);
assert.match(entries.builderView, /LoreEditor\.view/);
assert.match(entries.builderView, /LoreDocumentRenderer\.view/);
assert.match(entries.builderVm, /createLoreDraft/);
assert.match(entries.builderVm, /builder_version: "0\.5"/);
assert.match(entries.editorView, /Character Image Library/);
assert.match(entries.editorView, /Section-only Character Tags/);
assert.match(entries.editorView, /Asset-level Location Tags/);
assert.match(entries.editorView, /Chapter-only Location Tags/);
assert.match(entries.editorView, /Section-only Location Tags/);
assert.match(entries.editorView, /pluralLabel = "Characters"/);
assert.match(entries.editorView, /pluralLabel="Locations"/);
assert.match(entries.editorView, /Owned/);
assert.match(entries.editorView, /Liked/);
assert.match(entries.editorView, /maxSelections/);
assert.match(entries.editorView, /Story excerpt/);
assert.match(entries.editorView, /One item per line/);
assert.match(entries.editorView, /Reference block title/);
assert.match(entries.editorView, /Two Column Layout|Columns stack on smaller screens/);
assert.match(entries.editorView, /onAddColumnBlock/);
assert.match(entries.editorView, /onAddStatItem/);
assert.match(entries.editorView, /Lore Block Library/);
assert.match(entries.editorView, /Add content block/);
assert.match(entries.editorContract, /category: "Writing"/);
assert.match(entries.editorContract, /category: "Archive & Reference"/);
assert.match(entries.editorVm, /countLoreBlocks/);
assert.match(entries.editorVm, /updateColumnBlockList/);
assert.match(entries.editorVm, /applySelectedImage/);
assert.match(entries.editorVm, /fetchOwnedCreations\(\{ type: "LOCATION" \}\)/);
assert.match(entries.editorVm, /toggleDocumentLocation/);
assert.match(entries.editorContract, /lore_document_contract_v4/);
assert.match(entries.editorContract, /"two-column"/);
assert.match(entries.editorContract, /"stat-block"/);
assert.match(entries.editorContract, /LORE_COLUMN_BLOCK_TYPES/);
assert.match(entries.editorShell, /LoreJsonEditorModal/);
assert.match(entries.editorShell, /jsonEditorSlot/);
assert.match(entries.editorView, /jsonEditorSlot/);
assert.match(entries.editorView, /JSON Editor/);
assert.match(entries.editorVm, /jsonEditorOpen/);
assert.match(entries.editorVm, /applyJsonDocument/);
assert.match(entries.jsonEditorShell, /useLoreJsonEditorViewModel/);
assert.match(entries.jsonEditorShell, /LoreJsonEditorModalView/);
assert.match(entries.jsonEditorView, /Download AI Guide/);
assert.match(entries.jsonEditorView, /Validate & Apply/);
assert.match(entries.jsonEditorView, /Authored Lore Document/);
assert.match(entries.jsonEditorVm, /buildLoreJsonAiAuthoringGuide/);
assert.match(entries.jsonEditorVm, /validateLoreJsonText/);
assert.match(entries.jsonEditorValidation, /lore_json_editor_validation_v1/);
assert.match(entries.jsonEditorValidation, /normalizeLoreDocument/);
assert.match(entries.jsonEditorValidation, /visual selector/);
assert.match(entries.jsonEditorGuide, /Current Lore document JSON/);
assert.match(entries.jsonEditorGuide, /Do not invent database UUIDs/);
assert.match(entries.jsonEditorContract, /lore_json_editor_view_contract_v1/);
assert.match(entries.rendererView, /sourcebook-page/);
assert.match(entries.rendererView, /chapter\.sections/);
assert.match(entries.rendererView, /Copy chapter link/);
assert.match(entries.rendererView, /Copy section link/);
assert.match(entries.rendererView, /Back to contents/);
assert.match(entries.rendererView, /LocationLinks/);
assert.match(entries.rendererView, /lore-contents/);
assert.match(entries.rendererVm, /publicHref/);
assert.match(entries.rendererVm, /testBannerText/);
assert.match(entries.blockRenderer, /nested \? "space-y-8"/);
assert.match(entries.twoColumnBlock, /nested/);
assert.match(entries.statBlock, /item\.id/);
assert.match(entries.constants, /"LORE"/);
assert.match(entries.policy, /LORE:/);
assert.match(entries.editShell, /isLore/);
assert.match(entries.editShell, /Open full owner preview/);
assert.match(entries.ownerPreviewPage, /Owner-only draft preview/);
assert.match(entries.ownerPreviewPage, /publicHref=\{previewHref\}/);
assert.match(entries.readinessShell, /useLorePublicationReadinessViewModel/);
assert.match(entries.readinessShell, /LorePublicationReadinessView/);
assert.match(entries.readinessView, /Publish a validated revision/);
assert.match(entries.readinessView, /Submit for validation/);
assert.match(entries.readinessView, /Cancel validation/);
assert.match(entries.readinessView, /Publish validated revision/);
assert.match(entries.readinessView, /Open full owner preview/);
assert.match(entries.readinessVm, /validateLoreDocument/);
assert.match(entries.readinessVm, /isAuthoringReady/);
assert.match(entries.readinessContract, /lore_publication_readiness_contract_v4/);
assert.match(entries.validationClient, /submitLoreValidation/);
assert.match(entries.validationClient, /cancelLoreValidation/);
assert.match(entries.validationApi, /submitOwnedLoreValidation/);
assert.match(entries.validationCancelApi, /cancelOwnedLoreValidation/);
assert.match(entries.publicationApi, /publishOwnedLoreValidatedRevision/);
assert.match(entries.publicPublicationApi, /getPublicLorePublication/);
assert.match(entries.publicCreationPage, /getPublicLorePublicationPageData/);
assert.match(entries.validationRoute, /handleLoreValidationCollection/);
assert.match(entries.validationRoute, /handleLoreValidationPublication/);
assert.match(entries.publicationRoute, /handlePublicLorePublication/);
assert.match(entries.validationService, /buildLoreValidationSnapshot/);
assert.match(entries.validationRepository, /claimNextLoreValidationChunkJson/);
assert.match(entries.validationWorker, /submitLlamaGuardTextClassificationJob/);
assert.match(entries.validationWorker, /cancelLlamaGuardTextClassificationJob/);
assert.match(entries.validationSnapshot, /lore_validation_snapshot_v1/);
assert.match(entries.publicationRepository, /publishLoreValidationSubmissionJsonAsActor/);
assert.match(entries.publicationRepository, /getPublicLorePublicationJson/);
assert.match(entries.publicationService, /hydratePublicLoreImages/);
assert.match(entries.publicationService, /publishValidatedLoreRevision/);
assert.match(entries.engineUseShell, /useLoreEngineUseViewModel/);
assert.match(entries.engineUseView, /Submit for Engine Use/);
assert.match(entries.engineUseView, /Character knowledge/);
assert.match(entries.engineUseView, /Location relevance/);
assert.match(entries.engineUseVm, /submitLoreForEngineUse/);
assert.match(entries.engineUseClient, /lore-engine-use/);
assert.match(entries.engineUseApi, /submitOwnedLoreForEngineUse/);
assert.match(entries.engineUseRoute, /handleLoreEngineUseCollection/);
assert.match(entries.engineUseService, /normalizeLoreEngineUseRequest/);
assert.match(entries.engineUseRepository, /createLoreEngineUseSubmissionJsonAsActor/);
assert.match(entries.publicPublicationPageService, /api\/lore/);
assert.match(entries.editShell, /LorePublicationReadiness/);
assert.doesNotMatch(entries.publicPage, /showTestBanner/);
assert.match(entries.publicPage, /publicHref=/);
assert.match(entries.communityRoute, /"LORE"/);
assert.match(entries.publicPreview, /hydratePublicLoreImages/);
assert.match(entries.publicPreview, /getLoreImageLibraryEntryIds/);
assert.match(entries.publicRender, /mapLoreBlocks/);
assert.match(entries.publicRender, /collectLoreBlocks/);
assert.match(entries.publicRender, /library_visibility|libraryVisibility/);
assert.match(entries.publicRender, /entryCreationId === sourceCharacterId/);
assert.match(entries.persistence, /lore_document_contract_v4/);
assert.match(entries.persistence, /COLUMN_BLOCK_TYPES/);
assert.match(entries.persistence, /hydrateBlock/);
assert.match(entries.persistence, /hydrateLocationRefs/);
assert.match(entries.persistence, /LORE_LOCATION_REFERENCE_NOT_AVAILABLE/);
assert.match(entries.persistence, /builder_version: "0\.5"/);

console.log("Lore patch source diagnostics passed.");
