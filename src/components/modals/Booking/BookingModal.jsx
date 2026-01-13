import { useEffect, useMemo, useState } from 'react'
import styles from './BookingModal.module.css'
import { sendBooking } from '../../../api/booking'

const initial = {
  name: '',
  contact: '',
  childAge: '',
  format: 'online',
  city: '',
  time: '',
  message: '',
}

export default function BookingModal({ open, onClose, serviceId, serviceTitle }) {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle')

  const fields = useMemo(() => {
    if (serviceId === 'free') return ['name', 'contact', 'time', 'message']
    if (serviceId === 'group') return ['name', 'contact', 'childAge', 'format', 'city', 'time', 'message']
    return ['name', 'contact', 'childAge', 'format', 'time', 'message']
  }, [serviceId])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    setStatus('idle')
    setForm(initial)
  }, [open, serviceId])

  if (!open) return null

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')

    try {
      await sendBooking({
        serviceId,
        serviceTitle: serviceTitle || serviceId,
        ...form,
        sourceUrl: window.location.href,
      })

      setStatus('sent')
      setForm(initial)
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className={styles.backdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <header className={styles.head}>
          <div>
            <div className={styles.kicker}>Заявка</div>
            <div className={styles.title}>{serviceTitle}</div>
          </div>

          <button className={styles.close} onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </header>

        <form className={styles.form} onSubmit={submit}>
          {fields.includes('name') && (
            <label className={styles.field}>
              <span>Имя</span>
              <input value={form.name} onChange={set('name')} required placeholder="Как к вам обращаться?" />
            </label>
          )}

          {fields.includes('contact') && (
            <label className={styles.field}>
              <span>Телефон или Telegram</span>
              <input value={form.contact} onChange={set('contact')} required placeholder="+358… или @username" />
            </label>
          )}

          {fields.includes('childAge') && (
            <label className={styles.field}>
              <span>Возраст ребёнка</span>
              <input value={form.childAge} onChange={set('childAge')} placeholder="например, 8" />
            </label>
          )}

          {fields.includes('format') && (
            <label className={styles.field}>
              <span>Формат</span>
              <select value={form.format} onChange={set('format')}>
                <option value="online">Онлайн</option>
                <option value="offline">Офлайн</option>
              </select>
            </label>
          )}

          {fields.includes('city') && (
            <label className={styles.field}>
              <span>Город (если офлайн)</span>
              <input value={form.city} onChange={set('city')} placeholder="например, Helsinki" />
            </label>
          )}

          {fields.includes('time') && (
            <label className={styles.field}>
              <span>Когда удобно</span>
              <input value={form.time} onChange={set('time')} placeholder="дни/время" />
            </label>
          )}

          {fields.includes('message') && (
            <label className={styles.field}>
              <span>Коротко о запросе</span>
              <textarea
                value={form.message}
                onChange={set('message')}
                rows={4}
                placeholder="1–3 предложения достаточно"
              />
            </label>
          )}

          <button className={styles.submit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Отправляю…' : 'Отправить заявку'}
          </button>

          {status === 'sent' && <div className={styles.ok}>Отправлено ✅ Я скоро свяжусь с вами.</div>}
          {status === 'error' && <div className={styles.err}>Ошибка отправки. Попробуйте ещё раз.</div>}
        </form>
      </div>
    </div>
  )
}
