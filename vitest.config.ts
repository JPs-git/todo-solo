import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'dist', 'src/types']
    },
    globals: true,
    setupFiles: ['src/setupTests.ts']
  }
});
