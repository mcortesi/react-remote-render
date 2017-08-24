
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     { loader: "style-loader" },
      //     { loader: "css-loader" }
      //   ]
      // }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
}