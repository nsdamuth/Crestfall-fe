const CUSTOM_APPEARANCE_VALUE_MAX_LENGTH = 160;
const CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH = 240;

const speciesOptions = [
  { value: "", label: "Not chosen" },
  { value: "HUMAN", label: "Human" },
  { value: "BASTET", label: "Bastet / Catfolk" },
  { value: "KITSUNE", label: "Kitsune" },
  { value: "LAMIA", label: "Lamia / Gorgon" },
  { value: "GENIE", label: "Genie" },
  { value: "CONSTRUCT", label: "Construct / Robot" },
  { value: "DEMON", label: "Demon" },
  { value: "ANGEL", label: "Angel" },
  { value: "ELF", label: "Elf" },
  { value: "ALIEN", label: "Alien" },
  { value: "MERFOLK", label: "Merfolk" },
  { value: "HARPY", label: "Harpy" },
  { value: "VAMPIRE", label: "Vampire" },
  { value: "WEREWOLF", label: "Werewolf" },
  { value: "CUSTOM", label: "Custom" },
];

const genderPresentationOptions = [
  { value: "", label: "Not chosen" },
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "ANDROGYNOUS", label: "Androgynous" },
  { value: "CUSTOM", label: "Custom" },
];

const roleArchetypeOptions = [
  { value: "", label: "None", pinned: true },
  { value: "CUSTOM", label: "Custom", pinned: true },

  { value: "ARTIFICER", label: "Artificer", group: "Fantasy" },
  { value: "BARBARIAN", label: "Barbarian", group: "Fantasy" },
  { value: "BARD", label: "Bard", group: "Fantasy" },
  { value: "CLERIC", label: "Cleric", group: "Fantasy" },
  { value: "FIGHTER", label: "Fighter", group: "Fantasy" },
  { value: "MAGE", label: "Mage", group: "Fantasy" },
  { value: "PALADIN", label: "Paladin", group: "Fantasy" },
  { value: "RANGER", label: "Ranger", group: "Fantasy" },
  { value: "ROGUE", label: "Rogue", group: "Fantasy" },

  { value: "BARTENDER", label: "Bartender", group: "Modern" },
  { value: "BOUNCER", label: "Bouncer", group: "Modern" },
  { value: "CEO", label: "CEO", group: "Modern" },
  { value: "DANCER", label: "Dancer", group: "Modern" },
  { value: "DETECTIVE", label: "Detective", group: "Modern" },
  { value: "DOCTOR", label: "Doctor", group: "Modern" },
  { value: "ENGINEER", label: "Engineer", group: "Modern" },
  { value: "JOURNALIST", label: "Journalist", group: "Modern" },
  { value: "LAWYER", label: "Lawyer", group: "Modern" },
  { value: "PROFESSOR", label: "Professor", group: "Modern" },
  { value: "SCIENTIST", label: "Scientist", group: "Modern" },
  { value: "SECURITY", label: "Security", group: "Modern" },

  { value: "ANDROID", label: "Android", group: "Sci-Fi" },
  { value: "BOUNTY_HUNTER", label: "Bounty Hunter", group: "Sci-Fi" },
  { value: "CYBORG", label: "Cyborg", group: "Sci-Fi" },
  { value: "HACKER", label: "Hacker", group: "Sci-Fi" },
  { value: "PILOT", label: "Pilot", group: "Sci-Fi" },
  { value: "SMUGGLER", label: "Smuggler", group: "Sci-Fi" },
  { value: "SPACE_MARINE", label: "Space Marine", group: "Sci-Fi" },
  { value: "TECHNOMANCER", label: "Technomancer", group: "Sci-Fi" },
];

