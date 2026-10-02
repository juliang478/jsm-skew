import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article/article-body";
import { ArticleHeader } from "@/components/article/article-header";
import { ArticleHero } from "@/components/article/article-hero";
import { BiasDistribution } from "@/components/article/bias-distribution";
import { RelatedStories } from "@/components/article/related-stories";
import { AiSummaryCard } from "@/components/article/sidebar/ai-summary-card";
import { BiasAnalysisCard } from "@/components/article/sidebar/bias-analysis-card";
import { SourceBreakdownCard } from "@/components/article/sidebar/source-breakdown-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsletterCta } from "@/components/layout/newsletter-cta";
import { TopBar } from "@/components/layout/top-bar";
import { toDetailView } from "@/lib/supabase/mappers";
import { getArticleDetailById } from "@/lib/supabase/queries/articles";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const row = await getArticleDetailById(id);

	if (!row) notFound();
	const article = toDetailView(row);

	return (
		<>
			<TopBar />
			<SiteHeader />
			<main className="flex-1 bg-surface">
				<div className="mx-auto max-w-app px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
					<div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
						<article className="min-w-0 lg:col-span-2">
							<ArticleHeader article={article} />
							<ArticleHero article={article} />
							<BiasDistribution article={article} />
							<ArticleBody article={article} />
							<div className="mt-6">
								<RelatedStories articles={article.related} />
							</div>
						</article>
						<aside aria-label="Article analysis" className="grid min-w-0 content-start gap-4 lg:sticky lg:top-24 lg:col-span-1">
							<BiasAnalysisCard article={article} />
							<AiSummaryCard article={article} />
							<SourceBreakdownCard article={article} />
						</aside>
					</div>
					<NewsletterCta />
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
