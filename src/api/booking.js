export async function sendBooking(data) {
  const res = await fetch(import.meta.env.VITE_API_URL + '/api/telegram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Ошибка отправки')
  }

  return res.json()
}