const speechStyleOptions = [
  {
    value: "DIRECT",
    label: "Direct",
    description: "Clear, efficient, and straightforward.",
  },
  {
    value: "FORMAL",
    label: "Formal",
    description: "Polished, proper, carefully worded.",
  },
  {
    value: "CASUAL",
    label: "Casual",
    description: "Relaxed, conversational, natural.",
  },
  {
    value: "POETIC",
    label: "Poetic",
    description: "Expressive, metaphorical, emotionally rich.",
  },
  {
    value: "SARCASTIC",
    label: "Sarcastic",
    description: "Dry, teasing, ironic, biting.",
  },
  {
    value: "SOFT_SPOKEN",
    label: "Soft-Spoken",
    description: "Quiet, restrained, gentle.",
  },
  {
    value: "COMMANDING",
    label: "Commanding",
    description: "Authoritative, forceful, expects attention.",
  },
  {
    value: "PLAYFUL",
    label: "Playful",
    description: "Energetic, teasing, lively.",
  },
  {
    value: "CRYPTIC",
    label: "Cryptic",
    description: "Mysterious, indirect, layered.",
  },
  {
    value: "ACADEMIC",
    label: "Academic",
    description: "Precise, analytical, intellectual.",
  },
  {
    value: "BLUNT",
    label: "Blunt",
    description: "Harshly honest, unfiltered, abrupt.",
  },
  {
    value: "MELODIC",
    label: "Melodic",
    description: "Smooth, musical, flowing.",
  },
  {
    value: "CUSTOM",
    label: "Custom",
    description: "Write your own speech style.",
  },
];

const movementStyleOptions = [
  {
    value: "GRACEFUL",
    label: "Graceful",
    description: "Elegant, smooth, controlled.",
  },
  {
    value: "PREDATORY",
    label: "Predatory",
    description: "Focused, stalking, dangerous.",
  },
  {
    value: "RELAXED",
    label: "Relaxed",
    description: "Loose, comfortable, easygoing.",
  },
  {
    value: "ENERGETIC",
    label: "Energetic",
    description: "Fast, expressive, restless.",
  },
  {
    value: "PRECISE",
    label: "Precise",
    description: "Measured, efficient, deliberate.",
  },
  {
    value: "HEAVY",
    label: "Heavy",
    description: "Weighty, forceful, grounded.",
  },
  {
    value: "NERVOUS",
    label: "Nervous",
    description: "Fidgety, uncertain, tense.",
  },
  {
    value: "ELEGANT",
    label: "Elegant",
    description: "Refined, polished, poised.",
  },
  {
    value: "STEALTHY",
    label: "Stealthy",
    description: "Quiet, subtle, hard to notice.",
  },
  {
    value: "EXPLOSIVE",
    label: "Explosive",
    description: "Sudden, forceful, aggressive.",
  },
  {
    value: "MEASURED",
    label: "Measured",
    description: "Controlled, restrained, disciplined.",
  },
  {
    value: "RESTLESS",
    label: "Restless",
    description: "Always shifting, pacing, moving.",
  },
  {
    value: "CATLIKE_PHYSICALITY",
    label: "Catlike Physicality",
    description:
      "Alert, expressive physical behavior shaped by feline curiosity, balance, poised stillness, sudden motion, and chosen proximity.",
  },
  {
    value: "CUSTOM",
    label: "Custom",
    description: "Write your own movement style.",
  },
];

const interestOptions = [
  {
    value: "ADVENTURE",
    label: "Adventure",
    description: "Exploration, risk, discovery.",
  },
  {
    value: "ART",
    label: "Art",
    description: "Beauty, creativity, aesthetics.",
  },
  {
    value: "POWER",
    label: "Power",
    description: "Influence, control, ambition.",
  },
  {
    value: "KNOWLEDGE",
    label: "Knowledge",
    description: "Learning, secrets, understanding.",
  },
  {
    value: "ROMANCE",
    label: "Romance",
    description: "Love, intimacy, emotional bonds.",
  },
  {
    value: "JUSTICE",
    label: "Justice",
    description: "Fairness, law, moral action.",
  },
  {
    value: "WEALTH",
    label: "Wealth",
    description: "Money, status, luxury.",
  },
  {
    value: "FREEDOM",
    label: "Freedom",
    description: "Independence, rebellion, escape.",
  },
  {
    value: "MUSIC",
    label: "Music",
    description: "Performance, rhythm, sound.",
  },
  {
    value: "CRAFTING",
    label: "Crafting",
    description: "Building, tinkering, making.",
  },
  {
    value: "COMBAT",
    label: "Combat",
    description: "Battle, strength, competition.",
  },
  {
    value: "MYSTERY",
    label: "Mystery",
    description: "Secrets, puzzles, investigation.",
  },
  {
    value: "NATURE",
    label: "Nature",
    description: "Wildlife, forests, wilderness.",
  },
  {
    value: "TECHNOLOGY",
    label: "Technology",
    description: "Machines, systems, innovation.",
  },
  {
    value: "POLITICS",
    label: "Politics",
    description: "Leadership, influence, strategy.",
  },
  {
    value: "CUSTOM",
    label: "Custom",
    description: "Write your own interests.",
  },
];

