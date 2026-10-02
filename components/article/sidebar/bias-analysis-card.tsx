import { Button } from "@/components/ui/button";
import { SidebarCard } from "@/components/ui/sidebar-card";
import type { BiasLabel, NewsArticleDetail, SourceBias } from "@/lib/types";

const rows: { label: string; key: SourceBias; color: string }[] = [
  { label: "Left", key: "left", color: "bg-bias-left" },
  { label: "Center", key: "center", color: "bg-bias-center" },
  { label: "Right", key: "right", color: "bg-bias-right" },
];

function displayLabel(label: BiasLabel) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function strongestPercentage(article: NewsArticleDetail) {
  return Math.max(article.bias.left, article.bias.center, article.bias.right);
}

const labelColor: Record<BiasLabel, string> = {
  left: "text-bias-left",
  center: "text-text-primary",
  right: "text-bias-right",
  mixed: "text-accent",
  unclear: "text-text-secondary",
};

export function BiasAnalysisCard({ article }: { article: NewsArticleDetail }) {
  return (
    <SidebarCard title="Bias Analysis">
      <div className="border-b border-divider pb-4">
        <p className="text-caption font-medium text-text-primary">Overall Bias · AI Estimate</p>
        <p className={`mt-1 text-h3 font-bold ${labelColor[article.biasLabel]}`}>
          {displayLabel(article.biasLabel)} {strongestPercentage(article)}%
        </p>
        <p className="text-caption text-text-secondary">Based on {article.sourceCount} balanced sources</p>
      </div>
      <div className="my-3 grid gap-3">
        {rows.map((row) => (
          <div key={row.key} className="grid grid-cols-[3.5rem_2.5rem_minmax(0,1fr)] items-center gap-2 text-caption">
            <span className="text-text-primary">{row.label}</span>
            <span className="text-right text-text-secondary">{article.bias[row.key]}%</span>
            <div className="h-1.5 overflow-hidden rounded-full bg-bg-secondary">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: `${article.bias[row.key]}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="border-t border-divider pt-3 text-caption leading-relaxed text-text-secondary">
        Political framing is an AI estimate based on the wording and emphasis in available coverage.
      </p>
      {article.confidence !== undefined && (
        <p className="mt-2 text-caption text-text-secondary">Confidence: {Math.round(article.confidence * 100)}%</p>
      )}
      <p className="mt-3 text-caption leading-relaxed text-text-secondary">{article.framingNotes}</p>
      {article.loadedTerms.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-caption font-semibold text-text-primary">Loaded terms</p>
          <p className="text-caption text-text-secondary">{article.loadedTerms.join(", ")}</p>
        </div>
      )}
      <p className="mt-3 text-caption leading-relaxed text-text-secondary">{article.disclaimer}</p>
      <Button variant="outline" className="mt-3 w-full">How We Analyze Bias</Button>
    </SidebarCard>
  );
}