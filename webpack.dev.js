const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackCopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/game.js",
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
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    client: {
      overlay: false,
    },
  },
  performance: {
    hints: false,
  },
  mode: "development",
  devtool: "eval-source-map",
  output: {
    filename: "game.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.ProvidePlugin({
      pc: "playcanvas",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.ejs",
      inlineSource: ".(js|css)$",
    }),
    new WebpackCopyPlugin({
      patterns: [
        { from: "assets", to: "assets" },
      ],
    }),
  ],
};