const bodyTypeOptions = [
  { value: "", label: "Not chosen", description: "Leave body type undefined." },
  { value: "SLIM", label: "Slim", description: "Narrow, light, slender silhouette." },
  { value: "ATHLETIC", label: "Athletic", description: "Fit, active, capable build." },
  { value: "CURVY", label: "Curvy", description: "Soft, rounded, pronounced curves." },
  { value: "MUSCULAR", label: "Muscular", description: "Strong, visibly powerful physique." },
  { value: "HEAVYSET", label: "Heavyset", description: "Larger, heavier physical presence." },
  { value: "LITHE", label: "Lithe", description: "Flexible, agile, graceful body line." },
  { value: "LEAN", label: "Lean", description: "Trim, wiry, low-bulk physique." },
  { value: "STOCKY", label: "Stocky", description: "Compact, sturdy, solid frame." },
  { value: "CUSTOM", label: "Custom", description: "Write your own body type." },
];

const heightOptions = [
  { value: "", label: "Not chosen", description: "Leave height undefined." },
  { value: "SHORT", label: "Short", description: "Below average adult height." },
  { value: "AVERAGE", label: "Average", description: "Typical adult height." },
  { value: "ABOVE_AVERAGE", label: "Above Average", description: "Somewhat taller than average." },
  { value: "TALL", label: "Tall", description: "Clearly tall adult silhouette." },
  { value: "VERY_TALL", label: "Very Tall", description: "Strikingly tall adult silhouette." },
  { value: "CUSTOM", label: "Custom", description: "Write your own height descriptor." },
];

const buildOptions = [
  { value: "", label: "Not chosen", description: "Leave build undefined." },
  { value: "DELICATE", label: "Delicate", description: "Fine-boned, light, fragile-looking." },
  { value: "BALANCED", label: "Balanced", description: "Proportional and neutral." },
  { value: "BROAD", label: "Broad", description: "Wide shoulders or broad frame." },
  { value: "POWERFUL", label: "Powerful", description: "Strong, imposing, forceful build." },
  { value: "GRACEFUL", label: "Graceful", description: "Elegant, poised, flowing physicality." },
  { value: "COMPACT", label: "Compact", description: "Shorter, dense, efficient frame." },
  { value: "TOWERING", label: "Towering", description: "Large, imposing vertical presence." },
];

const proportionOptions = [
  {
    value: "",
    label: "Not chosen",
    description: "Leave proportions undefined.",
    exclusive: true,
  },
  {
    value: "BALANCED",
    label: "Balanced",
    description: "Neutral, proportional silhouette.",
    exclusive: true,
  },
  {
    value: "BROAD_SHOULDERS",
    label: "Broad Shoulders",
    description: "Shoulder-dominant frame.",
  },
  {
    value: "NARROW_WAIST",
    label: "Narrow Waist",
    description: "Defined waist emphasis.",
  },
  {
    value: "WIDE_HIPS",
    label: "Wide Hips",
    description: "Hip-emphasized silhouette.",
  },
  {
    value: "FULL_CHEST_BUST",
    label: "Full Chest / Bust",
    description: "Chest or bust-emphasized silhouette.",
  },
  {
    value: "STRAIGHT_FRAME",
    label: "Straight Frame",
    description: "Less curve, straighter silhouette.",
  },
  {
    value: "CUSTOM",
    label: "Custom",
    description: "Write custom proportions.",
  },
];

