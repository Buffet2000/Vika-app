import { useMemo, useState } from 'react'
import styles from './Consultations.module.css'

import BookingModal from '../modals/Booking/BookingModal'

import freeImg from '../../assets/images/cards/free.png'
import groupImg from '../../assets/images/cards/group.png'
import individualImg from '../../assets/images/cards/individual.png'

const cards = [
  {
    id: 'free',
    title: 'Первичная консультация',
    badge: 'Бесплатно',
    image: freeImg,
    text: '15–20 минут. Коротко познакомимся, уточним запрос и подберём формат.',
    points: ['Подходит, если вы сомневаетесь', 'Поймём, с чего лучше начать', 'Без обязательств'],
    button: 'Записаться бесплатно',
  },
  {
    id: 'group',
    title: 'Групповые занятия',
    badge: '«Школа чувств»',
    image: groupImg,
    text: 'Онлайн и офлайн-группы для детей. Подбираем по возрасту и запросу.',
    points: ['Эмоции и саморегуляция', 'Коммуникация и уверенность', 'Поддерживающая атмосфера'],
    button: 'Записаться в группу',
  },
  {
    id: 'individual',
    title: 'Индивидуальные занятия',
    badge: 'Дети/подростки',
    image: individualImg,
    text: 'Если ситуация требует особого внимания и бережной индивидуальной работы.',
    points: ['Персональный план', 'Мягкие техники', 'Обратная связь родителям'],
    button: 'Записаться индивидуально',
  },
]

export default function Consultations() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('free')

  const active = useMemo(() => cards.find((c) => c.id === activeId), [activeId])

  return (
    <section className={styles.section} id="consultations">
      <div className={styles.wrap}>
        <h2 className={styles.title}>Консультации</h2>
        <p className={styles.lead}>Выберите формат — откроется короткая форма заявки.</p>

        <div className={styles.grid}>
          {cards.map((c) => (
            <article key={c.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img src={c.image} alt="" />
              </div>

              <div className={styles.content}>
                <div className={styles.head}>
                  <h3>{c.title}</h3>
                  <span className={styles.badge}>{c.badge}</span>
                </div>

                <p className={styles.text}>{c.text}</p>

                <ul className={styles.list}>
                  {c.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>

                <button
                  className={styles.button}
                  onClick={() => {
                    setActiveId(c.id)
                    setOpen(true)
                  }}
                >
                  {c.button}
                </button>
              </div>
            </article>
          ))}
        </div>

        <BookingModal
          open={open}
          onClose={() => setOpen(false)}
          serviceId={activeId}
          serviceTitle={active?.title}
        />
      </div>
    </section>
  )
}
