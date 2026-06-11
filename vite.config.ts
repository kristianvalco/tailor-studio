import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// @tauri-apps/cli sets TAURI_DEV_HOST when running on a device/emulator
const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Vite options tailored for Tauri development
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  // Monaco ships large worker bundles; keep the build quiet about chunk size.
  build: {
    target: 'es2021',
    chunkSizeWarningLimit: 4000,
  },
})
