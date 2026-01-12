import styles from './Hero.module.css'

import leftDecor from '../../assets/images/hero-left.png'
import rightScene from '../../assets/images/hero-right.png'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div
          className={styles.heroBox}
          style={{
            backgroundImage: `
              linear-gradient(90deg,
                rgba(251,251,251,0.62) 0%,
                rgba(251,251,251,0.48) 38%,
                rgba(251,251,251,0.18) 64%,
                rgba(251,251,251,0.00) 100%
              ),
              url(${leftDecor}),
              url(${rightScene})
            `,
          }}
        >
          <div className={styles.content}>
            <h1 className={styles.title}>Детский и семейный психолог</h1>

            <p className={styles.subtitle}>
              Помогаю детям и родителям справляться
              <br />
              с тревогой, стрессом и эмоциональными
              <br />
              трудностями
            </p>

            <a className={styles.btn} href="#booking">
              Записаться на консультацию
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
