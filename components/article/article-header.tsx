import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NewsArticleDetail } from "@/lib/types";

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12v16l-6-4-6 4V4z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

export function ArticleHeader({ article }: { article: NewsArticleDetail }) {
  return (
    <header>
      <p className="mb-2 text-caption text-text-secondary">
        <span className="font-medium text-text-primary">{article.category}</span>
        <span aria-hidden="true"> · </span>{article.country}
      </p>
      <h1 className="text-h2 font-bold leading-tight text-text-primary sm:text-h1">
        {article.title}
      </h1>
      <div className="my-4 flex flex-wrap items-center justify-between gap-3 border-b border-divider pb-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-caption text-text-secondary">
          <span className="text-text-primary">By {article.author}</span>
          <span aria-hidden="true">·</span>
          <time>{article.publishedDate}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
          <Badge tone={article.sentimentLabel} className="capitalize">{article.sentimentLabel}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="text" title="Save story" aria-label="Save story" className="size-9 min-h-9 px-0"><BookmarkIcon /></Button>
          <Button variant="text" title="Share story" aria-label="Share story" className="size-9 min-h-9 px-0"><ShareIcon /></Button>
          <Button variant="text" title="More story actions" aria-label="More story actions" className="size-9 min-h-9 px-0"><MoreIcon /></Button>
        </div>
      </div>
    </header>
  );
}