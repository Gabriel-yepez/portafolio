import { ViteReactSSG } from 'vite-react-ssg/single-page'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { api } from './services/api'
import './styles/globals.css'

export const createRoot = ViteReactSSG(
  <App />,
  async ({ isClient }) => {
    if (isClient) return

    await Promise.allSettled([
      queryClient.prefetchQuery({ queryKey: ['hero'],            queryFn: api.hero }),
      queryClient.prefetchQuery({ queryKey: ['about'],           queryFn: api.about }),
      queryClient.prefetchQuery({ queryKey: ['projects'],        queryFn: api.projects }),
      queryClient.prefetchQuery({ queryKey: ['certifications'],  queryFn: api.certifications }),
      queryClient.prefetchQuery({ queryKey: ['tech-categories'], queryFn: api.categories }),
      queryClient.prefetchQuery({ queryKey: ['global'],          queryFn: api.global }),
    ])
  },
)
