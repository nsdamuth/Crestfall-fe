# Creator stops field allocation, all 54 fields

Source of truth: `components/studio/create/character/constants/form.js` (53 keys)
plus `voice_module_ids` (read/written in the live app's BehaviorStep, not
initialized in the same file). 54 total, nothing cut.

Sixteen fields have no natural subject in any of the seven stops. Twelve of
those are the clothing, outfit, and wardrobe fields, ruled into The
silhouette. The other four are freeform meta notes with no single subject
(appearance notes, personality notes, extra runtime notes, creator
directives); each is placed in the stop closest to its subject and folded
into an advanced section there.

Correction against an earlier pass of this table: `short_concept` was
first assumed to be a one-line tagline and placed in The name. Reading the
live app's IdentityStep.jsx shows it is actually bound to
`roleArchetypeOptions`, a grouped Fantasy / Modern / Sci-Fi role-archetype
picker with no separate custom-value field, so a raw custom string
overwrites the field directly. Moved to The kind below, where it belongs
by subject. The name stop is unchanged from commit 2.

## The name (built, commit 2, unchanged)

| Field | Exposed / collapsed | Control |
|---|---|---|
| name | exposed | text field |
| title | exposed | text field |

## The kind (commit 5)

Nominal identity classifiers, no visual character to compare, so this stop
is dropdowns and chips, never tiles.

| Field | Exposed / collapsed | Control |
|---|---|---|
| species | exposed | inline dropdown |
| custom_species | exposed, shown when species is custom | text field |
| gender_presentation | exposed | inline dropdown |
| custom_gender_presentation | exposed, shown when gender is custom | text field |
| short_concept | exposed | inline dropdown (role archetype), switches to a text field in custom mode |
| mbti_type | collapsed, "Typing and zodiac" fold | inline dropdown |
| western_zodiac_sign | collapsed, same fold | inline dropdown |
| east_asian_zodiac_sign | collapsed, same fold | inline dropdown |

## The face (built, commit 3)

| Field | Exposed / collapsed | Control |
|---|---|---|
| skin_tone | exposed | swatch grid |
| eye_color | exposed | swatch grid |
| hair_color | exposed | swatch grid |
| hair_style | exposed | chip row (inside "More hair" fold) |
| visual_heritage_reference | exposed | inline dropdown ("Ethnic Appearance") |

Flag, not resolved by this table: the built face stop also presents
hair_length and hair_texture, which are not keys in the 53-field canonical
form. They trace to a separate legacy Hair modal's option set, not this
schema. Left as shipped; not part of the 54.

## The silhouette (commit 6)

Body fine-tuning has visual character and gets tiles or chips, never a
slider. Clothing, outfit, and wardrobe land here per the brief, since no
other stop has a home for them.

Two corrections against the live app, found while building this stop.
`useKibbePresetModalViewModel.js` shows `kibbe_identity` normally drives a
preset modal that offers to fill or replace `body_type`/`build`/`height`/
`proportions` from a suggestion table; that modal is exactly "the body
identity chooser" the brief's full-stop clause says not to build, so this
stop presents kibbe_identity as a plain tile choice with no auto-fill.
`useDefaultClothingSelectorViewModel.js` shows the outfit and wardrobe
fields are normally set as a group by searching and picking one existing
Outfit or Wardrobe creation in a modal; that search-and-pick modal is "the
wardrobe browser" the same clause excludes. Both fields still appear
below; neither gets the takeover that would normally populate them.

Also found there: `proportions` is stored as an array (several from a
bounded set), not the plain string form.js's default implies, and
`hips_waist_shoulders` is a legacy field the live app only ever clears
when proportions is set, never writes to directly. It is carried in this
stop's state and cleared alongside proportions, with no control of its
own, matching that behavior. `chest_bust` has no reader or writer anywhere
else in the live app; given no precedent, it gets a plain text field.

