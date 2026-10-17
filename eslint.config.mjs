import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
  },
  globalIgnores([".next/**", "out/**", "coverage/**", "next-env.d.ts"]),
]);
