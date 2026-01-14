import Article from '../../components/Article/Article.jsx'
import image from '../../assets/images/hero-wide.png'
import image2 from '../../assets/images/hero-wide2.png'

const articles = [
  {
    id: 'anxiety-1',
    coverUrl: image,
    coverAlt: 'Ребёнок и родители в уютной комнате',
    coverHeight: 460,
    coverPosition: 'center 20%',
    title: 'Как помочь ребёнку справиться с тревогой',
    subtitle: 'Несколько мягких шагов, которые можно начать делать уже сегодня.',
    paragraphs: [
      'Тревога у детей часто проявляется не словами, а поведением: капризами, отказом идти в школу, трудностями со сном или резкой чувствительностью к мелочам.',
      'Первый шаг — признать чувства ребёнка. Даже если причина тревоги кажется незначительной, для ребёнка она реальна.',
      'Дальше важно создать предсказуемость: режим дня, понятные переходы и спокойное сопровождение.',
    ],
  },
  {
    id: 'sleep-1',
    coverUrl: image2,
    coverAlt: 'Спокойная вечерняя сцена',
    coverHeight: 460,
    coverPosition: 'center 30%',
    title: 'Ночной страх и плохой сон',
    subtitle: 'Как поддержать ребёнка и не усилить тревожность.',
    paragraphs: [
      'Ночной страх — частая история, особенно в периоды перемен и перегрузки.',
      'Важно быть рядом и возвращать ощущение безопасности.',
      'Если страхи повторяются, полезно мягко разобраться, что именно пугает ребёнка.',
    ],
  },
]

export default function ArticlesPage() {
  return (
    <>
      {articles.map((a) => (
        <Article
          key={a.id}
          coverUrl={a.coverUrl}
          coverAlt={a.coverAlt}
          coverHeight={a.coverHeight}
          coverPosition={a.coverPosition}
          title={a.title}
          subtitle={a.subtitle}
          paragraphs={a.paragraphs}
        />
      ))}
    </>
  )
}
