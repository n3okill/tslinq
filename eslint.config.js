import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPrettier from "eslint-config-prettier";
import security from "eslint-plugin-security";
import tsdoc from "eslint-plugin-tsdoc";


export default tseslint.config(
    {
        files: ["src/**/*.{js,mjs,cjs,ts}"],
    },
    {
        ignores: ["dist", "old"],
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    security.configs.recommended,
    eslintPrettier,
    {
        plugins: {
           tsdoc,
        },
        rules: {
          "tsdoc/syntax": "warn"
        }
    },
    {
        rules: {
            "@typescript-eslint/array-type": ["error", { default: "generic" }],
        },
    },
  );
