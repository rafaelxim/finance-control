import { mergeConfig } from 'vite'

import viteConfig from './vite.config'

export default mergeConfig(viteConfig, {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'],
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**']
  }
})
