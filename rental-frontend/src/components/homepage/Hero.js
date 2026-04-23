import styles from "./Hero.module.css";

export default function Hero({ location = "Cluj-Napoca & împrejurimi" }) {
    return (
        <section className={styles.hero}>
            <div className={styles.eyebrow}>{location}</div>

            <h1 className={styles.title}>
                Find your next <br />
                <span>home.</span>
            </h1>
        </section>
    );
}