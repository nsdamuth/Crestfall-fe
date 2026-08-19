# Image Reassignment presentation semantics

Status: semantic presentation contract and realistic fixtures only.

This package brings the current image-reassignment user experience into the FE
lane without moving the transaction, authorization, or API orchestration out of
Crestfall.

## Current transaction

```text
image_reassignment_transaction_v0
```

Current cost:

```text
1 Coin
```

The service returns the current source asset and eligible destination assets.
The destination set excludes the current source.

## Current user-facing rules

The action is presented only when the active image is marked reassignable and
has both an image output ID and a current source Creation ID.

Current ownership copy:

```text
Only images you created can be moved, and both the current and destination
assets must belong to you.
```

Current movement semantics:

```text
Reassignment moves the same image. It does not duplicate the file.
```

If the image is featured or used as a visual reference on the source asset,
those source references are cleared automatically by the authoritative
transaction.

## Permanent boundary

Crestfall remains authoritative for:

- authenticating the actor
- verifying ownership of the image output
- verifying ownership of the source Creation
- verifying ownership of the destination Creation
- validating the source-image association
- rejecting source == destination
- rejecting duplicate destination membership
- checking/spending the 1 Coin cost
- moving the library association
- clearing source featured/reference relationships
- DB transactionality
- returning the authoritative post-move result
- refreshing account balance and source/destination UI state

Crestfall-fe owns only the presentation semantics and user intent callbacks.

The FE contract does not decide whether an image is truly eligible. The
`canReassign` input is display-ready state supplied by the authoritative
application layer.

## Current presentation states covered

- action hidden/visible
- loading eligible assets
- destination selection
- no eligible destination assets
- ready-to-submit
- submitting
- success
- error/stale-source messaging
- singular/plural Coin labels

## Visual integration

The existing FE lane already has a current media-lightbox package. This patch
does not overwrite it. It adds a neutral semantic package that the FE lane can
use when reconciling the V2 lightbox treatment.

## Protected scopes untouched

- `app/studio/v2/**`
- `components/studio/my-creations/edit/**`
- `components/kit/**`
- `components/studio/chat/**`
