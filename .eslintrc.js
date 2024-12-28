module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['jest', '@typescript-eslint', 'unused-imports'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
    'react-native/no-inline-styles': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'prettier/prettier': ['error', { bracketSameLine: true }],
    'max-len': ['error', { code: 160 }],
  },
  extends: ['@react-native', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
};