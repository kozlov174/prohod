import tseslint from 'typescript-eslint'

import { fixupPluginRules } from '@eslint/compat'
import pluginJs from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginSonarjs from 'eslint-plugin-sonarjs'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
// eslint-disable-next-line no-restricted-syntax
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
      'import/external-module-folders': ['.yarn'],
      'import/resolver': {
        node: {
          extensions: ['.ts', '.js', '.jsx', '.json', '.tsx'],
        },
        alias: {
          map: [['@', './src/.']],
          extensions: ['.ts', '.js', '.jsx', '.json', '.tsx'],
        },
      },
    },
    plugins: {
      'unused-imports': pluginUnusedImports,
      sonarjs: fixupPluginRules(pluginSonarjs),
      'react-hooks': fixupPluginRules(pluginReactHooks),
      import: pluginImport,
    },
    rules: {
      'no-var': 'error',
      quotes: ['warn', 'single'],
      semi: ['warn', 'never'],
      'prefer-const': 'warn',
      eqeqeq: 'error',
      'unused-imports/no-unused-imports': 'warn',

      'no-restricted-syntax': [
        'error',
        {
          selector:
            'ExportDefaultDeclaration[declaration.callee.name!="defineConfig"]',
          message: 'Prefer named exports',
        },
      ],

      'no-undef': 'warn',
      'no-redeclare': 'off',
      'no-extra-boolean-cast': 'off',
      'no-prototype-builtins': 'off',
      'no-throw-literal': 'error',

      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unused-prop-types': 'warn',

      'sonarjs/prefer-immediate-return': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/prefer-single-boolean-return': 'off',
      'sonarjs/no-unused-collection': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'sort-imports': [
        'warn',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
          allowSeparatedGroups: true,
        },
      ],

      'import/order': [
        1,
        {
          groups: [
            'external',
            'builtin',
            'internal',
            ['parent', 'sibling', 'index', 'object'],
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['internal', 'react'],
          'newlines-between': 'always',
          distinctGroup: false,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]
