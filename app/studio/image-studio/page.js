import ImageStudioWorkbench from "@/components/studio/image-studio/ImageStudioWorkbench";

export default function ImageStudioPage() {
  return (
    <>
      <header className="pb-2">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted-gold)]">
          Image Studio
        </p>
      </header>

      <ImageStudioWorkbench />
    </>
  );
}