import '@mantine/core/styles.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider, createTheme } from '@mantine/core'
import NoSsr from '@/components/NoSsr'
import '@/util/i18n'

const theme = createTheme({
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  primaryColor: 'violet',
  primaryShade: 7,
  colors: {
    violet: [
      '#f5f3ff',
      '#ede9fe',
      '#ddd6fe',
      '#c4b5fd',
      '#a78bfa',
      '#8b5cf6',
      '#7c3aed',
      '#6d28d9',
      '#5b21b6',
      '#4c1d95',
    ],
  },
  components: {
    Paper: {
      defaultProps: {
        bg: 'var(--pd-surface)',
      },
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSsr>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Component {...pageProps} />
      </MantineProvider>
    </NoSsr>
  )
}
