const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackCopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/game.js",
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "esbuild-loader",
          options: {
            target: "es6",
          },
        },
      },
    ],
  },
  performance: {
    hints: "warning",
  },
  mode: "production",
  devtool: false,
  output: {
    filename: "game.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ["*.LICENSE.txt"],
    }),
    new webpack.ProvidePlugin({
      pc: "playcanvas",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.ejs",
      minify: true,
      inlineSource: ".(js|css)$",
    }),
    new HtmlInlineScriptPlugin(),
    new WebpackCopyPlugin({
      patterns: [
        { from: "assets", to: "assets" },
      ],
    }),
  ],
};
