# Crestfall Product Model · UX/UI Design and Build Reference

* **Status:** Living document. Reissued 9 Aug 2026\. Supersedes all previous product models.  
* **Audience:** UX/UI planning and build agents, and the design authority. This is the reference for building the new page architecture under the updated design system.  
* **Companions:** CRESTFALL-CONTENT-STANDARDS.md (content rating and compliance), docs/RESTYLE-RULES.md (visual design tokens and law), docs/CONTRACT-REQUESTS.md (backend change requests), docs/LOOM-WORKFLOW-GUIDE.md (component architecture).

## How to use this document (read first)

This is a living document, not a frozen spec. Before planning or building against it, verify its assumptions against the live system: review the database schema, the services-api surface, and the current repository (read-only) and update this document to reflect every live feature it does not yet cover. Where this document and the live system disagree, investigate which is stale, propose the correction, and record it here. Every build sprint should leave this document more accurate than it found it.

---

## 1\. Terminology: presentation layer vs. data layer

The backend is not being renamed. The front end owns a presentation layer mapping: it reads the entities as built and displays the ruled names. Backend renames are deferred so they never block feature work; each mapping is documented as a contract request (CR) with full specs so the backend can be aligned later in one pass.

| Presentation name (user-facing) | Data layer entity (unchanged) | Notes |
| :---- | :---- | :---- |
| Story | Room Template | The single playable unit, one chat. |
| Adventure | Storyline | A series of linked Stories with continuous cast, world state, and memory. |
| Scenario | Scenario | The underlying narrative logic attached to a Story. |
| Narrator | Narrator | The orchestrator of narrative flow at runtime. |
| Character | Character | A playable or supporting persona. |
| Location | Location | A setting; supports hierarchy (regions containing places). |
| Outfit | Outfit | A single assembled look. |
| Wardrobe | Wardrobe | A Character's collection of Outfits. |
| Quest *(proposed alias, pending GO)* | Scenario category value "Adventure" | Display alias only, resolving the name collision with the Adventure unit. CR to be filed for a later backend rename, with build specs. |

Rules for the mapping:

* Display names appear in all UI copy, labels, empty states, and system messages. Data layer names never surface to users.  
* The mapping lives in one place in the front end (a single terminology map), never scattered as inline strings, so a later backend rename is a one-file change.  
* Retired words that appear in neither layer's UI copy: Arc, Codex, Sessions.

## 2\. Information architecture

Three sections, nine pages, one global navigation. The sidebar lists them in journey order:

* **Play:** Home, Stories, Adventures  
* **Create:** Studio, Images, Vault  
* **Explore:** Community, Creators, Lore

### The journey loop

Every page ends with the bottom promo banner component advancing the user to the next page in the loop:

Home → Stories → Adventures → Studio → Images → Vault → Community → Creators → Lore → Home.

## 3\. Shared component patterns

These patterns are built once and configured per page. They are the backbone of the new architecture.

### 3.1 Sticky filter bar (all seven list pages)

One component: search input, filter controls, sort control, pinned below the page head on scroll. Configured per section with the variables relevant to that page's entities. Examples of per-page configuration:

* Stories: type (Character / Story / Adventure), status (in progress / startable), visibility, rating tier, recency.  
* Community: entity type, rating tier, popularity, recency, remixable.  
* Creators: metric sorts (followers, plays, hearts) serving as the leaderboard, activity recency.  
* Images: linked asset, style mode, date.  
* Lore: approval state, world or faction, recency.

Local scope: the bar searches and filters the current page's list only.

### 3.2 Global search (site-wide)

A quick search available from the global chrome on every page. Typeahead behavior: as the user types, a dropdown presents the top five matches across the full site (assets, Stories, Adventures, creators, lore), each result clickable and routing directly to its destination. Full-query submit routes to the richest matching list page with the query applied. Global search complements, never replaces, the local sticky filter bar.

### 3.3 Bottom promo banner (all nine pages)

The ruled bottom banner treatment: full width at page end, uniform screen over artwork, content centered. Anatomy: eyebrow, title, description, CTA. Each page's banner sells the next page in the journey loop and its CTA routes there. Copy per banner follows the copy system; banner artwork follows tile art direction.

### 3.4 Load-more pagination (all list pages)

No infinite scroll. Lists render an initial batch, then a "show more" CTA that appends the next batch. The page footer, and therefore the journey banner, stays reachable at all times. This is a deliberate trade: reachable page end over uninterrupted scroll.

### 3.5 Modal dialogs

Quick creation and builders open as modals in the unified modal frame: close in place, never navigate, maximize the full screen vertically and horizontally at phone width with internal thumb scrolling (R4, 10 Aug 2026), center at 700px and up. Progressive disclosure for multi-step creation.

## 4\. Page specifications

Each page below states its purpose, primary layout, key components, and the user journey it serves. All list pages carry the sticky filter bar (3.1), load-more pagination (3.4), and the journey banner (3.3); those are not restated per page.

### Play

**4.1 Home.** Purpose: the guidepost. Layout: a dynamic feed aggregating from every other section, personalized to the account: continue-playing cards, new releases, community highlights, creator activity, fresh lore. Every card routes outward; Home holds no content of its own. Signed-out visitors receive an editorial (non-personalized) version. Journey: land, orient, and step into whichever section calls.

**4.2 Stories.** Purpose: play history and next session in one place. Layout: the Continue group leads (every in-progress Story and Adventure, newest activity first, one tap resumes the chat), then the startable shelf: playable Characters, Stories, and Adventures across all visibilities the user can access (own private work, saved public work, link-shared Internal work). Journey: open Stories, resume in one tap, or choose what to start next.

