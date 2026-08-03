# Creation Studio

Creation Studio is Crestfall's portable entry surface for choosing creation tools and following the optional guided build path.

## LOOM boundary

- `CreationStudio.view.jsx` renders Quick Start, Guided Build, and Full Studio from projected props.
- `useCreationStudioViewModel.js` owns mode state, saved-count loading, milestone projection, and recommendations.
- `CreationStudio.contract.mjs` defines the experience version, modes, asset groupings, chapter order, milestone dependencies, and projection helpers.
- `CreationStudio.fixtures.mjs` provides deterministic counts, assets, and registry data for diagnostics.
- `creationStudioDiagnostics.mjs` protects the contract, progression rules, Binding Shell ownership, request boundary, and navigation injection.

The portable View does not fetch, persist, import Supabase/PostGraphile, or own Next.js navigation. Production routing is injected through the Binding Shell.
