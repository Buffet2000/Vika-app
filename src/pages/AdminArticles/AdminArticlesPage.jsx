import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminArticleCard from '../../components/AdminArticleCard/AdminArticleCard.jsx'
import styles from './AdminArticlesPage.module.css'

import {
  fetchAllArticlesAdmin,
  deleteArticleById,
  setArticlePublished,
} from '../../api/articles.js'

export default function AdminArticlesPage() {
  const nav = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sort, setSort] = useState('new')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAllArticlesAdmin()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function getSortIso(a) {
    return (a?.is_published ? a?.published_at : null) || a?.updated_at || a?.created_at || null
  }

  const sortedItems = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : []
    arr.sort((a, b) => {
      const ia = getSortIso(a)
      const ib = getSortIso(b)

      const da = ia ? Date.parse(ia) : 0
      const db = ib ? Date.parse(ib) : 0

      const na = Number.isFinite(da) ? da : 0
      const nb = Number.isFinite(db) ? db : 0

      return sort === 'new' ? nb - na : na - nb
    })
    return arr
  }, [items, sort])

  async function onDelete(id, title) {
    if (!id) return
    if (busyId) return

    const ok = window.confirm(
      `Удалить статью?\n\n"${title || 'Без названия'}"\n\nЭто действие нельзя отменить.`
    )
    if (!ok) return

    try {
      setBusyId(id)
      await deleteArticleById(id)
      setItems((p) => (Array.isArray(p) ? p.filter((x) => x.id !== id) : []))
    } catch (e) {
      console.error(e)
      alert(e?.message || 'Ошибка удаления')
    } finally {
      setBusyId(null)
    }
  }

  async function onTogglePublish(id, current) {
    if (!id) return
    if (busyId) return

    try {
      setBusyId(id)

      await setArticlePublished(id, !current)

      setItems((p) =>
        (Array.isArray(p) ? p : []).map((x) =>
          x.id === id
            ? {
                ...x,
                is_published: !current,
                published_at: !current ? new Date().toISOString() : null,
              }
            : x
        )
      )
    } catch (e) {
      console.error(e)
      alert(e?.message || 'Ошибка')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Загрузка…</div>
  if (error) return <div style={{ padding: 24 }}>Ошибка: {error}</div>

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <h1 className={styles.title}>Все статьи</h1>
            <p className={styles.lead}>
              Черновики и публикации. Наведи на карточку — появятся действия.
            </p>

            <div className={styles.toolbar}>
              <div className={styles.sort}>
                <span className={styles.sortLabel}>Сортировка:</span>

                <div className={styles.sortBtns} role="group" aria-label="Сортировка статей">
                  <button
                    type="button"
                    onClick={() => setSort('new')}
                    className={`${styles.sortBtn} ${sort === 'new' ? styles.sortBtnActive : ''}`}
                    aria-pressed={sort === 'new'}
                  >
                    Сначала новые
                  </button>

                  <button
                    type="button"
                    onClick={() => setSort('old')}
                    className={`${styles.sortBtn} ${sort === 'old' ? styles.sortBtnActive : ''}`}
                    aria-pressed={sort === 'old'}
                  >
                    Сначала старые
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            className={styles.primary}
            type="button"
            onClick={() => nav('/admin/editor', { replace: false })}
          >
            + Новая статья
          </button>
        </div>

        {!sortedItems.length ? (
          <div className={styles.empty}>Пока нет статей.</div>
        ) : (
          <div className={styles.grid}>
            {sortedItems.map((a) => (
              <AdminArticleCard
                key={a.id}
                title={a.title}
                isPublished={!!a.is_published}
                publishedAt={a.published_at}
                updatedAt={a.updated_at}
                createdAt={a.created_at}
                busy={busyId === a.id}
                onEdit={() => nav(`/admin/editor/${a.id}`)}
                onTogglePublish={() => onTogglePublish(a.id, !!a.is_published)}
                onDelete={() => onDelete(a.id, a.title)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
