import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from 'rollup-plugin-terser';

export default {
  input: "src/ink-emitter.ts",
  output: [
    {
      file: "dist/ink-emitter.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/ink-emitter.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      typescript: require("typescript"),
      useTsconfigDeclarationDir: true,
    }),
    resolve(),
    commonjs(),
    terser({
      compress: {
        drop_console: true, 
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    })
  ],
};
