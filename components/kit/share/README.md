# KitShareSheet

The one share package (fe/share-og brief 1, RULED 13 Sep 2026; sharing
is public only since follow-up 1, RULED 13 Sep 2026). Every share
button in the app mounts it; no page carries share logic of its own.
Contract 1.1.0.

## The type rule

Lives in `shareTypeRule.js` and nowhere else.

- An image (and video later) carries no card. It shares the actual
  image at the medium stored derivative (the served `cardUrl`, the
  file proxy's `card` variant), with the large one (`displayUrl`, the
  `display` variant) behind it, never the original and never an
  upscale. The preview shows the image, the title, the creator, and
  the link.
- A playable asset (character, story, adventure) carries the card: the
  stylized 1200 by 630 image the share-card route composes from public
  creation data (`app/api/share-card/[id]/route.js`), built on the
  asset's featured image, the Crestfall Studio lockup (the sidebar's
  mark, `public/assets/icons/icons-v7.svg#i-59`, drawn as the same
  circles inside `ShareCardImage.jsx` because Satori loads no external
  symbol, with the wordmark in the vendored display face at the
  sidebar's proportions), its title, a creator byline, a short excerpt,
  and the play invitation.
- A creator profile carries no card. It shares the plain link preview
  (the avatar, the display name, the handle) and lands on the public
  profile route, `/studio/profile/:username`.
- Every other creation (location, outfit, lore, a registry) shares the
  plain link preview with no card.
- The byline is the creator. The `ref` on the link is the sharer.
  Sharing a creation you did not make still credits the maker on the
  card and still earns the sharer the referral.
- Sharing is public only. A private creation and an Internal one
  (data-layer UNLISTED) both take the blocked state: the sentence
  "This creation can only be shared once it is public.", the primary
  "Submit for public review", and Close. No link, no card, no native
  share is built for either. The primary posts the existing
  publication review path (`submitCreationReview` in
  `lib/client/studio/creations/creationClient.js`, the same call the
  creation editor's Publishing section makes, PUBLIC review only); on
  success the button reads "Submitted for review" and disables. A
  creation already in review opens in that state. A failure keeps the
  button live and shows "Could not submit for review." beneath the
  actions. The Chassis honors the call for the owner's own draft or
  rejected creation; Internal links open for signed-in recipients only
  once CR-075 lands, which is why an Internal creation is blocked here
  rather than shared.

`kitShareDiagnostics.mjs` asserts every branch, the blocked state for
a private and an Internal creation included (`npm run
diagnostics:loom:share`).

## Link destinations (RULED at the plan gate, 13 Sep 2026)

`shareUrl.js` builds every path.

- A playable share lands on its landing family from the URL research
  map: `/c/:id/:slug`, `/story/:id/:slug`, `/adventure/:id/:slug`. The
  slug comes from the title (CR-076 asks the Chassis to write one); the
  landing routes key on the id.
- An image share lands on the public page of the creation it was
  generated from, `/studio/creations/:id?image=:outputId`, with the
  image named so the page can select it once it can (CR-077). An image
  with no source creation lands on the sharer's public profile,
  `/studio/profile/:username`.
- Every other creation lands on `/studio/creations/:id`.
- Every link ends with `?ref=<sharer username>`.
- The landing page's sign-in link is
  `/login?next=<the exact page, ref included>&ref=<username>`; the
  Chassis honors both under CR-074.

## The sheet

- `KitShareSheet.view.jsx`: eyebrow "Share", the title, the creator
  byline, the preview (the card image for a playable public creation,
  else the link preview row), the link in a read-only field on
  `--bed-deep` (a control you read sinks one step below), Copy link
  (secondary), Share... (gold primary, only when the browser offers
  `navigator.share`), and a status chip (Link copied, Shared, Share
  unavailable).
- Mounted on `KitModalFrame` variant modal at 36rem, a popup modal at
  every width: bottom-docked full width under 700px with the grabber
  and internal scroll, a centered fixed-width panel at 700px and up.
  The frame owns the close control and every dismissal path. The card
  preview keeps its 1200 by 630 ratio inside the panel and never
  overflows at 390; the title breaks long words; the link field never
  widens the panel.
- A blocked share renders the eyebrow, the title, the sentence, Submit
  for public review (gold primary), and Close (secondary), with the
  failure line beneath when the submission fails.

## Boundary

```text
VaultV2Mockup.jsx, CommunityV2Mockup.jsx, ImagesV2ImageViewer.jsx, CreatorProfileLive.jsx (later: the story chat page)
  -> useKitShareController({ sharerUsername })   open(asset), close, copyLink, nativeShare, submitForReview, sheetProps
       -> shareTypeRule.buildShareIntent          the rule, the copy, the visibility fold, the review state
            -> shareUrl                            paths, slug, ref, sign-in return
       -> creationClient.submitCreationReview     the existing publication review path (blocked sheet only)
  -> KitShareSheet (Binding Shell, components/kit/KitShareSheet.jsx)
       -> useKitShareSheetViewModel               normalization, status copy, review button copy
       -> KitShareSheet.view.jsx                  presentation only
            -> ../KitModalFrame
app/api/share-card/[id]/route.js
  -> shareCardModel.buildShareCardModel           the one card model
  -> ShareCardImage.jsx                           the one card renderer (Satori subset)
```

## Mounting on a page

```jsx
const { accountProfile } = useStudioAccount();
const share = useKitShareController({ sharerUsername: accountProfile?.username });

<button onClick={() => share.open({
  creationType: item.type,
  id: item.id,
  title: item.title,
  creatorHandle: item.creatorHandle,
  visibility: item.rawCreation?.visibility,
  canonStatus: item.canonStatus,
  lifecycleStatus: item.status,
  featuredImageSrc: item.imageSrc,
})}>Share</button>

<KitShareSheet {...share.sheetProps} />
```

An image passes `mediaType: "IMAGE"`, `id` (the output id),
`sourceCreationId`, and `media` (the served derivative fields:
`cardUrl` the medium size, `displayUrl` the large one, never the
original). The image viewer on /studio/v2/images builds both from the
file proxy's `card` and `display` variants.
`lifecycleStatus` lets a blocked sheet open already reading "Submitted
for review" when the creation is IN_REVIEW. A creator profile passes
`kind: "profile"`, `id` (the profile id), `title` (the display name),
`creatorUsername` (the handle), and `featuredImageSrc` (the avatar).

## Copy

- "Share", "Link", "Copy link", "Share...", "Close".
- "Link copied.", "Shared.", "Share unavailable." (the image viewer's
  existing status lines).
- Blocked: "This creation can only be shared once it is public."
  (follow-up 1; supersedes the Vault sentence from brief 1).
- "Submit for public review", "Submitted for review", "Could not
  submit for review."
- Invitation on the card: "Play free on Crestfall".

## Fixtures

playable, playable-native, image, profile, link, blocked, blocked-internal,
blocked-submitting, blocked-submitted, blocked-error, copied, error,
no-image, longest.
