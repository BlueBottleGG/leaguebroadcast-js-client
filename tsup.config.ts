import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: [],
  noExternal: [/#types(\/.*)?/, /#overlay-health/],
  esbuildOptions(options) {
    options.alias = {
      "#types": "./types",
      "#overlay-health": "../shared-overlay-health/src/index.ts",
    };
  },
});
