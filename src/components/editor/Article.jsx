import styles from './Article.module.css'

/**
 * Универсальная страница статьи/заметки.
 *
 * Дальше можно будет подставлять данные из Supabase:
 * coverUrl, title, subtitle, html или blocks.
 */
export default function Article({
  coverUrl,
  coverAlt = '',
  coverHeight = 280, // <= 300px по твоему ТЗ
  coverPosition = 'center', // можно двигать: 'center 35%', 'left center' и т.д.
  title,
  subtitle,
  // Вариант A: готовый HTML (из будущего редактора)
  html,
  // Вариант B: массив абзацев (если пока без редактора)
  paragraphs,
}) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <article className={styles.card}>
          <div
            className={styles.cover}
            style={{
              height: coverHeight,
              backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
              backgroundPosition: coverPosition,
            }}
            aria-label={coverAlt}
            role={coverUrl ? 'img' : undefined}
          >
            {!coverUrl && <div className={styles.coverPlaceholder}>Обложка статьи</div>}
            <div className={styles.coverOverlay} aria-hidden="true" />
          </div>

          <div className={styles.body}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

            <div className={styles.content}>
              {html ? (
                <div
                  className={styles.prose}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <div className={styles.prose}>
                  {(paragraphs || []).map((t, idx) => (
                    <p key={idx}>{t}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
