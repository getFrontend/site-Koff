import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import Legacy from "@vitejs/plugin-legacy";

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
    plugins: [
        Legacy({
            targets: ["defaults", "not IE 11"],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {},
        },
        postcss: [autoprefixer({})],
    }
});	