export function useTheme() {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  // Initialize from localStorage or system preference
  onMounted(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const start = saved || (prefersDark ? 'dark' : 'light')
    setTheme(start)
  })

  const setTheme = (value: 'light' | 'dark') => {
    theme.value = value
    document.documentElement.setAttribute('theme', value)
    localStorage.setItem('theme', value)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
}
