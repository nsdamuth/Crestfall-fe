# LANES

## Who owns what

| Lane | People | Owns | Never touches |
|---|---|---|---|
| Design and front end | Brian + Claude | Views, Kit, tokens, fixtures, page composition; the bible | Routes, application logic, application ViewModels, data |
| Chassis | Nick + Sol (reader only) | Routes, application logic, application ViewModels, authoritative Binding Shells, contracts, data, staging, deploy | Design law, tokens, fixtures, page composition |

Boundary rule of record: FE-REVIEW-01 (CLAUDE.md). Sol never edits
this repo.

## Where things live

| What | Where |
|---|---|
| Product front end and the bible | Crestfall-fe (this repo) |
| Chassis: routes, logic, data, deploy | Nick's repo (name and branch: open question to Nick) |
| Business process and skills | anthology-ops |
| claude.ai project instructions | A pointer to bible/STATUS.md only; no duplicated rules |
| Contract changes | docs/CONTRACT-REQUESTS.md, the only mechanism |
| Design law | docs/DESIGN-TOKENS.md and docs/FRONTEND-SOP.md |
| Product model | docs/CRESTFALL-PRODUCT-MODEL-UXUI.md |
| Phase ledger | docs/ROADMAP.md |
