const EMPTY_LINK_FIELDS = Object.freeze({
  linkedCharacters: [],
  linkedLocations: [],
  linkedOrganizations: [],
  linkedFactions: [],
  linkedItems: [],
  linkedEvents: [],
  linkedQuests: [],
});

function sampleEntry(entry = {}) {
  return Object.freeze({
    aliases: [],
    summary: "",
    publicDescription: "",
    hiddenNotes: "",
    visualIdentity: "",
    relationshipNotes: "",
    ...EMPTY_LINK_FIELDS,
    rulesNotes: "",
    accessRules: "",
    knowledgeRules: "",
    consequences: "",
    promptGuidance: "",
    negativePromptNotes: "",
    middlewareHints: "",
    ...entry,
  });
}

const QUEST_SAMPLES = Object.freeze([
  Object.freeze({
    id: "quest.sample.missing_person.v1",
    label: "Missing Person",
    category: "Job Posting",
    summary: "A compact investigation seed that demonstrates a public hook, private context, leads, and completion guidance.",
    demonstrates: ["Public hook", "Private notes", "Leads", "Outcome guidance"],
    entry: sampleEntry({
      name: "Missing Person",
      aliases: ["Missing Person Alert"],
      category: "Job Posting",
      summary: "A person has been reported missing and the requester needs someone to investigate.",
      publicDescription: "A notice asks for help locating a missing person. The creator should replace this text with the known public facts.",
      hiddenNotes: "Add creator-only facts here: what actually happened, which clues are true, and what must remain undiscovered until earned.",
      relationshipNotes: "Link the missing person, requester, witnesses, and relevant locations after loading this sample.",
      rulesNotes: "Keep clues evidence-bound. Do not reveal hidden facts merely because the quest is active.",
      accessRules: "Describe where or when the posting can be discovered.",
      knowledgeRules: "Separate public notice information from witness-only or investigator-only knowledge.",
      consequences: "Define what completion, failure, delay, or discovery changes in the world.",
      promptGuidance: "Treat this as an investigation seed. Surface clues through play rather than summarizing the answer.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.delivery.v1",
    label: "Delivery",
    category: "Job Posting",
    summary: "Shows a simple origin, destination, cargo, and completion boundary without requiring mechanics.",
    demonstrates: ["Clear task", "Destination", "Completion boundary"],
    entry: sampleEntry({
      name: "Routine Delivery",
      category: "Job Posting",
      summary: "Carry a package or message from one place to another.",
      publicDescription: "A sender needs a delivery completed safely and on time.",
      hiddenNotes: "Optional creator-only complication: the cargo may be fragile, politically sensitive, or more important than it appears.",
      relationshipNotes: "Link the sender, recipient, origin, and destination after loading.",
      rulesNotes: "Do not invent a delivery failure unless the fiction or mechanics support it.",
      accessRules: "Define who can accept the job and where it is offered.",
      knowledgeRules: "The courier knows only the information explicitly given with the job unless more is discovered.",
      consequences: "Delivery success can improve trust, unlock follow-up work, or simply close the task.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.retrieval.v1",
    label: "Item Retrieval",
    category: "Delivery / Retrieval",
    summary: "Demonstrates a retrieval objective with provenance, location, and handoff boundaries.",
    demonstrates: ["Target object", "Search area", "Handoff"],
    entry: sampleEntry({
      name: "Recover the Lost Item",
      category: "Delivery / Retrieval",
      summary: "Find a specific missing object and return it to the requester.",
      publicDescription: "An item of value has been lost or left behind and needs to be recovered.",
      hiddenNotes: "Record the real location, false leads, and any condition the item is currently in.",
      relationshipNotes: "Link the owner, likely search locations, and any Item asset if one exists.",
      rulesNotes: "A found object should remain where established until movement is actually authorized.",
      consequences: "Returning the correct object resolves the task; returning the wrong object does not.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.escort.v1",
    label: "Escort",
    category: "Job Posting",
    summary: "Shows a travel-linked objective with a protected traveler and explicit arrival condition.",
    demonstrates: ["Protected person", "Route", "Arrival condition"],
    entry: sampleEntry({
      name: "Escort a Traveler",
      category: "Job Posting",
      summary: "Accompany someone safely from an origin to a destination.",
      publicDescription: "A traveler needs protection or reliable company during a journey.",
      hiddenNotes: "Add any creator-known threat, motive, or route complication here.",
      relationshipNotes: "Link the traveler and route locations after loading.",
      rulesNotes: "The escort does not control the traveler's decisions unless an authored rule explicitly says otherwise.",
      accessRules: "Define rank, reputation, faction, or location requirements if any.",
      consequences: "Arrival with the traveler safe completes the core objective.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.hunt.v1",
    label: "Creature Hunt",
    category: "Job Posting",
    summary: "Demonstrates a dangerous target quest without assuming a combat system.",
    demonstrates: ["Target", "Evidence", "Success condition"],
    entry: sampleEntry({
      name: "Dangerous Creature Hunt",
      category: "Job Posting",
      summary: "Locate a dangerous creature that is threatening a region and resolve the threat.",
      publicDescription: "Reports describe a dangerous creature near a known area.",
      hiddenNotes: "Record the creature's actual behavior, lair, vulnerabilities, and whether the public report is accurate.",
      relationshipNotes: "Link the creature Character/NPC if authored and the affected locations.",
      rulesNotes: "Do not assume combat is the only valid resolution unless the creator requires it.",
      consequences: "Resolve the threat by the accepted method and define any ecological or social aftermath.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.investigation.v1",
    label: "Open Investigation",
    category: "Investigation",
    summary: "A flexible clue-driven investigation example for mysteries that are not job-board postings.",
    demonstrates: ["Question", "Clue policy", "Hidden answer"],
    entry: sampleEntry({
      name: "Open Investigation",
      category: "Investigation",
      summary: "Investigate an unresolved incident and determine what happened.",
      publicDescription: "The known facts do not yet explain the incident.",
      hiddenNotes: "Write the creator-authoritative answer and the evidence chain here.",
      rulesNotes: "Do not let the Narrator promote speculation into fact. Clues should be discoverable from authored or runtime-supported evidence.",
      knowledgeRules: "Track which facts are public, witness-known, expert-known, or hidden.",
      consequences: "Define what becomes possible once the truth is established.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.faction_task.v1",
    label: "Faction Task",
    category: "Faction Task",
    summary: "Shows how a quest can be scoped to an organization without embedding organization IDs in the sample.",
    demonstrates: ["Faction scope", "Access rule", "Reputation consequence"],
    entry: sampleEntry({
      name: "Faction Assignment",
      category: "Faction Task",
      summary: "Complete a task on behalf of an organization or faction.",
      publicDescription: "A group has work that advances one of its interests.",
      hiddenNotes: "Add the group's true motive and any internal disagreement here.",
      relationshipNotes: "Use the visual link picker to attach the relevant Organization or Faction Registry.",
      accessRules: "Describe membership, rank, reputation, or invitation requirements.",
      knowledgeRules: "Internal motives should not become public knowledge without evidence.",
      consequences: "Success or failure can change standing with the linked group.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.exploration.v1",
    label: "Exploration",
    category: "Exploration",
    summary: "A discovery-oriented quest that teaches location relationships and open-ended success criteria.",
    demonstrates: ["Unknown area", "Discovery goals", "Open outcome"],
    entry: sampleEntry({
      name: "Explore the Unknown Area",
      category: "Exploration",
      summary: "Reach, survey, or understand a place that is poorly known.",
      publicDescription: "A region, ruin, route, or site remains insufficiently explored.",
      hiddenNotes: "List creator-known discoveries and which ones should require specific exploration.",
      relationshipNotes: "Link the relevant Location assets after loading.",
      rulesNotes: "Unknown does not mean undefined: preserve authored geography and established constraints.",
      consequences: "Completion can reveal routes, facts, resources, or future hooks.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.social.v1",
    label: "Social Objective",
    category: "Social Objective",
    summary: "Demonstrates an objective based on trust, negotiation, or access rather than combat.",
    demonstrates: ["Social goal", "Agency boundary", "Multiple resolutions"],
    entry: sampleEntry({
      name: "Earn an Audience",
      category: "Social Objective",
      summary: "Gain enough trust, leverage, or legitimacy to secure a meeting or agreement.",
      publicDescription: "The desired person or group is not currently willing or available to cooperate.",
      hiddenNotes: "Record what actually matters to the target and what will not persuade them.",
      rulesNotes: "No dialogue choice automatically compels another Character. Preserve Character agency.",
      consequences: "Success opens the requested access; failure may close or complicate the route.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.relationship.v1",
    label: "Relationship Objective",
    category: "Relationship Quest",
    summary: "Shows a low-authority relationship arc without turning a Character into a quest reward.",
    demonstrates: ["Relationship arc", "Character agency", "Soft progression"],
    entry: sampleEntry({
      name: "Repair a Strained Relationship",
      category: "Relationship Quest",
      summary: "Create opportunities to repair trust after a meaningful conflict.",
      publicDescription: "A relationship has been damaged and may be repairable through future choices.",
      hiddenNotes: "Record the Character's actual grievance and any boundaries they will not compromise.",
      rulesNotes: "The quest may create opportunities, never force affection, forgiveness, loyalty, or consent.",
      consequences: "Possible outcomes include reconciliation, changed boundaries, or a permanent split.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.hidden_route.v1",
    label: "Hidden Route",
    category: "Hidden Route",
    summary: "A sample for concealed objectives that should not appear until an authored trigger is met.",
    demonstrates: ["Hidden hook", "Discovery gate", "Reveal policy"],
    entry: sampleEntry({
      name: "Hidden Route",
      category: "Hidden Route",
      summary: "A concealed route or objective becomes available only after a specific discovery.",
      hiddenNotes: "Define the trigger and the concealed content here.",
      accessRules: "The route remains unavailable until the authored discovery condition is satisfied.",
      knowledgeRules: "Do not advertise the hidden route before the player has evidence for it.",
      consequences: "Discovery can unlock a new location, branch, or method of resolving another objective.",
    }),
  }),
  Object.freeze({
    id: "quest.sample.recurring.v1",
    label: "Recurring Work",
    category: "Recurring Objective",
    summary: "Shows a repeatable task where each instance is new work rather than one eternally open quest.",
    demonstrates: ["Recurring availability", "Per-instance completion", "Reset guidance"],
    entry: sampleEntry({
      name: "Recurring Work",
      category: "Recurring Objective",
      summary: "A type of work can become available repeatedly under defined conditions.",
      publicDescription: "This kind of work returns over time rather than existing as one permanent unfinished task.",
      rulesNotes: "Treat each accepted instance as a distinct runtime objective when the runtime supports it.",
      accessRules: "Define when or how often new instances may appear.",
      consequences: "Completing one instance does not permanently remove the recurring opportunity.",
    }),
  }),
]);

const EVENT_SAMPLES = Object.freeze([
  Object.freeze({
    id: "event.sample.incident.v1",
    label: "Public Incident",
    category: "Incident",
    summary: "A simple event record showing public facts, hidden cause, participants, and consequences.",
    demonstrates: ["Public facts", "Hidden cause", "Consequences"],
    entry: sampleEntry({
      name: "Public Incident",
      category: "Incident",
      summary: "A notable incident occurred and should remain part of world continuity.",
      publicDescription: "Write only the facts that ordinary observers can know here.",
      hiddenNotes: "Record the creator-authoritative cause, hidden participants, or disputed facts here.",
      relationshipNotes: "Link involved Characters, Locations, and Organizations after loading.",
      rulesNotes: "Do not let later narration overwrite established outcomes without an authored or runtime-supported change.",
      knowledgeRules: "Separate public knowledge from witness-only and hidden information.",
      consequences: "Describe persistent changes caused by the incident.",
    }),
  }),
  Object.freeze({
    id: "event.sample.festival.v1",
    label: "Festival / Holiday",
    category: "Holiday / Festival",
    summary: "Demonstrates a recurring or scheduled public event with atmosphere and access guidance.",
    demonstrates: ["Schedule", "Public atmosphere", "Recurring use"],
    entry: sampleEntry({
      name: "Annual Festival",
      category: "Holiday / Festival",
      summary: "A recurring public celebration changes the normal rhythm of a place.",
      publicDescription: "Describe what visitors can see, hear, and expect during the celebration.",
      hiddenNotes: "Optional creator-only traditions, risks, or political tensions can live here.",
      accessRules: "Define the date, season, location, or prerequisites for this event to be active.",
      consequences: "Record temporary closures, gatherings, markets, competitions, or lasting outcomes.",
      promptGuidance: "Use the event to color the scene without forcing the player to participate.",
    }),
  }),
  Object.freeze({
    id: "event.sample.conflict.v1",
    label: "Battle / Conflict",
    category: "Battle / Conflict",
    summary: "A historical or current conflict sample with explicit sides and aftermath boundaries.",
    demonstrates: ["Participants", "Outcome", "Aftermath"],
    entry: sampleEntry({
      name: "Major Conflict",
      category: "Battle / Conflict",
      summary: "Two or more forces clashed and the result matters to current continuity.",
      publicDescription: "Record the commonly known version of the conflict.",
      hiddenNotes: "Record disputed motives, secret actors, or the true cause only if creator-authored.",
      relationshipNotes: "Link the relevant factions, Characters, and Locations.",
      consequences: "Territory, casualties, alliances, grudges, damaged locations, or policy changes belong here.",
    }),
  }),
  Object.freeze({
    id: "event.sample.disaster.v1",
    label: "Disaster",
    category: "Disaster",
    summary: "Shows how to preserve physical and social consequences from a world event.",
    demonstrates: ["Physical change", "Response", "Persistent aftermath"],
    entry: sampleEntry({
      name: "Regional Disaster",
      category: "Disaster",
      summary: "A destructive event changed a place and the lives around it.",
      publicDescription: "Describe the visible event and its widely known effects.",
      hiddenNotes: "If the disaster had a hidden or supernatural cause, record only creator-authoritative facts here.",
      rulesNotes: "Destroyed, closed, flooded, burned, or otherwise changed places remain changed until repaired by authority.",
      consequences: "Record displacement, shortages, closures, reconstruction, and new hazards.",
    }),
  }),
  Object.freeze({
    id: "event.sample.discovery.v1",
    label: "Discovery",
    category: "Discovery",
    summary: "A clean example for a discovery that changes what the world knows.",
    demonstrates: ["Discovery", "Knowledge spread", "New opportunities"],
    entry: sampleEntry({
      name: "Important Discovery",
      category: "Discovery",
      summary: "Something previously unknown was discovered and can now affect future scenes.",
      publicDescription: "Record what has become publicly established, if anything.",
      hiddenNotes: "Record what the discoverers know but have not revealed, plus any unresolved implications.",
      knowledgeRules: "Knowledge should spread according to witnesses, communication, publication, and authored rules.",
      consequences: "The discovery may unlock locations, research, quests, conflict, or new public knowledge.",
    }),
  }),
  Object.freeze({
    id: "event.sample.meeting.v1",
    label: "Important Meeting",
    category: "Meeting",
    summary: "Shows a social event record that preserves decisions without inventing participant intent.",
    demonstrates: ["Participants", "Decisions", "Private/public split"],
    entry: sampleEntry({
      name: "Important Meeting",
      category: "Meeting",
      summary: "A meeting produced decisions or information worth preserving in continuity.",
      publicDescription: "Record only the meeting facts that are publicly known.",
      hiddenNotes: "Record private decisions, undisclosed positions, and off-record facts here.",
      rulesNotes: "Do not infer agreement, loyalty, or intent beyond what was actually established.",
      consequences: "Record decisions, commitments, deadlines, or follow-up actions that survived the meeting.",
    }),
  }),
  Object.freeze({
    id: "event.sample.investigation_beat.v1",
    label: "Investigation Beat",
    category: "Investigation Beat",
    summary: "A small event entry for one consequential clue or investigative development.",
    demonstrates: ["Clue event", "Evidence", "Quest relationship"],
    entry: sampleEntry({
      name: "Investigation Breakthrough",
      category: "Investigation Beat",
      summary: "An investigation gained a meaningful new clue or ruled out a prior theory.",
      publicDescription: "Describe what was actually observed or established.",
      hiddenNotes: "Record the creator's interpretation separately from what the investigators can prove.",
      relationshipNotes: "Link a related Quest Registry if this event advances an authored investigation.",
      knowledgeRules: "Evidence and interpretation remain distinct.",
      consequences: "The clue can redirect the investigation or unlock a new lead.",
    }),
  }),
  Object.freeze({
    id: "event.sample.historical.v1",
    label: "Historical Event",
    category: "Historical Event",
    summary: "Demonstrates old history with public record, disputed record, and current consequences.",
    demonstrates: ["Historical fact", "Disputed knowledge", "Present-day effect"],
    entry: sampleEntry({
      name: "Historical Turning Point",
      category: "Historical Event",
      summary: "A past event still shapes the present world.",
      publicDescription: "Write the accepted historical account here.",
      hiddenNotes: "Record creator-authoritative facts omitted from or distorted by the public record.",
      knowledgeRules: "Characters should know history according to culture, education, access, and authored epistemic rules.",
      consequences: "Record borders, institutions, grudges, traditions, ruins, or laws that still exist because of the event.",
    }),
  }),
  Object.freeze({
    id: "event.sample.recurring.v1",
    label: "Recurring Event",
    category: "Recurring Event",
    summary: "Shows a repeatable event pattern without claiming that it is always active.",
    demonstrates: ["Recurrence", "Activation rule", "Per-occurrence state"],
    entry: sampleEntry({
      name: "Recurring Public Event",
      category: "Recurring Event",
      summary: "An event repeats on a schedule or under recurring conditions.",
      publicDescription: "Describe what a normal occurrence looks like.",
      accessRules: "Define the schedule, trigger, or condition that makes an occurrence active.",
      rulesNotes: "The registry definition describes the pattern; each actual occurrence remains runtime/story state.",
      consequences: "Record only persistent consequences here; per-occurrence outcomes belong to runtime continuity.",
    }),
  }),
  Object.freeze({
    id: "event.sample.scandal.v1",
    label: "Scandal",
    category: "Scandal",
    summary: "A reputation-focused sample separating accusation, public belief, and creator-known truth.",
    demonstrates: ["Public claim", "Truth boundary", "Reputation consequence"],
    entry: sampleEntry({
      name: "Public Scandal",
      category: "Scandal",
      summary: "A public accusation or revelation has damaged trust or reputation.",
      publicDescription: "Record what people are actually saying or what was publicly revealed.",
      hiddenNotes: "Record what is true, false, exaggerated, or still unknown.",
      knowledgeRules: "Public belief is not automatically factual truth.",
      consequences: "Record reputation, access, political, commercial, or relationship effects.",
    }),
  }),
]);

const SAMPLE_LIBRARY = Object.freeze({
  QUEST_REGISTRY: QUEST_SAMPLES,
  EVENT_REGISTRY: EVENT_SAMPLES,
});

function normalizeQuery(value) {
  return String(value || "").trim().toLowerCase();
}

export function isStructuredRegistrySampleLibraryEnabled(registryType) {
  return Boolean(SAMPLE_LIBRARY[String(registryType || "").toUpperCase()]);
}

export function listStructuredRegistrySamples(
  registryType,
  { query = "", category = "ALL" } = {}
) {
  const items = SAMPLE_LIBRARY[String(registryType || "").toUpperCase()] || [];
  const needle = normalizeQuery(query);

  return items.filter((sample) => {
    if (category !== "ALL" && sample.category !== category) return false;
    if (!needle) return true;

    const haystack = [
      sample.label,
      sample.category,
      sample.summary,
      ...(sample.demonstrates || []),
      sample.entry?.name,
      sample.entry?.summary,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}

export function getStructuredRegistrySample(registryType, sampleId) {
  return (
    (SAMPLE_LIBRARY[String(registryType || "").toUpperCase()] || []).find(
      (sample) => sample.id === sampleId
    ) || null
  );
}

export function listStructuredRegistrySampleCategories(registryType) {
  const items = SAMPLE_LIBRARY[String(registryType || "").toUpperCase()] || [];
  return [...new Set(items.map((sample) => sample.category).filter(Boolean))];
}

export function createStructuredRegistryEntryFromSample(registryType, sampleId) {
  const sample = getStructuredRegistrySample(registryType, sampleId);
  if (!sample) return null;

  return JSON.parse(JSON.stringify(sample.entry));
}
