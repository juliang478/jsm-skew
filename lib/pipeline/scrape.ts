import "server-only";
import type { ArticleInsert, Source } from "@/lib/supabase/types";
import { articleUrlsExist, insertArticle } from "@/lib/supabase/queries/articles";
import { createLog } from "@/lib/supabase/queries/logs";
import { getActiveSources } from "@/lib/supabase/queries/sources";
import { parseArticle } from "@/lib/scraping/article";
import { isLikelyArticleUrl, isRejectedUrl, normalizeUrl } from "@/lib/scraping/candidate-url";
import { extractCandidateLinks } from "@/lib/scraping/extract";
import { fetchHtml } from "@/lib/scraping/oxylabs";
import type { ScrapeSummary, SourceScrapeResult } from "./types";

export const DEFAULT_LIMIT_PER_SOURCE = 5;
const MAX_LIMIT_PER_SOURCE = 25;
const MAX_CANDIDATES_PER_SOURCE = 60;

export interface ManualScrapeOptions {
  sources?: string[];
  limitPerSource?: number;
}

export class InvalidSourceSelectionError extends Error {
  constructor() {
    super("One or more selected sources are not active.");
    this.name = "InvalidSourceSelectionError";
  }
}

function emptySourceResult(): SourceScrapeResult {
  return {
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    rejectionReasons: {},
    failed: false,
  };
}

function addReason(result: SourceScrapeResult, reason: string): void {
  result.rejectionReasons[reason] = (result.rejectionReasons[reason] ?? 0) + 1;
}

function makeSummary(results: SourceScrapeResult[], durationMs: number): ScrapeSummary {
  const rejectionReasons: Record<string, number> = {};
  for (const result of results) {
    for (const [reason, count] of Object.entries(result.rejectionReasons)) {
      rejectionReasons[reason] = (rejectionReasons[reason] ?? 0) + count;
    }
  }

  const failedSources = results.filter((result) => result.failed).length;
  const status = results.length === 0 || failedSources === results.length
    ? "failed"
    : failedSources > 0
      ? "partial"
      : "complete";

  return {
    status,
    sourcesChecked: results.length,
    candidatesFound: results.reduce((sum, result) => sum + result.candidatesFound, 0),
    candidatesRejected: results.reduce((sum, result) => sum + result.candidatesRejected, 0),
    duplicatesSkipped: results.reduce((sum, result) => sum + result.duplicatesSkipped, 0),
    detailPagesScraped: results.reduce((sum, result) => sum + result.detailPagesScraped, 0),
    articlesInserted: results.reduce((sum, result) => sum + result.articlesInserted, 0),
    articlesRejected: results.reduce((sum, result) => sum + result.articlesRejected, 0),
    articlesFailed: results.reduce((sum, result) => sum + result.articlesFailed, 0),
    durationMs,
    rejectionReasons,
  };
}

