import styles from './Pricing.module.css'

const plans = [
  {
    title: 'Первичная консультация',
    price: '€60',
    time: '50 минут',
    tag: 'Старт',
    features: [
      'Уточнение запроса и целей',
      'Первичная диагностика',
      'План дальнейшей работы',
    ],
  },
  {
    title: 'Индивидуальная работа с ребёнком',
    price: '€55',
    time: '45–50 минут',
    tag: 'Популярно',
    featured: true,
    features: [
      'Бережные техники и упражнения',
      'Развитие навыков саморегуляции',
      'Поддержка и динамика',
    ],
  },
  {
    title: 'Консультация для родителей',
    price: '€50',
    time: '45 минут',
    tag: 'Семья',
    features: [
      'Рекомендации для дома',
      'Разбор сложных ситуаций',
      'Границы и коммуникация',
    ],
  },
]

export default function Pricing() {
  return (
    <section className={styles.section} id="pricing">
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.title}>Форматы консультаций и стоимость</h2>
          <p className={styles.subtitle}>
            Онлайн или очно — подберём формат, который подойдёт вашей ситуации.
          </p>
        </div>

        <div className={styles.grid}>
          {plans.map((p) => (
            <article
              key={p.title}
              className={`${styles.card} ${p.featured ? styles.featured : ''}`}
            >
              <div className={styles.top}>
                <span className={styles.tag}>{p.tag}</span>
                <h3 className={styles.cardTitle}>{p.title}</h3>

                <div className={styles.priceRow}>
                  <div className={styles.price}>{p.price}</div>
                  <div className={styles.time}>{p.time}</div>
                </div>
              </div>

              <ul className={styles.list}>
                {p.features.map((f) => (
                  <li key={f} className={styles.li}>
                    <span className={styles.dot} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <a className={styles.btn} href="#booking">
                Записаться
              </a>
            </article>
          ))}
        </div>

        <p className={styles.note}>
          * Стоимость и длительность можно адаптировать под ваш город/практику.
        </p>
      </div>
    </section>
  )
}