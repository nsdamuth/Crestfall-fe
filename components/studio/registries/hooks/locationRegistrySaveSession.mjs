function normalizeCreationId(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function createLocationRegistrySaveSession(initialCreationId = "") {
  let savedCreationId = normalizeCreationId(initialCreationId);
  let saveInFlight = false;

  return {
    beginSave() {
      if (saveInFlight) {
        return {
          accepted: false,
          method: null,
          creationId: savedCreationId || null,
        };
      }

      saveInFlight = true;

      return {
        accepted: true,
        method: savedCreationId ? "PATCH" : "POST",
        creationId: savedCreationId || null,
      };
    },

    completeSave(nextCreationId = "") {
      const normalizedNextCreationId = normalizeCreationId(nextCreationId);

      if (normalizedNextCreationId) {
        savedCreationId = normalizedNextCreationId;
      }

      saveInFlight = false;

      return savedCreationId || null;
    },

    failSave() {
      saveInFlight = false;
    },

    getSavedCreationId() {
      return savedCreationId || null;
    },

    isSaveInFlight() {
      return saveInFlight;
    },
  };
}
