// Datos simulados SOLO para desarrollo sin backend (VITE_USE_MOCK=true).
// Los seis valores corresponden a las dimensiones públicas del Estudio de Valores
// de Allport, Vernon y Lindzey. No contienen ítems ni baremos del instrumento.
import type { Valor } from '../../features/valores/types';

export const MOCK_VALORES: Valor[] = [
  { id: 1, codigo: 'TEO', nombre: 'Teórico', descripcion: 'Interés por descubrir la verdad y ordenar el conocimiento.' },
  { id: 2, codigo: 'ECO', nombre: 'Económico', descripcion: 'Interés por lo útil y práctico, y por la eficiencia en los recursos.' },
  { id: 3, codigo: 'EST', nombre: 'Estético', descripcion: 'Interés por la forma, la armonía y la belleza de las experiencias.' },
  { id: 4, codigo: 'SOC', nombre: 'Social', descripcion: 'Interés por las personas y su bienestar.' },
  { id: 5, codigo: 'POL', nombre: 'Político', descripcion: 'Interés por el poder, la influencia y el liderazgo.' },
  { id: 6, codigo: 'REL', nombre: 'Religioso', descripcion: 'Interés por la unidad, el sentido y la trascendencia.' },
];
