import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'
import tsEslint from '@typescript-eslint/eslint-plugin'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@typescript-eslint': tsEslint,
    },
    rules: {
      semi: ['error', 'never'],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
])
