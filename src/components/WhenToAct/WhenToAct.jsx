import styles from './WhenToAct.module.css'

import img from '../../assets/images/blocks/when-to-act.png'

export default function WhenToAct() {
  return (
    <section className={styles.section} aria-labelledby="when-to-act-title">
      <div className="container">
        <div className={styles.box}>
          <div className={styles.content}>
            <h2 className={styles.title} id="when-to-act-title">
              Когда родителям важно не откладывать обращение
            </h2>

            <p className={styles.lead}>
              Обратиться к психологу стоит, если вы замечаете, что:
            </p>

            <ul className={styles.list}>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                ребёнок стал «не таким, как раньше»
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                он всё чаще боится, тревожится, избегает общения
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                вы чувствуете, что разговоры, уговоры и наказания не работают
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                напряжение в семье растёт
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                вы сами устали и не понимаете, как помочь
              </li>
            </ul>

            <div className={styles.actions}>
              <a className={styles.btn} href="#booking">
                Записаться на консультацию
              </a>
              <span className={styles.note}>
                Можем начать с короткой первичной встречи.
              </span>
            </div>
          </div>

          <div className={styles.media} aria-hidden="true">
            <img className={styles.img} src={img} alt="" />
          </div>
        </div>
      </div>
    </section>
  )
}
