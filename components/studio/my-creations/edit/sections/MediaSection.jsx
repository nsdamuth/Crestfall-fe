import {
  SectionTitle,
} from "@/components/studio/my-creations/edit/sections/SharedFields";
import {
  Image as ImageIcon,
} from "lucide-react";

export default function MediaSection() {
  return (
    <div>
      <SectionTitle
        eyebrow="Media"
        title="Media Library"
        body="Images and videos attached to this creation will appear here. Later this will connect to Image Studio and generated media assets."
      />

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
        <ImageIcon className="mx-auto text-[var(--muted-gold)]" size={32} />
        <p className="mt-4 font-display text-3xl">No media yet</p>
        <p className="mx-auto mt-2 max-w-xl leading-7 text-[var(--muted)]">
          Generated images will eventually be selected from the internal media
          library. No external file uploads.
        </p>
      </div>
    </div>
  );
}