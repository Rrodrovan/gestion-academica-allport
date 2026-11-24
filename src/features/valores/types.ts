// Tipos que representan el contrato JSON del recurso "valores" del Test de Allport.
// IMPORTANTE: contrastar con la API real (Postman / OpenAPI) y ajustar si difiere.

export interface Valor {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

// Forma estándar de Spring Data cuando el endpoint devuelve Page<T> (Sesión 8).
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
