import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import prettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import typescript from "typescript-eslint";

const controlStatements = [
  "if",
  "return",
  "for",
  "while",
  "do",
  "switch",
  "try",
  "throw",
];
const paddingAroundControl = [
  ...controlStatements.flatMap((statement) => [
    { blankLine: "always", prev: "*", next: statement },
    { blankLine: "always", prev: statement, next: "*" },
  ]),
];
const noUseEffectMessage =
  "Direct useEffect is forbidden in this repository. Read skills/no-use-effect/SKILL.md and skills/no-use-effect/references/patterns.md. Use useMountEffect from @/hooks/use-mount-effect only for true mount-only external synchronization.";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  ...typescript.configs.recommended,
  {
    ...react.configs.flat.recommended,
    ...react.configs.flat["jsx-runtime"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-children-prop": "off",
      "react/no-unescaped-entities": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ImportSpecifier[parent.source.value='react'][imported.name='useEffect']",
          message: noUseEffectMessage,
        },
        {
          selector:
            "CallExpression[callee.object.name='React'][callee.property.name='useEffect']",
          message: noUseEffectMessage,
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "@stylistic/padding-line-between-statements": [
        "error",
        ...paddingAroundControl,
      ],
    },
  },
  {
    files: ["web/hooks/use-mount-effect.ts"],
    rules: {
      "no-restricted-syntax": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    ignores: [
      ".agents/**",
      "vendor",
      "node_modules",
      "public",
      "bootstrap/ssr",
      "vite.config.ts",
      "web/types/**/*.d.ts",
      "web/test-fixtures/**",
      "web/tests/*.mjs",
      "web/actions/**",
      "web/components/ui/*",
      "web/routes/**",
      "web/wayfinder/**",
    ],
  },
  prettier,
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      curly: ["error", "all"],
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: false }],
    },
  },
];
