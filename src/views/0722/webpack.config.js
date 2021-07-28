const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    index: "./dist/main.js",
  },
  output: {
    filename: "[name].bundle.js?[hash:8]",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "即時預覽",
      filename: "demo.html",
      template: "./dist/index.html",
      chunks: ["index"],
    }),
    new VueLoaderPlugin(),
  ],
};
