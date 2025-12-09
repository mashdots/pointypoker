import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import { defineConfig, globalIgnores } from 'eslint/config';
import sort from 'eslint-plugin-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores([
    'node_modules/',
    'public/',
    '**/lib/**/*',
  ]),
  {
    extends: [
      'js/recommended',
      'tseslint/recommended',
      'reactRefresh/vite',
      reactHooks.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],
    files: [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
    ],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@stylistic': stylistic,
      js,
      react,
      reactHooks,
      reactRefresh,
      sort,
      tseslint,
    },
    rules: {
      '@stylistic/array-bracket-newline': [
        'error',
        {
          minItems: 3,
          multiline: true,
        },
      ],
      '@stylistic/array-bracket-spacing': [
        'error',
        'never',
        {
          'arraysInArrays': false,
          'objectsInArrays': false,
        },
      ],
      '@stylistic/array-element-newline': [
        'error',
        {
          minItems: 3,
          multiline: true,
        },
      ],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/exp-list-style': ['error', { 'multiLine': { 'minItems': 1 } }],
      '@stylistic/function-paren-newline': ['error', { minItems: 3 }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/max-len': [
        'error',
        {
          code: 120,
          ignoreComments: true,
        },
      ],

      '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: false }],
      '@stylistic/no-trailing-spaces': [
        'error',
        {
          ignoreComments: false,
          skipBlankLines: false,
        },
      ],
      '@stylistic/object-curly-newline': [
        'error',
        {
          'ExportDeclaration': {
            minProperties: 3,
            multiline: true,
          },
          'ImportDeclaration': {
            minProperties: 3,
            multiline: true,
          },
          'ObjectExpression': {
            minProperties: 3,
            multiline: true,
          },
          'ObjectPattern': {
            minProperties: 3,
            multiline: true,
          },
        },
      ],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-property-newline': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      'no-undef': 'warn',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'react/jsx-indent': [
        'error',
        2,
        {
          checkAttributes: true,
          indentLogicalExpressions: true,
        },
      ],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-max-props-per-line': ['error', { maximum: 2 }],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'sort/imports': [
        'warn',
        {
          'groups': [
            {
              'order': 60,
              'type': 'side-effect',
            },
            {
              'order': 30,
              'regex': '@',
            },
            {
              'order': 10,
              'regex': 'react',
            },
            {
              'order': 20,
              'type': 'dependency',
            },
            {
              'order': 50,
              'regex': '\\.(png|jpg|svg)$',
            },
            {
              'order': 40,
              'type': 'other',
            },
          ],
          'separator': '\n',
          'typeOrder': 'first',
        },
      ],
      'sort/object-properties': [
        'error',
        {
          'caseSensitive': false,
          'natural': true,
        },
      ],
    },
  },
]);
