import { redirect } from "next/navigation";

// V2 convergence cutover: the historical /studio/create catalogue is no longer
// a product destination. Keep the route as a compatibility pointer so stale
// links, bookmarks, and legacy navigation return to canonical Full Studio.
export default function CreatePage() {
  redirect("/studio?mode=full");
}
