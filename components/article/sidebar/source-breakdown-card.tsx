import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarCard } from "@/components/ui/sidebar-card";
import type { NewsArticleDetail, SourceBias } from "@/lib/types";

const sourceRows: { label: string; key: SourceBias; color: string }[] = [
  { label: "Left", key: "left", color: "bg-bias-left" },
  { label: "Center", key: "center", color: "bg-bias-center" },
  { label: "Right", key: "right", color: "bg-bias-right" },
];

const badgeTone = {
  left: "left",
  center: "center",
  right: "right",
} as const;

export function SourceBreakdownCard({ article }: { article: NewsArticleDetail }) {
  return (
    <SidebarCard title="Source Breakdown">
      <p className="mb-4 text-caption font-medium text-text-primary">{article.sourceCount} Total Sources</p>
      <div className="grid gap-3 border-b border-divider pb-4">
        {sourceRows.map((row) => {
          const percentage = article.bias[row.key];
          const count = Math.round(article.sourceCount * percentage / 100);
          return (
            <div key={row.key} className="grid grid-cols-[3.5rem_3.5rem_minmax(0,1fr)] items-center gap-2 text-caption">
              <span>{row.label}</span>
              <span className="text-right text-text-secondary">{count} ({percentage}%)</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-bg-secondary">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mb-3 mt-4 flex justify-between text-caption font-semibold text-text-secondary">
        <h3>Top Sources</h3>
        <span>Bias</span>
      </div>
      <ul className="grid gap-2.5">
        {article.topSources.map((source) => (
          <li key={source.name} className="flex items-center justify-between gap-3 text-caption">
            <span className="min-w-0 truncate text-text-primary">{source.name}</span>
            <Badge tone={badgeTone[source.bias]} className="min-h-0 px-1.5 capitalize">{source.bias}</Badge>
          </li>
        ))}
      </ul>
      <Button variant="outline" className="mt-4 w-full">View All Sources</Button>
    </SidebarCard>
  );
}