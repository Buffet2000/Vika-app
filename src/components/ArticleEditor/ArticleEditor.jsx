import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Article from '../Article/Article.jsx'
import styles from './ArticleEditor.module.css'

import { supabase } from '../../lib/supabaseClient.js'
import { uploadCover } from '../../lib/uploadCover.js'
import RichTextEditor from '../Editor/RichTextEditor.jsx'

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph', content: [] }] }

function makeEmpty() {
  return {
    title: '',
    subtitle: '',
    content: typeof structuredClone === 'function'
      ? structuredClone(EMPTY_DOC)
      : JSON.parse(JSON.stringify(EMPTY_DOC)),
    coverFile: null,
  }
}

function safeDoc(v) {
  if (!v || typeof v !== 'object') return makeEmpty().content
  if (v.type !== 'doc') return makeEmpty().content
  if (!Array.isArray(v.content) || v.content.length === 0) return makeEmpty().content
  return v
}

function extractTextFromTipTap(doc) {
  const d = safeDoc(doc)

  const outBlocks = []
  let current = ''

  const pushBlock = () => {
    const t = current
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    if (t) outBlocks.push(t)
    current = ''
  }

  const textOfInline = (node) => {
    if (!node) return ''
    if (node.type === 'text') return node.text || ''
    if (node.type === 'hardBreak') return '\n'
    if (!Array.isArray(node.content)) return ''
    return node.content.map(textOfInline).join('')
  }

  const walk = (node) => {
    if (!node) return

    if (node.type === 'paragraph' || node.type === 'heading') {
      current += textOfInline(node)
      pushBlock()
      return
    }

    if (node.type === 'listItem') {
      const liText = (node.content || []).map(textOfInline).join('').trim()
      if (liText) {
        current += `- ${liText}`
        pushBlock()
      }
      return
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(walk)
    }
  }

  walk(d)
  pushBlock()

  return outBlocks.join('\n\n').trim()
}

export default function ArticleEditor() {
  const params = useParams()
  const editId = params?.id || null

  const [draft, setDraft] = useState(makeEmpty)
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

  function clearAll() {
    setDraft(makeEmpty())
    setDraftId(null)
    setCoverDbUrl('')
    setStatus('idle')
    setErrorText('')
  }

  function buildPayload() {
    const title = draft.title.trim()
    const subtitle = draft.subtitle.trim()
    const content = safeDoc(draft.content)
    const content_text = extractTextFromTipTap(content)

    return {
      title,
      subtitle: subtitle || null,
      content,
      content_text,
    }
  }

  function validateBase(payload) {
    if (!payload.title) return 'Нужен заголовок.'
    if (!payload.content_text || payload.content_text.trim().length < 3) return 'Нужен текст статьи.'
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
          .select('id,title,subtitle,content,content_text,cover_url,is_published,published_at,updated_at')
          .eq('id', editId)
          .single()

        if (error) throw error
        if (!alive) return

        setDraftId(data.id)
        setCoverDbUrl(data.cover_url || '')

        setDraft({
          title: data.title || '',
          subtitle: data.subtitle || '',
          content: safeDoc(data.content),
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

  async function ensureDraftRow(payload) {
    let id = draftId

    if (!id) {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: payload.title,
          subtitle: payload.subtitle,
          content: payload.content,
          content_text: payload.content_text,
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

    return id
  }

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
      const id = await ensureDraftRow(payload)

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
          subtitle: payload.subtitle,
          content: payload.content,
          content_text: payload.content_text,
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
      const id = await ensureDraftRow(payload)

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
          subtitle: payload.subtitle,
          content: payload.content,
          content_text: payload.content_text,
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
                    disabled={isBusy}
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
                    disabled={isBusy}
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
                  disabled={isBusy}
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
                  disabled={isBusy}
                />
              </label>
            </div>

            <div className={styles.card}>
              <div className={styles.rowBetween}>
                <div>
                  <div className={styles.blockTitle}>Текст (TipTap)</div>
                  <div className={styles.blockHint}>Один “взрослый” редактор вместо абзацев.</div>
                </div>
              </div>

              <RichTextEditor
                value={safeDoc(draft.content)}
                onChange={(json) => setField('content', safeDoc(json))}
                disabled={isBusy}
              />

              <div className={styles.footerRow}>
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={clearAll}
                  disabled={isBusy}
                >
                  Очистить
                </button>

                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={saveDraft}
                  disabled={isBusy}
                >
                  {status === 'saving' ? 'Сохраняю…' : 'Сохранить'}
                </button>

                <button
                  type="button"
                  className={styles.btn}
                  onClick={publish}
                  disabled={isBusy}
                >
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

          {/* PREVIEW */}
          <div className={styles.preview}>
            <div className={styles.previewCard}>
              <Article
                mini
                coverUrl={coverUrl}
                title={draft.title}
                subtitle={draft.subtitle}
                content={safeDoc(draft.content)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
