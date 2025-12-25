import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 1. Add this new import
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),

    // 2. Add the Auto-Import plugin here
    Components({
      dirs: ['src/components'], // Look in this folder
      extensions: ['vue'], // Look for .vue files
      deep: true, // Look inside subfolders
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/_variables.scss" as *;`,
      },
    },
  },
  base: '/Cultivation_Game/',
})
