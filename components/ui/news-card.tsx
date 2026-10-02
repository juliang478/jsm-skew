import Image from "next/image";
import Link from "next/link";
import { BiasMeter } from "@/components/ui/bias-meter";
import type { NewsArticleCard } from "@/lib/types";

export function NewsCard({ article }: { article: NewsArticleCard }) {
  return (
    <Link
      href={`/news/${article.id}`}
      className="group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
    <article className="overflow-hidden rounded-md border border-border bg-bg-primary shadow-sm transition-shadow group-hover:shadow-md">
      <div className="relative aspect-video overflow-hidden rounded-md bg-bg-secondary">
        <Image
          src={article.image}
          alt={article.imageAlt}
          width={1000}
          height={563}
          unoptimized
          className="h-full w-full object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 grid size-6 place-items-center rounded-full border border-bg-primary/80 bg-text-primary/40 text-bg-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
        </span>
      </div>
      <div className="flex min-h-34 flex-col justify-between px-3 py-2">
        <p className="text-caption text-text-secondary">
          {article.biasLabel ? (
            <>
              <span className="font-semibold text-text-primary">{article.source}</span>
              <span aria-hidden="true"> · </span>
              {article.publishedAt}
            </>
          ) : (
            <>
              <span className="font-semibold text-text-primary">{article.category}</span>
              <span aria-hidden="true"> · </span>
              {article.country}
            </>
          )}
        </p>
        <h2 className="line-clamp-2 text-body-md font-semibold leading-tight text-text-primary">
          {article.title}
        </h2>
        <BiasMeter
          left={article.framing.left}
          center={article.framing.center}
          right={article.framing.right}
          compact
        />
        {article.biasLabel ? (
          <p className="text-caption text-text-secondary">
            AI-estimated {article.biasLabel} · {article.sentimentLabel}
            {article.confidence !== undefined && ` · ${Math.round(article.confidence * 100)}% confidence`}
          </p>
        ) : (
          <p className="text-caption text-text-secondary">
            {article.sourceCount} {article.sourceCount === 1 ? "source" : "sources"}
          </p>
        )}
      </div>
    </article>
    </Link>
  );
}