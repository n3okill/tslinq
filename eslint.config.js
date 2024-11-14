import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPrettier from "eslint-config-prettier";
import security from "eslint-plugin-security";

export default [
  { files: ["./src/**/*.ts"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPrettier,
  security.configs.recommended,
];
