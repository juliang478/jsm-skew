import "server-only";

const OXYLABS_ENDPOINT = "https://realtime.oxylabs.io/v1/queries?type=raw";
const OXYLABS_TIMEOUT_MS = 180_000;

interface OxylabsResult {
  content?: unknown;
  status_code?: unknown;
  url?: unknown;
}

interface OxylabsResponse {
  results?: OxylabsResult[];
}

export interface ScrapedHtml {
  html: string;
  statusCode: number;
  finalUrl: string;
}

export class OxylabsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OxylabsError";
  }
}

function isOxylabsResponse(value: unknown): value is OxylabsResponse {
  return typeof value === "object" && value !== null && "results" in value;
}

export async function fetchHtml(url: string): Promise<ScrapedHtml> {
  const username = process.env.OXY_WSA_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD;

  if (!username || !password) {
    throw new OxylabsError("Oxylabs credentials are not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OXYLABS_TIMEOUT_MS);

  try {
    const response = await fetch(OXYLABS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source: "universal", url }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new OxylabsError(`Oxylabs request failed with HTTP ${response.status}.`);
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new OxylabsError("Oxylabs returned an invalid response.");
    }

    if (!isOxylabsResponse(payload)) {
      throw new OxylabsError("Oxylabs returned an invalid response.");
    }

    const result = payload.results?.[0];
    if (!result || typeof result.status_code !== "number") {
      throw new OxylabsError("Oxylabs did not return a page result.");
    }
    if (result.status_code >= 400) {
      throw new OxylabsError(`Target page returned HTTP ${result.status_code}.`);
    }
    if (typeof result.content !== "string" || !result.content.trim()) {
      throw new OxylabsError("Oxylabs returned an empty page.");
    }

    return {
      html: result.content,
      statusCode: result.status_code,
      finalUrl: typeof result.url === "string" ? result.url : url,
    };
  } catch (error) {
    if (error instanceof OxylabsError) throw error;
    if (controller.signal.aborted) {
      throw new OxylabsError("Oxylabs request timed out.");
    }
    throw new OxylabsError("Oxylabs request could not be completed.");
  } finally {
    clearTimeout(timeout);
  }
}