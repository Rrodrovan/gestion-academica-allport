import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// El proxy envía /api al backend Spring Boot. Si la API no usa el puerto 9090,
// defina VITE_API_PROXY_TARGET en .env.local (p. ej. http://localhost:8080).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const target = env.VITE_API_PROXY_TARGET || 'http://localhost:9090';
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: { '/api': { target, changeOrigin: true } },
    },
  };
});
