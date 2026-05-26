import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Configuración básica para que Vite procese componentes .vue
export default defineConfig({
  plugins: [vue()]
});