import { build } from "esbuild";
import { readFile } from "node:fs/promises";

const license = await readFile("javascript/plurimath-ts/LICENSE", "utf8");

await build({
  stdin: {
    contents: 'export { default } from "./javascript/plurimath-ts/src/index.ts";',
    resolveDir: process.cwd(),
    sourcefile: "website-converter.js",
  },
  outfile: "javascript/plurimath.js",
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "es2022",
  minify: true,
  banner: { js: `/*!\n${license}\n*/` },
  logLevel: "info",
});
