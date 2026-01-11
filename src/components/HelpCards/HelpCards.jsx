import styles from './HelpCards.module.css'

const items = [
  {
    title: 'Тревожность',
    text: 'Страхи, переживания, неуверенность',
    img: '/images/icons/anxiety.png',
  },
  {
    title: 'Поведение',
    text: 'Агрессия, замкнутость, конфликты',
    img: '/images/icons/behavior.png',
  },
  {
    title: 'Школа',
    text: 'Стресс, давление, снижение мотивации',
    img: '/images/icons/school.png',
  },
]

export default function HelpCards() {
  return (
    <section className={styles.section} id="help">
      <div className="container">
        <h2 className={styles.title}>С чем я помогаю</h2>

        <div className={styles.grid}>
          {items.map((it) => (
            <article key={it.title} className={styles.card}>
              <div className={styles.iconWrap}>
                <img className={styles.icon} src={it.img} alt="" />
              </div>

              <div>
                <h3 className={styles.cardTitle}>{it.title}</h3>
                <p className={styles.cardText}>{it.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}