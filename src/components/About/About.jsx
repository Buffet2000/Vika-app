import styles from './About.module.css'

// TODO: подставь свой путь к фото
import photo from '../../assets/images/blocks/My-photo.jpg'

const certificates = [
  'Диплом Педагога - психолога',
  'Сертификат «Арт-терапия в работе специалистов помогающих профессий»',
  'Сертификат «Как понять мир подростка и как действовать в сложных ситуациях»',
  'Сертификат «Символдрама и современный психоанализ в диагностике и психотерапии депрессии»',
  'Сертификат «Эффективное взаимодействие с семейным окружением детей с опытом травмы»',
  'Сертификат «Введение в Терапию Принятия и Ответственности (АСТ) и применение АСТ для работы с прокрастинацией»',
  'Сертификат «Введение в методы и подходы психотерапии»',
  'Сертификат обучения гипнозу и гипнотерапии (Московский институт Гипноза)',
  'Сертификат обучения методу ДПДГ (Московский Институт Гипноза)',
]

const formats = [
  {
    title: 'Индивидуальные консультации',
    text: 'Для детей, подростков и взрослых. Бережно разбираем запрос и выстраиваем понятный план работы.',
  },
  {
    title: 'Групповые онлайн-занятия для детей',
    text: '«Школа чувств» — практики эмоций, общения и саморегуляции в поддерживающей атмосфере.',
  },
  {
    title: 'Онлайн из любой точки мира',
    text: 'Можно начать без ожидания и привязки к городу — подберём удобный формат и время.',
  },
]

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className="container">
        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1 className={styles.h1}>Обо мне</h1>
            <p className={styles.sublead}>
              Психологическое сопровождение детей, подростков и взрослых — бережно, по шагам и с опорой на
              реальные изменения в жизни.
            </p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNum}>14</div>
                <div className={styles.statText}>лет в системе образования</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>3000+</div>
                <div className={styles.statText}>индивидуальных консультаций</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>200+</div>
                <div className={styles.statText}>тренингов и программ</div>
              </div>
            </div>

            <div className={styles.badges}>
              <span className={styles.badge}>дети</span>
              <span className={styles.badge}>подростки</span>
              <span className={styles.badge}>взрослые</span>
              <span className={styles.badgeSoft}>онлайн</span>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.photoCard}>
              {/* Если фото ещё нет — оставь заглушку */}
              <img className={styles.photo} src={photo} alt="Фото психолога" />
            </div>
          </div>
        </header>

        {/* EDUCATION */}
        <div className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.title}>Образование</h2>

            <div className={styles.eduBlock}>
              <div className={styles.eduTitle}>Основное образование</div>
              <div className={styles.eduText}>
                Государственный университет Республики Молдова
                <br />
                <b>Специальность:</b> Педагогика и психология
                <br />
                <b>Год окончания:</b> 2009
              </div>
            </div>

            <details className={styles.details}>
              <summary className={styles.summary}>
                Дополнительное образование и сертификаты
                <span className={styles.summaryHint}>Нажмите, чтобы раскрыть</span>
              </summary>

              <ul className={styles.list}>
                {certificates.map((t) => (
                  <li key={t} className={styles.item}>
                    <span className={styles.dot} aria-hidden="true" />
                    <span className={styles.text}>{t}</span>
                  </li>
                ))}
              </ul>
            </details>
          </article>

          <article className={styles.card}>
            <h2 className={styles.title}>Опыт работы</h2>

            <ul className={styles.list}>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.text}>
                  <b>14 лет</b> в системе образования
                </span>
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.text}>— 10 лет в общеобразовательной школе</span>
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.text}>— 4 года в Суворовском училище</span>
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.text}>
                  Более <b>3000</b> индивидуальных консультаций
                </span>
              </li>
              <li className={styles.item}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.text}>
                  Более <b>200</b> тренингов и групповых программ
                </span>
              </li>
            </ul>

            <div className={styles.note}>
              Эти цифры — про практику и устойчивый опыт в работе с детьми, подростками и семейными
              запросами.
            </div>
          </article>
        </div>

        {/* FORMATS */}
        <section className={styles.formats}>
          <header className={styles.formatsHead}>
            <h2 className={styles.h2}>Форматы работы</h2>
            <p className={styles.lead}>Подберём формат под ваш запрос и ситуацию.</p>
          </header>

          <div className={styles.cards3}>
            {formats.map((f) => (
              <article key={f.title} className={styles.miniCard}>
                <div className={styles.miniTitle}>{f.title}</div>
                <div className={styles.miniText}>{f.text}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
