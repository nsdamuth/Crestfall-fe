import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StudioShell from "@/components/studio/StudioShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudioLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <StudioShell user={user}>{children}</StudioShell>;
}