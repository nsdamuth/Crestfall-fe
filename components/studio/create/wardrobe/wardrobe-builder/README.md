# Wardrobe Builder LOOM feature

## Boundary

```text
WardrobeBuilder.jsx                         Binding Shell
        ↓
useWardrobeBuilderViewModel                 ViewModel / Chassis
        ↓
WardrobeBuilder.view.jsx                    Portable View / Skin
```

The Shell preserves the public import used by the Create Wardrobe page and owns
the application-bound Outfit picker. The portable View receives normalized
wardrobe entries, selection rules, prompt guidance, and semantic callbacks.

## Persistence

The ViewModel builds the existing `WARDROBE` creation payload through
`buildWardrobeCreationPayload` and sends it through the shared creation client.
The saved creation continues to store normalized wardrobe data under
`creation.data` and redirects to Creation Edit.

## Portable View restrictions

The View does not import the Outfit picker, creation client, router, wardrobe
payload builder, or persistence helpers. Fixture previews can render every
visual state without a database or creation catalogue.

## Development preview

```text
/dev/ui-preview/wardrobe-builder
```

The route is unavailable in production.
