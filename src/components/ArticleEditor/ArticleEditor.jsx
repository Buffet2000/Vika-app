import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Article from '../Article/Article.jsx'
import styles from './ArticleEditor.module.css'

import { supabase } from '../../lib/supabaseClient.js'
import { uploadCover } from '../../lib/uploadCover.js'

const empty = {
  title: '',
  subtitle: '',
  paragraphs: [''],
  coverFile: null,
}
function normalizeParagraphs(v) {
  if (Array.isArray(v)) return v.map(String)
  return ['']
}

export default function ArticleEditor() {
  const params = useParams()
  const editId = params?.id || null
  const [draft, setDraft] = useState(empty)

  const [draftId, setDraftId] = useState(null)

  const [coverDbUrl, setCoverDbUrl] = useState('')

  const [status, setStatus] = useState('idle')
  const [errorText, setErrorText] = useState('')

  const coverBlobUrl = useMemo(() => {
    if (!draft.coverFile) return ''
    return URL.createObjectURL(draft.coverFile)
  }, [draft.coverFile])

  const coverUrl = coverBlobUrl || coverDbUrl || ''

  useEffect(() => {
    return () => {
      if (coverBlobUrl) URL.revokeObjectURL(coverBlobUrl)
    }
  }, [coverBlobUrl])

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
    setDraftId(null)
    setCoverDbUrl('')
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

  function validateBase(payload) {
    if (!payload.title) return 'Нужен заголовок.'
    if (!payload.paragraphs.length) return 'Добавь хотя бы один абзац.'
    return ''
  }

  useEffect(() => {
    let alive = true

    async function load() {
      if (!editId) return

      setStatus('loading')
      setErrorText('')

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id,title,subtitle,paragraphs,cover_url,is_published,published_at,updated_at')
          .eq('id', editId)
          .single()

        if (error) throw error
        if (!alive) return

        setDraftId(data.id)
        setCoverDbUrl(data.cover_url || '')

        setDraft({
          title: data.title || '',
          subtitle: data.subtitle || '',
          paragraphs: normalizeParagraphs(data.paragraphs),
          coverFile: null,
        })

        setStatus('idle')
      } catch (e) {
        console.error(e)
        if (!alive) return
        setStatus('error')
        setErrorText(e?.message || 'Не удалось загрузить статью.')
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [editId])

  async function saveDraft() {
    if (status === 'saving' || status === 'publishing' || status === 'loading') return
    setErrorText('')

    const payload = buildPayload()
    const v = validateBase(payload)
    if (v) {
      setStatus('error')
      setErrorText(v)
      return
    }

    setStatus('saving')

    try {
      let id = draftId

      if (!id) {
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title: payload.title,
            subtitle: payload.subtitle || null,
            paragraphs: payload.paragraphs,
            cover_url: null,
            is_published: false,
            published_at: null,
          })
          .select('id')
          .single()

        if (error) throw error
        id = data.id
        setDraftId(id)
      }

      let cover_public_url = null
      if (draft.coverFile) {
        cover_public_url = await uploadCover(draft.coverFile)
        setCoverDbUrl(cover_public_url)
        setField('coverFile', null)
      }

      const { error } = await supabase
        .from('articles')
        .update({
          title: payload.title,
          subtitle: payload.subtitle || null,
          paragraphs: payload.paragraphs,
          ...(cover_public_url ? { cover_url: cover_public_url } : {}),
          is_published: false,
          published_at: null,
        })
        .eq('id', id)

      if (error) throw error

      setStatus('saved')
    } catch (e) {
      console.error(e)
      setStatus('error')
      setErrorText(e?.message || 'Ошибка при сохранении.')
    }
  }

  async function publish() {
    if (status === 'saving' || status === 'publishing' || status === 'loading') return
    setErrorText('')

    const payload = buildPayload()
    const v = validateBase(payload)
    if (v) {
      setStatus('error')
      setErrorText(v)
      return
    }

    setStatus('publishing')

    try {
      let id = draftId
      if (!id) {
        const { data, error } = await supabase
          .from('articles')
          .insert({
            title: payload.title,
            subtitle: payload.subtitle || null,
            paragraphs: payload.paragraphs,
            cover_url: null,
            is_published: false,
            published_at: null,
          })
          .select('id')
          .single()

        if (error) throw error
        id = data.id
        setDraftId(id)
      }

      let cover_public_url = null
      if (draft.coverFile) {
        cover_public_url = await uploadCover(draft.coverFile)
        setCoverDbUrl(cover_public_url)
        setField('coverFile', null)
      }

      const { error } = await supabase
        .from('articles')
        .update({
          title: payload.title,
          subtitle: payload.subtitle || null,
          paragraphs: payload.paragraphs,
          ...(cover_public_url ? { cover_url: cover_public_url } : {}),
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      setStatus('published')
    } catch (e) {
      console.error(e)
      setStatus('error')
      setErrorText(e?.message || 'Ошибка при публикации.')
    }
  }

  const isBusy = status === 'saving' || status === 'publishing' || status === 'loading'

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <header className={styles.head}>
          <h1 className={styles.pageTitle}>
            {editId ? 'Редактирование статьи' : 'Редактор статьи'}
          </h1>
          <p className={styles.pageLead}>
            Заполни поля слева — справа увидишь, как статья выглядит на сайте.
          </p>
        </header>

        <div className={styles.layout}>
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

                {(draft.coverFile || coverDbUrl) && (
                  <button
                    className={styles.ghostBtn}
                    type="button"
                    onClick={() => {
                      setField('coverFile', null)
                      setCoverDbUrl('')
                    }}
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

                <button className={styles.btn} type="button" onClick={addParagraph} disabled={isBusy}>
                  + Абзац
                </button>
              </div>

              <div className={styles.paras}>
                {draft.paragraphs.map((t, i) => (
                  <div key={i} className={styles.para}>
                    <div className={styles.paraHead}>
                      <div className={styles.paraIndex}>Абзац {i + 1}</div>
                      <div className={styles.paraActions}>
                        <button type="button" className={styles.iconBtn} onClick={() => moveParagraph(i, -1)} title="Вверх" disabled={isBusy}>↑</button>
                        <button type="button" className={styles.iconBtn} onClick={() => moveParagraph(i, +1)} title="Вниз" disabled={isBusy}>↓</button>
                        <button type="button" className={styles.iconBtnDanger} onClick={() => removeParagraph(i)} title="Удалить" disabled={isBusy}>✕</button>
                      </div>
                    </div>

                    <textarea
                      className={styles.textarea}
                      rows={4}
                      value={t}
                      onChange={(e) => setParagraph(i, e.target.value)}
                      placeholder="Напиши абзац…"
                      disabled={isBusy}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.footerRow}>
                <button type="button" className={styles.ghostBtn} onClick={clearAll} disabled={isBusy}>
                  Очистить
                </button>

                <button type="button" className={styles.ghostBtn} onClick={saveDraft} disabled={isBusy}>
                  {status === 'saving' ? 'Сохраняю…' : 'Сохранить'}
                </button>

                <button type="button" className={styles.btn} onClick={publish} disabled={isBusy}>
                  {status === 'publishing' ? 'Публикую…' : 'Опубликовать'}
                </button>
              </div>

              {draftId && (
                <div style={{ marginTop: 10, color: 'rgba(47,79,71,0.7)', fontWeight: 800 }}>
                  ID: {draftId}
                </div>
              )}

              {status === 'loading' && (
                <div style={{ marginTop: 10, color: '#2f4f47', fontWeight: 800 }}>
                  ⏳ Загружаю статью…
                </div>
              )}

              {status === 'saved' && (
                <div style={{ marginTop: 10, color: '#2f4f47', fontWeight: 800 }}>
                  ✅ Сохранено (черновик)
                </div>
              )}

              {status === 'published' && (
                <div style={{ marginTop: 10, color: '#2f4f47', fontWeight: 800 }}>
                  ✅ Опубликовано
                </div>
              )}

              {status === 'error' && (
                <div style={{ marginTop: 10, color: '#8a2f2f', fontWeight: 800 }}>
                  ❌ {errorText || 'Ошибка'}
                </div>
              )}
            </div>
          </div>

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
