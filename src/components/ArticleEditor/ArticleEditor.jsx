import { useEffect, useMemo, useState } from 'react'
import Article from '../Article/Article.jsx' // поправь путь под проект
import styles from './ArticleEditor.module.css'

import { supabase } from '../../lib/supabaseClient.js' // поправь путь под проект
import { uploadCover } from '../../lib/uploadCover.js' // поправь путь под проект

const empty = {
  title: '',
  subtitle: '',
  paragraphs: [''],
  coverFile: null,
}

export default function ArticleEditor() {
  const [draft, setDraft] = useState(empty)
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const [errorText, setErrorText] = useState('')

  // локальный preview для картинки (без загрузки)
  const coverUrl = useMemo(() => {
    if (!draft.coverFile) return ''
    return URL.createObjectURL(draft.coverFile)
  }, [draft.coverFile])

  // важно: не копить blob-URL в памяти
  useEffect(() => {
    return () => {
      if (coverUrl) URL.revokeObjectURL(coverUrl)
    }
  }, [coverUrl])

  function setField(key, value) {
    setDraft((p) => ({ ...p, [key]: value }))
  }

  function setParagraph(i, value) {
    setDraft((p) => {
      const next = [...p.paragraphs]
      next[i] = value
      return { ...p, paragraphs: next }
    })
  }

  function addParagraph() {
    setDraft((p) => ({ ...p, paragraphs: [...p.paragraphs, ''] }))
  }

  function removeParagraph(i) {
    setDraft((p) => {
      const next = p.paragraphs.filter((_, idx) => idx !== i)
      return { ...p, paragraphs: next.length ? next : [''] }
    })
  }

  function moveParagraph(i, dir) {
    setDraft((p) => {
      const next = [...p.paragraphs]
      const j = i + dir
      if (j < 0 || j >= next.length) return p
      ;[next[i], next[j]] = [next[j], next[i]]
      return { ...p, paragraphs: next }
    })
  }

  function clearAll() {
    setDraft(empty)
    setStatus('idle')
    setErrorText('')
  }

  function buildPayload() {
    return {
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      paragraphs: draft.paragraphs.map((t) => t.trim()).filter(Boolean),
    }
  }

  // ✅ ПУБЛИКАЦИЯ: upload cover → insert row
  async function publish() {
    if (status === 'saving') return
    setErrorText('')

    const payload = buildPayload()

    // базовая валидация
    if (!payload.title) {
      setStatus('error')
      setErrorText('Нужен заголовок.')
      return
    }
    if (!payload.paragraphs.length) {
      setStatus('error')
      setErrorText('Добавь хотя бы один абзац.')
      return
    }

    setStatus('saving')

    try {
      // 1) грузим обложку (если выбрана)
      let cover_public_url = null
      if (draft.coverFile) {
        cover_public_url = await uploadCover(draft.coverFile) // вернёт public URL
      }

      // 2) пишем статью в таблицу articles
      // ⚠️ вставляем только те поля, которые точно есть в таблице:
      // title (text), subtitle (text), paragraphs (jsonb), cover_url (text)
      const { error } = await supabase.from('articles').insert({
        title: payload.title,
        subtitle: payload.subtitle || null,
        paragraphs: payload.paragraphs, // jsonb
        cover_url: cover_public_url,
      })

      if (error) throw error

      setStatus('saved')
      // если хочешь — очищать после публикации:
      // setDraft(empty)
    } catch (e) {
      console.error(e)
      setStatus('error')
      setErrorText(e?.message || 'Ошибка при публикации.')
    }
  }

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <header className={styles.head}>
          <h1 className={styles.pageTitle}>Редактор статьи</h1>
          <p className={styles.pageLead}>
            Заполни поля слева — справа увидишь, как статья выглядит на сайте.
          </p>
        </header>

        <div className={styles.layout}>
          {/* LEFT: FORM */}
          <div className={styles.panel}>
            <div className={styles.card}>
              <div className={styles.row}>
                <div className={styles.label}>Обложка</div>

                <label className={styles.fileBtn}>
                  Выбрать картинку
                  <input
                    className={styles.hidden}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setField('coverFile', e.target.files?.[0] || null)}
                  />
                </label>

                {draft.coverFile && (
                  <button
                    className={styles.ghostBtn}
                    type="button"
                    onClick={() => setField('coverFile', null)}
                  >
                    Убрать
                  </button>
                )}
              </div>

              <div className={styles.coverMini}>
                {coverUrl ? (
                  <img className={styles.coverMiniImg} src={coverUrl} alt="" />
                ) : (
                  <div className={styles.coverMiniEmpty}>Обложка не выбрана</div>
                )}
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Заголовок</span>
                <input
                  className={styles.input}
                  value={draft.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="Например: Как помочь ребёнку справиться с тревогой"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Подзаголовок</span>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={draft.subtitle}
                  onChange={(e) => setField('subtitle', e.target.value)}
                  placeholder="1–2 предложения — о чём статья и для кого"
                />
              </label>
            </div>

            <div className={styles.card}>
              <div className={styles.rowBetween}>
                <div>
                  <div className={styles.blockTitle}>Текст</div>
                  <div className={styles.blockHint}>Каждый абзац — отдельным полем.</div>
                </div>

                <button className={styles.btn} type="button" onClick={addParagraph}>
                  + Абзац
                </button>
              </div>

              <div className={styles.paras}>
                {draft.paragraphs.map((t, i) => (
                  <div key={i} className={styles.para}>
                    <div className={styles.paraHead}>
                      <div className={styles.paraIndex}>Абзац {i + 1}</div>
                      <div className={styles.paraActions}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => moveParagraph(i, -1)}
                          title="Вверх"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => moveParagraph(i, +1)}
                          title="Вниз"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtnDanger}
                          onClick={() => removeParagraph(i)}
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <textarea
                      className={styles.textarea}
                      rows={4}
                      value={t}
                      onChange={(e) => setParagraph(i, e.target.value)}
                      placeholder="Напиши абзац…"
                    />
                  </div>
                ))}
              </div>

              <div className={styles.footerRow}>
                <button type="button" className={styles.ghostBtn} onClick={clearAll}>
                  Очистить
                </button>

                <button
                  type="button"
                  className={styles.btn}
                  onClick={publish}
                  disabled={status === 'saving'}
                  title="Загрузит обложку в Storage и создаст строку в таблице articles"
                >
                  {status === 'saving' ? 'Публикую…' : 'Опубликовать'}
                </button>
              </div>

              {status === 'saved' && (
                <div style={{ marginTop: 10, color: '#2f4f47', fontWeight: 800 }}>
                  ✅ Опубликовано в Supabase
                </div>
              )}

              {status === 'error' && (
                <div style={{ marginTop: 10, color: '#8a2f2f', fontWeight: 800 }}>
                  ❌ {errorText || 'Ошибка'}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className={styles.preview}>
            <div className={styles.previewCard}>
              <Article
                mini
                coverUrl={coverUrl}
                title={draft.title}
                subtitle={draft.subtitle}
                paragraphs={draft.paragraphs.map((t) => t.trim()).filter(Boolean)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
