import { useEffect, useState } from 'react';
import { ApiError } from '../../shared/api/httpClient';
import { useValorDetalle, useValores } from './useValores';

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

export function ValoresPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const q = useDebounced(search, 300);

  const lista = useValores(q);
  const detalle = useValorDetalle(selectedId);

  return (
    <main className="container">
      <header>
        <h1>Test de Valores de Allport</h1>
        <p className="muted">Valores del instrumento consultados desde la API Spring Boot.</p>
      </header>

      <div className="toolbar">
        <label htmlFor="buscar">Buscar valor</label>
        <input
          id="buscar"
          type="search"
          placeholder="Nombre o código…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="layout">
        <section aria-live="polite">
          {lista.isPending && <p className="state">Cargando valores…</p>}

          {lista.isError && (
            <div className="state error" role="alert">
              <p>{errorMessage(lista.error)}</p>
              <button onClick={() => lista.refetch()}>Reintentar</button>
            </div>
          )}

          {lista.isSuccess && lista.data.length === 0 && (
            <p className="state">No se encontraron valores{q ? ` para “${q}”` : ''}.</p>
          )}

          {lista.isSuccess && lista.data.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {lista.data.map((v) => (
                  <tr
                    key={v.id}
                    className={v.id === selectedId ? 'selected' : ''}
                    onClick={() => setSelectedId(v.id)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedId(v.id)}
                  >
                    <td>{v.codigo}</td>
                    <td>{v.nombre}</td>
                    <td>{v.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <aside className="detail" aria-live="polite">
          <h2>Detalle</h2>
          {selectedId === null && <p className="muted">Seleccione un valor de la tabla.</p>}
          {detalle.isFetching && selectedId !== null && <p className="state">Cargando detalle…</p>}
          {detalle.isError && <p className="error">{errorMessage(detalle.error)}</p>}
          {detalle.isSuccess && !detalle.isFetching && (
            <dl>
              <dt>Código</dt>
              <dd>{detalle.data.codigo}</dd>
              <dt>Nombre</dt>
              <dd>{detalle.data.nombre}</dd>
              <dt>Descripción</dt>
              <dd>{detalle.data.descripcion}</dd>
            </dl>
          )}
        </aside>
      </div>
    </main>
  );
}
