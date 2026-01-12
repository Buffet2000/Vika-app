import { useState } from 'react'
import styles from './Booking.module.css'

const IMG = '/images/booking.png'

export default function Booking() {
  const [form, setForm] = useState({
    parentName: '',
    childAge: '',
    contact: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    // пока просто в консоль
    console.log('BOOKING_FORM_SUBMIT', {
      ...form,
      createdAt: new Date().toISOString(),
    })

    setSent(true)
    // при желании можно очистить:
    // setForm({ parentName:'', childAge:'', contact:'', message:'' })
  }

  return (
    <section className={styles.section} id="booking">
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <h2 className={styles.title}>Онлайн-запись</h2>
          <p className={styles.subtitle}>
            Оставьте заявку — я свяжусь с вами, чтобы уточнить время и формат консультации.
          </p>

          {!sent ? (
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.label}>
                Ваше имя
                <input
                  className={styles.input}
                  name="parentName"
                  value={form.parentName}
                  onChange={onChange}
                  placeholder="Например, Юрий"
                  required
                />
              </label>

              <label className={styles.label}>
                Возраст ребёнка
                <input
                  className={styles.input}
                  name="childAge"
                  value={form.childAge}
                  onChange={onChange}
                  placeholder="Например, 6"
                  required
                />
              </label>

              <label className={styles.label}>
                Телефон / Telegram / WhatsApp
                <input
                  className={styles.input}
                  name="contact"
                  value={form.contact}
                  onChange={onChange}
                  placeholder="+358… или @username"
                  required
                />
              </label>

              <label className={styles.label}>
                Коротко о запросе
                <textarea
                  className={styles.textarea}
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Что беспокоит? Когда началось? Есть ли уже попытки решить?"
                />
              </label>

              <div className={styles.actions}>
                <button className={styles.submit} type="submit">
                  Отправить заявку
                </button>

                <button
                  className={styles.secondary}
                  type="button"
                  onClick={() => setForm({ parentName:'', childAge:'', contact:'', message:'' })}
                >
                  Очистить
                </button>
              </div>

              <p className={styles.note}>
                Нажимая “Отправить”, вы соглашаетесь на обработку данных для связи по вашему запросу.
              </p>
            </form>
          ) : (
            <div className={styles.success}>
              <div className={styles.successTitle}>Спасибо! Заявка отправлена ✅</div>
              <p className={styles.successText}>
                Я свяжусь с вами в ближайшее время. Если срочно — напишите в мессенджер.
              </p>

              <button className={styles.secondary} onClick={() => setSent(false)}>
                Отправить ещё одну заявку
              </button>
            </div>
          )}
        </div>

        <div className={styles.right} aria-hidden="true">
          <img className={styles.image} src={IMG} alt="" />
        </div>
      </div>
    </section>
  )
}