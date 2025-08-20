import styles from './StepCard.module.css';

interface Props {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export default function StepCard({ icon, title, text }: Props) {
  return (
    <article className={styles.card} tabIndex={0}>
      <div className={styles.icon} aria-hidden>
        {icon}
      </div>

      <div className={styles.copy}>
        <strong className={styles.title}>{title}</strong>
        <span className={styles.text}>{text}</span>
      </div>
    </article>
  );
}
