import "server-only";
import { getActiveSources } from "@/lib/supabase/queries/sources";

export async function GET(): Promise<Response> {
  try {
    const sources = await getActiveSources();
    return Response.json({
      sources: sources.map(({ id, name, listing_url }) => ({ id, name, listing_url })),
    });
  } catch (error) {
    console.error("[sources] failed to load active sources", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return Response.json({ error: "Sources could not be loaded." }, { status: 500 });
  }
}