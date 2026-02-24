import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import createVitePlugins from './vite/plugins';

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, process.cwd());
    const { VITE_BASE_URL, VITE_API_API_PREFIX, VITE_APP_BASE_API } = env;
    return {
        base: VITE_BASE_URL,
        plugins: createVitePlugins(env, command === 'build'),
        resolve: {
            alias: {
                // 设置路径
                '~': path.resolve(__dirname, './'),
                // 设置别名
                '@': path.resolve(__dirname, './src'),
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        },
        // 打包配置
        build: {
            sourcemap: command === 'build' ? false : 'inline',
            outDir: 'dist',
            assetsDir: 'assets',
            chunkSizeWarningLimit: 30000,
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                },
            },
        },
        // vite 相关配置
        server: {
            port: 30000,
            host: true,
            open: true,
            proxy: {
                [VITE_API_API_PREFIX]: {
                    target: VITE_APP_BASE_API,
                    changeOrigin: true,
                    rewrite: (p) => p.replace(new RegExp(`^${VITE_API_API_PREFIX}`), ''),
                },
            },
        },
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule: any) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove();
                                }
                            },
                        },
                    },
                ],
            },
        },
    };
});
