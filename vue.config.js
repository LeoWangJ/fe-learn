const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
  publicPath: "/fe-learn/",
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
};
