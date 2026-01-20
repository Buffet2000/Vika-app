import styles from './Article.module.css'

function renderInline(node, keyPrefix = 'i') {
  if (!node) return null

  if (node.type === 'text') {
    let el = node.text || ''
    const marks = Array.isArray(node.marks) ? node.marks : []

    marks.forEach((m, i) => {
      if (m.type === 'bold') el = <strong key={`${keyPrefix}-b-${i}`}>{el}</strong>
      if (m.type === 'italic') el = <em key={`${keyPrefix}-em-${i}`}>{el}</em>
      if (m.type === 'underline') el = <u key={`${keyPrefix}-u-${i}`}>{el}</u>
      if (m.type === 'link') {
        const href = m.attrs?.href || '#'
        el = (
          <a key={`${keyPrefix}-a-${i}`} href={href} target="_blank" rel="noopener noreferrer">
            {el}
          </a>
        )
      }
    })

    return el
  }

  if (node.type === 'hardBreak') return <br key={`${keyPrefix}-br`} />

  const children = Array.isArray(node.content)
    ? node.content.map((c, idx) => renderInline(c, `${keyPrefix}-${idx}`))
    : null

  return children
}

function renderBlock(node, idx) {
  if (!node) return null

  if (node.type === 'paragraph') {
    return <p key={`p-${idx}`}>{renderInline(node, `p-${idx}`)}</p>
  }

  if (node.type === 'heading') {
    const level = Math.min(Math.max(Number(node.attrs?.level || 2), 1), 6)
    const Tag = `h${level}`
    return <Tag key={`h-${idx}`}>{renderInline(node, `h-${idx}`)}</Tag>
  }

  if (node.type === 'bulletList') {
    return (
      <ul key={`ul-${idx}`}>
        {(node.content || []).map((li, i) => renderBlock(li, `${idx}-li-${i}`))}
      </ul>
    )
  }

  if (node.type === 'orderedList') {
    return (
      <ol key={`ol-${idx}`}>
        {(node.content || []).map((li, i) => renderBlock(li, `${idx}-li-${i}`))}
      </ol>
    )
  }

  if (node.type === 'listItem') {
    const parts = Array.isArray(node.content) ? node.content : []
    return (
      <li key={`li-${idx}`}>
        {parts.map((c, i) => {
          if (c.type === 'paragraph') {
            return <span key={`li-${idx}-p-${i}`}>{renderInline(c, `li-${idx}-${i}`)}</span>
          }

          if (c.type === 'bulletList' || c.type === 'orderedList') {
            return <span key={`li-${idx}-l-${i}`}>{renderBlock(c, `${idx}-${i}`)}</span>
          }
          return <span key={`li-${idx}-x-${i}`}>{renderInline(c, `li-${idx}-${i}`)}</span>
        })}
      </li>
    )
  }

  // fallback
  if (Array.isArray(node.content)) {
    return (
      <div key={`x-${idx}`}>
        {node.content.map((c, i) => renderBlock(c, `${idx}-${i}`))}
      </div>
    )
  }

  return null
}

function TipTapContent({ content }) {
  const doc = content && typeof content === 'object' ? content : null
  const nodes = Array.isArray(doc?.content) ? doc.content : []
  if (!nodes.length) return null

  return <div className={styles.prose}>{nodes.map((n, i) => renderBlock(n, i))}</div>
}

export default function Article({ mini = false, coverUrl, title, subtitle, content }) {
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
          <TipTapContent content={content} />
        </div>
      </div>
    </article>
  )

  if (mini) return Card

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>{Card}</div>
    </section>
  )
}
