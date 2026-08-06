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

| Field | Exposed / collapsed | Control |
|---|---|---|
| kibbe_identity | exposed, primary | tile grid |
| body_type | collapsed, "Fine-tune the body" fold | chip row |
| height | collapsed, same fold | chip row |
| build | collapsed, same fold | chip row |
| proportions | collapsed, same fold | chip row |
| chest_bust | collapsed, same fold | inline dropdown |
| hips_waist_shoulders | collapsed, same fold | inline dropdown |
| body_notes | collapsed, same fold | freeform text area |
| clothing_style | exposed | chip row |
| default_clothing_mode | exposed | inline dropdown |
| default_outfit_id | exposed, via picker | tile grid ("Choose an outfit") |
| default_outfit_title | exposed, via picker | set by the outfit tile chosen |
| default_outfit_description | exposed, via picker | set by the outfit tile chosen |
| default_outfit_image_url | exposed, via picker | set by the outfit tile chosen |
| default_outfit_content_rating | exposed, via picker | set by the outfit tile chosen |
| default_wardrobe_id | exposed, via picker | tile grid ("Choose a wardrobe") |
| default_wardrobe_title | exposed, via picker | set by the wardrobe tile chosen |
| default_wardrobe_description | exposed, via picker | set by the wardrobe tile chosen |
| default_wardrobe_image_url | exposed, via picker | set by the wardrobe tile chosen |
| default_wardrobe_content_rating | exposed, via picker | set by the wardrobe tile chosen |
| appearance_notes | collapsed, "Fine-tune the body" fold | freeform text area |

## The heart (commit 7)

| Field | Exposed / collapsed | Control |
|---|---|---|
| outward_personality | exposed | freeform text area |
| internal_personality | exposed | freeform text area |
| speech_style | exposed | inline dropdown |
| greeting | exposed | freeform text area |
| scenario | exposed | freeform text area |
| backstory | exposed | freeform text area |
| verbosity_level | collapsed, "Advanced" fold | chip row |
| philosophy | collapsed, same fold | freeform text area |
| interests | collapsed, same fold | chip row |
| relationship_to_player | collapsed, same fold | inline dropdown |
| voice_module_ids | collapsed, same fold | multi-select list |
| personality_notes | collapsed, same fold | freeform text area |

## The seal (commit 8)

| Field | Exposed / collapsed | Control |
|---|---|---|
| visibility | exposed | chip row |
| content_rating | exposed | chip row |
| age | exposed | number field |
| character_color_palette_id | collapsed, "Rendering" fold | swatch grid |

## The payoff (commit 9)

| Field | Exposed / collapsed | Control |
|---|---|---|
| (live preview, not a form field) | exposed, primary | rendered preview, only here |
| creator_directives | collapsed, "Advanced directives" fold | freeform text area |
| extra_runtime_notes | collapsed, same fold | freeform text area |

## Totals

Name 2, kind 8, face 5, silhouette 21, heart 12, seal 4, payoff 2 (plus the
live preview, not a field) = 54 fields placed, none cut, none in an eighth
stop.
