import {
  normalizeMechanicsDocument,
  normalizeMechanicsString,
} from "../../../my-creations/edit/sections/mechanics-modules/mechanics-core/mechanicsDocumentNormalization.js";

export function buildMechanicsModuleCreationPayload(form) {
  const title =
    normalizeMechanicsString(form?.title) || "Untitled Mechanics Module";

  return {
    type: "MECHANICS_MODULE",
    title,
    description:
      normalizeMechanicsString(form?.description) ||
      "A reusable Crestfall mechanics module.",
    visibility: form?.visibility || "PRIVATE",
    content_rating: form?.content_rating || "SFW",
    data: normalizeMechanicsDocument(form?.data),
  };
}
