import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import LoreBlockRenderer from "@/components/LoreBlockRenderer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedRecords from "@/components/RelatedRecords";
import FloatingBackButton from "@/components/FloatingBackButton";

function resolveAssetPath(assetBase, value) {
  if (!value) return value;
  if (value.startsWith("/")) return value;
  if (!assetBase) return value;

  return `${assetBase}/${value}`;
}

function resolveBlockAssets(entry) {
  const blocks = entry.content ?? [];

  return blocks.map((block) => resolveBlock(entry.assetBase, block));
}

function resolveBlock(assetBase, block) {
  const resolved = {
    ...block,
    image: resolveAssetPath(assetBase, block.image),
    src: resolveAssetPath(assetBase, block.src),
    poster: resolveAssetPath(assetBase, block.poster),
  };

  if (block.columns) {
    resolved.columns = block.columns.map((column) => ({
      ...column,
      blocks: column.blocks?.map((nestedBlock) =>
        resolveBlock(assetBase, nestedBlock)
      ),
    }));
  }

  return resolved;
}

export default function DetailPage({ entry }) {
  const texture = entry.texture ?? "paper-clean";

  return (
    <>
      <SiteHeader />
      <FloatingBackButton />
       <SiteShell eyebrow={entry.eyebrow} title={entry.title}>
        <article className={`sourcebook-page ${texture} mx-auto max-w-5xl`}>
        <Breadcrumbs
            currentTitle={entry.title}
            path={entry.breadcrumbs ?? []}
            />
          <div className="sourcebook-flourish" />

          <header className="text-center">
            <p className="sourcebook-eyebrow font-display text-xs uppercase tracking-[0.45em]">
              {entry.eyebrow}
            </p>

            <h1 className="mt-5 font-display text-5xl tracking-wide sm:text-6xl">
              {entry.title}
            </h1>

            {entry.subtitle && (
              <p className="mx-auto mt-8 max-w-2xl font-serif text-xl italic leading-9">
                {entry.subtitle}
              </p>
            )}
          </header>

          <LoreBlockRenderer blocks={resolveBlockAssets(entry)} />
          <RelatedRecords records={entry.related} />
        </article>
      </SiteShell>
    </>
  );
}