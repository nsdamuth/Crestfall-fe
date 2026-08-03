"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

export default function ScrollControls() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <button
        onClick={scrollToTop}
        className="
        group
        flex h-12 w-12 items-center justify-center
        rounded-full

        border border-[var(--muted-gold)]/20

        bg-black/55
        text-[var(--muted-gold)]

        shadow-[0_0_20px_rgba(0,0,0,0.45)]

        backdrop-blur-md

        transition-all duration-300 ease-out

        hover:border-[var(--muted-gold)]/60
        hover:bg-[rgba(120,95,45,0.22)]
        hover:text-[var(--parchment)]
        hover:shadow-[0_0_24px_rgba(184,134,11,0.22)]

        active:scale-95
        "
        aria-label="Scroll to top">
        <ChevronUp size={22}
            className="transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>

      <button
        onClick={scrollToBottom}
        className="
        group
        flex h-12 w-12 items-center justify-center
        rounded-full

        border border-[var(--muted-gold)]/20

        bg-black/55
        text-[var(--muted-gold)]

        shadow-[0_0_20px_rgba(0,0,0,0.45)]

        backdrop-blur-md

        transition-all duration-300 ease-out

        hover:border-[var(--muted-gold)]/60
        hover:bg-[rgba(120,95,45,0.22)]
        hover:text-[var(--parchment)]
        hover:shadow-[0_0_24px_rgba(184,134,11,0.22)]

        active:scale-95
        "
        aria-label="Scroll to bottom">
        <ChevronDown size={22}
            className="transition-transform duration-300 group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}