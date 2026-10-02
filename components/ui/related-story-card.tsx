import Image from "next/image";
import Link from "next/link";
import type { NewsArticleCard } from "@/lib/types";

export function RelatedStoryCard({ article }: { article: NewsArticleCard }) {
  return (
    <Link
      href={`/news/${article.id}`}
      className="group grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bg-secondary">
        <Image src={article.image} alt={article.imageAlt} fill unoptimized sizes="80px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-caption leading-tight text-text-secondary">{article.category} · {article.country}</p>
        <h3 className="mt-1 line-clamp-2 text-caption font-semibold leading-snug text-text-primary group-hover:underline">
          {article.title}
        </h3>
        <p className="mt-1 text-caption text-text-secondary">{article.publishedAt} · {article.readTime ?? "5 min read"}</p>
      </div>
    </Link>
  );
}