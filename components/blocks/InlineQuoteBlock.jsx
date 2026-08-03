export default function InlineQuoteBlock({ text, attribution }) {
  if (!text) return null;

  return (
    <blockquote className="my-6 text-center font-serif italic text-[#2a2118]">
      <p className="text-xl leading-8">“{text}”</p>

      {attribution && (
        <footer className="mt-3 font-display text-xs uppercase tracking-[0.25em] text-[#7b5525]">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}