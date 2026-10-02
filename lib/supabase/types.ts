export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BiasLabel = "left" | "center" | "right" | "mixed" | "unclear";
export type SentimentLabel = "positive" | "neutral" | "negative";
export type LogLevel = "debug" | "info" | "warn" | "error";

export type Source = {
  id: string;
  name: string;
  listing_url: string;
  parser_strategy: string | null;
  active: boolean;
  logo_url: string | null;
  created_at: string;
};

export type Article = {
  id: string;
  source_id: string;
  url: string;
  canonical_url: string | null;
  title: string;
  image_url: string;
  published_at: string;
  raw_text: string;
  scraped_at: string;
  analyzed_at: string | null;
  created_at: string;
};

export type ArticleAnalysis = {
  id: string;
  article_id: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: SentimentLabel;
  bias_score: number;
  bias_label: BiasLabel;
  left_percentage: number;
  center_percentage: number;
  right_percentage: number;
  confidence: number;
  framing_notes: string | null;
  loaded_terms: string[];
  disclaimer: string | null;
  model: string;
  created_at: string;
};

export type Log = {
  id: string;
  level: LogLevel;
  event: string;
  message: string | null;
  context: Json | null;
  source_id: string | null;
  article_id: string | null;
  created_at: string;
};

export type OxylabsSchedule = {
  id: string;
  schedule_id: string;
  source_id: string;
  cron: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type OxylabsScheduleRun = {
  id: string;
  schedule_id: string;
  run_id: string;
  job_id: string | null;
  result_status: string | null;
  processed: boolean;
  created_at: string;
}

export type SourceInsert = Pick<Source, "name" | "listing_url"> &
  Partial<Omit<Source, "name" | "listing_url">>;
export type ArticleInsert = Pick<Article, "source_id" | "url" | "title" | "image_url" | "published_at"> &
  Partial<Omit<Article, "source_id" | "url" | "title" | "image_url" | "published_at">>;
export type ArticleAnalysisInsert = Pick<
  ArticleAnalysis,
  | "article_id"
  | "summary"
  | "sentiment_score"
  | "sentiment_label"
  | "bias_score"
  | "bias_label"
  | "left_percentage"
  | "center_percentage"
  | "right_percentage"
  | "confidence"
  | "model"
> & Partial<Omit<ArticleAnalysis, "article_id" | "summary" | "sentiment_score" | "sentiment_label" | "bias_score" | "bias_label" | "left_percentage" | "center_percentage" | "right_percentage" | "confidence" | "model">>;
export type LogInsert = Pick<Log, "event"> & Partial<Omit<Log, "event">>;
export type OxylabsScheduleInsert = Pick<OxylabsSchedule, "schedule_id" | "source_id" | "cron"> &
  Partial<Omit<OxylabsSchedule, "schedule_id" | "source_id" | "cron">>;
export type OxylabsScheduleRunInsert = Pick<OxylabsScheduleRun, "schedule_id" | "run_id"> &
  Partial<Omit<OxylabsScheduleRun, "schedule_id" | "run_id">>;

type Relationship<
  ForeignKeyName extends string,
  Column extends string,
  OneToOne extends boolean,
  ReferencedRelation extends string,
  ReferencedColumn extends string,
> = {
  foreignKeyName: ForeignKeyName;
  columns: [Column];
  isOneToOne: OneToOne;
  referencedRelation: ReferencedRelation;
  referencedColumns: [ReferencedColumn];
};

type Table<
  Row,
  Insert,
  Update,
  Relationships extends {
    foreignKeyName: string;
    columns: string[];
    isOneToOne?: boolean;
    referencedRelation: string;
    referencedColumns: string[];
  }[] = [],
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export interface Database {
  public: {
    Tables: {
      sources: Table<
        Source,
        SourceInsert,
        Partial<Source>,
        [Relationship<"articles_source_id_fkey", "id", false, "articles", "source_id">]
      >;
      articles: Table<
        Article,
        ArticleInsert,
        Partial<Article>,
        [Relationship<"articles_source_id_fkey", "source_id", false, "sources", "id">]
      >;
      article_analyses: Table<
        ArticleAnalysis,
        ArticleAnalysisInsert,
        Partial<ArticleAnalysis>,
        [Relationship<"article_analyses_article_id_fkey", "article_id", true, "articles", "id">]
      >;
      logs: Table<
        Log,
        LogInsert,
        Partial<Log>,
        [
          Relationship<"logs_source_id_fkey", "source_id", false, "sources", "id">,
          Relationship<"logs_article_id_fkey", "article_id", false, "articles", "id">
        ]
      >;
      oxylabs_schedules: Table<
        OxylabsSchedule,
        OxylabsScheduleInsert,
        Partial<OxylabsSchedule>,
        [Relationship<"oxylabs_schedules_source_id_fkey", "source_id", false, "sources", "id">]
      >;
      oxylabs_schedule_runs: Table<
        OxylabsScheduleRun,
        OxylabsScheduleRunInsert,
        Partial<OxylabsScheduleRun>,
        [Relationship<"oxylabs_schedule_runs_schedule_id_fkey", "schedule_id", false, "oxylabs_schedules", "schedule_id">]
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};