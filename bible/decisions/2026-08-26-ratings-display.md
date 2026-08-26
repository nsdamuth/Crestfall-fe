# DECISION: ratings display words, recorded 26 Aug 2026

RULED (already in force): the platform's three rating labels display
as **Everyone / Young Adult / Adult**, one to one over the backend
values SFW / MATURE / EXPLICIT. The Young Adult word was ruled by
Brian on 23 Aug 2026 (build-0823 close-out), superseding Teen,
display layer only. Source of record:
lib/shared/presentation/terminology.js and CR-027 in
docs/CONTRACT-REQUESTS.md. The CR-027 content audit still gates live
data under these labels.

RULED by Brian, 26 Aug 2026: line 1 chosen for every label. Adult
means R-rated; no nudity on the platform at any tier. The three
description lines that ship wherever the rating rows render:

- **Everyone:** Fine for all ages; nothing beyond what a G or PG
  film would show.
- **Young Adult:** Comparable to a PG-13 film: some intense moments,
  nothing explicit.
- **Adult:** Comparable to an R film: strong language and mature
  themes, no nudity.

The rejected lines, kept for the record (game-rating-aligned and
payment-processor-aligned variants per label):

- Everyone: "Content for every player: no strong language, no
  intense themes." / "General-audience content; safe for all account
  types."
- Young Adult: "Teen-and-up content: stylized conflict and mild
  language, nothing graphic." / "Thirteen-plus content; strong
  themes handled without explicit material."
- Adult: "Mature-audiences content: intense violence and strong
  language, never sexual content." / "Adults-only themes within
  platform rules: no nudity, no sexually explicit material."

Recorded by: Claude. Ruled by: Brian, 26 Aug 2026.
