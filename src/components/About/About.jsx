import { useEffect, useState } from 'react'
import styles from './About.module.css'
import photoFallback from '../../assets/images/blocks/My-photo.jpg'
import { fetchAbout } from '../../api/about.js'

const certificates = [
  'Диплом Педагога - психолога',
  'Сертификат «Арт-терапия в работе специалистов помогающих профессий»',
  'Сертификат «Как понять мир подростка и как действовать в сложных ситуациях»',
  'Сертификат «Символдрама и современный психоанализ в диагностике и психотерапии депрессии»',
  'Сертификат «Эффективное взаимодействие с семейным окружением детей с опытом травмы»',
  'Сертификат «Введение в Терапию Принятия и Ответственности (АСТ)»',
  'Сертификат «Введение в методы и подходы психотерапии»',
  'Сертификат обучения гипнозу и гипнотерапии',
  'Сертификат обучения методу ДПДГ',
]

export default function About() {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await fetchAbout()
        if (alive) setAbout(data)
      } catch (e) {
        console.error(e)
      }
    })()
    return () => { alive = false }
  }, [])

  if (!about) return null

  const {
    name,
    intro1,
    intro2,
    stats = [],
    badges = [],
    formats = [],
    avatar_url,
  } = about

  const avatarUrl = avatar_url || photoFallback

  return (
    <section className={styles.section} id="about">
      <div className="container">
        <header className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1 className={styles.h1}>Обо мне</h1>

            {name && (
              <p className={styles.sublead}>
                Меня зовут {name}.
              </p>
            )}

            {intro1 && <p className={styles.sublead}>{intro1}</p>}
            {intro2 && <p className={styles.sublead}>{intro2}</p>}

            {!!stats.length && (
              <div className={styles.stats}>
                {stats.map((s, i) => (
                  <div key={i} className={styles.stat}>
                    <div className={styles.statNum}>{s.num}</div>
                    <div className={styles.statText}>{s.text}</div>
                  </div>
                ))}
              </div>
            )}

            {!!badges.length && (
              <div className={styles.badges}>
                {badges.map((b) => (
                  <span key={b} className={styles.badge}>{b}</span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.heroRight}>
            <div className={styles.photoCard}>
              <img className={styles.photo} src={avatarUrl} alt={name || 'Фото'} />
            </div>
          </div>
        </header>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.title}>Образование</h2>

            <div className={styles.eduBlock}>
              <div className={styles.eduTitle}>Основное образование</div>
              <div className={styles.eduText}>
                Государственный университет Республики Молдова<br />
                <b>Специальность:</b> Педагогика и психология<br />
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
                    <span className={styles.dot} />
                    <span className={styles.text}>{t}</span>
                  </li>
                ))}
              </ul>
            </details>
          </article>

          <article className={styles.card}>
            <h2 className={styles.title}>Опыт работы</h2>

            <ul className={styles.list}>
              {stats.map((s, i) => (
                <li key={i} className={styles.item}>
                  <span className={styles.dot} />
                  <span className={styles.text}>
                    <b>{s.num}</b> {s.text}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.note}>
              Эти цифры — про практику и устойчивый опыт работы.
            </div>
          </article>
        </div>

        {!!formats.length && (
          <section className={styles.formats}>
            <header className={styles.formatsHead}>
              <h2 className={styles.h2}>Форматы работы</h2>
              <p className={styles.lead}>Подберём формат под ваш запрос.</p>
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
        )}
      </div>
    </section>
  )
}
