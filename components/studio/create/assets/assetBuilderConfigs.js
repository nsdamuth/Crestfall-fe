export const assetBuilderConfigs = {
  pose: {
    eyebrow: "Visual Asset",
    creationType: "POSE",
    title: "Create Pose",
    description:
      "Create a reusable pose with structured body geometry, motion/staging semantics, and focused image-generation guidance.",
    typeLabel: "Pose",
    promptLabel: "Pose Guidance",
    promptPlaceholder:
      "Describe the pose geometry and staging. You can also build guidance from the structured Pose fields.",
    extraFields: [],
  },

  outfit: {
    eyebrow: "Visual Asset",
     creationType: "OUTFIT",
    title: "Create Outfit / Clothing",
    description:
      "Create reusable clothing, armor, uniforms, costumes, and outfit presets for characters.",
    typeLabel: "Outfit",
    promptLabel: "Outfit Guidance",
    promptPlaceholder:
      "Describe garments, materials, color palette, texture, accessories, armor, coverage, and style.",
    extraFields: [
      {
        id: "category",
        label: "Category",
        options: [
          { value: "", label: "Not chosen" },
          { value: "CASUAL", label: "Casual" },
          { value: "FORMAL", label: "Formal" },
          { value: "ARMOR", label: "Armor" },
          { value: "UNIFORM", label: "Uniform" },
          { value: "CEREMONIAL", label: "Ceremonial" },
          { value: "FANTASY", label: "Fantasy" },
        ],
      },
      {
        id: "coverage",
        label: "Coverage",
        options: [
          { value: "", label: "Not chosen" },
          { value: "FULL", label: "Full Coverage" },
          { value: "MODERATE", label: "Moderate" },
          { value: "STYLIZED", label: "Stylized" },
          { value: "MATURE", label: "Mature" },
        ],
      },
    ],
  },

  location: {
    eyebrow: "World Space",
    creationType: "LOCATION",
    title: "Create Location / Scene",
    description:
      "Create a place that can be used in stories, image prompts, rooms, and canon submissions.",
    typeLabel: "Location",
    promptLabel: "Location Guidance",
    promptPlaceholder:
      "Describe the place, mood, lighting, time, weather, architecture, atmosphere, and story use.",
    extraFields: [
      {
        id: "space_type",
        label: "Space Type",
        options: [
          { value: "", label: "Not chosen" },
          { value: "INTERIOR", label: "Interior" },
          { value: "EXTERIOR", label: "Exterior" },
          { value: "CITY", label: "City" },
          { value: "WILDERNESS", label: "Wilderness" },
          { value: "RUIN", label: "Ruin" },
          { value: "DREAMLIKE", label: "Dreamlike" },
        ],
      },
      {
        id: "locationScale",
        label: "Location Scale",
        options: [
          { value: "", label: "Not chosen" },
          { value: "REALM", label: "Realm / Plane" },
          { value: "PLANET", label: "Planet" },
          { value: "CONTINENT", label: "Continent" },
          { value: "REGION", label: "Region" },
          { value: "KINGDOM", label: "Kingdom / Nation" },
          { value: "CITY", label: "City" },
          { value: "DISTRICT", label: "District" },
          { value: "NEIGHBORHOOD", label: "Neighborhood" },
          { value: "BUILDING", label: "Building" },
          { value: "ROOM", label: "Room" },
          { value: "LANDMARK", label: "Landmark" },
          { value: "WILDERNESS", label: "Wilderness" },
          { value: "DUNGEON", label: "Dungeon" },
          { value: "POCKET_DIMENSION", label: "Pocket Dimension" },
          { value: "OTHER", label: "Other" },
        ],
      },
      {
        id: "mood",
        label: "Mood",
        options: [
          { value: "", label: "Not chosen" },
          { value: "PEACEFUL", label: "Peaceful" },
          { value: "DANGEROUS", label: "Dangerous" },
          { value: "MYSTERIOUS", label: "Mysterious" },
          { value: "LUXURIOUS", label: "Luxurious" },
          { value: "CORPORATE", label: "Corporate" },
          { value: "ANCIENT", label: "Ancient" },
        ],
      },
    ],
  },

  imagePreset: {
    eyebrow: "Generation Tool",
    creationType: "IMAGE_PRESET",
    title: "Create Image Preset",
    description:
      "Create reusable image-generation presets for style, mood, framing, and visual consistency.",
    typeLabel: "Image Preset",
    promptLabel: "Preset Guidance",
    promptPlaceholder:
      "Describe the rendering style, visual treatment, mood, prompt behavior, and reusable generation rules.",
    extraFields: [
      {
        id: "preset_family",
        label: "Preset Family",
        options: [
          { value: "", label: "Not chosen" },
          { value: "ANIME", label: "Anime" },
          { value: "REALISTIC", label: "Realistic" },
          { value: "PAINTERLY", label: "Painterly" },
          { value: "CINEMATIC", label: "Cinematic" },
          { value: "NOIR", label: "Noir" },
          { value: "CUSTOM", label: "Custom" },
        ],
      },
      {
        id: "default_aspect",
        label: "Default Aspect",
        options: [
          { value: "", label: "Not chosen" },
          { value: "PORTRAIT", label: "Portrait" },
          { value: "SQUARE", label: "Square" },
          { value: "LANDSCAPE", label: "Landscape" },
        ],
      },
    ],
  },
};