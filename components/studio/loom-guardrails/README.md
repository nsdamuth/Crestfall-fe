# Repository-Wide LOOM Guardrails

This package contains repository-level diagnostics only. It introduces no production View, ViewModel, route, API, persistence, or storage behavior.

## Protected boundaries

The guardrail suite checks:

1. **Portable View boundaries**
   - Portable `*.view.jsx` files cannot import `next/link` or `next/navigation`.
   - Portable Views cannot import client APIs, server services, Supabase helpers, or `app/` modules.
   - Portable Views cannot own `fetch()`, router hooks, pathname hooks, or search-parameter hooks.

2. **Product-data request routing**
   - User-facing `app/` and `components/` source cannot call `fetch()` outside the Next.js API proxy layer.
   - Client request ownership remains in `lib/client`, with server orchestration behind API routes.

3. **Supabase restriction**
   - Supabase usage outside API routes is restricted to the explicit authentication and session handling surfaces.
   - Those allowlisted files cannot call table or RPC product-data operations.

4. **LOOM package support files**
   - Every portable View directory must contain a versioned contract, fixtures, and a README.
   - Tiny stateless packages may be covered by parent diagnostics and previews; the guardrail does not require one diagnostic or preview route per leaf View.

5. **Development-only previews**
   - Every page under `app/dev/ui-preview` must use both a production environment check and `notFound()`.
   - This is production preview protection, not an authorization mechanism.

6. **Diagnostic accountability**
   - Every focused `*Diagnostics.mjs` file must either be referenced by a `package.json` command or appear in the explicit diagnostic exclusions manifest.
   - Exclusions must identify whether the diagnostic needs cross-service source, an installed runtime, or the deferred Mechanics assessment.

## Intentional exclusions

`loomGuardrailExclusions.mjs` is an auditable list, not a skip-all mechanism. An excluded diagnostic must still exist, must have a concrete reason, and must be removed from the manifest when it becomes directly runnable through the root package.

## Scope

This closeout hardens the already validated LOOM architecture. It does not change runtime behavior, does not add a feature count, and does not begin Mechanics abstraction.
