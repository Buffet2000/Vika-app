import { supabase } from './supabaseClient'

export async function uploadCover(file) {
  if (!file) return null

  // 👉 уникальное имя файла
  const ext = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = `articles/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('covers')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    console.error(uploadError)
    throw new Error('Ошибка загрузки обложки')
  }

  const { data } = supabase.storage
    .from('covers')
    .getPublicUrl(filePath)

  return data.publicUrl
}
