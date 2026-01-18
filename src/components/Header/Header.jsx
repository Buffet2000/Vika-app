import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

import logo from '../../assets/logo/school-of-feelings.png'
import { useAuth } from '../Auth/UseAuth'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, loading } = useAuth()

  const isAuthed = !!user

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="School of Feelings"
            className={styles.brandLogo}
          />
        </Link>

        <nav
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          aria-label="Основное меню"
        >
          <NavLink to="/" className={styles.link} onClick={() => setOpen(false)} end>
            Главная
          </NavLink>

          <NavLink to="/articles" className={styles.link} onClick={() => setOpen(false)}>
            Статьи
          </NavLink>

          <NavLink to="/consultations" className={styles.link} onClick={() => setOpen(false)}>
            Консультации
          </NavLink>

          <NavLink to="/about" className={styles.link} onClick={() => setOpen(false)}>
            Обо мне
          </NavLink>

          {!loading && isAuthed && (
            <NavLink to="/admin" className={styles.linkAdmin} onClick={() => setOpen(false)}>
              Кабинет
            </NavLink>
          )}

          <a
            className={styles.cta}
            href="#booking"
            onClick={() => setOpen(false)}
          >
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

        {open && (
          <div
            className={styles.backdrop}
            onClick={() => setOpen(false)}
          />
        )}
      </div>
    </header>
  )
}
