import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 项目页需要相对路径，避免资源 404
export default defineConfig({
  plugins: [react()],
  base: './',
});
