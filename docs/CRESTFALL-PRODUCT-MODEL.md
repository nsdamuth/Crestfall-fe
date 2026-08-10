# Crestfall product model

Canonical definition of what Crestfall is made of and what each
destination is for. Ruled 4 Aug 2026. Supersedes the product model
section of CRESTFALL-DESIGN-CONTEXT.md and the product model section
of PROJECT-INSTRUCTIONS.md.

## The unit ladder

**Assets** are the pieces: characters, player characters, locations,
outfits, scenarios, and lore. Everything starts private.

**A Story** gathers assets into a chat you can play. It is the
playable unit.

**An Adventure** links several Stories into one continuing chat.
Completing a node either chains straight to the next Story or returns
the player to open-world play until an authored trigger makes the
next node available. Cast, world state, and memory stay continuous
across the whole Adventure.

A Story is an episode. An Adventure is a season.

## The three sections

### Play

**Home** is the guidepost. Newest story updates from every section,
new releases, and direct routes into play, create, and explore.

**Stories** is where you play. It holds the Stories you can start and
the ones you are already in.

**Adventures** is where linked Stories live, both the ones you play
and the ones you build.

### Create

**Studio** is where you make assets and Stories and where you submit
work for public release.

**Images** is where you create and browse your images.

**Vault** is where you manage everything you have made: assets,
Stories, and Adventures.

### Explore

**Community** holds public assets, Stories, and Adventures you can
play and remix.

**Creators** holds creator profiles, leaderboards, and discovery.
Browse top work, follow the people making it.

**Lore** is where you write and read published Lorebooks, the
backstories behind characters and worlds. Submit a Lorebook for
public release. Accepted Lore feeds deeper backstory into Stories and
makes characters richer.

## Visibility

One four-state enum, everywhere, on assets, Stories, and Adventures.

**Private.** Only you. Everything starts here.

**Internal.** You share a link and other people can play it. It
cannot be remixed, it does not appear in Community, and it is not
searchable. Internal is the feedback state.

**Public.** Anyone can play it, anyone can remix it, and it appears
in Community and in search.

**Canon.** Submitted to the official Crestfall Chronicles canon and
accepted. Canon work carries its own label. Canon is the only badge
that is gold.

## Editing and approval

Public work cannot be edited in place. To change something that is
public, pull a private copy, edit that copy, and submit again. Every
return to public goes through approval. This is why Internal exists:
it is how you get feedback without spending an approval cycle.

Canon is final. Submitting to Canon signs the work over to Crestfall
and it becomes part of the official story. You get the badge and the
credit, and you give up the character. Canon work is never edited
again by its creator.

## Retired words

Arc, Codex, and Sessions never appear in copy or briefs. Storyline is
retired from copy the moment the Adventure rename lands in code.

## Naming gaps owed by Nick, not the design side

The repo does not yet match this model. Three renames are owed before
launch and the restyle does not touch any of them.

1. The playable unit is named Room Template in code. It is a Story.
2. Storyline in code is an Adventure.
3. Adventure exists in code as a Scenario category value. That value
   is something else and needs a different name.

## Open

Where an in-progress chat appears now that Sessions is retired, and
what it is called on screen. Not ruled.

Ruled 9 Aug 2026: Characters are directly playable in chat, the same
as Stories and Adventures.
