import "server-only";
import { load } from "cheerio";
import type { Source } from "@/lib/supabase/types";
import { normalizeUrl } from "./candidate-url";

const STORY_LINK_SELECTORS = [
  "main article a[href]",
  "main [data-testid*='story'] a[href]",
  "main [data-testid*='article'] a[href]",
  "main [data-testid*='card'] a[href]",
  "main [class*='story'] a[href]",
  "main [class*='article'] a[href]",
  "main [class*='card'] a[href]",
  "main h1 a[href], main h2 a[href], main h3 a[href]",
  "article a[href]",
].join(",");

export function extractCandidateLinks(html: string, source: Source): string[] {
  const $ = load(html);
  $(
    "nav, footer, aside, [role='navigation'], [aria-hidden='true'], [hidden], " +
      "[style*='display:none'], [style*='display: none'], [class~='hidden'], [class*='visually-hidden'], " +
      "[class*='newsletter'], [class*='subscription'], [class*='menu'], [class*='advert']",
  ).remove();

  const links = new Set<string>();
  const baseUrl = new URL(source.listing_url);

  $(STORY_LINK_SELECTORS).each((_index, element) => {
    const href = $(element).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    try {
      const normalized = normalizeUrl(new URL(href, baseUrl).toString());
      if (normalized) links.add(normalized);
    } catch {
      return;
    }
  });

  return [...links];
}