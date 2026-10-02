import "server-only";
import { load } from "cheerio";
import type { Source } from "@/lib/supabase/types";
import { isLikelyArticleUrl, isRejectedUrl, normalizeUrl } from "./candidate-url";

export interface ParsedArticle {
  title: string;
  imageUrl: string;
  publishedAt: string;
  canonicalUrl: string | null;
  rawText: string;
}

export type ParseArticleResult =
  | { ok: true; article: ParsedArticle }
  | { ok: false; reason: string };

const BODY_SELECTORS = [
  '[itemprop="articleBody"]',
  '[data-testid*="article-body"]',
  '[class*="article-body"]',
  '[class*="story-body"]',
  "article",
  "main",
];

const REMOVAL_SELECTORS = [
  "script",
  "style",
  "noscript",
  "svg",
  "nav",
  "footer",
  "aside",
  "form",
  "figure",
  "[role='navigation']",
  "[class*='advert']",
  "[id*='advert']",
  "[class*='newsletter']",
  "[id*='newsletter']",
  "[class*='subscription']",
  "[id*='subscription']",
  "[class*='related']",
  "[id*='related']",
  "[class*='most-viewed']",
  "[class*='most_viewed']",
  "[class*='load-more']",
  "[class*='social-share']",
  "[class*='share-buttons']",
].join(",");

function cleanText(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/\b(?:javascript error|enable javascript|loading\.\.\.)\b/gi, "")
    .replace(/(?:\.[\w-]+\s*\{[^}]*\}\s*){2,}/g, "")
    .trim();
}

function isGenericTitle(title: string): boolean {
  const normalized = title.toLowerCase().replace(/\s+/g, " ").trim();
  return (
    normalized.length < 12 ||
    /^(?:home|news|world|politics|business|technology|sports|sport|live|watch|video|podcasts?|shows?|games?|search|subscribe)(?: news)?$/i.test(
      normalized,
    )
  );
}

function getPublishedDate($: ReturnType<typeof load>): string | null {
  const candidates: string[] = [];
  const metadata = $(
    'meta[property="article:published_time"], meta[name="datePublished"], [itemprop="datePublished"]',
  );
  metadata.each((_index, element) => {
    const value = $(element).attr("content") ?? $(element).attr("datetime");
    if (value) candidates.push(value);
  });
  $("time[datetime]").each((_index, element) => {
    const value = $(element).attr("datetime");
    if (value) candidates.push(value);
  });

  for (const script of $("script[type='application/ld+json']").toArray()) {
    try {
      const value: unknown = JSON.parse($(script).text());
      collectPublishedDates(value, candidates);
    } catch {
      continue;
    }
  }

  for (const candidate of candidates) {
    const timestamp = Date.parse(candidate);
    if (Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
  }
  return null;
}

function collectPublishedDates(value: unknown, candidates: string[]): void {
  if (Array.isArray(value)) {
    for (const item of value) collectPublishedDates(item, candidates);
    return;
  }
  if (typeof value !== "object" || value === null) return;

  for (const [key, nested] of Object.entries(value)) {
    if (key === "datePublished" && typeof nested === "string") candidates.push(nested);
    else collectPublishedDates(nested, candidates);
  }
}

function getArticleText($: ReturnType<typeof load>): string {
  let body = $(BODY_SELECTORS[0]).first();
  for (const selector of BODY_SELECTORS) {
    const candidate = $(selector).first();
    if (candidate.find("p").length > 0 && cleanText(candidate.text()).length >= 100) {
      body = candidate;
      break;
    }
  }

  const paragraphs: string[] = [];
  body.find("p").each((_index, element) => {
    const paragraph = cleanText($(element).text());
    if (paragraph.length >= 35) paragraphs.push(paragraph);
  });

  if (paragraphs.length === 0) {
    const text = cleanText(body.text());
    if (text.length >= 900) {
      const sentences = text.split(/(?<=[.!?])\s+/);
      let current = "";
      for (const sentence of sentences) {
        current = current ? `${current} ${sentence}` : sentence;
        if (current.length >= 350) {
          paragraphs.push(current);
          current = "";
        }
      }
      if (current) paragraphs.push(current);
    }
  } else if (paragraphs.length === 1 && paragraphs[0].length >= 500) {
    const sentences = paragraphs[0].split(/(?<=[.!?])\s+/);
    const splitParagraphs: string[] = [];
    let current = "";
    for (const sentence of sentences) {
      current = current ? `${current} ${sentence}` : sentence;
      if (current.length >= 350) {
        splitParagraphs.push(current);
        current = "";
      }
    }
    if (current) splitParagraphs.push(current);
    paragraphs.splice(0, paragraphs.length, ...splitParagraphs);
  }

  return paragraphs.join("\n\n");
}

export function parseArticle(html: string, url: string, source: Source): ParseArticleResult {
  if (!isLikelyArticleUrl(url, source)) return { ok: false, reason: "not_article_url" };

  const $ = load(html);
  const title = cleanText(
    $("meta[property='og:title']").attr("content") ||
      $("meta[name='twitter:title']").attr("content") ||
      $("h1").first().text() ||
      $("title").text(),
  );
  if (isGenericTitle(title)) return { ok: false, reason: "generic_title" };

  const rawImage =
    $("meta[property='og:image']").attr("content") ??
    $("meta[name='twitter:image']").attr("content") ??
    $("article img[src]").first().attr("src");
  let imageUrl: string | null = null;
  try {
    if (rawImage) imageUrl = normalizeUrl(new URL(rawImage, url).toString());
  } catch {
    imageUrl = null;
  }
  if (!imageUrl || /placeholder|default-image|no-image/i.test(imageUrl)) {
    return { ok: false, reason: "missing_image" };
  }

  const publishedAt = getPublishedDate($);
  if (!publishedAt) return { ok: false, reason: "missing_published_date" };

  const canonicalValue = $("link[rel='canonical']").attr("href") ?? $("meta[property='og:url']").attr("content");
  let canonicalUrl: string | null = null;
  try {
    if (canonicalValue) canonicalUrl = normalizeUrl(new URL(canonicalValue, url).toString());
  } catch {
    canonicalUrl = null;
  }
  if (canonicalValue && (!canonicalUrl || isRejectedUrl(canonicalUrl) || !isLikelyArticleUrl(canonicalUrl, source))) {
    return { ok: false, reason: "invalid_canonical_url" };
  }

  $(REMOVAL_SELECTORS).remove();
  const rawText = getArticleText($);
  const meaningfulParagraphs = rawText.split("\n\n").filter((paragraph) => paragraph.length >= 40);
  if (meaningfulParagraphs.length < 3 && rawText.length < 900) {
    return { ok: false, reason: "insufficient_article_body" };
  }

  return {
    ok: true,
    article: { title, imageUrl, publishedAt, canonicalUrl, rawText },
  };
}