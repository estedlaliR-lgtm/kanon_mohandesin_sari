import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        root: resolve(root, 'index.html'),
        home: resolve(root, 'home/index.html'),
        news: resolve(root, 'news/index.html'),
        app: resolve(root, 'app/index.html'),
        services: resolve(root, 'services/index.html'),
        workgroup: resolve(root, 'workgroup/index.html'),
        contact: resolve(root, 'contact/index.html'),
        info: resolve(root, 'info/index.html'),
        members: resolve(root, 'members/index.html'),
        login: resolve(root, 'login/index.html'),
        communication: resolve(root, 'Communication/index.html'),
        pwa: resolve(root, 'pwa/index.html'),
      },
    },
  },
})
