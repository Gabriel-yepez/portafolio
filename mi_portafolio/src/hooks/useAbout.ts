import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useAbout() {
  return useQuery({ queryKey: ['about'], queryFn: api.about })
}
