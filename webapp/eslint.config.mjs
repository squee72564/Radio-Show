import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    name: 'local-overrides',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    name: 'prettier',
    rules: prettierConfig.rules,
  },
];

export default config;
