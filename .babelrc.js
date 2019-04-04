const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  presets: [
    ['@babel/react', {
      development: !isProd
    }],
    ['@babel/env', {
      targets: {
        browsers: ['last 2 versions'],
      },
    }],
  ],
  plugins: [
    'styled-components',
    ['import', {
      libraryName: 'antd',
      style: true,
    }, 'antd'],
    ['import', {
      libraryName: 'antd-mobile',
      style: true,
    }, 'antd-mobile'],
    "react-hot-loader/babel",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-class-properties",
    // ["@babel/plugin-proposal-decorators", { "legacy": true }]
    // ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-proposal-do-expressions",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-json-strings",
    "@babel/plugin-proposal-logical-assignment-operators",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-throw-expressions",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    '@babel/plugin-transform-runtime'
  ],

}