export const npcRegistryModalActionsFixtures = [
  {
    id: "save-entry",
    label: "Save Entry",
    props: {
      saveLabel: "Save Entry",
      onClose: null,
      onSave: null,
    },
  },
  {
    id: "add-rule",
    label: "Add Rule",
    props: {
      saveLabel: "Add Rule",
      onClose: null,
      onSave: null,
    },
  },
  {
    id: "update-relationship",
    label: "Update Relationship",
    props: {
      saveLabel: "Update Relationship",
      onClose: null,
      onSave: null,
    },
  },
  {
    id: "empty-label",
    label: "Empty Save Label",
    props: {
      saveLabel: "",
      onClose: null,
      onSave: null,
    },
  },
  {
    id: "long-label",
    label: "Long Label",
    props: {
      saveLabel:
        "Save This Deliberately Long Registry Relationship Rule Label",
      onClose: null,
      onSave: null,
    },
  },
  {
    id: "missing-actions",
    label: "Missing Callbacks",
    props: {
      saveLabel: "Save Safely",
      onClose: null,
      onSave: null,
    },
  },
];
