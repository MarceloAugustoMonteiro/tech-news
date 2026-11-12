import { getTechnologyNews } from "@/services/guardian";
import NewsCard from "./NewsCard";

export default async function NewsList() {
  const news = await getTechnologyNews();

  console.log(news);

  if (news.length === 0) {
    return (
      <p className="news-loading">
        No stories available right now. Please check back soon.
      </p>
    );
  }

  const firstImageIndex = news.findIndex((article) => article.fields?.thumbnail);

  return (
    <div className="news-grid">
      {news.map((article, index) => (
        <NewsCard
          key={article.id}
          article={article}
          featured={index === 0}
          prioritizeImage={index === firstImageIndex}
        />
      ))}
    </div>
  );
}