const visualHeritageReferenceOptions = [
  {
    value: "",
    label: "Unspecified",
    description:
      "Do not add an ethnic appearance cue. You can describe it manually elsewhere if needed.",
  },
  {
    value: "WHITE_EUROPEAN",
    label: "White / European",
    description: "Use a white or broadly European visual appearance.",
  },
  {
    value: "BLACK_AFRICAN",
    label: "Black / African",
    description: "Use a Black or broadly African visual appearance.",
  },
  {
    value: "CHINESE",
    label: "Chinese",
    description: "Use a Chinese visual appearance.",
  },
  {
    value: "JAPANESE",
    label: "Japanese",
    description: "Use a Japanese visual appearance.",
  },
  {
    value: "KOREAN",
    label: "Korean",
    description: "Use a Korean visual appearance.",
  },
  {
    value: "SOUTH_ASIAN",
    label: "South Asian",
    description:
      "Use a broadly South Asian visual appearance, such as Indian, Pakistani, Bangladeshi, Nepali, or Sri Lankan.",
  },
  {
    value: "SOUTHEAST_ASIAN",
    label: "Southeast Asian",
    description:
      "Use a broadly Southeast Asian visual appearance, such as Filipino, Vietnamese, Thai, Indonesian, Malay, or Cambodian.",
  },
  {
    value: "MIDDLE_EASTERN",
    label: "Middle Eastern",
    description: "Use a broadly Middle Eastern visual appearance.",
  },
  {
    value: "NORTH_AFRICAN",
    label: "North African",
    description: "Use a broadly North African visual appearance.",
  },
  {
    value: "INDIGENOUS_AMERICAS",
    label: "Native American / Indigenous Americas",
    description:
      "Use a Native American or Indigenous Americas visual appearance.",
  },
  {
    value: "PACIFIC_ISLANDER",
    label: "Pacific Islander",
    description:
      "Use a broadly Pacific Islander visual appearance.",
  },
  {
    value: "LATINO_HISPANIC",
    label: "Latino / Hispanic",
    description: "Use a broadly Latino or Hispanic visual appearance.",
  },
  {
    value: "MIXED_MULTIRACIAL",
    label: "Mixed / Multiracial",
    description: "Use a visibly mixed or multiracial visual appearance.",
  },
];



const kibbeIdentityOptions = [
  {
    value: "",
    label: "Not chosen",
    description:
      "Do not use a Kibbe-inspired silhouette identity or apply any body-trait suggestions.",
    suggestions: {
      body_type: "",
      build: "",
      height: "",
      proportions: [],
    },
  },
  {
    value: "DRAMATIC",
    label: "Dramatic",
    description:
      "Long, sleek, and sharply defined visual lines with a strong vertical impression.",
    suggestions: {
      body_type: "LEAN",
      build: "GRACEFUL",
      height: "TALL",
      proportions: ["STRAIGHT_FRAME"],
    },
  },
  {
    value: "SOFT_DRAMATIC",
    label: "Soft Dramatic",
    description:
      "A strong vertical silhouette softened by prominent curves and an elegant, commanding presence.",
    suggestions: {
      body_type: "CURVY",
      build: "POWERFUL",
      height: "TALL",
      proportions: ["NARROW_WAIST", "FULL_CHEST_BUST", "WIDE_HIPS"],
    },
  },
  {
    value: "FLAMBOYANT_NATURAL",
    label: "Flamboyant Natural",
    description:
      "An elongated, broad, open silhouette with relaxed strength and athletic ease.",
    suggestions: {
      body_type: "ATHLETIC",
      build: "BROAD",
      height: "TALL",
      proportions: ["BROAD_SHOULDERS", "STRAIGHT_FRAME"],
    },
  },
  {
    value: "SOFT_NATURAL",
    label: "Soft Natural",
    description:
      "A softly curved silhouette with visible width, relaxed shaping, and an approachable physical presence.",
    suggestions: {
      body_type: "CURVY",
      build: "BROAD",
      height: "AVERAGE",
      proportions: ["BROAD_SHOULDERS", "NARROW_WAIST", "WIDE_HIPS"],
    },
  },
  {
    value: "DRAMATIC_CLASSIC",
    label: "Dramatic Classic",
    description:
      "Balanced proportions with a controlled vertical line and subtle sharpness.",
    suggestions: {
      body_type: "SLIM",
      build: "BALANCED",
      height: "ABOVE_AVERAGE",
      proportions: ["STRAIGHT_FRAME"],
    },
  },
  {
    value: "SOFT_CLASSIC",
    label: "Soft Classic",
    description:
      "Balanced, symmetrical visual lines softened by gentle curves and refined moderation.",
    suggestions: {
      body_type: "CURVY",
      build: "BALANCED",
      height: "AVERAGE",
      proportions: ["BALANCED"],
    },
  },
  {
    value: "FLAMBOYANT_GAMINE",
    label: "Flamboyant Gamine",
    description:
      "A compact, angular silhouette with energetic contrast and crisp, broken visual lines.",
    suggestions: {
      body_type: "LEAN",
      build: "COMPACT",
      height: "SHORT",
      proportions: ["BROAD_SHOULDERS", "STRAIGHT_FRAME"],
    },
  },
  {
    value: "SOFT_GAMINE",
    label: "Soft Gamine",
    description:
      "A compact adult silhouette combining lively crispness with rounded, softly defined curves.",
    suggestions: {
      body_type: "CURVY",
      build: "COMPACT",
      height: "SHORT",
      proportions: ["NARROW_WAIST", "FULL_CHEST_BUST", "WIDE_HIPS"],
    },
  },
  {
    value: "THEATRICAL_ROMANTIC",
    label: "Theatrical Romantic",
    description:
      "A delicate, curve-led silhouette with a defined waist and refined sharp accents.",
    suggestions: {
      body_type: "CURVY",
      build: "DELICATE",
      height: "SHORT",
      proportions: ["NARROW_WAIST", "FULL_CHEST_BUST", "WIDE_HIPS"],
    },
  },
  {
    value: "ROMANTIC",
    label: "Romantic",
    description:
      "A softly rounded, curve-led silhouette with gentle shaping and continuous visual flow.",
    suggestions: {
      body_type: "CURVY",
      build: "GRACEFUL",
      height: "AVERAGE",
      proportions: ["NARROW_WAIST", "FULL_CHEST_BUST", "WIDE_HIPS"],
    },
  },
];



