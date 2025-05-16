import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import { config as baseConfig } from './base.eslint.config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").FlatConfig[]}
 */
export const nextJsConfig = [
  ...baseConfig,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/**'],
  },
]
