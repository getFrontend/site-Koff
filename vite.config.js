import { defineConfig } from "vite";

export default defineConfig({
    root: './src',
    base: './',
    build: {
        outDir: './../dist',
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