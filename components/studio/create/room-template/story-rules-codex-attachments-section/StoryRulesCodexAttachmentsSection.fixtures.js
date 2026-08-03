const BASE_COPY = {
  eyebrow: "Story Rules",
  title: "Rules Codex Attachments",
  body:
    "Attach Rules Codices that define how this Story interprets mechanics, thresholds, special cases, and world-specific rules.",
  addLabel: "Attach Rules Codex",
  emptyLabel: "No Rules Codices attached.",
  runtimeNote:
    "This relationship establishes Story scope only. Runtime section selection and prompt composition are activated separately.",
};

export const storyRulesCodexAttachmentsPopulatedFixture = {
  ...BASE_COPY,
  attachments: [
    {
      id: "codex_core_rules",
      title: "Crownfall Core Rules",
      typeLabel: "Rules Codex",
      description:
        "Core stat meanings, tier gates, progression interpretation, and system-wide special cases.",
      imageUrl: "",
      notes: "Use as the primary Story-level interpretation source.",
      removeAriaLabel: "Remove Crownfall Core Rules",
    },
    {
      id: "codex_city_economy",
      title: "Crestfall City Trade Rules",
      typeLabel: "Rules Codex",
      description:
        "Story-specific currency interpretation, guild discounts, and market exceptions.",
      imageUrl: "/images/placeholder-card.jpg",
      notes: "Apply only when the party is inside Crestfall City.",
      removeAriaLabel: "Remove Crestfall City Trade Rules",
    },
  ],
};

export const storyRulesCodexAttachmentsEmptyFixture = {
  ...BASE_COPY,
  attachments: [],
};

export const storyRulesCodexAttachmentsLegacyFixture = {
  ...BASE_COPY,
  attachments: [
    {
      id: "legacy_rules_codex_id",
      title: "legacy-rules-codex-id",
      typeLabel: "Rules Codex",
      description: "",
      imageUrl: "",
      notes: "",
      removeAriaLabel: "Remove legacy Rules Codex",
    },
  ],
};

export const storyRulesCodexAttachmentsLongContentFixture = {
  eyebrow: "Story-Specific Rules, Interpretation, and Scoped Guidance",
  title:
    "Rules Codex Attachments for a Large Multi-Region Chronicle with Several Mechanical Systems",
  body:
    "A deliberately long explanation describing how multiple Story-scoped Codices may define interpretation rules for skills, magic, economy, progression, divine exceptions, and other authored systems without replacing deterministic mechanics.",
  addLabel: "Attach Another Rules Codex",
  emptyLabel: "No Story-scoped Rules Codices are currently attached.",
  runtimeNote:
    "A deliberately long runtime note confirms that attachment persistence and runtime retrieval remain separate responsibilities so that creators can establish scope without granting unrestricted prompt authority.",
  attachments: [
    {
      id: "long_codex",
      title:
        "The Complete Interpretive Rules for Progression, Magic Schools, Guild Rank, Economy, Divine Exceptions, and Narrative Thresholds",
      typeLabel: "Rules Codex",
      description:
        "A long description used to stress card wrapping, truncation, responsive layout, and attachment-note behavior.",
      imageUrl: "/images/placeholder-card.jpg",
      notes:
        "Prefer the most specific matching section and never treat narrative interpretation as permission to override deterministic guards.",
      removeAriaLabel: "Remove long Rules Codex fixture",
    },
  ],
};

export const storyRulesCodexAttachmentsMissingCallbacksFixture = {
  ...storyRulesCodexAttachmentsPopulatedFixture,
  onOpenPicker: null,
  onRemoveAttachment: null,
  onChangeAttachmentNotes: null,
};
