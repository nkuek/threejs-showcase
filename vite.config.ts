import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import glsl from "vite-plugin-glsl";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl(), svgr()],
  assetsInclude: ["**/*.gltf", "**/*.glb"],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
