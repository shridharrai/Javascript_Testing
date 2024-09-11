import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      "space-before-function-paren": "off",
    },
  },
  { ignores: ["dist/"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
