import styles from './IndividualProgram.module.css'

import illu from '../../assets/images/blocks/individual-left.png'

const process = ['первое занятие — диагностическое']

const methods = ['арт-терапию', 'ДПДГ (если возраст и запрос позволяют)']

export default function IndividualProgram() {
  return (
    <section className={styles.section} id="individual">
      <div className="container">
        <header className={styles.head}>
          <h2 className={styles.title}>Индивидуальные занятия с детьми и подростками</h2>
          <p className={styles.lead}>
            Индивидуальные занятия подходят, если ситуация требует особого внимания и бережного сопровождения.
          </p>
        </header>

        <article className={styles.card}>
          <div className={styles.inner}>
            <div className={styles.illuWrap} aria-hidden="true">
              <img className={styles.illu} src={illu} alt="" />
            </div>

            <div className={styles.content}>
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Как проходит работа</h3>
                <ul className={styles.list}>
                  {process.map((t) => (
                    <li key={t} className={styles.item}>
                      <span className={styles.dot} aria-hidden="true" />
                      <span className={styles.text}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.block}>
                <h3 className={styles.blockTitle}>В работе с детьми я чаще использую</h3>
                <ul className={styles.list}>
                  {methods.map((t) => (
                    <li key={t} className={styles.item}>
                      <span className={styles.dot} aria-hidden="true" />
                      <span className={styles.text}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.note}>
                Это помогает мягко проживать сложные эмоции и находить внутреннюю опору.
              </div>

              <div className={styles.actions}>
                <a className={styles.btn} href="#booking">
                  Записаться на консультацию
                </a>
                <p className={styles.hint}>Подходит детям и подросткам с индивидуальными запросами.</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
