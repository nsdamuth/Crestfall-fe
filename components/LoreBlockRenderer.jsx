import TextBlock from "@/components/blocks/TextBlock";
import HeadingBlock from "@/components/blocks/HeadingBlock";
import TwoColumnBlock from "@/components/blocks/TwoColumnBlock";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import ImageBlock from "@/components/blocks/ImageBlock";
import ExcerptBlock from "@/components/blocks/ExcerptBlock";
import DividerBlock from "@/components/blocks/DividerBlock";
import SidebarBlock from "@/components/blocks/SidebarBlock";
import StoryExcerptBlock from "@/components/blocks/StoryExcerptBlock";
import InlineQuoteBlock from "@/components/blocks/InlineQuoteBlock";
import PullQuoteBlock from "@/components/blocks/PullQuoteBlock";
import StatBlock from "@/components/blocks/StatBlock";
import CalloutBlock from "@/components/blocks/CalloutBlock";

export default function LoreBlockRenderer({ blocks = [], nested = false }) {
  return (
    <div className={nested ? "space-y-8" : "mt-12 space-y-12"}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={block.id || index} {...block} />;

          case "heading":
            return <HeadingBlock key={block.id || index} {...block} />;

          case "two-column":
            return <TwoColumnBlock key={block.id || index} {...block} />;

          case "quote":
            return <QuoteBlock key={block.id || index} {...block} />;

          case "image":
            return (
              <ImageBlock
                key={block.id || index}
                {...block}
                variant="lore-parchment"
              />
            );

          case "excerpt":
            return <ExcerptBlock key={block.id || index} {...block} />;

          case "story-excerpt":
            return <StoryExcerptBlock key={block.id || index} {...block} />;

          case "sidebar":
            return <SidebarBlock key={block.id || index} {...block} />;

          case "divider":
            return <DividerBlock key={block.id || index} />;

          case "pull-quote":
            return <PullQuoteBlock key={block.id || index} {...block} />;

          case "stat-block":
            return <StatBlock key={block.id || index} {...block} />;

          case "callout":
            return <CalloutBlock key={block.id || index} {...block} />;

          case "inline-quote":
            return <InlineQuoteBlock key={block.id || index} {...block} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
