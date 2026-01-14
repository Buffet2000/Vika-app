import styles from './Article.module.css'

export default function Article({
  mini = false,

  coverUrl,
  title,
  subtitle,

  html,
  paragraphs,
}) {
  const TitleTag = mini ? 'h2' : 'h1'

  const Card = (
    <article className={`${styles.card} ${mini ? styles.mini : ''}`}>
      <div
        className={styles.cover}
        style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
        role={coverUrl ? 'img' : undefined}
        aria-label={coverUrl ? title || 'Обложка статьи' : undefined}
      >
        {!coverUrl && <div className={styles.coverPlaceholder}>Обложка статьи</div>}
        <div className={styles.coverOverlay} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        {title && <TitleTag className={styles.title}>{title}</TitleTag>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.content}>
          {html ? (
            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
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
  )

  // В режиме превью — без section/container (чтобы не тащить фон/отступы)
  if (mini) return Card

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>{Card}</div>
    </section>
  )
}
