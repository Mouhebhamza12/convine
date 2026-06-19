import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    // Build the SPA straight into the Laravel app's public/ directory so the
    // backend serves the document and hashed assets from a single origin (the
    // cookie/CSRF auth depends on same-origin). `emptyOutDir: false` keeps
    // Laravel's own public files (index.php, .htaccess, storage symlink…).
    build: {
        outDir: '../backend/public',
        emptyOutDir: false,
        assetsDir: 'assets',
    },
    server: {
        host: 'localhost',
        port: Number(process.env.PORT) || 3000,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
            },
        },
    },
});
