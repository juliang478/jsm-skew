import "server-only";
import type { Source } from "@/lib/supabase/types";

export const NON_ARTICLE_PATTERNS = [
  /(?:^|\/)(?:sections?|categories?|topics?|tags?|authors?|search)(?:\/|$)/i,
  /(?:^|\/)(?:shows?|programs?|podcasts?|live|games?)(?:\/|$)/i,
  /(?:^|\/)(?:products?|reviews?|shopping)(?:\/|$)/i,
  /(?:^|\/)(?:corporate|company|about|support|help)(?:\/|$)/i,
  /(?:^|\/)(?:newsletters?|subscriptions?|subscribe)(?:\/|$)/i,
  /(?:^|\/)(?:videos?)(?:\/|$)/i,
];

const TRACKING_PARAMETERS = /^(?:utm_.+|fbclid|gclid|mc_cid|mc_eid|ref_src)$/i;

export function normalizeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    url.hash = "";
    for (const parameter of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMETERS.test(parameter)) url.searchParams.delete(parameter);
    }
    url.searchParams.sort();
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");

    return url.toString();
  } catch {
    return null;
  }
}

export function isRejectedUrl(value: string): boolean {
  try {
    const pathname = decodeURIComponent(new URL(value).pathname);
    return NON_ARTICLE_PATTERNS.some((pattern) => pattern.test(pathname));
  } catch {
    return true;
  }
}

function hasArticleShape(hostname: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "");

  if (hostname.endsWith("reuters.com")) {
    return /(?:^|\/)(?:id[A-Z0-9]{6,}|[^/]+-20\d{2}-\d{2}-\d{2}|[^/]+-id[A-Z0-9]+)(?:\.html)?$/i.test(path);
  }
  if (hostname.endsWith("npr.org")) {
    return /^\/\d{4}\/\d{2}\/\d{2}\/.+/.test(path);
  }
  if (hostname.endsWith("foxnews.com")) {
    const segments = path.split("/").filter(Boolean);
    const slug = segments.at(-1) ?? "";
    return segments.length >= 2 && (slug.split(/[-_]/).filter(Boolean).length >= 3 || /\d{5,}/.test(slug));
  }
  if (hostname.endsWith("bbc.com") || hostname.endsWith("bbc.co.uk")) {
    return /^\/news\/(?:articles\/)?[a-z0-9-]{6,}$/i.test(path);
  }
  if (hostname.endsWith("theguardian.com")) {
    return /^\/(?:[^/]+\/)?20\d{2}\/[a-z]{3}\/\d{1,2}\/[^/]+$/i.test(path);
  }

  const segments = path.split("/").filter(Boolean);
  const finalSegment = segments.at(-1) ?? "";
  const hasDate = /(?:^|\/)20\d{2}\/\d{1,2}\/\d{1,2}(?:\/|$)/.test(path);
  const hasId = /(?:^|[-_/])(?:id)?[a-z0-9]{7,}(?:\.html)?$/i.test(finalSegment);
  const hasLongSlug = finalSegment.replace(/\.[^.]+$/, "").split(/[-_]/).filter(Boolean).length >= 5;
  return hasDate || hasId || hasLongSlug;
}

export function isLikelyArticleUrl(value: string, source: Source): boolean {
  const normalized = normalizeUrl(value);
  if (!normalized || isRejectedUrl(normalized)) return false;

  try {
    const url = new URL(normalized);
    const sourceUrl = new URL(source.listing_url);
    if (url.hostname.toLowerCase() !== sourceUrl.hostname.toLowerCase()) return false;
    if (url.pathname === sourceUrl.pathname.replace(/\/+$/, "")) return false;
    if (
      (url.hostname.endsWith("bbc.com") || url.hostname.endsWith("bbc.co.uk")) &&
      /^\/news\/sport(?:\/|$)/i.test(url.pathname)
    ) {
      return false;
    }
    return hasArticleShape(url.hostname.toLowerCase(), decodeURIComponent(url.pathname));
  } catch {
    return false;
  }
}