| Field | Exposed / collapsed | Control |
|---|---|---|
| kibbe_identity | exposed, primary | tile grid, no auto-fill |
| body_type | collapsed, "Fine-tune the body" fold | chip row |
| height | collapsed, same fold | chip row |
| build | collapsed, same fold | chip row |
| proportions | collapsed, same fold | multi-select chip row |
| chest_bust | collapsed, same fold | text field |
| hips_waist_shoulders | collapsed, same fold | none, cleared alongside proportions |
| body_notes | collapsed, same fold | freeform text area |
| clothing_style | exposed | text field |
| default_clothing_mode | exposed | inline dropdown (None / Outfit / Wardrobe) |
| default_outfit_id | exposed, empty-state stub | "Select outfit" stub, no picker built |
| default_outfit_title | exposed, empty-state stub | set only once a picker exists |
| default_outfit_description | exposed, empty-state stub | set only once a picker exists |
| default_outfit_image_url | exposed, empty-state stub | set only once a picker exists |
| default_outfit_content_rating | exposed, empty-state stub | set only once a picker exists |
| default_wardrobe_id | exposed, empty-state stub | "Select wardrobe" stub, no picker built |
| default_wardrobe_title | exposed, empty-state stub | set only once a picker exists |
| default_wardrobe_description | exposed, empty-state stub | set only once a picker exists |
| default_wardrobe_image_url | exposed, empty-state stub | set only once a picker exists |
| default_wardrobe_content_rating | exposed, empty-state stub | set only once a picker exists |
| appearance_notes | collapsed, "Fine-tune the body" fold | freeform text area |

## The heart (commit 7)

BehaviorStep.jsx, the live app's own equivalent step, corrects two guesses
from the first pass of this table: `interests` is a single choice via the
same TraitModal pattern as speech style and MBTI, not a multi-select
despite its plural name, and `verbosity_level` has five fixed values
(Terse through Highly verbose), not an open chip set. `voice_module_ids`
is confirmed to be a real multi-value field, set through
VoiceModulePickerModal, a search-and-pick modal over reusable voice
creations. That modal is not literally named in the brief's exclusion
list, but it is the same shape as the outfit and wardrobe browsers the
list does name, so it gets the same empty-state stub treatment rather
than an attempt to rebuild it. `relationship_to_player` has no dropdown
precedent anywhere in the live app, just a plain text value, so it stays
a text area rather than the dropdown the first pass of this table guessed.

Also noted, not acted on: BehaviorStep.jsx also reads and writes a
`movement_style` field, used across several other flows, but it is not a
key in constants/form.js's 53-field initialForm, so it falls outside the
54 fields this build is scoped to and is left alone.

| Field | Exposed / collapsed | Control |
|---|---|---|
| outward_personality | exposed | freeform text area |
| internal_personality | exposed | freeform text area |
| speech_style | exposed | inline dropdown |
| greeting | exposed | freeform text area |
| scenario | exposed | freeform text area |
| backstory | exposed | freeform text area |
| verbosity_level | collapsed, "Advanced" fold | inline dropdown, five fixed values |
| philosophy | collapsed, same fold | freeform text area |
| interests | collapsed, same fold | inline dropdown |
| relationship_to_player | collapsed, same fold | freeform text area |
| voice_module_ids | collapsed, same fold | empty-state stub, no picker built |
| personality_notes | collapsed, same fold | freeform text area |

## The seal (commit 8)

Flag, not resolved by this table: the chrome commit's stub copy for this
stop ("Visibility, rating, rendering, and an adult age") promises a
rendering control. The literal match is `rendering_style` (anime / photoreal
/ either), read by this same character flow's own review step, but it is
not a key in constants/form.js's 53-field initialForm, so like
movement_style it falls outside the 54 fields this build covers.
`character_color_palette_id` was the other candidate, but its own modal's
description states outright that it "does not affect image generation," it
only recolors chat presentation, so it is not a rendering control either.
It is still placed here, since visibility, rating, and presentation
settings share a subject and no other stop fits it better, but this stop's
own intro copy says "presentation" rather than "rendering" so it is not
promising something none of the 54 fields deliver. Whether to add
rendering_style as a fifty-fifth field is left for a future ruling.

| Field | Exposed / collapsed | Control |
|---|---|---|
| visibility | exposed | chip row |
| content_rating | exposed | chip row |
| age | exposed | number field, floor of 18 |
| character_color_palette_id | collapsed, "Presentation" fold | swatch grid |

## The payoff (commit 9)

The live preview reuses the app's own existing
`character-preview/CharacterPreview.view.jsx` and its viewmodel rather
than building a new one, since that pair is already presentation-only and
already reads exactly the identity fields this stop needs to summarize
(name, title, short_concept, species, gender_presentation, and their
custom values, clothing_style).

| Field | Exposed / collapsed | Control |
|---|---|---|
| (live preview, not a form field) | exposed, primary | rendered preview, only here |
| creator_directives | collapsed, "Advanced directives" fold | freeform text area |
| extra_runtime_notes | collapsed, same fold | freeform text area |

## Totals

Name 2, kind 8, face 5, silhouette 21, heart 12, seal 4, payoff 2 (plus the
live preview, not a field) = 54 fields placed, none cut, none in an eighth
stop.
