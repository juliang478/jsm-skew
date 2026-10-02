import type {
  BiasLabel,
  NewsArticleCard,
  NewsArticleDetail,
  SourceBias,
} from "@/lib/types";

export const MOCK_ARTICLES: NewsArticleCard[] = [
  {
    id: "peace-proposal",
    category: "Politics",
    country: "United States",
    source: "Reuters",
    title: "Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "United States flags outside a government building",
    publishedAt: "2 hours ago",
    sentimentLabel: "neutral",
    framing: { left: 20, center: 31, right: 49 },
    sourceCount: 12,
  },
  {
    id: "grapes-health",
    category: "Health",
    country: "United States",
    source: "Associated Press",
    title: "Researchers Make Case for Grapes as a ‘Superfood’ After Review of Health Evidence",
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Sunlit grapes growing on a vine",
    publishedAt: "3 hours ago",
    sentimentLabel: "positive",
    framing: { left: 18, center: 42, right: 40 },
    sourceCount: 7,
  },
  {
    id: "cern-physics",
    category: "Science",
    country: "Switzerland",
    source: "BBC News",
    title: "CERN Finds High-Significance Hint of Physics Beyond Standard Model",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Engineer inspecting industrial equipment underground",
    publishedAt: "4 hours ago",
    sentimentLabel: "neutral",
    framing: { left: 16, center: 62, right: 22 },
    sourceCount: 8,
  },
  {
    id: "nicaragua-rivera",
    category: "World",
    country: "Nicaragua",
    source: "The Guardian",
    title: "Indigenous Leader Brooklyn Rivera Dies in Nicaragua After Nearly 3 Years of Detention",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Crowd gathered at an outdoor public event",
    publishedAt: "5 hours ago",
    sentimentLabel: "negative",
    framing: { left: 54, center: 28, right: 18 },
    sourceCount: 63,
  },
  {
    id: "lebanon-council",
    category: "World",
    country: "Middle East",
    source: "Al Jazeera",
    title: "UN Security Council to Hold Emergency Meeting as Israel Pushes Deeper into Lebanon",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Damaged buildings in an urban neighborhood",
    publishedAt: "6 hours ago",
    sentimentLabel: "negative",
    framing: { left: 22, center: 35, right: 43 },
    sourceCount: 15,
  },
  {
    id: "oil-prices",
    category: "Business",
    country: "Global",
    source: "CNBC",
    title: "Oil Prices Dip as OPEC+ Considers Output Increase Amid Weak Demand",
    image: "https://images.unsplash.com/photo-1532102235608-dc8fc689c9ab?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Fuel pump at a service station",
    publishedAt: "7 hours ago",
    sentimentLabel: "negative",
    framing: { left: 25, center: 50, right: 25 },
    sourceCount: 11,
  },
  {
    id: "starship-test",
    category: "Technology",
    country: "United States",
    source: "Space.com",
    title: "SpaceX Launches Starship Test Flight in Milestone for Mars Program",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Rocket lifting off through a cloud of smoke",
    publishedAt: "8 hours ago",
    sentimentLabel: "positive",
    framing: { left: 12, center: 45, right: 43 },
    sourceCount: 9,
  },
  {
    id: "apple-ai",
    category: "Business",
    country: "United States",
    source: "The Verge",
    title: "Apple Unveils AI-Powered Features Across iPhone, iPad and Mac",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Close-up of modern electronic components",
    publishedAt: "9 hours ago",
    sentimentLabel: "positive",
    framing: { left: 15, center: 40, right: 45 },
    sourceCount: 10,
  },
  {
    id: "climate-target",
    category: "Climate",
    country: "Global",
    source: "Reuters",
    title: "2025 on Track to Be Among Top 3 Hottest Years, EU Climate Service Says",
    image: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Thermometer in bright afternoon sunlight",
    publishedAt: "10 hours ago",
    sentimentLabel: "negative",
    framing: { left: 33, center: 34, right: 33 },
    sourceCount: 14,
  },
  {
    id: "fed-rates",
    category: "Economy",
    country: "United States",
    source: "Financial Times",
    title: "Fed Holds Rates Steady, Signals Caution on Inflation and Growth Outlook",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Tall glass office buildings in a financial district",
    publishedAt: "11 hours ago",
    sentimentLabel: "neutral",
    framing: { left: 30, center: 45, right: 25 },
    sourceCount: 13,
  },
  {
    id: "madrid-final",
    category: "Soccer",
    country: "Europe",
    source: "ESPN",
    title: "Real Madrid Win Champions League Final After Comeback Victory in Final",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Football match underway in a packed stadium",
    publishedAt: "12 hours ago",
    sentimentLabel: "positive",
    framing: { left: 10, center: 20, right: 70 },
    sourceCount: 26,
  },
  {
    id: "canada-wildfires",
    category: "Environment",
    country: "Canada",
    source: "CBC News",
    title: "Wildfires Force Thousands to Evacuate Across Western Canada",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Sunlight filtering through a dense forest",
    publishedAt: "13 hours ago",
    sentimentLabel: "negative",
    framing: { left: 27, center: 33, right: 40 },
    sourceCount: 17,
  },
];

