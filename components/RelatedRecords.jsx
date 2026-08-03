import Link from "next/link";

export default function RelatedRecords({ records = [] }) {
  if (!records.length) return null;

  return (
    <section className="mt-14 border-t border-[rgba(120,85,40,0.28)] pt-8">
      <h2 className="font-display text-sm uppercase tracking-[0.35em] text-[#7b5525]">
        Related Records
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {records.map((record) => (
          <Link
            key={record.href}
            href={record.href}
            className="border border-[rgba(120,85,40,0.24)] bg-[rgba(255,255,255,0.18)] px-5 py-4 font-serif text-lg text-[#2a2118] transition hover:border-[#7b5525]"
          >
            {record.title}
          </Link>
        ))}
      </div>
    </section>
  );
}