import styles from './Hero.module.css'

import heroImg from '../../assets/images/hero-wide.png'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <h1 className={styles.title}>Детский и семейный психолог</h1>
          <p className={styles.subtitle}>
            Помогаю детям и родителям справляться с тревогой, стрессом и эмоциональными
            трудностями
          </p>

          <div className={styles.actions}>
            <a className={styles.btn} href="#booking">
              Записаться онлайн
            </a>
          </div>
        </div>

        <div className={styles.right} aria-hidden="true">
          <img className={styles.image} src={heroImg} alt="" />
        </div>
      </div>
    </section>
  )
}