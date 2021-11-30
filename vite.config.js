import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server:{
        host:true
    }
    // server: {
    //     cors: true,
    //     proxy: {
    //         '^/api': {
    //             // target: 'http://192.168.180.20/api',
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/api/, '')
    //         },
    //     }
    // }
    // envDir: "./src/env"
    // server: {
    //     proxy: {
    //         '/api': {
    //             changeOrigin: true,
    //             target: 'https://api.leaked.wiki',
    //             rewrite: (path) => path.replace(/^\/api/, '')
    //         }
    //     }
    // }
})