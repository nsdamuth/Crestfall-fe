import { useRouter } from "next/navigation";

export function useProfileBackButtonViewModel({
  fallbackHref = "/studio/community",
} = {}) {
  const router = useRouter();

  function onGoBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return {
    ariaLabel: "Go back",
    onGoBack,
  };
}
