import LoreBlockRenderer from "@/components/LoreBlockRenderer";

export default function TwoColumnBlock({ columns = [] }) {
  if (!columns.length) return null;

  return (
    <div className="grid gap-12 md:grid-cols-2">
      {columns.map((column, index) => (
        <section key={column.id || index}>
          <LoreBlockRenderer blocks={column.blocks ?? []} nested />
        </section>
      ))}
    </div>
  );
}
