export const publicProfileTabsCreationsFixture = Object.freeze({
  eyebrow: "Public Profile",
  title: "Characters & Canon Work",
  tabs: Object.freeze([
    Object.freeze({ id: "creations", label: "Creations", isActive: true }),
    Object.freeze({ id: "activity", label: "Activity", isActive: false }),
    Object.freeze({ id: "badges", label: "Badges", isActive: false }),
  ]),
  contentLabel: "Creation grid slot",
});

export const publicProfileTabsActivityFixture = Object.freeze({
  eyebrow: "Public Profile",
  title: "Activity",
  tabs: Object.freeze([
    Object.freeze({ id: "creations", label: "Creations", isActive: false }),
    Object.freeze({ id: "activity", label: "Activity", isActive: true }),
    Object.freeze({ id: "badges", label: "Badges", isActive: false }),
  ]),
  contentLabel: "Activity feed slot",
});

export const publicProfileTabsBadgesFixture = Object.freeze({
  eyebrow: "Public Profile",
  title: "Badges",
  tabs: Object.freeze([
    Object.freeze({ id: "creations", label: "Creations", isActive: false }),
    Object.freeze({ id: "activity", label: "Activity", isActive: false }),
    Object.freeze({ id: "badges", label: "Badges", isActive: true }),
  ]),
  contentLabel: "Badge collection slot",
});
