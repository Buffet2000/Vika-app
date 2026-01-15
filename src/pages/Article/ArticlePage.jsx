import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Article from '../../components/Article/Article.jsx'

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadArticles() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setError('Не удалось загрузить статьи')
      } else {
        setArticles(data || [])
      }

      setLoading(false)
    }

    loadArticles()
  }, [])

  if (loading) {
    return <p style={{ padding: 40 }}>Загрузка статей…</p>
  }

  if (error) {
    return <p style={{ padding: 40, color: 'red' }}>{error}</p>
  }

  if (!articles.length) {
    return <p style={{ padding: 40 }}>Статей пока нет</p>
  }

  return (
    <>
      {articles.map((a) => (
        <Article
          key={a.id}
          coverUrl={a.cover_url || undefined}
          title={a.title}
          subtitle={a.subtitle}
          paragraphs={Array.isArray(a.paragraphs) ? a.paragraphs : []}
        />
      ))}
    </>
  )
}
