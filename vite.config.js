import { defineConfig } from "vite";

export default defineConfig({
    root: './src',
    base: 'https://getfrontend.github.io/site-Koff/app/',
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