type ArticleDetailCopy = Omit<
  NewsArticleDetail,
  | "id"
  | "title"
  | "category"
  | "country"
  | "imageUrl"
  | "imageAlt"
  | "bias"
  | "sentimentLabel"
  | "sourceCount"
  | "related"
>;

export const MOCK_ARTICLE_DETAILS: Record<string, ArticleDetailCopy> = {
  "peace-proposal": {
    author: "David Morgan",
    publishedDate: "May 31, 2026",
    readTime: "12 min read",
    imageCaption:
      "President Donald Trump in the Cabinet Room at the White House, Washington, D.C., May 30, 2026.",
    imageCredit: "Andrew Harnik / Getty Images",
    bodyParagraphs: [
      "The Trump administration has sent Iran a revised nuclear deal proposal that includes tougher terms on uranium enrichment and stronger verification measures, according to a report published Saturday.",
      "The new proposal, delivered through intermediaries in Oman, requires Iran to halt all uranium enrichment on its soil and ship its stockpile of enriched uranium out of the country. It also demands unrestricted access for international inspectors to all Iranian nuclear facilities, including military sites.",
      "'This is a take-it-or-leave-it proposal,' a senior administration official told the Wall Street Journal. 'The President wants a deal, but he will not accept a weak agreement that puts America or our allies at risk.'",
      "Iran has not yet officially responded to the proposal. Iranian Foreign Minister Hossein Amir-Abdollahian said last week that any deal must respect Iran's right to peaceful nuclear energy and include the lifting of all U.S. sanctions.",
      "The revised proposal comes after several rounds of indirect talks between U.S. and Iranian officials failed to produce a breakthrough. The Trump administration has warned that if diplomacy fails, it is prepared to take other action to prevent Iran from obtaining a nuclear weapon.",
      "European allies have urged both sides to continue negotiations. 'We believe diplomacy is still the best path forward,' said a spokesperson for the EU's foreign policy chief.",
      "Israel, which has long opposed the 2015 nuclear deal with Iran, praised the Trump administration's tougher stance. 'This is the kind of leadership that was missing in the past,' said Israeli Prime Minister Benjamin Netanyahu in a statement.",
      "The fate of the proposal now rests with Iran, as global attention remains focused on whether a new nuclear agreement can be reached or if tensions will escalate further.",
    ],
    biasLabel: "right",
    confidence: 0.82,
    framingNotes:
      "Coverage emphasizes the proposal's stricter inspection and enrichment terms, while also including diplomatic and Iranian responses.",
    loadedTerms: ["take-it-or-leave-it", "weak agreement"],
    disclaimer:
      "Political framing is an AI estimate based on the wording and emphasis in available coverage, not an objective measure of a publisher or article.",
    summaryPoints: [
      "The Trump administration has sent Iran a revised nuclear deal proposal with tougher terms, including a halt to uranium enrichment and the removal of enriched uranium stockpiles.",
      "The proposal demands unrestricted inspector access to all nuclear sites, including military facilities.",
      "Iran has not responded officially but says any deal must respect its right to peaceful nuclear energy and include sanctions relief.",
      "The U.S. says it is prepared to take other action if diplomacy fails, while European allies urge continued negotiations.",
      "Israel supports the tougher stance, saying it could help prevent Iran from acquiring nuclear weapons.",
    ],
    summaryGenerated: "May 31, 2026",
    summaryReadTime: "3 min read",
    topSources: [
      { name: "Fox News", bias: "right" },
      { name: "The Wall Street Journal", bias: "center" },
      { name: "Reuters", bias: "center" },
      { name: "BBC", bias: "center" },
      { name: "CNN", bias: "left" },
      { name: "The New York Times", bias: "center" },
      { name: "The Washington Post", bias: "center" },
      { name: "Newsmax", bias: "right" },
    ],
  },
  "grapes-health": {
    author: "Associated Press",
    publishedDate: "May 31, 2026",
    readTime: "6 min read",
    imageCaption: "Grapes growing on a sunlit vine.",
    imageCredit: "Associated Press",
    bodyParagraphs: [
      "Researchers reviewing existing health evidence say grapes may offer several nutritional benefits, while cautioning that no single food can replace a balanced diet.",
      "The review considered findings on grapes and compounds found in their skins and seeds. The authors said more controlled research is needed to establish how those findings translate to everyday health outcomes.",
      "Nutrition experts advise readers to consider the full body of evidence and treat broad claims such as 'superfood' with care.",
    ],
    biasLabel: "center",
    confidence: 0.71,
    framingNotes:
      "The report presents the review's potential benefits alongside limits in the available evidence.",
    loadedTerms: ["superfood"],
    disclaimer:
      "Sentiment and framing labels are AI estimates for reader context and are not medical advice.",
    summaryPoints: [
      "A review of health evidence makes a case for grapes as part of a varied diet.",
      "Researchers note that more study is needed before drawing firm conclusions about health outcomes.",
      "Experts caution against treating any single food as a substitute for balanced nutrition.",
    ],
    summaryGenerated: "May 31, 2026",
    summaryReadTime: "2 min read",
    topSources: [
      { name: "Associated Press", bias: "center" },
      { name: "Reuters", bias: "center" },
      { name: "Healthline", bias: "left" },
    ],
  },
};

