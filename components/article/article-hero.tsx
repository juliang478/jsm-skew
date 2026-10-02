import Image from "next/image";
import type { NewsArticleDetail } from "@/lib/types";

export function ArticleHero({ article }: { article: NewsArticleDetail }) {
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-md bg-bg-secondary">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          unoptimized
          priority
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2 text-caption leading-relaxed text-text-secondary">
        {article.imageCaption}<br />Photo: {article.imageCredit}
      </figcaption>
    </figure>
  );
}