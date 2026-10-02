import type { ArticleViewRow } from "@/lib/supabase/queries/articles";
import type { BiasLabel as DatabaseBiasLabel, SentimentLabel as DatabaseSentimentLabel } from "@/lib/supabase/types";
import type { NewsArticleCard, NewsArticleDetail, SourceBias } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatArticleDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : dateFormatter.format(date);
}

export function readTimeFromText(text: string): string {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export function splitParagraphs(raw: string): string[] {
  const cleaned = raw.trim();
  if (!cleaned) return [];

  const paragraphs = cleaned
    .split(/\n\s*\n|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) return paragraphs;

  const sentences = cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length < 2) return paragraphs;

  const chunks: string[] = [];
  for (let index = 0; index < sentences.length; index += 3) {
    chunks.push(sentences.slice(index, index + 3).join(" "));
  }
  return chunks;
}

export function splitSummaryPoints(summary: string): string[] {
  const lines = summary
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);

  if (lines.length > 1) return lines;
  return splitParagraphs(summary);
}

export function leanFromLabel(label: DatabaseBiasLabel): SourceBias {
  if (label === "left" || label === "right") return label;
  return "center";
}

function displayLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function toCardView(row: ArticleViewRow): NewsArticleCard {
  const { article, source, analysis } = {
    article: row,
    source: row.source,
    analysis: row.analysis,
  };

  return {
    id: article.id,
    title: article.title,
    source: source.name,
    country: displayLabel(analysis.sentiment_label),
    image: article.image_url,
    imageAlt: article.title,
    category: source.name,
    publishedAt: formatArticleDate(article.published_at),
    sentimentLabel: analysis.sentiment_label as DatabaseSentimentLabel,
    framing: {
      left: analysis.left_percentage,
      center: analysis.center_percentage,
      right: analysis.right_percentage,
    },
    sourceCount: 1,
    biasLabel: analysis.bias_label,
    confidence: analysis.confidence,
  };
}

export function toDetailView(row: ArticleViewRow): NewsArticleDetail {
  const { source, analysis } = row;
  const biasLabel: DatabaseBiasLabel = analysis.bias_label;
  const disclaimer = analysis.disclaimer ??
    "Sentiment and framing are AI estimates for reader context, not objective measures.";

  return {
    id: row.id,
    title: row.title,
    category: source.name,
    country: displayLabel(analysis.sentiment_label),
    author: source.name,
    publishedDate: formatArticleDate(row.published_at),
    readTime: readTimeFromText(row.raw_text),
    imageUrl: row.image_url,
    imageAlt: row.title,
    imageCaption: row.title,
    imageCredit: source.name,
    bodyParagraphs: splitParagraphs(row.raw_text),
    bias: {
      left: analysis.left_percentage,
      center: analysis.center_percentage,
      right: analysis.right_percentage,
    },
    biasLabel,
    sentimentLabel: analysis.sentiment_label,
    confidence: analysis.confidence,
    framingNotes: analysis.framing_notes ?? "",
    loadedTerms: analysis.loaded_terms,
    disclaimer,
    summaryPoints: splitSummaryPoints(analysis.summary),
    summaryGenerated: formatArticleDate(row.analyzed_at ?? analysis.created_at),
    summaryReadTime: readTimeFromText(analysis.summary),
    sourceCount: 1,
    topSources: [{ name: source.name, bias: leanFromLabel(biasLabel) }],
    related: [],
  };
}