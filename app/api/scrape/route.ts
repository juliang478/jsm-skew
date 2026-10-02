import "server-only";
import { timingSafeEqual } from "node:crypto";
import { InvalidSourceSelectionError, runManualScrape } from "@/lib/pipeline/scrape";

const ADMIN_SECRET_HEADER = "x-biasly-admin-secret";

interface ScrapeRequestBody {
  sources?: string[];
  limitPerSource?: number;
}

function hasValidSecret(request: Request): boolean {
  const expected = process.env.BIASLY_ADMIN_SECRET;
  const received = request.headers.get(ADMIN_SECRET_HEADER);
  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBody(value: unknown): ScrapeRequestBody | null {
  if (!isRecord(value)) return null;

  const sources = value.sources;
  if (
    sources !== undefined &&
    (!Array.isArray(sources) || sources.length === 0 || sources.some((source) => typeof source !== "string" || !source.trim()))
  ) {
    return null;
  }

  const limitPerSource = value.limitPerSource;
  if (limitPerSource !== undefined && (!Number.isInteger(limitPerSource) || (limitPerSource as number) < 1 || (limitPerSource as number) > 25)) {
    return null;
  }

  return {
    ...(sources === undefined ? {} : { sources: sources as string[] }),
    ...(limitPerSource === undefined ? {} : { limitPerSource: limitPerSource as number }),
  };
}

export async function POST(request: Request): Promise<Response> {
  if (!hasValidSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const options = parseBody(body);
  if (!options) return Response.json({ error: "Invalid scrape options." }, { status: 400 });

  try {
    const summary = await runManualScrape(options);
    return Response.json(summary);
  } catch (error) {
    if (error instanceof InvalidSourceSelectionError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("[scrape] request failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return Response.json({ error: "Scrape could not be completed." }, { status: 500 });
  }
}