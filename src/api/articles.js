// src/api/articles.js
import { supabase } from '../lib/supabaseClient'

export async function saveDraft({ id, title, subtitle, content, content_text, coverUrl }) {
  const payload = {
    title,
    subtitle: subtitle || null,
    content: content || null,
    content_text: content_text || null,
    cover_url: coverUrl || null,
    is_published: false,
    published_at: null,
  }

  if (id) {
    const { data, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function publishArticle(id) {
  const { data, error } = await supabase
    .from('articles')
    .update({
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchPublishedArticles({ sort = 'newest' } = {}) {
  const ascending = sort === 'oldest'

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, subtitle, content, cover_url, published_at, updated_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending, nullsFirst: false })
    .order('updated_at', { ascending })
    .order('created_at', { ascending })

  if (error) throw error
  return data || []
}

export async function fetchAllArticlesAdmin() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, is_published, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function deleteArticleById(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}

export async function setArticlePublished(id, nextPublished) {
  const patch = nextPublished
    ? { is_published: true, published_at: new Date().toISOString() }
    : { is_published: false, published_at: null }

  const { error } = await supabase.from('articles').update(patch).eq('id', id)
  if (error) throw error
}
