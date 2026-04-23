import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useTechnologies() {
  return useQuery({ queryKey: ['tech-categories'], queryFn: api.categories })
}
