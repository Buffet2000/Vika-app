import { supabase } from '../lib/supabaseClient'

export async function sendBooking(data) {
  const { error: dbError } = await supabase.from('bookings').insert([
    {
      service_id: data.serviceId,
      service_title: data.serviceTitle,
      name: data.name,
      contact: data.contact,
      child_age: data.childAge || null,
      format: data.format || null,
      city: data.city || null,
      time: data.time || null,
      message: data.message || null,
      source_url: data.sourceUrl || null,
    },
  ])

  if (dbError) throw dbError

  const { error: fnError } = await supabase.functions.invoke('notify-telegram', {
    body: data,
  })

  if (fnError) {
    console.warn('Telegram notify failed (booking saved):', fnError)
  }
}
