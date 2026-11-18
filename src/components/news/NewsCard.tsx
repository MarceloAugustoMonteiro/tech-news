import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";
import styles from "./NewsCard.module.css";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/services/guardian";
import NewsDate from "./NewsDate";

interface NewsCardProps {
  article: Article;
  featured?: boolean;
  prioritizeImage?: boolean;
}

const FEATURED_IMAGE_SIZES = "(max-width: 541px) calc(100vw - 42px), 500px";
const CARD_IMAGE_SIZES =
  "(max-width: 639px) calc(100vw - 40px), (max-width: 899px) calc((100vw - 88px) / 2), (max-width: 1215px) calc((100vw - 112px) / 3), 368px";

export default function NewsCard({
  article,
  featured = false,
  prioritizeImage = false,
}: NewsCardProps) {
  const thumbnail = article.fields?.thumbnail;

  return (
    <article className={`${styles.card}${featured ? ` ${styles.featured}` : ""}`}>
      <Link href={`/news/${article.id}`} prefetch={false} className={styles.link}>
        <div className={styles.media}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={article.webTitle}
              width={500}
              height={400}
              sizes={featured ? FEATURED_IMAGE_SIZES : CARD_IMAGE_SIZES}
              loading={prioritizeImage ? "eager" : "lazy"}
              fetchPriority={prioritizeImage ? "high" : "auto"}
              className={styles.image}
            />
          ) : (
            <span className={styles.imagePlaceholder} aria-hidden="true">
              technews.
            </span>
          )}
          {featured && <span className={styles.featuredLabel}>In focus</span>}
        </div>
        <div className={styles.content}>
          <div className={styles.meta}>
            <span>Technology</span>
            <span aria-hidden="true">/</span>
            <NewsDate value={article.webPublicationDate} />
          </div>
          <h2>{article.webTitle}</h2>
          <div className={styles.bottom}>
            <span>The Guardian</span>
            <span className={styles.readLink}>
              Read story <ArrowUpRightIcon />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
