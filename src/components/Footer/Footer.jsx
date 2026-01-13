import styles from './Footer.module.css'
import footerImg from '../../assets/images/blocks/footer-img2.png'

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
          <a href="/">Главная</a>
          <a href="/">Статьи</a>
          <a href="/consultations">Консультации</a>
          <a href="/about">Обо мне</a>
        </nav>

        <div className={styles.media} aria-hidden="true">
          <img src={footerImg} alt="" />
        </div>

      </div>
    </footer>
  )
}
