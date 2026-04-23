import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useGlobal() {
  return useQuery({ queryKey: ['global'], queryFn: api.global })
}
