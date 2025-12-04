import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Ensure process.env.API_KEY is always replaced with a string (even if empty)
      // This prevents runtime errors where the variable might be undefined
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})