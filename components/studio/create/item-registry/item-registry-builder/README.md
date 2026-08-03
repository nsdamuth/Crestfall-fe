# Item Registry Builder LOOM boundary

## Structure

```text
ItemRegistryBuilder.jsx                    Binding Shell
item-registry-builder/
  ItemRegistryBuilder.view.jsx             Portable View / Skin
  useItemRegistryBuilderViewModel.js       ViewModel / Chassis
  ItemRegistryBuilder.contract.js          Semantic View contract
  ItemRegistryBuilder.fixtures.js          Isolated visual states
```

## Ownership

The View owns tabs, entry cards, form presentation, tracking fields, prompt
guidance, review presentation, loading/saving feedback, and semantic callback
invocation. It does not create or update Crestfall records and it does not
interpret API responses.

The ViewModel owns registry normalization, entry mutation, alias parsing,
payload creation, save orchestration, creation-ID extraction, and navigation.
It saves through the existing creation client.

`ItemStartingAssignmentEditor` remains application-owned because it loads and
binds Crestfall creations through its linked-creation picker. The Binding Shell
injects one editor slot per item entry into the portable View.

## Persistence

The existing `ITEM_REGISTRY` creation payload and `creations.data` shape remain
unchanged. The legacy `useItemRegistryBuilder` export delegates to the new
ViewModel as a compatibility adapter.
