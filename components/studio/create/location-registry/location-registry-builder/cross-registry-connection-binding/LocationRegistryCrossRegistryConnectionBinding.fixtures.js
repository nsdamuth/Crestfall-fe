export const locationRegistryCrossRegistryLocalEntriesFixture =
  Object.freeze([
    {
      id: "loc_district",
      kind: "AD_HOC",
      name: "Acceptance District",
      creationId: "",
      creationType: "",
    },
    {
      id: "loc_workshop",
      kind: "AD_HOC",
      name: "Test Workshop",
      creationId: "",
      creationType: "",
    },
    {
      id: "loc_linked",
      kind: "CREATION_REF",
      name: "Linked Location",
      creationId:
        "11111111-1111-4111-8111-111111111111",
      creationType: "LOCATION",
    },
  ]);

export const locationRegistryCrossRegistryOptionsFixture =
  Object.freeze([
    {
      id:
        "22222222-2222-4222-8222-222222222222",
      title:
        "Aethelgard City Registry",
    },
    {
      id:
        "33333333-3333-4333-8333-333333333333",
      title:
        "Outer Roads Registry",
    },
  ]);

export const locationRegistryCrossRegistryRemoteLocationsFixture =
  Object.freeze([
    {
      id: "remote_brass_gate",
      value: "remote_brass_gate",
      label: "Brass Gate",
      creationId:
        "44444444-4444-4444-8444-444444444444",
      creationType: "LOCATION",
      kind: "CREATION_REF",
    },
    {
      id: "remote_market",
      value: "remote_market",
      label: "Central Market",
      creationId: "",
      creationType: "",
      kind: "AD_HOC",
    },
  ]);

export const locationRegistryCrossRegistrySavedFixture =
  Object.freeze({
    currentCreationId:
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",

    connectionDraft: {
      id: "connection-workshop-gate",
      from: {
        registryCreationId: "",
        locationEntryId:
          "loc_workshop",
        locationCreationId: "",
      },
      to: {
        registryCreationId:
          "22222222-2222-4222-8222-222222222222",
        locationEntryId:
          "remote_brass_gate",
        locationCreationId:
          "44444444-4444-4444-8444-444444444444",
      },
      fromLocationId:
        "loc_workshop",
      toLocationId:
        "remote_brass_gate",
    },

    localEntries:
      locationRegistryCrossRegistryLocalEntriesFixture,

    registryOptions:
      locationRegistryCrossRegistryOptionsFixture,

    connectionFromLocationOptions: [],

    connectionToLocationOptions:
      locationRegistryCrossRegistryRemoteLocationsFixture,

    registryTitleById: {
      "22222222-2222-4222-8222-222222222222":
        "Aethelgard City Registry",
      "33333333-3333-4333-8333-333333333333":
        "Outer Roads Registry",
    },

    referenceRegistryLoadError: "",
    authoringAvailable: true,
  });

export const locationRegistryCrossRegistryLocalLinkedLocationFixture =
  Object.freeze({
    currentCreationId:
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",

    connectionDraft: {
      from: {
        registryCreationId: "",
        locationEntryId:
          "loc_linked",
        locationCreationId:
          "11111111-1111-4111-8111-111111111111",
      },
      to: {
        registryCreationId: "",
        locationEntryId:
          "loc_district",
        locationCreationId: "",
      },
      fromLocationId:
        "loc_linked",
      toLocationId:
        "loc_district",
    },

    localEntries:
      locationRegistryCrossRegistryLocalEntriesFixture,

    registryOptions:
      locationRegistryCrossRegistryOptionsFixture,

    connectionFromLocationOptions: [],
    connectionToLocationOptions: [],

    registryTitleById: {},
    referenceRegistryLoadError: "",
    authoringAvailable: true,
  });

export const locationRegistryCrossRegistryUnsavedFixture =
  Object.freeze({
    currentCreationId: "",

    connectionDraft: {
      from: {
        registryCreationId: "",
        locationEntryId:
          "loc_workshop",
        locationCreationId: "",
      },
      to: {
        registryCreationId:
          "22222222-2222-4222-8222-222222222222",
        locationEntryId:
          "remote_market",
        locationCreationId: "",
      },
      fromLocationId:
        "loc_workshop",
      toLocationId:
        "remote_market",
    },

    localEntries:
      locationRegistryCrossRegistryLocalEntriesFixture,

    registryOptions:
      locationRegistryCrossRegistryOptionsFixture,

    connectionFromLocationOptions: [],

    connectionToLocationOptions:
      locationRegistryCrossRegistryRemoteLocationsFixture,

    registryTitleById: {
      "22222222-2222-4222-8222-222222222222":
        "Aethelgard City Registry",
    },

    referenceRegistryLoadError: "",
    authoringAvailable: false,
  });

export const locationRegistryCrossRegistryDegradedFixture =
  Object.freeze({
    currentCreationId:
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",

    connectionDraft: {
      from: {
        registryCreationId:
          "33333333-3333-4333-8333-333333333333",
        locationEntryId:
          "missing_remote_location",
        locationCreationId:
          "55555555-5555-4555-8555-555555555555",
      },
      to: {
        registryCreationId: "",
        locationEntryId:
          "loc_district",
        locationCreationId: "",
      },
      fromLocationId:
        "missing_remote_location",
      toLocationId:
        "loc_district",
    },

    localEntries:
      locationRegistryCrossRegistryLocalEntriesFixture,

    registryOptions:
      locationRegistryCrossRegistryOptionsFixture,

    connectionFromLocationOptions: [],
    connectionToLocationOptions: [],

    registryTitleById: {
      "33333333-3333-4333-8333-333333333333":
        "Outer Roads Registry",
    },

    referenceRegistryLoadError:
      "A referenced Location Registry could not be loaded.",

    authoringAvailable: true,
  });
