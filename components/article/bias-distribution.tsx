import { BiasMeter } from "@/components/ui/bias-meter";
import type { NewsArticleDetail } from "@/lib/types";

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function BiasDistribution({ article }: { article: NewsArticleDetail }) {
  return (
    <section aria-label="AI-estimated bias distribution" className="mt-4 rounded-md border border-border bg-bg-primary p-4">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-body-sm font-semibold text-text-primary">AI-Estimated Bias Distribution</h2>
        <InfoIcon />
      </div>
      <BiasMeter left={article.bias.left} center={article.bias.center} right={article.bias.right} />
      <p className="mt-3 text-caption font-medium text-text-primary">{article.sourceCount} sources</p>
    </section>
  );
}