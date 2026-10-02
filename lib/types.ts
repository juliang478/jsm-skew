export type BiasLabel = "left" | "center" | "right" | "mixed" | "unclear";
export type SentimentLabel = "positive" | "neutral" | "negative";
export type SourceBias = "left" | "center" | "right";

export interface BiasBreakdown {
  left: number;
  center: number;
  right: number;
}

export interface NewsArticleCard {
  id: string;
  title: string;
  source: string;
  country: string;
  image: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  readTime?: string;
  sentimentLabel: SentimentLabel;
  framing: BiasBreakdown;
  sourceCount: number;
  biasLabel?: BiasLabel;
  confidence?: number;
}

export interface NewsArticleDetail {
  id: string;
  title: string;
  category: string;
  country: string;
  author: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
  imageCredit: string;
  bodyParagraphs: string[];
  bias: BiasBreakdown;
  biasLabel: BiasLabel;
  sentimentLabel: SentimentLabel;
  confidence?: number;
  framingNotes: string;
  loadedTerms: string[];
  disclaimer: string;
  summaryPoints: string[];
  summaryGenerated: string;
  summaryReadTime: string;
  sourceCount: number;
  topSources: { name: string; bias: SourceBias }[];
  related: NewsArticleCard[];
}