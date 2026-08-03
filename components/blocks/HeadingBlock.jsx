export default function HeadingBlock({ text = "", level = 2 }) {
  if (!text) return null;

  const safeLevel = Number(level) === 3 ? 3 : 2;
  const className =
    safeLevel === 3
      ? "font-display text-2xl text-[#5f421e]"
      : "font-display text-4xl text-[#3a2917]";

  return safeLevel === 3 ? (
    <h3 className={className}>{text}</h3>
  ) : (
    <h2 className={className}>{text}</h2>
  );
}
