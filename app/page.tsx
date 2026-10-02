import { CategoryBar } from "@/components/layout/category-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TopBar } from "@/components/layout/top-bar";
import { NewsCard } from "@/components/ui/news-card";
import { toCardView } from "@/lib/supabase/mappers";
import { getHomeArticles } from "@/lib/supabase/queries/articles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = (await getHomeArticles()).map(toCardView);

  return (
    <>
      <TopBar />
      <SiteHeader />
      <CategoryBar />
      <main className="mx-auto w-full max-w-app flex-1 px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
        <h1 className="mb-5 text-h2 font-bold text-text-primary">Top News</h1>
        <section
          aria-label="Top news stories"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {articles.length > 0 ? articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          )) : (
            <p className="col-span-full py-8 text-body-sm text-text-secondary">
              No analyzed articles yet — run the pipeline to populate the feed.
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
