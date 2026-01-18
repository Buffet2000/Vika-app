import styles from './AdminArticleCard.module.css'
import { FiEdit3, FiUpload, FiDownload, FiTrash2 } from 'react-icons/fi'

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AdminArticleCard({
  title,
  isPublished,
  publishedAt,
  updatedAt,
  createdAt,
  dateText,
  busy = false,
  onEdit,
  onDelete,
  onTogglePublish,
}) {
  const iso =
    dateText ||
    (isPublished ? publishedAt : null) ||
    updatedAt ||
    createdAt ||
    null

  return (
    <article className={styles.card} tabIndex={0}>
      <div className={styles.meta}>
        <span className={`${styles.badge} ${isPublished ? styles.pub : styles.draft}`}>
          {isPublished ? 'Опубликовано' : 'Черновик'}
        </span>
        <span className={styles.date}>{formatDate(iso)}</span>
      </div>

      <h3 className={styles.title}>{title?.trim() || 'Без названия'}</h3>

      <div className={styles.actions}>
        {/* Edit */}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onEdit}
          disabled={busy}
          title="Изменить"
          aria-label="Изменить"
        >
          <FiEdit3 size={18} />
        </button>

        {/* Publish / Unpublish */}
        <button
          type="button"
          className={`${styles.iconBtn} ${isPublished ? styles.iconBtnGhost : styles.iconBtnPrimary}`}
          onClick={onTogglePublish}
          disabled={busy}
          title={isPublished ? 'Снять с публикации' : 'Опубликовать'}
          aria-label={isPublished ? 'Снять с публикации' : 'Опубликовать'}
        >
          {isPublished ? <FiDownload size={18} /> : <FiUpload size={18} />}
        </button>

        {/* Delete */}
        <button
          type="button"
          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
          onClick={onDelete}
          disabled={busy}
          title="Удалить"
          aria-label="Удалить"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </article>
  )
}
