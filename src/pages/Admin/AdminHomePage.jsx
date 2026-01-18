import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './AdminHomePage.module.css'

import { fetchAllArticlesAdmin } from '../../api/articles.js'

function formatDateTime(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AdminHomePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchAllArticlesAdmin()
        if (alive) setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        if (alive) setError(e?.message || String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => {
    const total = items.length
    const published = items.filter((x) => !!x.is_published).length
    const drafts = total - published

    const lastIso =
      items
        .map((x) => x.updated_at || x.created_at || null)
        .filter(Boolean)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null

    return { total, published, drafts, lastIso }
  }, [items])

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <header className={styles.head}>
            <div>
              <h1 className={styles.title}>Обзор</h1>
              <p className={styles.text}>Статистика и быстрые действия.</p>
            </div>

            <div className={styles.actions}>
              <Link className={styles.btnGhost} to="/admin/articles">
                Все статьи
              </Link>
              <Link className={styles.btn} to="/admin/editor">
                + Новая статья
              </Link>
            </div>
          </header>

          {loading && <div className={styles.state}>Загрузка…</div>}
          {!loading && error && <div className={styles.stateErr}>Ошибка: {error}</div>}

          {!loading && !error && (
            <>
              <div className={styles.kpis}>
                <div className={styles.kpi}>
                  <div className={styles.kpiNum}>{stats.total}</div>
                  <div className={styles.kpiLabel}>Всего статей</div>
                </div>

                <div className={styles.kpi}>
                  <div className={styles.kpiNum}>{stats.published}</div>
                  <div className={styles.kpiLabel}>Опубликовано</div>
                </div>

                <div className={styles.kpi}>
                  <div className={styles.kpiNum}>{stats.drafts}</div>
                  <div className={styles.kpiLabel}>Черновики</div>
                </div>

                <div className={styles.kpiWide}>
                  <div className={styles.kpiLabel}>Последняя активность</div>
                  <div className={styles.kpiValue}>{formatDateTime(stats.lastIso)}</div>
                </div>
              </div>

              <div className={styles.note}>
                Редактирование и публикация — в разделе «Все статьи».
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
