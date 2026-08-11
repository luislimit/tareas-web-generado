import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useUsuarios } from '../features/usuarios/hooks/useUsuarios'
import type { Usuario } from '../features/usuarios/types/usuario'

const STORAGE_KEY = 'tareas.currentUserId'

interface CurrentUserContextValue {
  usuarios: Usuario[]
  currentUserId: string
  currentUser?: Usuario
  loading: boolean
  setCurrentUserId: (id: string) => void
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const usuariosQuery = useUsuarios()
  const usuarios = useMemo(() => {
    const all = Array.isArray(usuariosQuery.data) ? usuariosQuery.data : []
    const active = all.filter((u) => u.activo)
    return active.length ? active : all
  }, [usuariosQuery.data])

  const [currentUserId, setCurrentUserIdState] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '')

  useEffect(() => {
    if (!usuarios.length) return
    const storedIsValid = usuarios.some((u) => String(u.id) === currentUserId)
    if (storedIsValid) return
    if (usuarios.length === 1) {
      const onlyId = String(usuarios[0].id)
      setCurrentUserIdState(onlyId)
      localStorage.setItem(STORAGE_KEY, onlyId)
    } else if (currentUserId) {
      setCurrentUserIdState('')
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [usuarios, currentUserId])

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id)
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  }

  const currentUser = usuarios.find((u) => String(u.id) === currentUserId)
  const value = useMemo(() => ({ usuarios, currentUserId, currentUser, loading: usuariosQuery.isLoading, setCurrentUserId }), [usuarios, currentUserId, currentUser, usuariosQuery.isLoading])

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) throw new Error('useCurrentUser debe utilizarse dentro de CurrentUserProvider')
  return context
}
