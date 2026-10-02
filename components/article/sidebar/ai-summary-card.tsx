import { Button } from "@/components/ui/button";
import { SidebarCard } from "@/components/ui/sidebar-card";
import type { NewsArticleDetail } from "@/lib/types";

export function AiSummaryCard({ article }: { article: NewsArticleDetail }) {
  return (
    <SidebarCard title="AI Summary">
      <p className="mb-4 text-caption text-text-secondary">
        Generated {article.summaryGenerated}<span aria-hidden="true"> · </span>{article.summaryReadTime}
      </p>
      <ul className="grid list-disc gap-3 pl-4 text-body-sm leading-relaxed text-text-primary">
        {article.summaryPoints.map((point, index) => <li key={`${article.id}-summary-${index}`}>{point}</li>)}
      </ul>
      <p className="mt-4 text-caption leading-relaxed text-text-secondary">
        AI summaries can make mistakes. {article.disclaimer}
      </p>
      <Button variant="outline" className="mt-3">Provide Feedback</Button>
    </SidebarCard>
  );
}