import { getMarkdownEntryByPath } from "@/lib/content";

export function getIntro() {
  return getMarkdownEntryByPath("", "intro");
}