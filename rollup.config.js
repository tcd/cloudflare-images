import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"

/** @type {import('rollup').RollupOptions} */
const config = {
    input: "./src/index.ts",
    output: [
        {
            format: "cjs",
            file: "./dist/index.cjs.js",
            exports: "named",
            sourcemap: true,
        },
    ],
    external: [
        "path",
        "fs/promises",
        "axios",
        "form-data",
    ],
    plugins: [
        typescript({
            tsconfig: "tsconfig.prod.json",
            sourceMap: true,
        }),
        commonjs({ extensions: [".ts"] }), // the ".ts" extension is required
    ],
}

export default config
