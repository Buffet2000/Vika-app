import { useState } from 'react'
import styles from './Header.module.css'

import { Link } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="/">
          <span className={styles.brandDot} aria-hidden="true" />
          <span className={styles.brandText}>Психолог</span>
        </a>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`} aria-label="Основное меню">
          <a className={styles.link} href="/">Главная</a>
          <a className={styles.link} href="/posts">Статьи</a>
          <Link to="/consultations" className={styles.link}>Консультации</Link>
          <Link to="/about" className={styles.link}>Обо мне</Link>

          <a className={styles.cta} href="#booking" onClick={() => setOpen(false)}>
            Записаться
          </a>
        </nav>

        <button
          className={styles.burger}
          type="button"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>

        {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
      </div>
    </header>
  )
}
