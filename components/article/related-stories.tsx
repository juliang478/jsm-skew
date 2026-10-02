import { RelatedStoryCard } from "@/components/ui/related-story-card";
import type { NewsArticleCard } from "@/lib/types";

export function RelatedStories({ articles }: { articles: NewsArticleCard[] }) {
  // Keep related coverage within the article page's five-item limit.
  const related = articles.slice(0, 5);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-divider pt-5">
      <h2 className="mb-4 text-body-md font-semibold text-text-primary">Related Stories</h2>
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        {related.map((article) => <RelatedStoryCard key={article.id} article={article} />)}
      </div>
    </section>
  );
}