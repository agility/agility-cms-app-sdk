import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
import external from "rollup-plugin-peer-deps-external"
import dts from "rollup-plugin-dts"

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/cjs/index.js",
                format: "cjs",
                sourcemap: true,
                name: "agility-app-sdk",
            },
            {
                file: "dist/esm/index.js",
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser({ compress: true }),
        ],
        external: ["react", "react-dom"]
    },
    {
        input: "dist/esm/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
        external: ["react", "react-dom"]
    },
]

