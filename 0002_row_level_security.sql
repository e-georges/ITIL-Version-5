import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

// Client utilisé dans les composants côté navigateur ("use client").
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
