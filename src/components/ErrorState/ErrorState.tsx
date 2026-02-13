import styles from './ErrorState.module.css';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong', onRetry }: ErrorStateProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Oops!</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.button} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};