import styles from './GroupProgram.module.css'
import bg from '../../assets/images/backgrounds/backgroung-horizontal.png'

const forWho = [
  'часто тревожатся и переживают',
  'боятся ошибаться, стесняются',
  'не умеют выражать злость и обиду',
  'быстро «взрываются» или, наоборот, всё держат в себе',
  'испытывают трудности в общении с другими детьми',
  'тяжело переживают критику, отказ, конфликт',
]

const whatWeDo = [
  'учимся понимать, что я сейчас чувствую',
  'учимся безопасно выражать эмоции',
  'развиваем уверенность в себе',
  'учимся говорить о себе и слышать других',
  'осваиваем способы успокоения и самоподдержки',
]

const results = [
  'ребёнок становится спокойнее',
  'меньше истерик и вспышек',
  'ребёнок лучше говорит о своих чувствах',
  'повышается уверенность в себе',
  'становится легче в общении и в семье',
]

function BulletList({ items }) {
  return (
    <ul className={styles.list}>
      {items.map((t) => (
        <li key={t} className={styles.item}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.text}>{t}</span>
        </li>
      ))}
    </ul>
  )
}

export default function GroupProgram() {
  return (
    <section className={styles.section} id="group">
      <div className="container">
        <header className={styles.head}>
          <h2 className={styles.title}>Групповые занятия для детей</h2>
          <p className={styles.lead}>
            <span className={styles.programName}>«ШКОЛА ЧУВСТВ»</span> — онлайн и офлайн-группы для детей,
            которым сложно справляться с эмоциями и отношениями с другими.
          </p>
        </header>

        <article
          className={styles.card}
          style={{
            '--bg': `url(${bg})`,
          }}
        >
          <div className={styles.bg} aria-hidden="true" />

          <div className={styles.inner}>
            <div className={styles.main}>
              <h3 className={styles.cardTitle}>Подходит детям, которые:</h3>
              <BulletList items={forWho} />

              <div className={styles.callout}>
                <p className={styles.calloutText}>
                  Формат — игровой, творческий и бережный: через рисунок, обсуждения, упражнения и
                  поддерживающую атмосферу.
                </p>
              </div>

              <div className={styles.actionsLeft}>
                <a className={styles.btn} href="#booking">
                  Записаться на консультацию
                </a>
                <p className={styles.hint}>Расскажите возраст ребёнка — подберём формат группы.</p>
              </div>
            </div>

            <aside className={styles.side}>
              <div className={styles.block}>
                <h4 className={styles.blockTitle}>Что мы делаем на занятиях</h4>
                <BulletList items={whatWeDo} />
              </div>

              <div className={`${styles.block} ${styles.blockSoft}`}>
                <h4 className={styles.blockTitle}>После курса родители обычно замечают</h4>
                <BulletList items={results} />
              </div>
            </aside>
          </div>
        </article>
      </div>
    </section>
  )
}
