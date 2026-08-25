export default function PullQuoteBlock({ text, attribution }) {
  return (
    <blockquote className="sourcebook-pullquote">
      <p>“{text}”</p>

      {attribution && <footer>· {attribution}</footer>}
    </blockquote>
  );
}