import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      react(),
      tsconfigPaths()
    ],
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    esbuild: {
      drop: isProd ? ["console", "debugger"] : [],
      legalComments: "none",
      treeShaking: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
    },
    server: {
    port: 5174
  }
  };
});
 