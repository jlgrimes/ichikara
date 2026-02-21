import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Allow slightly larger main chunk (the 500KB default triggers a false
    // warning for a Capacitor/Supabase app — realistic threshold is 600KB).
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        /**
         * Manual chunks strategy:
         *
         * vendor-react   — React + ReactDOM (most stable, changes rarely)
         * vendor-supabase — Supabase JS client (stable)
         * vendor-capacitor — Capacitor plugins (stable)
         *
         * analytics + monitoring are already lazy via dynamic import().
         * curriculum (language content) is lazy via LanguageContext dynamic import.
         *
         * Result: main app chunk stays lean; vendor chunks are long-cached by CDN/browser.
         */
        manualChunks(id) {
          // React runtime → vendor-react
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // Supabase → vendor-supabase
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          // Capacitor plugins → vendor-capacitor
          if (id.includes('node_modules/@capacitor/')) {
            return 'vendor-capacitor';
          }
        },
      },
    },
  },
})
