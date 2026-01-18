import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSession, onAuthStateChange } from '../../api/auth.js'

export default function AuthGate({ children }) {
  const nav = useNavigate()
  const loc = useLocation()
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let sub

    ;(async () => {
      const s = await getSession()
      setSession(s)
      setReady(true)

      sub = onAuthStateChange((next) => {
        setSession(next)
      })
    })()

    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!session) {
      nav('/login', { replace: true, state: { from: loc.pathname } })
    }
  }, [ready, session, nav, loc.pathname])

  if (!ready) return null
  if (!session) return null

  return children
}
