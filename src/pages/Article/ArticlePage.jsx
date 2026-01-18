import { useEffect, useState } from 'react'
import Article from '../../components/Article/Article.jsx'
import { fetchPublishedArticles } from '../../api/articles.js'
import styles from './ArticlePage.module.css'

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sort, setSort] = useState('newest')

  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchPublishedArticles({ sort })
        if (alive) setArticles(data)
      } catch (e) {
        console.error(e)
        if (alive) setError(e?.message || String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => { alive = false }
  }, [sort])

  return (
    <>
      <section className={styles.top}>
        <div className={`container ${styles.container}`}>
          <div className={styles.bar}>
            <div className={styles.label}>Сортировка:</div>

            <div className={styles.controls}>
              <button
                type="button"
                onClick={() => setSort('newest')}
                className={`${styles.btn} ${sort === 'newest' ? styles.active : ''}`}
              >
                Сначала новые
              </button>

              <button
                type="button"
                onClick={() => setSort('oldest')}
                className={`${styles.btn} ${sort === 'oldest' ? styles.active : ''}`}
              >
                Сначала старые
              </button>
            </div>
          </div>

          {loading && <div className={styles.note}>Загрузка…</div>}
          {error && <div className={styles.note}>Ошибка: {error}</div>}
          {!loading && !error && !articles.length && (
            <div className={styles.note}>Пока нет опубликованных статей.</div>
          )}
        </div>
      </section>

      {!loading && !error && articles.map((a) => (
        <Article
          key={a.id}
          coverUrl={a.cover_url || ''}
          title={a.title}
          subtitle={a.subtitle || ''}
          paragraphs={Array.isArray(a.paragraphs) ? a.paragraphs : []}
        />
      ))}
    </>
  )
}
