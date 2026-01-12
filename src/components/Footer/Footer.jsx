import styles from './Footer.module.css'
import footerArt from '../../assets/images/blocks/footer-img.png'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <div className={styles.brand}>Детский и семейный психолог</div>
          <p className={styles.quote}>
            «Когда чувства находят слова — становится легче жить.»
          </p>
        </div>

        <nav className={styles.nav} aria-label="Меню в подвале">
          <a href="/" className={styles.link}>Главная</a>
          <a href="/services" className={styles.link}>Услуги</a>
          <a href="/contacts" className={styles.link}>Контакты</a>
        </nav>

        {/* вместо кнопки — картинка */}
        <div className={styles.right} aria-hidden="true">
          <img className={styles.art} src={footerArt} alt="" />
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Психолог</span>
      </div>
    </footer>
  )
}
