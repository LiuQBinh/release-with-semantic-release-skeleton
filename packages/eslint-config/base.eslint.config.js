import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

const compat = new FlatCompat({
  // eslint-disable-next-line no-undef
  baseDirectory: import.meta.dirname || __dirname,
})

export const config = defineConfig([
  js.configs.recommended,
  ...compat.extends('eslint-config-prettier'),
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      '@typescript-eslint/no-explicit-any': 'off',
      'turbo/no-undeclared-env-vars': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: ['dist/**'],
  },
])
