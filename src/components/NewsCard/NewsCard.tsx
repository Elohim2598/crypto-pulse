import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { NewsArticle } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import styles from './NewsCard.module.css';

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

export const NewsCard = ({ article, index }: NewsCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: 'power3.out' }
      );
    }
  }, [index]);

  return (
    <a
      ref={cardRef}
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.header}>
        <span className={styles.source}>{article.source.title}</span>
        <span className={styles.time}>{formatRelativeTime(article.published_at)}</span>
      </div>
      <h3 className={styles.title}>{article.title}</h3>
      {article.currencies.length > 0 && (
        <div className={styles.tags}>
          {article.currencies.slice(0, 3).map((currency) => (
            <span key={currency.code} className={styles.tag}>
              {currency.code}
            </span>
          ))}
        </div>
      )}
    </a>
  );
};