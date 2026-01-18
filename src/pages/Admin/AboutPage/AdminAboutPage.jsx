import { useEffect, useMemo, useState } from 'react'
import styles from './AdminAboutPage.module.css'
import { fetchAbout, updateAbout } from '../../../api/about.js'
import { uploadAboutAvatar } from '../../../lib/uploadAboutAvatar.js'

const EMPTY = {
  name: '',
  intro1: '',
  intro2: '',
  stats: [
    { num: '', text: '' },
    { num: '', text: '' },
    { num: '', text: '' },
  ],
  badges: [],
  formats: [
    { title: '', text: '' },
    { title: '', text: '' },
    { title: '', text: '' },
  ],
  avatar_url: '',
}

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const avatarPreview = useMemo(() => {
    if (!avatarFile) return ''
    return URL.createObjectURL(avatarFile)
  }, [avatarFile])

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const row = await fetchAbout()
        if (!alive) return

        setForm({
          name: row?.name || '',
          intro1: row?.intro1 || '',
          intro2: row?.intro2 || '',
          avatar_url: row?.avatar_url || '',
          stats: Array.isArray(row?.stats) ? row.stats : EMPTY.stats,
          badges: Array.isArray(row?.badges) ? row.badges : [],
          formats: Array.isArray(row?.formats) ? row.formats : EMPTY.formats,
        })
      } catch (e) {
        console.error(e)
        setError(e.message)
      } finally {
        alive && setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  function setStat(i, key, value) {
    setForm((p) => {
      const next = [...p.stats]
      next[i] = { ...next[i], [key]: value }
      return { ...p, stats: next }
    })
  }

  function setFormat(i, key, value) {
    setForm((p) => {
      const next = [...p.formats]
      next[i] = { ...next[i], [key]: value }
      return { ...p, formats: next }
    })
  }

  async function save() {
    if (status === 'saving') return
    setStatus('saving')
    setError('')

    try {
      let avatar_url = form.avatar_url

      if (avatarFile) {
        avatar_url = await uploadAboutAvatar(avatarFile)
      }

      await updateAbout({
        name: form.name,
        intro1: form.intro1,
        intro2: form.intro2,
        stats: form.stats,
        badges: form.badges,
        formats: form.formats,
        avatar_url,
      })

      setAvatarFile(null)
      setForm((p) => ({ ...p, avatar_url }))
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 1200)
    } catch (e) {
      console.error(e)
      setStatus('error')
      setError(e.message)
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Загрузка…</div>

  const avatarSrc = avatarPreview || form.avatar_url || ''

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <header className={styles.head}>
            <div>
              <h1 className={styles.title}>Обо мне</h1>
              <p className={styles.lead}>Минимальный редактор. Позже расширим.</p>
            </div>
            <button className={styles.primary} onClick={save}>
              {status === 'saving' ? 'Сохраняю…' : 'Сохранить'}
            </button>
          </header>

          {status === 'error' && <div className={styles.err}>❌ {error}</div>}
          {status === 'saved' && <div className={styles.ok}>✅ Сохранено</div>}

          <div className={styles.grid}>
            <div className={styles.block}>
              <div className={styles.blockTitle}>Аватар</div>

              <label className={styles.avatarBox}>
                {avatarSrc ? (
                  <img className={styles.avatarImg} src={avatarSrc} alt="Аватар" />
                ) : (
                  <div className={styles.avatarEmpty}>Нет фото</div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className={styles.hidden}
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </label>

              <div className={styles.avatarHint}>
                {avatarPreview
                  ? 'Новое фото (ещё не сохранено)'
                  : form.avatar_url
                  ? 'Текущее фото'
                  : 'Нажмите, чтобы выбрать фото'}
              </div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>Тексты</div>

              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Имя"
              />

              <textarea
                className={styles.textarea}
                rows={4}
                value={form.intro1}
                onChange={(e) => setField('intro1', e.target.value)}
                placeholder="Абзац 1"
              />

              <textarea
                className={styles.textarea}
                rows={4}
                value={form.intro2}
                onChange={(e) => setField('intro2', e.target.value)}
                placeholder="Абзац 2"
              />
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>Цифры</div>
              {form.stats.map((s, i) => (
                <div key={i} className={styles.row2}>
                  <input
                    className={styles.input}
                    value={s.num}
                    onChange={(e) => setStat(i, 'num', e.target.value)}
                  />
                  <input
                    className={styles.input}
                    value={s.text}
                    onChange={(e) => setStat(i, 'text', e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>Бейджи</div>
              <input
                className={styles.input}
                value={form.badges.join(', ')}
                onChange={(e) =>
                  setField(
                    'badges',
                    e.target.value
                      .split(',')
                      .map((x) => x.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>Форматы</div>
              {form.formats.map((f, i) => (
                <div key={i}>
                  <input
                    className={styles.input}
                    value={f.title}
                    onChange={(e) => setFormat(i, 'title', e.target.value)}
                    placeholder="Заголовок"
                  />
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={f.text}
                    onChange={(e) => setFormat(i, 'text', e.target.value)}
                    placeholder="Текст"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