const mbtiTypeOptions = [
  {
    value: "",
    label: "Not chosen",
    description:
      "Do not use an MBTI-style archetype as supplemental personality flavor.",
  },
  {
    value: "ISTJ",
    label: "ISTJ",
    description:
      "Practical, orderly, responsible, and inclined to trust proven methods.",
  },
  {
    value: "ISFJ",
    label: "ISFJ",
    description:
      "Considerate, dutiful, observant, and protective of people and traditions.",
  },
  {
    value: "INFJ",
    label: "INFJ",
    description:
      "Insightful, idealistic, private, and strongly guided by personal values.",
  },
  {
    value: "INTJ",
    label: "INTJ",
    description:
      "Strategic, independent, analytical, and inclined to plan several steps ahead.",
  },
  {
    value: "ISTP",
    label: "ISTP",
    description:
      "Calm, adaptable, hands-on, and likely to solve problems through direct action.",
  },
  {
    value: "ISFP",
    label: "ISFP",
    description:
      "Gentle, flexible, observant, and protective of personal authenticity.",
  },
  {
    value: "INFP",
    label: "INFP",
    description:
      "Imaginative, empathetic, idealistic, and deeply attached to inner values.",
  },
  {
    value: "INTP",
    label: "INTP",
    description:
      "Curious, conceptual, independent, and inclined to test ideas through logic.",
  },
  {
    value: "ESTP",
    label: "ESTP",
    description:
      "Bold, pragmatic, quick-reacting, and energized by immediate action.",
  },
  {
    value: "ESFP",
    label: "ESFP",
    description:
      "Expressive, sociable, spontaneous, and attentive to the present moment.",
  },
  {
    value: "ENFP",
    label: "ENFP",
    description:
      "Enthusiastic, imaginative, people-focused, and drawn toward new possibilities.",
  },
  {
    value: "ENTP",
    label: "ENTP",
    description:
      "Inventive, questioning, verbally agile, and eager to reframe problems.",
  },
  {
    value: "ESTJ",
    label: "ESTJ",
    description:
      "Decisive, organized, practical, and comfortable directing coordinated action.",
  },
  {
    value: "ESFJ",
    label: "ESFJ",
    description:
      "Warm, cooperative, attentive to social needs, and respectful of shared customs.",
  },
  {
    value: "ENFJ",
    label: "ENFJ",
    description:
      "Charismatic, empathetic, organized, and naturally inclined to motivate others.",
  },
  {
    value: "ENTJ",
    label: "ENTJ",
    description:
      "Assertive, strategic, goal-driven, and comfortable taking command.",
  },
];