export async function processSourceHomepage(
  source: Source,
  homepageHtml: string,
  limitPerSource: number,
): Promise<SourceScrapeResult> {
  const result = emptySourceResult();
  const links = extractCandidateLinks(homepageHtml, source);
  result.candidatesFound = links.length;
  console.info("[scrape] candidate links found", { source: source.name, count: links.length });

  const candidates = new Set<string>();
  for (const link of links) {
    const normalized = normalizeUrl(link);
    if (!normalized || isRejectedUrl(normalized) || !isLikelyArticleUrl(normalized, source)) {
      result.candidatesRejected += 1;
      addReason(result, "candidate_url_rejected");
      continue;
    }
    candidates.add(normalized);
  }

  const candidateUrls = [...candidates];
  if (result.candidatesRejected > 0) {
    console.info("[scrape] candidates rejected before detail scrape", {
      source: source.name,
      count: result.candidatesRejected,
    });
  }
  if (candidateUrls.length > MAX_CANDIDATES_PER_SOURCE) {
    const overflow = candidateUrls.length - MAX_CANDIDATES_PER_SOURCE;
    result.candidatesRejected += overflow;
    addReason(result, "candidate_cap_reached");
    candidateUrls.length = MAX_CANDIDATES_PER_SOURCE;
  }

  const existingUrls = await articleUrlsExist(candidateUrls);
  const newUrls = candidateUrls.filter((url) => !existingUrls.has(url));
  result.duplicatesSkipped += candidateUrls.length - newUrls.length;
  if (result.duplicatesSkipped > 0) {
    console.info("[scrape] duplicates skipped", { source: source.name, count: result.duplicatesSkipped });
  }

  for (const url of newUrls) {
    if (result.articlesInserted >= limitPerSource) break;

    try {
      const detail = await fetchHtml(url);
      result.detailPagesScraped += 1;
      console.info("[scrape] detail page scraped", { source: source.name, url });
      const parsed = parseArticle(detail.html, url, source);
      if (!parsed.ok) {
        result.articlesRejected += 1;
        addReason(result, parsed.reason);
        console.warn("[scrape] article rejected after validation", {
          source: source.name,
          url,
          reason: parsed.reason,
        });
        continue;
      }

      if (parsed.article.canonicalUrl && !existingUrls.has(parsed.article.canonicalUrl)) {
        const canonicalMatches = await articleUrlsExist([parsed.article.canonicalUrl]);
        for (const canonicalUrl of canonicalMatches) existingUrls.add(canonicalUrl);
        if (canonicalMatches.has(parsed.article.canonicalUrl)) {
          result.duplicatesSkipped += 1;
          addReason(result, "canonical_duplicate");
          continue;
        }
      } else if (parsed.article.canonicalUrl && existingUrls.has(parsed.article.canonicalUrl)) {
        result.duplicatesSkipped += 1;
        addReason(result, "canonical_duplicate");
        continue;
      }

      const articleRow: ArticleInsert = {
        source_id: source.id,
        url,
        canonical_url: parsed.article.canonicalUrl,
        title: parsed.article.title,
        image_url: parsed.article.imageUrl,
        published_at: parsed.article.publishedAt,
        raw_text: parsed.article.rawText,
        scraped_at: new Date().toISOString(),
        analyzed_at: null,
      };

      const inserted = await insertArticle(articleRow);
      if (inserted) {
        result.articlesInserted += 1;
        if (parsed.article.canonicalUrl) existingUrls.add(parsed.article.canonicalUrl);
        existingUrls.add(url);
        console.info("[scrape] article inserted", { source: source.name, url });
      } else {
        result.duplicatesSkipped += 1;
        addReason(result, "database_duplicate");
        console.info("[scrape] duplicate skipped", { source: source.name, url });
      }
    } catch (error) {
      result.articlesFailed += 1;
      addReason(result, "detail_page_failed");
      console.error("[scrape] detail page failed", {
        source: source.name,
        url,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return result;
}

export async function runManualScrape(options: ManualScrapeOptions = {}): Promise<ScrapeSummary> {
  const startedAt = Date.now();
  const limitPerSource = options.limitPerSource ?? DEFAULT_LIMIT_PER_SOURCE;
  if (!Number.isInteger(limitPerSource) || limitPerSource < 1 || limitPerSource > MAX_LIMIT_PER_SOURCE) {
    throw new RangeError(`limitPerSource must be between 1 and ${MAX_LIMIT_PER_SOURCE}.`);
  }

  console.info("[scrape] started", { limitPerSource });
  const activeSources = await getActiveSources();
  const selectedSources = options.sources
    ? activeSources.filter((source) =>
        options.sources?.some(
          (selection) => selection === source.id || selection.toLowerCase() === source.name.toLowerCase(),
        ),
      )
    : activeSources;

  if (options.sources && selectedSources.length !== new Set(options.sources).size) {
    throw new InvalidSourceSelectionError();
  }

  console.info("[scrape] selected sources", { sources: selectedSources.map((source) => source.name) });
  const results: SourceScrapeResult[] = [];

  for (const source of selectedSources) {
    console.info("[scrape] source started", { source: source.name, url: source.listing_url });
    try {
      const homepage = await fetchHtml(source.listing_url);
      console.info("[scrape] homepage fetched", { source: source.name, statusCode: homepage.statusCode });
      const result = await processSourceHomepage(source, homepage.html, limitPerSource);
      results.push(result);
      console.info("[scrape] source completed", { source: source.name, ...result });
    } catch (error) {
      const result = emptySourceResult();
      result.failed = true;
      result.articlesFailed = 1;
      addReason(result, "source_failed");
      results.push(result);
      console.error("[scrape] source failed", {
        source: source.name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const summary = makeSummary(results, Date.now() - startedAt);
  console.info("[scrape] completed", summary);

  try {
    await createLog({
      level: summary.status === "failed" ? "error" : summary.status === "partial" ? "warn" : "info",
      event: "scrape.summary",
      message: `Manual scrape ${summary.status}: inserted ${summary.articlesInserted} articles.`,
      context: { ...summary },
    });
  } catch (error) {
    console.error("[scrape] failed to persist summary log", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return summary;
}