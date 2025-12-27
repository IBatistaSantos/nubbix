import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export function createReactConfig(options = {}) {
  const {
    ignores = ["dist/**", "node_modules/**", "*.tsbuildinfo"],
    tsconfigPath = "./tsconfig.json",
    files = ["**/*.ts", "**/*.tsx"],
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
          ecmaFeatures: {
            jsx: true,
          },
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
        "react/react-in-jsx-scope": "off",
      },
    },
  ]);
}

export default createReactConfig();
