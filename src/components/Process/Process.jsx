import styles from './Process.module.css'

const steps = [
  { n: 1, title: 'Первичная консультация', text: 'Коротко знакомимся и уточняем запрос.' },
  { n: 2, title: 'Диагностика и обсуждение запроса', text: 'Определяем причины и план работы.' },
  { n: 3, title: 'Индивидуальная работа с ребёнком', text: 'Мягкие техники, упражнения и поддержка.' },
  { n: 4, title: 'Обратная связь с родителями', text: 'Рекомендации и сопровождение дома.' },
]

// положи картинку сюда: /public/images/process.png
const IMG = '/images/process.png'

export default function Process() {
  return (
    <section className={styles.section} id="process">
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <h2 className={styles.title}>Как проходит работа</h2>

          <ol className={styles.list}>
            {steps.map((s) => (
              <li key={s.n} className={styles.item}>
                <div className={styles.badge}>{s.n}</div>
                <div>
                  <div className={styles.stepTitle}>{s.title}</div>
                  <div className={styles.stepText}>{s.text}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.right} aria-hidden="true">
          <img className={styles.image} src={IMG} alt="" />
        </div>
      </div>
    </section>
  )
}