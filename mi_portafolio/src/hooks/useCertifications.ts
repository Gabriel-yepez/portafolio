import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useCertifications() {
  return useQuery({ queryKey: ['certifications'], queryFn: api.certifications })
}
