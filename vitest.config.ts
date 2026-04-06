import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/__tests__/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,vue}'],
        exclude: [
          'src/**/__tests__/**',
          'src/main.ts',
          'src/router/**',
          'src/**/*.d.ts',
        ],
      },
    },
  }),
)
