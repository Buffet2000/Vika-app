import styles from './Footer.module.css'
import footerImg from '../../assets/images/blocks/footer-img2.png'

import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        
        <div className={styles.left}>
          <blockquote className={styles.quote}>
            «Когда чувства находят слова — становится легче жить.»
          </blockquote>
          <div className={styles.copy}>© 2026</div>
        </div>

        <nav className={styles.menu}>
          <Link to="/" className={styles.link}>Главная</Link>
          <Link to="/" className={styles.link}>Статьи</Link>
          <Link to="/consultations" className={styles.link}>Консультации</Link>
          <Link to="/about" className={styles.link}>Обо мне</Link>
        </nav>

        <div className={styles.media} aria-hidden="true">
          <img src={footerImg} alt="" />
        </div>

      </div>
    </footer>
  )
}
