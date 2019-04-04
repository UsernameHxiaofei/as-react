const path = require('path');

module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              '@': path.resolve('./src'),
            },
            extensions: ['.js', '.json', '.jsx'],
          },
        },
      },
    },
  },
  rules: {
    // 'linbreak-style':['error','windows'],
    // 'global-require': 'on',
    // 'react/prop-types': 'off',
    // 'react/prefer-stateless-function': 'off',
    // 'react/no-array-index-key': 'off',
    // 'jsx-a11y/anchor-is-valid': 'off',
    // 'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.jsx', '.js'],
      },
    ],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/prefer-default-export': 0,
    // 'import/extensions': ['error', 'always', {
    //   js: 'never',
    //   jsx: 'never',
    // }],
    'import/no-extraneous-dependencies': 0,
    'no-case-declarations': 0,
    'no-nested-ternary': 0,
    'react/jsx-closing-tag-location': 0,
    'no-unused-vars': [
      'error',
      {
        args: 'none',
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    'class-methods-use-this': 0,
    semi: ['error', 'always'],
    'no-multiple-empty-lines': 0,
    'prefer-destructuring': 0,
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'no-debugger': 0,
    'react/sort-comp': 0,
  },
};
