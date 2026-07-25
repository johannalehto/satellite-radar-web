import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const reactNativeWebShim = new URL(
  './src/web/skia/reactNativeWebShim.ts',
  import.meta.url,
).pathname
const reactNativeAssetRegistryShim = new URL(
  './src/web/skia/reactNativeAssetRegistryShim.ts',
  import.meta.url,
).pathname

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'globalThis',
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@shopify/react-native-skia'],
    include: [
      'canvaskit-wasm/bin/full/canvaskit',
      'react-reconciler',
      'react-reconciler/constants',
    ],
  },
  resolve: {
    alias: [
      {
        find: 'react-native/Libraries/Image/AssetRegistry',
        replacement: reactNativeAssetRegistryShim,
      },
      {
        find: 'react-native',
        replacement: reactNativeWebShim,
      },
    ],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.mjs',
      '.js',
      '.mts',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
    ],
  },
})
