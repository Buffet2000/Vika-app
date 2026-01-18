import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import styles from './LoginPage.module.css'
import { supabase } from '../../lib/supabaseClient.js'

export default function LoginPage() {
  const nav = useNavigate()
  const loc = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorText, setErrorText] = useState('')

  const from = loc.state?.from?.pathname || '/admin'

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setErrorText('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setStatus('error')
      setErrorText(error.message)
      return
    }

    if (data?.session) nav(from, { replace: true })
    else nav('/admin/editor', { replace: true })
  }

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <h1 className={styles.title}>Вход</h1>
          <p className={styles.lead}>Только для администратора сайта.</p>

          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Пароль</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button className={styles.btn} disabled={status === 'loading'}>
              {status === 'loading' ? 'Вхожу…' : 'Войти'}
            </button>

            {status === 'error' && <div className={styles.err}>❌ {errorText}</div>}
          </form>

          <div className={styles.back}>
            <Link to="/articles">← На сайт</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
