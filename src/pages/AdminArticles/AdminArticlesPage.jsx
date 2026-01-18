// src/pages/AdminArticles/AdminArticlesPage.jsx
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

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAllArticlesAdmin()
      setItems(data)
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
    const arr = [...items]
    arr.sort((a, b) => {
      const da = getSortIso(a) ? new Date(getSortIso(a)).getTime() : 0
      const db = getSortIso(b) ? new Date(getSortIso(b)).getTime() : 0
      return sort === 'new' ? db - da : da - db
    })
    return arr
  }, [items, sort])

  async function onDelete(id, title) {
    const ok = window.confirm(
      `Удалить статью?\n\n"${title || 'Без названия'}"\n\nЭто действие нельзя отменить.`
    )
    if (!ok) return

    try {
      await deleteArticleById(id)
      setItems((p) => p.filter((x) => x.id !== id))
    } catch (e) {
      console.error(e)
      alert(e?.message || 'Ошибка удаления')
    }
  }

  async function onTogglePublish(id, current) {
    try {
      await setArticlePublished(id, !current)
      setItems((p) =>
        p.map((x) =>
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
                    <button type="button" className={`${styles.sortBtn} ${styles.sortBtnActive}`}>
                        Сначала новые
                    </button>
                    <button type="button" className={styles.sortBtn}>
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
