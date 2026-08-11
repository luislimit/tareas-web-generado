import { useQuery } from '@tanstack/react-query'
import { getPeticiones } from '../api/peticionApi'

export function usePeticiones() { return useQuery({ queryKey: ['peticiones'], queryFn: getPeticiones }) }
