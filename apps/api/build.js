import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "dist/index.js",
  sourcemap: true,

  packages: "external", 

  external: [
    "@prisma/client",
    ".prisma/client",
  ],
}).catch(() => process.exit(1));