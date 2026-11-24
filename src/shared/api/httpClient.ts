// Cliente HTTP compartido. Es el único lugar que conoce fetch, la URL base,
// el token Bearer y la conversión de errores HTTP en ApiError.

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
const TOKEN_KEY = 'allport_token';

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
  get isForbidden(): boolean {
    return this.status === 403;
  }
  get isNetwork(): boolean {
    return this.status === 0;
  }
}

export const tokenStore = {
  get: (): string | null => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string): void => sessionStorage.setItem(TOKEN_KEY, token),
  clear: (): void => sessionStorage.removeItem(TOKEN_KEY),
};

type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  params?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, String(value));
  });
  const qs = query.toString();
  return `${BASE_URL}${path}${qs ? `?${qs}` : ''}`;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(method: string, path: string, options: RequestOptions & { body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.params), {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('No se pudo conectar con el servidor.', 0);
  }

  const body = await parseBody(response);
  if (!response.ok) {
    throw new ApiError(messageFor(response.status, body), response.status, body);
  }
  return body as T;
}

function messageFor(status: number, body: unknown): string {
  if (status === 401) return 'Sesión no válida o expirada (401). Inicie sesión de nuevo.';
  if (status === 403) return 'No tiene permisos para ver este recurso (403).';
  if (status === 404) return 'El recurso solicitado no existe (404).';
  if (status >= 500) return `Error del servidor (${status}). Intente más tarde.`;
  if (body && typeof body === 'object' && 'message' in body && typeof (body as { message: unknown }).message === 'string') {
    return (body as { message: string }).message;
  }
  return `La solicitud falló (${status}).`;
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
};
