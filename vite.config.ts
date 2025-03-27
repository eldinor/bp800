import { defineConfig, loadEnv } from "vite";
import { vitePlugins } from "./vite/plugin";
import { resolve } from "path";

function pathResolve(dir: string) {
  return resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return defineConfig({
    base: env.VITE_PUBLIC_PATH,
    root,
    // plugin
    plugins: vitePlugins(env),
    // alias
    resolve: {
      alias: {
        "@": pathResolve("src"),
      },
      // https://github.com/vitejs/vite/issues/178#issuecomment-630138450
      extensions: [".js", ".ts", ".json"],
    },
    // https://vitejs.cn/config/#esbuild
    esbuild: {
      // pure: env.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : [],
      pure: mode === "production" ? ["console.log"] : [],
      //  drop: ["console", "debugger"],
    },
    // server config
    server: {
      // host: '192.168.0.0',
      port: 8088,
      open: true, // auto open
      hmr: true,
      cors: true,
      // Cross domain
      // proxy: {
      //     '/api': {
      //         target: 'http://',
      //         changeOrigin: true,
      //         ws: true,
      //         rewrite: (path) => path.replace(/^\/api/, '')
      //     }
      // }
    },

    // build: https://vitejs.cn/config/#build-target
    build: {
      target: "modules",
      outDir: "dist",
      chunkSizeWarningLimit: 550,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      },
    },

    optimizeDeps: {
      exclude: ["@babylonjs/havok"],
    },
  });
};