**4.3 Adventures.** Purpose: discovery of published Adventures plus the on-ramp to authoring one. Layout: a top banner (ruled top banner treatment) with the build CTA; the build action opens the Adventure builder as a modal, carrying the existing builder functionality whole into the new UX. Below, the public Adventure catalog. Journey: browse seasons worth committing to, start one, or open the builder without leaving the page.

### Create

**4.4 Studio.** Purpose: creation at two speeds, matching the real behavior: capture on the couch, refine at the desk.

* **Quick create:** modals for fast asset creation and Story assembly. Progressive disclosure, minutes not hours, phone-first.  
* **Advanced mode:** a picker modal selects any asset, Story, or Adventure the user owns; the page then becomes its full editor: every available field, organized for intuition rather than exhaustiveness. Deep prompt work, structured data input (including JSON where the entity supports it), and side-by-side refinement belong here. Desktop is the natural home; the layout remains fully functional at phone width.

Studio is also the public release submission hub: Public and Canon submissions begin here. Journey: create the moment inspiration strikes, return later with the full toolset to make it excellent.

**4.5 Images.** Purpose: the image workshop and library. Layout: the image creator plus the generated-image library. Defining feature: reference images. Generated images attach to an asset as its visual reference, and future generation is guided by them, keeping a Character's look consistent across scenes, Stories, and Adventures. Journey: craft the look once, pin it, and everything after stays on model.

**4.6 Vault.** Purpose: the personal management hub. Layout: every asset, Story, and Adventure the user created plus everything saved from other creators, all visibilities, one list. From any item: edit own work, or open a saved public work to remix into a private copy. Journey: one place where everything yours, and everything you have claimed, is always findable.

### Explore

**4.7 Community.** Purpose: the public catalog. Layout: every public asset, Story, and Adventure the community has released. Card actions: play, save to Vault, heart, remix. Journey: discover, claim, and make it yours.

**4.8 Creators.** Purpose: people discovery. Layout: creator profile previews; metric sorts on the sticky bar serve as the leaderboard (no separate leaderboard page). Each preview offers a quick peek at a few of the creator's top images before committing, then routes to the full profile or a follow action. Following keeps a creator's releases one tap away to play, save, remix, and heart. Journey: find whose worlds you love and keep them close.

**4.9 Lore.** Purpose: the platform's public editorial face, built on the existing lore infrastructure restyled to the new UX. Layout: creation opens as a modal from a banner or CTA at the page top; below, the list of community lore and the user's own. Approved public lore is readable signed-out and crawlable by search engines. Approved lore feeds into active Stories and enriches Characters. Journey: read the world, write into it, and let the best of it become part of play.

## 5\. Visibility model

The universal four-state enum on all assets, Stories, and Adventures:

* **Private:** creator only. All creations start here.  
* **Internal:** shareable by direct link for feedback. Unlisted, unsearchable, non-remixable.  
* **Public:** fully playable, remixable, and searchable in Community.  
* **Canon:** officially accepted into Crestfall Chronicles. Exclusive gold badge. Creator relinquishes edit rights and ownership.

Editing rules: Public work is never edited in place (pull a private copy, edit, resubmit). Internal exists to bypass approval for fast peer feedback. Canon is final and locked.

## 6\. Migration strategy: build new, then retire old

The new nine-page architecture is built alongside the existing pages, not by rebuilding them in place (the strangler pattern):

1. Each new page is built as a fresh route under the updated design system and LOOM component architecture, and added to the sidebar as it becomes usable.  
2. New pages read the same live data as the old pages through the same API surface. No duplicated state, no copied data.  
3. Old pages remain routable while their replacements are built, but leave the sidebar once the new page carries their function, so the navigation never shows two versions of one destination.  
4. A page is retired only after a parity check: every function the old page served exists on the new page, verified on a rendered page at 390 and 1440\.  
5. Retirement is per page, never a single cutover.

**Route law and parity echo, RULED 9 Aug 2026** (full detail:
`docs/BUILD-BLUEPRINT.md` chapter 3, sections 3.3 and 3.4). All nine
new pages build under `/studio/v2/<page>` and stay out of the sidebar
until parity. Cutover per page is one commit: move to the final
address, swap the sidebar entry, redirect the old address to the new
one. Old page code is deleted only in the single full-inventory sweep
at the deletion milestone, after all nine have cut over, never per
page. Every page build brief ends by echoing every function-map row
assigned to that page as present, deliberately excluded with its
ruling cited, or flagged for Brian; one open flag holds the page out of
the sidebar.

## 7\. Open items

* **DECIDED:** Character can be played in chat directly (tap a character, start a chat). The Stories page lists playable Characters, Stories, and Adventures.  
* **DECIDED:** update display alias for the Scenario category value "Scenario” so backend aligns with front end copy, can change later if needed.   
* **Ruled (9 Aug 2026):** new pages are built alongside old ones and old pages are retired per page after parity, per section 6\.  
* **Ruled (9 Aug 2026):** load-more pagination replaces infinite scroll on all list pages.

## 8\. Backend alignment (contract requests, later, non-blocking)

Nothing below blocks front-end work. Each is filed as a CR with full build specs so the backend can align in one pass later:

1. **CR (to file):** rename Room Template to Story in the data layer, matching the presentation mapping.  
2. **CR (to file):** rename Storyline to Adventure in the data layer.

