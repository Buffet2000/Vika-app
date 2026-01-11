import styles from './About.module.css'

// положи картинки сюда:
const PORTRAIT = '/images/about-portrait.png'   // слева портрет
const BG = '/images/bg/about-soft.png'          // опциональный фон секции (тот мягкий акварельный)

export default function About() {
  return (
    <section className={styles.section} id="about" style={{ backgroundImage: `url(${BG})` }}>
      <div className={`container ${styles.inner}`}>
        {/* Left: portrait */}
        <div className={styles.left}>
          <img className={styles.portrait} src={PORTRAIT} alt="Портрет психолога" />
        </div>

        {/* Middle: text */}
        <div className={styles.center}>
          <h2 className={styles.title}>Обо мне</h2>

          <p className={styles.text}>
            Меня зовут Анна Сергеева. Я детский и семейный психолог, работаю бережно и
            структурно, помогая детям и родителям находить опору и спокойствие.
          </p>

          <p className={styles.text}>
            В работе опираюсь на современные методы и индивидуальный подход.
            Важны безопасность, уважение к ребёнку и понятные шаги для родителей.
          </p>

          <a className={styles.btn} href="#about-more">
            Подробнее обо мне
          </a>
        </div>

        {/* Right: mini form card */}
        <aside className={styles.card} id="booking">
          <div className={styles.cardTitle}>Записаться на консультацию</div>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input className={styles.input} type="text" placeholder="Ваше имя" />
            <input className={styles.input} type="text" placeholder="Возраст ребёнка" />
            <input className={styles.input} type="text" placeholder="Телефон или мессенджер" />
            <textarea className={styles.textarea} placeholder="Кратко опишите запрос" />

            <button className={styles.submit} type="submit">
              Отправить
            </button>

            <p className={styles.note}>
              Я свяжусь с вами в ближайшее время, чтобы уточнить детали.
            </p>
          </form>
        </aside>
      </div>
    </section>
  )
}