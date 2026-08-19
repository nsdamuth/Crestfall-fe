export const creationStudioMechanicsProfileCatalogAllRoutesFixture =
  Object.freeze({
    routeTargets: {
      skillsProfile: {
        available: true,
        href:
          "/studio/create/skills-profile",
      },
      abilitySpellProfile: {
        available: true,
        href:
          "/studio/create/ability-spell-profile",
      },
      walletProfile: {
        available: true,
        href:
          "/studio/create/wallet-profile",
      },
    },
  });

export const creationStudioMechanicsProfileCatalogPartialRoutesFixture =
  Object.freeze({
    routeTargets: {
      skillsProfile: {
        available: true,
        href:
          "/studio/create/skills-profile",
      },
      abilitySpellProfile: {
        available: false,
        href: "",
        unavailableReason:
          "Ability & Spell Profile routing is waiting for the Chassis route mount.",
      },
      walletProfile: {
        available: false,
        href: "",
      },
    },
  });

export const creationStudioMechanicsProfileCatalogNoRoutesFixture =
  Object.freeze({
    routeTargets: {},
  });
