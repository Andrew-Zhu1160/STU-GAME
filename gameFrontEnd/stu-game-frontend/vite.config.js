import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (development, production, etc.)
  // The '' as the 3rd argument tells Vite to load ALL variables, 
  // even those without the VITE_ prefix if you want.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      // Use the port from .env, or fallback to 5173
      // Note: env variables are always strings, so we use parseInt
      port: parseInt(env.VITE_PORT) || 5173,
      strictPort: true, 
    },
  };
});