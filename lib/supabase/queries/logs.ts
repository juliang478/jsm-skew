import { createServiceClient } from "@/lib/supabase/server";
import type { Log, LogInsert } from "@/lib/supabase/types";

export async function createLog(entry: LogInsert): Promise<Log> {
  const { data, error } = await createServiceClient()
    .from("logs")
    .insert(entry)
    .select("*")
    .single();

  if (error) throw new Error(`Failed to create log entry: ${error.message}`);
  return data;
}

export async function getRecentLogs(limit = 50): Promise<Log[]> {
  const { data, error } = await createServiceClient()
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.max(0, limit));

  if (error) throw new Error(`Failed to load recent logs: ${error.message}`);
  return data ?? [];
}