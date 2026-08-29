# HANDOFF: Brian to Nick, for Sol. 26 Aug 2026

Nick: paste everything below the line to Sol along with
bible/CONTEXT.md, bible/COLLAB-WORKFLOW-PRD.md, and
bible/templates/PLAN-REVIEW-LOG.md. Sol reads and writes findings
back as text; Sol edits nothing in Crestfall-fe.

---

Sol: you are reviewing a proposed two-lane workflow between
Crestfall-fe (Brian and Claude: Views, Kit, tokens, fixtures, page
composition) and the Crestfall Chassis (Nick and you: routes,
application logic, ViewModels, contracts, data). Four tasks, in
order. Return everything as one packet of text Nick can hand back.

(a) Read CONTEXT.md first, then COLLAB-WORKFLOW-PRD.md. The glossary
defines every term the PRD uses; flag any term you read differently
on the Chassis side.

(b) Attack the PRD. Your job is to find what breaks on the Chassis
side: stations that assume access Nick does not have, gates that
would stall his work, review loops that cannot run at his cadence,
anything the Chassis cannot deliver as written. Write each finding
into the round format of PLAN-REVIEW-LOG.md (Round 1, reviewer Sol,
26 Aug 2026): ID, severity (BLOCKER, MAJOR, MINOR), the finding, the
evidence, leaving the response and status columns empty. Do not
soften findings; the workflow's own rule is that the maker never
grades their work, and this PRD was drafted on the Crestfall-fe side.

(c) Answer the OPEN environment questions. These are facts only the
Chassis side holds; Crestfall-fe's documents do not contain them:
  1. Which repository and which branch serve crestfall-studio.com
     today?
  2. What is staging: a URL, a branch, a deploy target? How does a
     build reach it?
  3. How is a release tagged and deployed, step by step, and by
     whom?
  4. The branch sync/merge_1 (tip 74454fa, per the 23 Aug 2026
     handoff): which of its items have since landed on any trunk,
     and which have not? In particular the two named collision files
     and the four chat packages that handoff lists.
  5. Will GitHub Issues serve as the one shared dev tracker for
     both lanes? If not, what should?

(d) Return the packet: the Round 1 review log from (b), the five
answers from (c), and any term flags from (a). Plain text or
markdown; Nick hands it back and it is filed into the bible
unchanged, then answered on the Crestfall-fe side in Round 2.

Ground rules: statements about Crestfall-fe's state should cite the
document handed to you; anything you cannot confirm, write
"expected, verify first". No em dashes anywhere in the packet.
