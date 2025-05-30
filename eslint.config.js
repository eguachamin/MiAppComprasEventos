// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const path = require('path');

module.exports = defineConfig([
  {
    ...expoConfig,
    settings: {
      'import/resolver': {
        'babel-module': {
          root: ['./src'],
        },
      },
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
