
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: mode === 'production' ? '/' : '/',
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          // Increase the maximum file size limit for caching
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.sorriso-inteligente\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                networkTimeoutSeconds: 10
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                }
              }
            }
          ]
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Senhor Sorriso - App Oficial',
          short_name: 'Senhor Sorriso',
          description: 'Aplicativo oficial da rede Senhor Sorriso - Agendamento online, chat IA e avaliação gratuita',
          theme_color: '#0ea5e9',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Make env variables available to the app
      __APP_ENV__: JSON.stringify(mode),
    },
    build: {
      // Different build configurations based on mode
      outDir: mode === 'staging' ? 'dist-staging' : 'dist',
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'esnext',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'],
            icons: ['lucide-react'],
            query: ['@tanstack/react-query'],
            utils: ['clsx', 'tailwind-merge', 'date-fns'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // Performance optimizations - sync trigger comment
      chunkSizeWarningLimit: 2000,
      assetsInlineLimit: 4096,
    },
    // Environment-specific optimizations
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-router-dom',
        'lucide-react',
        '@tanstack/react-query',
        'clsx',
        'tailwind-merge'
      ],
    },
    // Enable CSS optimization
    css: {
      devSourcemap: mode === 'development',
      modules: {
        localsConvention: 'camelCase',
      },
    },
  };
});
