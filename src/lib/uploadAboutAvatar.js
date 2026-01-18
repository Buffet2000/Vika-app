import { supabase } from './supabaseClient.js'

const BUCKET = 'covers'
const PATH = 'about/avatar.jpg'

export async function uploadAboutAvatar(file) {
  if (!file) return null

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(PATH, file, {
      upsert: true, 
      cacheControl: '3600',
      contentType: file.type || 'image/jpeg',
    })

  if (error) throw error

  const { data } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(PATH)

  return data.publicUrl
}
