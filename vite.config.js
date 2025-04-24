import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const host = "localhost";

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@js': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    server: {
        host: host,
        port: 8787,
        hmr: {
            host: host,
            clientPort: 8787,
        },
        watch: {
            followSymlinks: false,
            ignored: [
                '/app/public/',
                '/app/storage/',
                '/app/tests/',
                '/app/vendor/',
                '/app/reports/**'
            ]
        }
    }
});
