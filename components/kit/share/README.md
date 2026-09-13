# KitShareSheet

The one share package (fe/share-og brief 1, RULED 13 Sep 2026). Every
share button in the app mounts it; no page carries share logic of its
own. Contract 1.0.0.

## The type rule

Lives in `shareTypeRule.js` and nowhere else.

- An image (and video later) carries no card. It shares the actual
  image at the medium stored derivative (the served `cardUrl`), or the
  large one (`displayUrl`) when medium is absent, never the original
  and never an upscale. The preview shows the image, the title, the
  creator, and the link.
- A playable asset (character, story, adventure) carries the card: the
  stylized 1200 by 630 image the share-card route composes from public
  creation data (`app/api/share-card/[id]/route.js`), built on the
  asset's featured image, its title, a creator byline, a short excerpt,
  and the play invitation.
- Every other creation (location, outfit, lore, a registry) shares the
  plain link preview with no card.
- The byline is the creator. The `ref` on the link is the sharer.
  Sharing a creation you did not make still credits the maker on the
  card and still earns the sharer the referral.
- Private creations are blocked with the Vault sentence. Internal
  creations (data-layer UNLISTED) share the link with the Internal note
  and no card until the Chassis serves them to signed-in recipients
  (CR-075).

`kitShareDiagnostics.mjs` asserts both branches
(`npm run diagnostics:loom:share`).

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
  else the link preview row), an optional note, the link in a read-only
  field on `--bed-deep` (a control you read sinks one step below), Copy
  link (secondary), Share... (gold primary, only when the browser
  offers `navigator.share`), and a status chip (Link copied, Shared,
  Share unavailable).
- Mounted on `KitModalFrame` variant modal at 36rem: bottom-anchored
  full width under 700px with internal scroll, centered at 700px and
  up. The frame owns the close control and every dismissal path.
- A blocked share renders the eyebrow, the title, the sentence, and
  Close only.

## Boundary

```text
VaultV2Mockup.jsx, CommunityV2Mockup.jsx (later: the image viewer, the story chat page)
  -> useKitShareController({ sharerUsername })   open(asset), close, copyLink, nativeShare, sheetProps
       -> shareTypeRule.buildShareIntent          the rule, the copy, the visibility fold
            -> shareUrl                            paths, slug, ref, sign-in return
  -> KitShareSheet (Binding Shell, components/kit/KitShareSheet.jsx)
       -> useKitShareSheetViewModel               normalization, status copy
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
  featuredImageSrc: item.imageSrc,
})}>Share</button>

<KitShareSheet {...share.sheetProps} />
```

An image passes `mediaType: "IMAGE"`, `id` (the output id),
`sourceCreationId`, and `media` (the served derivative fields).

## Copy

- "Share", "Link", "Copy link", "Share...", "Close".
- "Link copied.", "Shared.", "Share unavailable." (the image viewer's
  existing status lines).
- Blocked: "Private creations are owner-only. Change visibility to
  Internal or Public before sharing a link." (the Vault sentence with
  the ruled word Internal, decision 6A).
- Internal note: "Recipients must sign in to Crestfall; this creation
  will not appear in search or public discovery." (the existing Vault
  sentence).
- Invitation on the card: "Play free on Crestfall".

## Fixtures

playable, playable-native, image, link, internal, blocked, copied,
error, no-image, longest.