const westernZodiacOptions = [
  {
    value: "",
    label: "Not chosen",
    description:
      "Do not use a Western zodiac archetype as supplemental personality flavor.",
  },
  {
    value: "ARIES",
    label: "Aries",
    description: "Direct, energetic, competitive, and action-oriented.",
  },
  {
    value: "TAURUS",
    label: "Taurus",
    description:
      "Steady, patient, loyal, comfort-seeking, and resistant to abrupt change.",
  },
  {
    value: "GEMINI",
    label: "Gemini",
    description: "Curious, adaptable, social, quick-witted, and easily restless.",
  },
  {
    value: "CANCER",
    label: "Cancer",
    description:
      "Protective, intuitive, sentimental, and strongly motivated by security.",
  },
  {
    value: "LEO",
    label: "Leo",
    description: "Confident, expressive, generous, proud, and eager to be recognized.",
  },
  {
    value: "VIRGO",
    label: "Virgo",
    description:
      "Observant, practical, analytical, detail-conscious, and service-oriented.",
  },
  {
    value: "LIBRA",
    label: "Libra",
    description:
      "Diplomatic, social, fairness-minded, and motivated to preserve harmony.",
  },
  {
    value: "SCORPIO",
    label: "Scorpio",
    description: "Private, intense, perceptive, loyal, and slow to lower defenses.",
  },
  {
    value: "SAGITTARIUS",
    label: "Sagittarius",
    description:
      "Adventurous, candid, optimistic, curious, and protective of personal freedom.",
  },
  {
    value: "CAPRICORN",
    label: "Capricorn",
    description:
      "Disciplined, ambitious, reserved, patient, and focused on long-term results.",
  },
  {
    value: "AQUARIUS",
    label: "Aquarius",
    description:
      "Independent, unconventional, idealistic, inventive, and sometimes detached.",
  },
  {
    value: "PISCES",
    label: "Pisces",
    description:
      "Empathetic, imaginative, intuitive, emotionally receptive, and dream-oriented.",
  },
];

const eastAsianZodiacOptions = [
  {
    value: "",
    label: "Not chosen",
    description:
      "Do not use an East Asian zodiac animal as supplemental personality flavor.",
  },
  {
    value: "RAT",
    label: "Rat",
    description: "Resourceful, observant, adaptable, socially aware, and strategic.",
  },
  {
    value: "OX",
    label: "Ox",
    description: "Patient, dependable, persistent, grounded, and slow to abandon a duty.",
  },
  {
    value: "TIGER",
    label: "Tiger",
    description: "Bold, competitive, protective, instinctive, and willing to take risks.",
  },
  {
    value: "RABBIT",
    label: "Rabbit",
    description: "Diplomatic, sensitive, cautious, refined, and harmony-seeking.",
  },
  {
    value: "DRAGON",
    label: "Dragon",
    description: "Confident, ambitious, charismatic, energetic, and protective of pride.",
  },
  {
    value: "SNAKE",
    label: "Snake",
    description: "Perceptive, private, composed, deliberate, and strategically patient.",
  },
  {
    value: "HORSE",
    label: "Horse",
    description: "Energetic, independent, sociable, adventurous, and freedom-seeking.",
  },
  {
    value: "GOAT",
    label: "Goat / Sheep",
    description: "Gentle, creative, compassionate, sensitive, and drawn toward harmony.",
  },
  {
    value: "MONKEY",
    label: "Monkey",
    description: "Clever, curious, playful, inventive, and quick to exploit opportunity.",
  },
  {
    value: "ROOSTER",
    label: "Rooster",
    description: "Precise, outspoken, organized, observant, and self-assured.",
  },
  {
    value: "DOG",
    label: "Dog",
    description: "Loyal, honest, protective, justice-minded, and cautious with trust.",
  },
  {
    value: "PIG",
    label: "Pig",
    description: "Generous, sincere, warm, pleasure-loving, and inclined to trust others.",
  },
];

export {
  CUSTOM_APPEARANCE_VALUE_MAX_LENGTH,
  CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
  speciesOptions,
  genderPresentationOptions,
  roleArchetypeOptions,
  speechStyleOptions,
  movementStyleOptions,
  interestOptions,
  kibbeIdentityOptions,
  mbtiTypeOptions,
  westernZodiacOptions,
  eastAsianZodiacOptions,
  bodyTypeOptions,
  heightOptions,
  buildOptions,
  proportionOptions,
  visualHeritageReferenceOptions,
};