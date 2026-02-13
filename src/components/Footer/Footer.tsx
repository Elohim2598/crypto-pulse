import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top section */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>
              <span className={styles.icon}>₿</span>
              CryptoPulse
            </h3>
            <p className={styles.tagline}>
              Real-time cryptocurrency tracking & analytics
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Resources</h4>
              <ul className={styles.list}>
                <li><a href="https://www.binance.com" target="_blank" rel="noopener noreferrer">Binance API</a></li>
                <li><a href="https://www.cryptocompare.com" target="_blank" rel="noopener noreferrer">CryptoCompare</a></li>
                <li><a href="https://tradingview.com" target="_blank" rel="noopener noreferrer">TradingView</a></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Built With</h4>
              <ul className={styles.list}>
                <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a></li>
                <li><a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer">TypeScript</a></li>
                <li><a href="https://gsap.com" target="_blank" rel="noopener noreferrer">GSAP</a></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Connect</h4>
              <ul className={styles.list}>
                <li><a href="https://github.com/Elohim2598/" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/sebastianperrone/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Bottom section */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} CryptoPulse. Built with passion by Sebastian Elohim Perrone.
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
};