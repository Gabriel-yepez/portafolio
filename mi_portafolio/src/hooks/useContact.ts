import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useContact() {
  return useQuery({ queryKey: ['contact'], queryFn: api.contact })
}
