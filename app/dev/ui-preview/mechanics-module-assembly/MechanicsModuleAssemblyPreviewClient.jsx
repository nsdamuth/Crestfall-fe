"use client";

import { useState } from "react";

import MechanicsModuleFieldsSection from "@/components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection";
import { MECHANICS_MODULE_ASSEMBLY_FIXTURES } from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/mechanicsModuleAssembly.fixtures.js";

export default function MechanicsModuleAssemblyPreviewClient() {
  const [fixtureId, setFixtureId] = useState("COMPLETE");
  const fixture =
    MECHANICS_MODULE_ASSEMBLY_FIXTURES.find((item) => item.id === fixtureId) ||
    MECHANICS_MODULE_ASSEMBLY_FIXTURES[0];
  const [form, setForm] = useState({ data: fixture.mechanicsData });
  const [replacementCount, setReplacementCount] = useState(0);

  function selectFixture(nextId) {
    const next = MECHANICS_MODULE_ASSEMBLY_FIXTURES.find(
      (item) => item.id === nextId
    );
    setFixtureId(nextId);
    setForm({ data: next?.mechanicsData || {} });
    setReplacementCount(0);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            M9 Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Mechanics Module Parent Assembly
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Complete-data replacements: {replacementCount}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {MECHANICS_MODULE_ASSEMBLY_FIXTURES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectFixture(item.id)}
                className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                  item.id === fixtureId
                    ? "border-[var(--muted-gold)]/50 text-[var(--muted-gold)]"
                    : "border-white/10 text-[var(--muted)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <MechanicsModuleFieldsSection
          form={form}
          updateDataField={(key, value) =>
            setForm((current) => ({
              ...current,
              data: { ...current.data, [key]: value },
            }))
          }
          replaceData={(nextData) => {
            setForm((current) => ({ ...current, data: nextData }));
            setReplacementCount((current) => current + 1);
          }}
        />
      </div>
    </main>
  );
}
