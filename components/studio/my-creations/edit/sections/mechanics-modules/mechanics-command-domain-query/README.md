# Mechanics Command Domain Query

LOOM authoring package for `command.domainQuery`.

The contract is `mechanics_command_domain_query_v1`. It maps a creator-authored Mechanics command to a typed, registered, read-only Crestfall domain operation. Domain and operation identifiers remain generic; runtime domain adapters own authoritative meaning.

This package does not execute queries, mutate state, infer natural-language gameplay intent, or define game-specific commands. `/` command identity remains creator-authored in Mechanics Command Core.
