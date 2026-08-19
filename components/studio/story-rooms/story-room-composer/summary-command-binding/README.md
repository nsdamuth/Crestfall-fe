# Story Room `/summary` command binding

Status: **WIRED**.

W17 closes the accepted `/summary` / `/recap` Story Room command seam.

The live command registry now contains `/help`, `/summary`, and `/commands`; `/recap` remains an alias. Only exact slash commands are intercepted.

While a summary is pending, duplicate summary requests and ordinary sends are blocked, the composer presents busy state, and the transcript shows the accessible Scene Recap pending card.

The returned persisted recap is appended once to the authoritative Story snapshot and renders through the existing SYSTEM-message surface. Current-boundary resolution, provider generation, persistence, and no-story-advance guarantees remain Chassis/runtime authority.