function strongestBias(article: NewsArticleCard): BiasLabel {
  const entries = Object.entries(article.framing) as [SourceBias, number][];
  return entries.reduce((strongest, current) =>
    current[1] > strongest[1] ? current : strongest,
  )[0];
}

function fallbackDetailCopy(article: NewsArticleCard): ArticleDetailCopy {
  const biasLabel = strongestBias(article);
  return {
    author: article.source,
    publishedDate: article.publishedAt,
    readTime: "5 min read",
    imageCaption: article.imageAlt,
    imageCredit: article.source,
    bodyParagraphs: [
      "A full article preview has not been added for this story yet. This page shows the available story metadata and source framing from the local sample dataset.",
    ],
    biasLabel,
    framingNotes: "This preview uses only the framing percentages supplied with the sample story.",
    loadedTerms: [],
    disclaimer: "Sentiment and framing are AI estimates for reader context, not objective measures.",
    summaryPoints: ["A full AI summary is not available for this sample story yet."],
    summaryGenerated: "Preview",
    summaryReadTime: "1 min read",
    topSources: [{ name: article.source, bias: biasLabel === "mixed" || biasLabel === "unclear" ? "center" : biasLabel }],
  };
}

export function getArticleDetail(id: string): NewsArticleDetail | undefined {
  const article = MOCK_ARTICLES.find((item) => item.id === id);
  if (!article) return undefined;

  const detail = MOCK_ARTICLE_DETAILS[id] ?? fallbackDetailCopy(article);
  const related = MOCK_ARTICLES.filter((item) => item.id !== article.id).slice(0, 5);

  return {
    ...detail,
    id: article.id,
    title: article.title,
    category: article.category,
    country: article.country,
    imageUrl: article.image,
    imageAlt: article.imageAlt,
    bias: article.framing,
    sentimentLabel: article.sentimentLabel,
    sourceCount: article.sourceCount,
    related,
  };
}