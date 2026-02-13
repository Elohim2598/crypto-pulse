import styles from './LoadingSkeleton.module.css';

export const StatCardSkeleton = () => {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.skeleton} ${styles.label}`}></div>
      <div className={`${styles.skeleton} ${styles.value}`}></div>
      <div className={`${styles.skeleton} ${styles.change}`}></div>
    </div>
  );
};

export const NewsCardSkeleton = () => {
  return (
    <div className={styles.newsCard}>
      <div className={styles.header}>
        <div className={`${styles.skeleton} ${styles.source}`}></div>
        <div className={`${styles.skeleton} ${styles.time}`}></div>
      </div>
      <div className={`${styles.skeleton} ${styles.title}`}></div>
      <div className={`${styles.skeleton} ${styles.title} ${styles.titleShort}`}></div>
      <div className={styles.tags}>
        <div className={`${styles.skeleton} ${styles.tag}`}></div>
        <div className={`${styles.skeleton} ${styles.tag}`}></div>
      </div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className={styles.chartContainer}>
      <div className={`${styles.skeleton} ${styles.chartTitle}`}></div>
      <div className={styles.chartBox}>
        <div className={styles.chartLines}>
          <div className={styles.chartLine} style={{ height: '60%' }}></div>
          <div className={styles.chartLine} style={{ height: '80%' }}></div>
          <div className={styles.chartLine} style={{ height: '45%' }}></div>
          <div className={styles.chartLine} style={{ height: '90%' }}></div>
          <div className={styles.chartLine} style={{ height: '70%' }}></div>
          <div className={styles.chartLine} style={{ height: '55%' }}></div>
          <div className={styles.chartLine} style={{ height: '85%' }}></div>
          <div className={styles.chartLine} style={{ height: '65%' }}></div>
        </div>
      </div>
    </div>
  );
};