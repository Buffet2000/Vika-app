import { supabase } from '../lib/supabaseClient.js'

const TABLE = 'about_page'
const SINGLE_ID = 1

function mapRowToForm(row) {
  if (!row) return null
  return {
    name: row.name ?? '',
    intro1: row.intro_1 ?? '',
    intro2: row.intro_2 ?? '',
    stats: Array.isArray(row.stats) ? row.stats : [],
    badges: Array.isArray(row.badges) ? row.badges : [],
    formats: Array.isArray(row.formats) ? row.formats : [],
    avatar_url: row.avatar_url ?? '',
  }
}

function mapFormToRow(patch) {
  const out = {}

  if ('name' in patch) out.name = patch.name
  if ('intro1' in patch) out.intro_1 = patch.intro1
  if ('intro2' in patch) out.intro_2 = patch.intro2
  if ('stats' in patch) out.stats = patch.stats
  if ('badges' in patch) out.badges = patch.badges
  if ('formats' in patch) out.formats = patch.formats
  if ('avatar_url' in patch) out.avatar_url = patch.avatar_url

  return out
}

export async function fetchAbout() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', SINGLE_ID)
    .single()

  if (error) throw error
  return mapRowToForm(data)
}

export async function updateAbout(patch) {
  const dbPatch = mapFormToRow(patch)

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbPatch)
    .eq('id', SINGLE_ID)
    .select('*')
    .single()

  if (error) throw error
  return mapRowToForm(data)
}
