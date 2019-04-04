module.exports = {
  baseUrl: '/as',
  theme: {
    '@primary-color': '#FF571A',
  },
  devServer: {
    disableHostCheck: true,
    host: 'localhost.dasouche.net',
  },
  chainWebpack(webpackConfig) {
    webpackConfig.resolve.alias.set("so-ui-react", "@souche-ui/so-ui-react")
  },
};
