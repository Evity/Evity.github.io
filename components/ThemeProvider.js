import { createContext, useContext, useSyncExternalStore } from 'react'

const ThemeContext = createContext(null)
const getSnapshot = () => document.documentElement.classList.contains('dark')
const getServerSnapshot = () => false

function savedTheme() {
  try {
    return localStorage.getItem('evity-theme')
  } catch (_) {
    return null
  }
}

function subscribeTheme(notify) {
  const root = document.documentElement
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const observer = new MutationObserver(notify)
  observer.observe(root, { attributes: true, attributeFilter: ['class'] })

  const applyPreference = preference => {
    root.classList.toggle(
      'dark',
      preference === 'dark' || (preference !== 'light' && media.matches)
    )
  }
  const systemChanged = () => {
    const preference = savedTheme()
    if (preference !== 'dark' && preference !== 'light') applyPreference(null)
  }
  const storageChanged = event => {
    if (event.key === 'evity-theme' || event.key === null)
      applyPreference(event.newValue)
  }
  media.addEventListener('change', systemChanged)
  window.addEventListener('storage', storageChanged)
  return () => {
    observer.disconnect()
    media.removeEventListener('change', systemChanged)
    window.removeEventListener('storage', storageChanged)
  }
}

export function ThemeProvider({ children }) {
  const dark = useSyncExternalStore(
    subscribeTheme,
    getSnapshot,
    getServerSnapshot
  )
  function toggleTheme() {
    const next = !getSnapshot()
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('evity-theme', next ? 'dark' : 'light')
    } catch (_) {}
  }
  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
