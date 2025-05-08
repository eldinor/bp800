import { defineConfig } from "vitest/config";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  test: {
    environment: "jsdom", // or 'happy-dom' if you prefer
    globals: true,
    //  setupFiles: './test/setup.js' // optional setup file
  },
  plugins: [wasm(), topLevelAwait()],
  server: {
    deps: {
      inline: ["@babylonjs/havok"],
    },
    fs: {
      allow: [".."], // Allows accessing node_modules
    },
  },
  coverage: {
    exclude: [
      "**/*.{js,ts}", // Exclude all JS/TS files outside /src
      "!src/**/*.{js,ts}", // Include only /src files
    ],
  },
});
