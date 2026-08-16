import styles from "./cityStateLabel.module.css";

type Props = {
  label: string;
};

export default function CityStateLabel({ label }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{label}</h1>
    </div>
  );
}
