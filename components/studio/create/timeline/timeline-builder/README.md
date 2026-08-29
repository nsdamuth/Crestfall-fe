# Timeline Builder / Editor

The V2 Timeline editor owns only Timeline presentation/curation state. Lore remains authoritative for Lore content and chronology metadata.

Timeline v2 adds authored chapters and `groupingMode` while retaining v1 compatibility. Creators can add/rename/order/remove chapters, assign attached Lore to chapters, use Lore era grouping, or choose a continuous chronology. Removing a chapter unassigns its entries rather than deleting Lore.

The View remains portable; fetching, save orchestration, chapter-id generation, normalization, and navigation stay in the ViewModel/Shell boundary.
