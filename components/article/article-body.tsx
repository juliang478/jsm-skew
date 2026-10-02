import type { NewsArticleDetail } from "@/lib/types";

export function ArticleBody({ article }: { article: NewsArticleDetail }) {
  return (
    <div className="mt-5 max-w-prose space-y-4 text-body-lg leading-relaxed text-text-primary">
      {article.bodyParagraphs.map((paragraph, index) => (
        <p key={`${article.id}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}