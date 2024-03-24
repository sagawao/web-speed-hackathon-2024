// import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import polyfillNode from 'rollup-plugin-polyfill-node';
import { pnpmWorkspaceRoot as findWorkspaceDir } from '@node-kit/pnpm-workspace-root';
import findPackageDir from 'pkg-dir';
import inject from '@rollup/plugin-inject';
// import { build } from 'tsup'
import { nodeResolve } from '@rollup/plugin-node-resolve';

async function getConfig() {
    const PACKAGE_DIR = findPackageDir.sync(process.cwd());
    if (!PACKAGE_DIR) {
        throw new Error('Package directory not found');
    }
    // const WORKSPACE_DIR = await findWorkspaceDir(process.cwd());
    // const OUTPUT_DIR = path.resolve(PACKAGE_DIR!, './dist');
    // const SEED_IMAGE_DIR = path.resolve(WORKSPACE_DIR!, './workspaces/server/seeds/images');
    // const IMAGE_PATH_LIST = fs.readdirSync(SEED_IMAGE_DIR).map((file) => `/images/${file}`);

    // console.log(IMAGE_PATH_LIST.join(','))

    return defineConfig({
        build: {
            modulePreload: true,
            outDir: 'dist',
            assetsInlineLimit: 0,
            rollupOptions: {
                input: {
                    client: path.resolve(PACKAGE_DIR!, './src/index.tsx'),
                },
                output: [
                    {
                        format: 'es',
                        dir: 'dist',
                        entryFileNames: '[name].global.js',
                        chunkFileNames: 'chunks/[name]-[hash].js',
                    },
                ],
                plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
                external: [
                    path.resolve(PACKAGE_DIR!, './src/serviceworker/index.ts')
                ],
            },
            minify: 'esbuild',
            sourcemap: true,
            target: 'esnext',
        },
        define: {
            NODE_ENV: process.env['NODE_ENV'] || 'development',
            global: {},
        },
        plugins: [
            nodeResolve(),
            tsconfigPaths(),
            polyfillNode(),
            wasm(),
            topLevelAwait(),
            reactRefresh(),
        ],
        server: {
            fs: {
                allow: [PACKAGE_DIR],
            },
        },
    })
}

export default getConfig();