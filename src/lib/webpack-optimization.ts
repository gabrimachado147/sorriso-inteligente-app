
// Webpack optimization configurations for production builds
export const webpackOptimizations = {
  // Bundle splitting configuration
  splitChunks: {
    chunks: 'all' as const,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all' as const,
        priority: 10,
      },
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react',
        chunks: 'all' as const,
        priority: 20,
      },
      ui: {
        test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
        name: 'ui-components',
        chunks: 'all' as const,
        priority: 15,
      },
      common: {
        minChunks: 2,
        chunks: 'all' as const,
        priority: 5,
        reuseExistingChunk: true,
      },
    },
  },

  // Minimization settings
  minimizer: {
    terser: {
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: true,
        format: {
          comments: false,
        },
      },
      extractComments: false,
    },
    css: {
      minify: true,
      sourceMap: false,
    },
  },

  // Performance hints
  performance: {
    hints: 'warning' as const,
    maxAssetSize: 512000, // 500kb
    maxEntrypointSize: 512000,
    assetFilter: (assetFilename: string) => {
      return !assetFilename.endsWith('.map');
    },
  },

  // Module concatenation
  concatenateModules: true,

  // Tree shaking
  usedExports: true,
  providedExports: true,
  sideEffects: false,
};

// Runtime chunk optimization
export const runtimeChunkConfig = {
  name: 'runtime',
};

// Asset optimization
export const assetOptimization = {
  // Image optimization
  images: {
    mozjpeg: { quality: 80 },
    optipng: { optimizationLevel: 5 },
    svgo: {
      plugins: [
        { name: 'removeViewBox', active: false },
        { name: 'removeDimensions', active: true },
      ],
    },
  },

  // Font optimization
  fonts: {
    preload: ['Inter-Regular', 'Inter-Medium', 'Inter-SemiBold'],
    display: 'swap' as const,
    subset: 'latin',
  },

  // CSS optimization
  css: {
    purge: {
      content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
      safelist: [
        'btn',
        'btn-primary',
        'btn-secondary',
        /^toast-/,
        /^modal-/,
      ],
    },
  },
};

// Service Worker optimization
export const serviceWorkerConfig = {
  // Caching strategies
  cacheStrategies: {
    // Static assets - Cache First
    static: {
      pattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/,
      strategy: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },

    // API calls - Network First
    api: {
      pattern: /^https:\/\/api\./,
      strategy: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutes
        },
        networkTimeoutSeconds: 3,
      },
    },

    // HTML - Stale While Revalidate
    html: {
      pattern: /\.html$/,
      strategy: 'StaleWhileRevalidate',
      options: {
        cacheName: 'html-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
      },
    },
  },

  // Precaching
  precache: {
    include: [
      '/',
      '/static/js/**/*.js',
      '/static/css/**/*.css',
      '/static/media/**/*',
    ],
    exclude: [
      /\.map$/,
      /asset-manifest\.json$/,
      /LICENSE/,
    ],
  },

  // Background sync
  backgroundSync: {
    appointments: {
      name: 'appointment-sync',
      options: {
        maxRetentionTime: 24 * 60, // 24 hours in minutes
      },
    },
    analytics: {
      name: 'analytics-sync',
      options: {
        maxRetentionTime: 48 * 60, // 48 hours in minutes
      },
    },
  },
};

// Performance monitoring
export const performanceConfig = {
  // Core Web Vitals thresholds
  thresholds: {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint
    TTFB: 600, // Time to First Byte
  },

  // Monitoring settings
  monitoring: {
    sampleRate: 0.1, // 10% of users
    reportUrl: '/api/performance',
    enableInDevelopment: false,
  },

  // Resource hints
  resourceHints: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    dnsPrefetch: [
      'https://api.supabase.co',
    ],
    prefetch: [
      '/critical.css',
      '/app.js',
    ],
  },
};

export default {
  webpack: webpackOptimizations,
  runtime: runtimeChunkConfig,
  assets: assetOptimization,
  serviceWorker: serviceWorkerConfig,
  performance: performanceConfig,
};
