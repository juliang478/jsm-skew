import { createServiceClient } from "@/lib/supabase/server";
import type { Source } from "@/lib/supabase/types";

export async function getActiveSources(): Promise<Source[]> {
  const { data, error } = await createServiceClient()
    .from("sources")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) throw new Error(`Failed to load active sources: ${error.message}`);
  return data ?? [];
}

export async function getAllSources(): Promise<Source[]> {
  const { data, error } = await createServiceClient()
    .from("sources")
    .select("*")
    .order("name");

  if (error) throw new Error(`Failed to load sources: ${error.message}`);
  return data ?? [];
}