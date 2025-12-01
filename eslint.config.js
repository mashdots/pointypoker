import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js, jsx, ts, tsx}'],
    plugins: {
      js,
      react,
      tseslint,
      reactHooks,
      reactRefresh,
      '@stylistic': stylistic,
    },
    extends: ['js/recommended', 'tseslint/recommended', 'reactRefresh/vite', reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'semi': ['error', 'always'],
      '@stylistic/max-len': [
        'error',
        {
          code: 120, ignoreComments: true,
        },
      ],
      '@stylistic/no-trailing-spaces': [
        'error',
        {
          skipBlankLines: false,
          ignoreComments: false,
        },
      ],
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'object-curly-newline': ['error', {
        'ObjectExpression': 'always',
        'ObjectPattern': {
          'multiline': true, minProperties: 3,
        },
        'ImportDeclaration': 'never',
        'ExportDeclaration': {
          'multiline': true, 'minProperties': 3,
        },
      }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/array-bracket-spacing': ['error', 'never', {
        'objectsInArrays': false,
        'arraysInArrays': false,
      },
      ],
      '@stylistic/indent': ['error', 2],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-multi-spaces': ['error', {
        ignoreEOLComments: false,
      }],
      '@stylistic/quotes': [
        'error',
        'single',
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
]);
