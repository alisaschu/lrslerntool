import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // Grenze für die Größenwarnung von Chunks (in KB)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Hier können Sie die Module definieren, die in einem separaten Chunk zusammengefasst werden sollen
          }
        },
      },
    },
  },
});