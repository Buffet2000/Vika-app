import { NavLink, Outlet } from 'react-router-dom'
import styles from './AdminLayout.module.css'
import { supabase } from '../../lib/supabaseClient.js'

export default function AdminLayout() {
  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.shell}>
          <aside className={styles.side}>
            <div className={styles.brand}>
              <div className={styles.brandTitle}>Кабинет</div>
              <div className={styles.brandSub}>Администрирование сайта</div>
            </div>

            <nav className={styles.nav}>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                Обзор
              </NavLink>

              <NavLink
                to="/admin/articles"
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                Статьи
              </NavLink>

              <NavLink to="/admin/about" className={({isActive}) => `${styles.link} ${isActive ? styles.active : ''}`}>Обо мне</NavLink>

              <button className={`${styles.link} ${styles.disabled}`} type="button" disabled>
                Настройки — скоро
              </button>
            </nav>

            <div className={styles.bottom}>
              <button className={styles.logout} type="button" onClick={logout}>
                Выйти
              </button>
            </div>
          </aside>

          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
    </section>
  )
}
