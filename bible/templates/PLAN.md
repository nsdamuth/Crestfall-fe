# PLAN: <feature name>

Purpose: the implementation plan for one signed PRD, one plan per
lane when the feature is cross-lane. Filled by: the lane that will
build the work, after Gate 2 sign-off.

From PRD: <link>. Signed on: <date>.

approach (architecture, data flow)
components (modules touched, per lane and repo)
dependencies (libraries, systems, other lanes)
data_model_and_contracts (schemas, interfaces, CR refs; a task that
  turns out to need an unplanned contract, ViewModel, or data-flow
  change STOPS and escalates, per docs/FRONTEND-SOP.md section 13)
tasks (dependency-ordered, each self-contained for one agent; every
  finished-task report echoes these part by part, DONE or STOPPED,
  per docs/FRONTEND-SOP.md section 8)
test_plan (how each acceptance criterion in the PRD is verified, one
  command per criterion, stated before the work starts)
interfaces_declared (every contract or shared file this plan
  touches; this list is what the pre-integrate check in
  bible/templates/GATES.md compares against the other lane's plan)

## Optional (carried from v1, not part of the v2 field list)

- stop_points: where work pauses for a render check or a ruling
  before continuing, when that is not already implied by a task
  boundary in the list above.
