import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function copyRootStaticAssets() {
  return {
    name: 'copy-root-static-assets',
    writeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      fs.mkdirSync(distDir, { recursive: true });
      for (const file of ['analog_data.js', 'i18n.js', 'app.js', 'styles.css']) {
        const src = path.resolve(__dirname, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(distDir, file));
        }
      }
      const vendorSrc = path.resolve(__dirname, 'vendor');
      if (fs.existsSync(vendorSrc)) {
        fs.cpSync(vendorSrc, path.join(distDir, 'vendor'), { recursive: true });
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyRootStaticAssets()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          map: path.resolve(__dirname, 'map.html'),
          finder: path.resolve(__dirname, 'finder.html'),
          methods: path.resolve(__dirname, 'methods.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
