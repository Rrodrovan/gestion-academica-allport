// Acceso a datos del recurso "valores". Los componentes NO llaman a fetch:
// usan estas funciones, que a su vez usan el cliente HTTP compartido.
import { httpClient } from '../../shared/api/httpClient';
import { MOCK_VALORES } from '../../shared/api/mockData';
import type { PageResponse, Valor } from './types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const RESOURCE = '/valores'; // ruta GET supuesta: verificar con la API real

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// La API puede responder un arreglo simple o un Page<T> de Spring: se normaliza.
function toList(data: Valor[] | PageResponse<Valor>): Valor[] {
  return Array.isArray(data) ? data : data.content;
}

export async function listarValores(q: string, signal?: AbortSignal): Promise<Valor[]> {
  if (USE_MOCK) {
    await delay(500);
    const term = q.trim().toLowerCase();
    return MOCK_VALORES.filter((v) => !term || v.nombre.toLowerCase().includes(term) || v.codigo.toLowerCase().includes(term));
  }
  const data = await httpClient.get<Valor[] | PageResponse<Valor>>(RESOURCE, { params: { q }, signal });
  return toList(data);
}

export async function obtenerValor(id: number, signal?: AbortSignal): Promise<Valor> {
  if (USE_MOCK) {
    await delay(300);
    const found = MOCK_VALORES.find((v) => v.id === id);
    if (!found) throw new Error('Valor no encontrado');
    return found;
  }
  return httpClient.get<Valor>(`${RESOURCE}/${id}`, { signal });
}
