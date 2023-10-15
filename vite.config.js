import { defineConfig } from "vite";

export default defineConfig({
    root: './src',
    base: './',
    build: {
        outDir: './../app',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: '/index.html'
            }
        }
    },
    publicDir: './../public',
    plugins: []
});