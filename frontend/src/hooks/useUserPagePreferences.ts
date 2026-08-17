import { useCallback, useEffect, useState } from 'react'

function storageKey(userId: string | number | undefined, pageKey: string) {
  return `tareas.user.${userId || 'anon'}.${pageKey}`
}

export function useUserPagePreferences<T>(userId: string | number | undefined, pageKey: string, defaults: T) {
  const key = storageKey(userId, pageKey)
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
    } catch {
      return defaults
    }
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      setValue(raw ? { ...defaults, ...JSON.parse(raw) } : defaults)
    } catch {
      setValue(defaults)
    }
  }, [key])

  const update = useCallback((next: T | ((current: T) => T)) => {
    setValue(current => {
      const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next
      localStorage.setItem(key, JSON.stringify(resolved))
      return resolved
    })
  }, [key])

  return [value, update] as const
}

export function useUserStoredState<T>(userId: string | number | undefined, pageKey: string, name: string, defaultValue: T) {
  const [prefs, setPrefs] = useUserPagePreferences<Record<string, unknown>>(userId, `${pageKey}.filters`, {})
  const value = (prefs[name] as T | undefined) ?? defaultValue
  const setValue = useCallback((next: T | ((current: T) => T)) => {
    setPrefs(current => {
      const currentValue = (current[name] as T | undefined) ?? defaultValue
      const resolved = typeof next === 'function' ? (next as (current: T) => T)(currentValue) : next
      return { ...current, [name]: resolved }
    })
  }, [name, defaultValue, setPrefs])
  return [value, setValue] as const
}
