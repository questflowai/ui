"use client\";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from \"@/components/ui/card\";
import { Badge } from \"@/components/ui/badge\";
import { cn } from \"@/lib/utils\";
import { ArrowUpRight, ArrowDownRight, Minus, MessageCircle, ExternalLink, List, Bitcoin } from \"lucide-react\";

// Type Definitions
interface Tweet {
  author: string;
  content: string;
  engagement: number;
}

interface TwitterReactions {
  totalEngagement: number;
  sentiment: string;
  sentimentScore: number;
  topTweets: Tweet[];
}

interface KeyMetrics {
  price: string;
  marketCap: string;
  fdv: string;
}

interface NewsItem {
  id: number;
  title: string;
  category: string;
  publishTime: string;
  sourceUrl: string;
  summary: string;
  keyMetrics: KeyMetrics;
  twitterReactions: TwitterReactions;
  priceImpact: string;
  tradingVolume: string;
}

interface MarketOverview {
  sentiment: string;
  sentimentScore: number;
  takeaways: string[];
  btcContext: string;
  bnbContext: string;
}

interface DashboardProps {
  title: string;
  date: string;
  marketOverview: MarketOverview;
  newsItems: NewsItem[];
}

// Helper Components
const SentimentBadge = ({ sentiment, score }: { sentiment: string; score: number }) => {
  const sentimentLower = sentiment.toLowerCase();
  const classes = cn(
    \"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold\",
    sentimentLower === 'positive' && \"bg-green-100 text-green-800\",
    sentimentLower === 'mixed' && \"bg-yellow-100 text-yellow-800\",
    sentimentLower === 'negative' && \"bg-red-100 text-red-800\"
  );
  const Icon = sentimentLower === 'positive' ? ArrowUpRight : sentimentLower === 'mixed' ? Minus : ArrowDownRight;

  return (
    <span className={classes}>
      <Icon className=\"h-3 w-3\" />
      {sentiment} ({score})
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
    const categoryLower = category.toLowerCase();
    const classes = cn(
        \"text-xs font-semibold\",
        categoryLower === 'listing' && \"border-blue-500/50 bg-blue-50 text-blue-700\",
        categoryLower === 'delisting' && \"border-red-500/50 bg-red-50 text-red-700\",
        categoryLower === 'tge' && \"border-purple-500/50 bg-purple-50 text-purple-700\",
    );
    return <Badge variant=\"outline\" className={classes}>{category}</Badge>;
};

const TweetCard = ({ tweet }: { tweet: Tweet }) => (
  <div className=\"text-xs p-2 border rounded-md bg-slate-50/50\">
    <p className=\"font-semibold text-slate-800\">{tweet.author}</p>
    <p className=\"text-slate-600 whitespace-pre-wrap\">{tweet.content}</p>
    <p className=\"text-right text-slate-500 font-medium mt-1\">
      {tweet.engagement.toLocaleString()} engagements
    </p>
  </div>
);

// Main Components
const MarketOverviewCard = ({ overview }: { overview: MarketOverview }) => (
  <Card className=\"mb-6 bg-slate-50/70\">
    <CardHeader>
      <CardTitle className=\"flex items-center gap-2 text-2xl text-slate-800\">
        Market Overview
      </CardTitle>
      <CardDescription>
        <SentimentBadge sentiment={overview.sentiment} score={overview.sentimentScore} />
      </CardDescription>
    </CardHeader>
    <CardContent className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
      <div className=\"md:col-span-2\">
        <h3 className=\"font-semibold text-lg mb-2 flex items-center gap-2 text-slate-700\"><List className=\"h-5 w-5\" /> Key Takeaways</h3>
        <ul className=\"list-disc pl-5 space-y-1 text-sm text-gray-700\">
          {overview.takeaways.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
      <div className=\"space-y-4\">
        <div>
          <h3 className=\"font-semibold text-lg mb-2 flex items-center gap-2 text-slate-700\"><Bitcoin className=\"h-5 w-5\" /> Market Context</h3>
          <p className=\"text-sm text-gray-700\">{overview.btcContext}</p>
          <p className=\"text-sm text-gray-700 mt-1\">{overview.bnbContext}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const NewsItemCard = ({ item }: { item: NewsItem }) => {
  const time = new Date(item.publishTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Card className=\"overflow-hidden shadow-sm\">
      <CardHeader className=\"bg-gray-50/70\">
        <div className=\"flex justify-between items-start gap-4\">
          <CardTitle className=\"text-lg text-gray-800\">{item.title}</CardTitle>
          <a href={item.sourceUrl} target=\"_blank\" rel=\"noopener noreferrer\" className=\"text-blue-500 hover:text-blue-700 flex-shrink-0\">
            <ExternalLink className=\"h-5 w-5\" />
          </a>
        </div>
        <div className=\"flex items-center gap-2 text-sm text-muted-foreground pt-1\">
          <CategoryBadge category={item.category} />
          <span>{time}</span>
        </div>
      </CardHeader>
      <CardContent className=\"p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6\">
        <div>
          <p className=\"text-sm text-gray-800 mb-4\">{item.summary}</p>
          <div className=\"grid grid-cols-3 gap-4 text-center p-3 bg-slate-50 rounded-lg\">
            <div>
              <p className=\"text-xs text-muted-foreground\">Price</p>
              <p className=\"font-bold text-sm text-slate-800\">{item.keyMetrics.price}</p>
            </div>
            <div>
              <p className=\"text-xs text-muted-foreground\">Market Cap</p>
              <p className=\"font-bold text-sm text-slate-800\">{item.keyMetrics.marketCap}</p>
            </div>
            <div>
              <p className=\"text-xs text-muted-foreground\">FDV</p>
              <p className=\"font-bold text-sm text-slate-800\">{item.keyMetrics.fdv}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className=\"font-semibold mb-2 text-slate-700\">Twitter Reactions</h4>
          <div className=\"flex items-center gap-4 mb-3\">
            <div className=\"flex items-center gap-1.5 text-sm\">
              <MessageCircle className=\"h-4 w-4 text-gray-500\" />
              <span className=\"font-bold text-slate-800\">{item.twitterReactions.totalEngagement.toLocaleString()}</span>
              <span className=\"text-muted-foreground\">Engagements</span>
            </div>
            <SentimentBadge sentiment={item.twitterReactions.sentiment} score={item.twitterReactions.sentimentScore} />
          </div>
          <div className=\"space-y-2\">
            {item.twitterReactions.topTweets.map((tweet, index) => (
              <TweetCard key={index} tweet={tweet} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className=\"bg-gray-50/70 py-3 px-4 md:px-6 flex flex-wrap justify-between text-sm gap-2\">
        <div>
          <span className=\"font-semibold text-slate-600\">Price Impact: </span>
          <span className=\"text-gray-700\">{item.priceImpact}</span>
        </div>
        <div>
          <span className=\"font-semibold text-slate-600\">Volume: </span>
          <span className=\"text-gray-700\">{item.tradingVolume}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function BweNewsDashboard({ title, date, marketOverview, newsItems }: DashboardProps) {
  return (
    <div className=\"bg-white text-black p-4 sm:p-6 font-sans\">
      <header className=\"mb-6\">
        <h1 className=\"text-3xl font-bold text-gray-900\">{title}</h1>
        <p className=\"text-md text-gray-500\">{new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      <main>
        <MarketOverviewCard overview={marketOverview} />

        <h2 className=\"text-2xl font-bold text-gray-900 my-6\">News Feed & Impact Analysis</h2>
        <div className=\"space-y-6\">
          {newsItems.map(item => <NewsItemCard key={item.id} item={item} />)}
        </div>
      </main>
    </div>
  );
}
