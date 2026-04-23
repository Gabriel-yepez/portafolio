import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useHero() {
  return useQuery({ queryKey: ['hero'], queryFn: api.hero })
}
