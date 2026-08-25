"use client";

import { useRouter } from "next/navigation";

import HomeView from "./home/Home.view";
import { useHomeViewModel } from "./home/useHomeViewModel";

export default function Home(props = {}) {
  const router = useRouter();
  const viewProps = useHomeViewModel({
    ...props,
    onNavigate: (href) => router.push(href),
  });

  return <HomeView {...viewProps} />;
}
