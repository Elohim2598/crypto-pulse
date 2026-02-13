import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export const StatCard = ({ label, value, change, isPositive }: StatCardProps) => {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
      {change && (
        <p className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
          {change}
        </p>
      )}
    </div>
  );
};