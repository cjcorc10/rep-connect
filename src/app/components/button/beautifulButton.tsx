import styles from './beautifulButton.module.scss'

export const BeautifulButton = () => {

    return (
        <button className={styles.button}>
            <span className={styles.shadow} />
            <span className={styles.edge} />
            <span className={styles.top}>SEARCH</span>
        </button>
    )
}