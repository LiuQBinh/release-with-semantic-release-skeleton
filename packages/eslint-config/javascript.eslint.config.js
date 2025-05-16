import { defineConfig } from 'eslint/config'
import js from '@eslint/js'

export default defineConfig([
  {
    extends: ['js/recommended'],
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        relg: true,
      },
    },
    plugins: {
      js,
    },
    rules: {
      semi: ['error', 'never'],
      'prettier/prettier': ['off', {}, { semi: false }],
      'import/order': 0,
      'no-console': 0,
      'one-var': ['error', { const: 'never', let: 'consecutive' }],
      'comma-dangle': ['error', 'always-multiline'],
      'new-cap': 'off',
      quotes: ['error', 'single'],
      'no-multi-str': 'off',
      'prefer-const': 'warn',
    },
  },
])
