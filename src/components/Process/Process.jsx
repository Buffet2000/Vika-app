import styles from './Process.module.css'
import processImg from '../../assets/images/process.png'

// (опционально) можешь подложить акварельный фон, как в других блоках:
import bg from '../../assets/images/backgrounds/backgroung-horizontal.png'

const steps = [
  { n: 1, title: 'Первичная консультация', text: 'Коротко знакомимся и уточняем запрос.' },
  { n: 2, title: 'Диагностика и обсуждение запроса', text: 'Определяем причины и план работы.' },
  { n: 3, title: 'Индивидуальная работа с ребёнком', text: 'Мягкие техники, упражнения и поддержка.' },
  { n: 4, title: 'Обратная связь с родителями', text: 'Рекомендации и сопровождение дома.' },
]

export default function Process() {
  return (
    <section className={styles.section} id="process">
      <div className="container">
        <header className={styles.head}>
          <h2 className={styles.title}>Как проходит работа</h2>
          <p className={styles.lead}>
            Пошагово и бережно — чтобы ребёнку было безопасно, а вам понятно, что происходит.
          </p>
        </header>

        <article
          className={styles.box}
          style={{ '--bg': `url(${bg})` }} // включи, если добавишь фон-картинку
        >
          <div className={styles.bg} aria-hidden="true" />

          <div className={styles.inner}>
            <div className={styles.left}>
              <ol className={styles.list}>
                {steps.map((s) => (
                  <li key={s.n} className={styles.item}>
                    <div className={styles.badge} aria-hidden="true">
                      {s.n}
                    </div>
                    <div>
                      <div className={styles.stepTitle}>{s.title}</div>
                      <div className={styles.stepText}>{s.text}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.right} aria-hidden="true">
              <img className={styles.image} src={processImg} alt="" />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
