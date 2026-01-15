import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: "es2018",              // good balance for modern devices
    sourcemap: false,              // smaller build
    cssCodeSplit: true,

    chunkSizeWarningLimit: 1500,   // silence warning (we know why)

    rollupOptions: {
      output: {
        manualChunks(id) {
          // 🔥 FORCE heavy libs out of main bundle
          if (id.includes("@splinetool")) return "spline"
          if (id.includes("gsap")) return "gsap"
          if (id.includes("three")) return "three"
          if (id.includes("node_modules")) return "vendor"
        },
      },
    },
  },
})
