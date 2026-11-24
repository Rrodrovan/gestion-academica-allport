import { useQuery } from '@tanstack/react-query';
import { listarValores, obtenerValor } from './valoresApi';

export function useValores(q: string) {
  return useQuery({
    queryKey: ['valores', q],
    queryFn: ({ signal }) => listarValores(q, signal),
  });
}

export function useValorDetalle(id: number | null) {
  return useQuery({
    queryKey: ['valores', 'detalle', id],
    queryFn: ({ signal }) => obtenerValor(id as number, signal),
    enabled: id !== null,
  });
}
