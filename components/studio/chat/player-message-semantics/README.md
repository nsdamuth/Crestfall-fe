# Player Message Semantics

Portable V2 Story Chat semantic projection for player-authored text.

## Contract

- Original player text remains unchanged and is the persistence/source text.
- Quoted-dialogue convention: quoted speech is `DIALOGUE`; ordinary unwrapped prose is `ACTION`.
- In quote-style prose, single-asterisk italics are `THOUGHT` when the turn clearly establishes quote-first/unwrapped action style.
- Asterisk-action convention remains supported: `*action*` with ordinary unwrapped dialogue is `ACTION` + `DIALOGUE`.
- Ambiguous mixed quote/asterisk turns preserve the first explicit convention marker so legacy `*action* "dialogue"` turns do not become private thought accidentally.
- `> message` is `MESSAGE`: written/digital communication, not private thought and not automatically spoken aloud.
- `` `telepathy` `` is `TELEPATHY` with `TARGETED_COMMUNICATION` visibility. It is not ordinary scene-visible text.
- `((private thought))` remains backward-compatible, but Thought composer mode and quote-style italics are the preferred private-thought paths.
- Persisted services-api `metadata.playerInputSemantics` outranks client inference when available.
- This package is presentation projection only. Character knowledge and private-channel authority stay in services-api.

`THOUGHT` renders with a private-thought rail. `MESSAGE` and `TELEPATHY` receive distinct presentation treatments so the transcript communicates the semantic channel without rewriting the stored player text.
