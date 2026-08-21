import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

export function Default() {
  return (
    <SectionTitle
      eyebrow="Identity"
      title="Who they are"
      body="Name, title, species, and the one-line role that shows up across the site."
    />
  );
}

export function LongestContent() {
  return (
    <SectionTitle
      eyebrow="Advanced Prompting"
      title="Everything the automatic sections do not cover"
      body="This is the longest realistic body copy this recipe carries: a full sentence or two of guidance, wrapping across more than one line at the standard measure, so the section title never collapses when a caller writes a genuinely long description."
    />
  );
}
