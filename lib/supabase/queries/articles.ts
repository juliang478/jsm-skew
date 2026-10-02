import { createServiceClient } from "@/lib/supabase/server";
import type { Article, ArticleAnalysis, ArticleInsert, Source } from "@/lib/supabase/types";

const MAX_URLS_PER_IN_QUERY = 15;

export interface ArticleViewRow extends Article {
  source: Source;
  analysis: ArticleAnalysis;
}

interface JoinedArticle extends Article {
  sources: Source | Source[] | null;
  article_analyses: ArticleAnalysis | ArticleAnalysis[] | null;
}

function firstRelation<T>(relation: T | T[] | null): T | null {
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation;
}

function normalizeJoinedArticle(row: JoinedArticle): ArticleViewRow | null {
  const source = firstRelation(row.sources);
  const analysis = firstRelation(row.article_analyses);

  if (!source || !analysis) return null;

  return { ...row, source, analysis };
}

export async function getHomeArticles(): Promise<ArticleViewRow[]> {
  const { data, error } = await createServiceClient()
    .from("articles")
    .select("*, sources(*), article_analyses!inner(*)")
    .not("analyzed_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Failed to load home articles: ${error.message}`);

  return ((data ?? []) as unknown as JoinedArticle[])
    .map(normalizeJoinedArticle)
    .filter((row): row is ArticleViewRow => row !== null);
}

export async function getArticleDetailById(id: string): Promise<ArticleViewRow | null> {
  const { data, error } = await createServiceClient()
    .from("articles")
    .select("*, sources(*), article_analyses(*)")
    .eq("id", id)
    .not("analyzed_at", "is", null)
    .maybeSingle();

  if (error) throw new Error(`Failed to load article detail: ${error.message}`);
  if (!data) return null;

  return normalizeJoinedArticle(data as unknown as JoinedArticle);
}

export async function articleUrlsExist(urls: string[]): Promise<Set<string>> {
  const uniqueUrls = [...new Set(urls)];
  const existingUrls = new Set<string>();
  const client = createServiceClient();

  for (let offset = 0; offset < uniqueUrls.length; offset += MAX_URLS_PER_IN_QUERY) {
    const chunk = uniqueUrls.slice(offset, offset + MAX_URLS_PER_IN_QUERY);
    const [originalResult, canonicalResult] = await Promise.all([
      client.from("articles").select("url").in("url", chunk),
      client.from("articles").select("canonical_url").in("canonical_url", chunk),
    ]);

    if (originalResult.error) {
      throw new Error(`Failed to check existing article URLs: ${originalResult.error.message}`);
    }
    if (canonicalResult.error) {
      throw new Error(`Failed to check existing canonical URLs: ${canonicalResult.error.message}`);
    }

    for (const row of originalResult.data ?? []) existingUrls.add(row.url);
    for (const row of canonicalResult.data ?? []) {
      if (row.canonical_url) existingUrls.add(row.canonical_url);
    }
  }

  return existingUrls;
}

export async function insertArticle(row: ArticleInsert): Promise<boolean> {
  const { error } = await createServiceClient().from("articles").insert(row);

  if (error?.code === "23505") return false;
  if (error) throw new Error(`Failed to insert article: ${error.message}`);
  return true;
}