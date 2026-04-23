import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useFooter() {
  return useQuery({ queryKey: ['footer'], queryFn: api.footer })
}
