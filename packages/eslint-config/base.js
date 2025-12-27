import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export function createBaseConfig(options = {}) {
  const {
    ignores = ["dist/**", "node_modules/**", "*.tsbuildinfo"],
    tsconfigPath = "./tsconfig.json",
    files = ["**/*.ts"],
  } = options;

  return defineConfig([
    {
      ignores,
    },
    {
      files,
      languageOptions: {
        parser: tsparser,
        ecmaVersion: 2020,
        sourceType: "module",
        parserOptions: {
          project: tsconfigPath,
        },
      },
      plugins: {
        "@typescript-eslint": tseslint,
      },
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "no-console": "warn",
      },
    },
  ]);
}

export default createBaseConfig();
