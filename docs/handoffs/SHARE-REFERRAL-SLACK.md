Nick, sharing on fe/share-og is ready for a look. Latest code commit 8f62a3ea, docs on top of it.

WHAT LANDED
- Share sheet: one popup for every Share button. Public creations share a link with a preview; private and internal ones are blocked with a one-line reason and a Submit for public review button that uses the existing review flow.
- Card image: playable creations (characters, stories, adventures) get a 1200 by 630 card with the Crestfall Studio lockup, the art, the title, the creator, a short excerpt, and Play free on Crestfall.
- Landing pages: every playable link opens a public page with that card in the preview; Play free sends a stranger to sign in and back to that page; Play sends a signed-in player straight to the creation.
- Vault: Share on your own items opens the sheet.
- Community: Share in the popup opens the sheet.
- Image viewer: Share on a Media Studio image shares the actual image at the medium size, never the original, with a link to the creation it came from.
- Creator profile: Share on a creator page shares the public profile link.
- Referral counter: the account page shows Referral bonus with a count, 0 until you serve it.

WHERE TO LOOK
- /studio/v2/vault (Share on a public item and on a private one), /studio/v2/community (Share in the popup), /studio/v2/images (Share in the viewer), /studio/v2/creators/crestfall (Share), /studio/v2/account (the counter under Coins).
- The card: /api/share-card/9b45b53f-d4e7-472e-9a3b-a89846124120
- One public character link: /c/9b45b53f-d4e7-472e-9a3b-a89846124120/lilith-of-nod

WHAT STILL NEEDS BUILDING (full detail in the handoff document, SHARE AND REFERRAL BACKEND HANDOFF; CR-078 was not needed, the review flow already exists)
- CR-072: record the sharer's handle when a visitor arrives on a share link, keep it 30 days, credit the sharer once when that visitor's account first subscribes.
- CR-073: serve the referral count on the account read so the counter shows a real number.
- CR-074: send a visitor back to the page they came from after any sign-in or sign-up, with the sharer's handle kept.
- CR-075: let signed-in players open an internal creation's link, if Brian still wants internal sharing at all.
- CR-076: write a slug for a creation when it goes public, so links carry a server-made name.
- CR-077: frontend work, opening the named image on the creation page and serving its picture in link previews.

WHAT TO CHECK WITH PUBLIC ASSETS
- Character: signed out, the link shows the card and Play free; after sign in they should land back on that character (today they land on the studio home, CR-074).
- Story: same as a character, with the story's card.
- Adventure: same, with the adventure's card.
- Image: signed out, the link shows the creation page the image came from; after sign in they should land there with that image selected (today: no selection, CR-077).
- Creator profile: signed out, the link shows the public profile; after sign in they should land back on it.

SHARE BUTTONS AND THEIR STATE
- Wired on this branch: Vault, the Community popup, the image viewer, the creator profile.
- Pending on fe/chat-studio: the story chat page's Share, which mounts the same sheet with the story being played.

ASKS
- A second test account, a way to simulate a subscription locally, one public character, story, adventure, and image on Brian's local account, so Brian can walk the whole loop.
- How the referral credit and the community affiliate program avoid crediting one sign-up twice.
