import { createBrowserClient } from "@supabase/ssr";

let supabaseBrowserInstance = null;

export function createClient() {
  // If the instance doesn't exist yet, create it once
  if (!supabaseBrowserInstance) {
    supabaseBrowserInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  
  // Always return the exact same instance everywhere across the app
  return supabaseBrowserInstance;
}