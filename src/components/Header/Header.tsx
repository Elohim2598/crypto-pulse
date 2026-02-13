import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Header.module.css';

export const Header = () => {
  const logoRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

 useEffect(() => {
  // Animate logo on mount
  if (logoRef.current) {
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }

  // Animate subtitle
  if (subtitleRef.current) {
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    );
  }
}, []);

  return (
    <header className={styles.header}>
      {/* Animated background gradients */}
      <div className={styles.gradient1}></div>
      <div className={styles.gradient2}></div>
      <div className={styles.gradient3}></div>

      <div className={styles.container}>
        <h1 ref={logoRef} className={styles.logo}>
          <span className={styles.icon}>₿</span>
          <span className={styles.logoText}>
            Crypto<span className={styles.pulse}>Pulse</span>
          </span>
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          Real-time cryptocurrency tracking & analytics
        </p>
        
        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Live Data</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>10+ Coins</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Real-time Updates</span>
          </div>
        </div>
      </div>
    </header>
  );
};